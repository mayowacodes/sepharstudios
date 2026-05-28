import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import {
  createWalletClient,
  createPublicClient,
  http,
  parseUnits,
  formatUnits,
  type Address,
  type Hex,
  isAddress,
  parseAbi
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon, polygonAmoy } from 'viem/chains';

/**
 * Server-side STC token transfer client.
 *
 * ⚠️  SECURITY ⚠️
 * This module reads a raw treasury private key from `TREASURY_PRIVATE_KEY` env.
 * That is an antipattern for production — see docs/treasury-custody.md for the
 * production path (AWS KMS / Fireblocks / multisig). The env-key implementation
 * is the test-net path: small treasuries, controlled exposure, easy to rotate.
 *
 * The public API of this module — `transferStc(toAddress, amount)` — stays the
 * same when you swap in a KMS-backed signer. Only the wallet-client builder
 * needs to change.
 */

const STC_TOKEN_ABI = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)'
]);

// Most ERC-20s use 18 decimals; STC contract follows the convention. Override
// via env if you ever ship a non-18 variant.
const STC_DECIMALS = Number(env.STC_TOKEN_DECIMALS ?? '18');

export class TreasuryNotConfiguredError extends Error {
  constructor() {
    super('Treasury wallet is not configured. Set TREASURY_PRIVATE_KEY and PUBLIC_STC_TOKEN_AMOY (or _POLYGON).');
    this.name = 'TreasuryNotConfiguredError';
  }
}

export class TreasuryBalanceLowError extends Error {
  constructor(have: bigint, need: bigint) {
    super(`Treasury STC balance too low: have ${formatUnits(have, STC_DECIMALS)}, need ${formatUnits(need, STC_DECIMALS)}.`);
    this.name = 'TreasuryBalanceLowError';
  }
}

/** Choose chain + token address based on env. Defaults to Amoy testnet. */
function resolveChain() {
  const network = (env.STC_NETWORK ?? 'amoy').toLowerCase();
  if (network === 'polygon' || network === 'mainnet') {
    return {
      chain: polygon,
      rpcUrl: env.POLYGON_RPC_URL ?? 'https://polygon-rpc.com',
      tokenAddress: publicEnv.PUBLIC_STC_TOKEN_POLYGON as Address | undefined
    };
  }
  return {
    chain: polygonAmoy,
    rpcUrl: env.AMOY_RPC_URL ?? 'https://rpc-amoy.polygon.technology',
    tokenAddress: publicEnv.PUBLIC_STC_TOKEN_AMOY as Address | undefined
  };
}

let cachedClients: ReturnType<typeof buildClients> | null = null;

function buildClients() {
  const { chain, rpcUrl, tokenAddress } = resolveChain();
  const pk = env.TREASURY_PRIVATE_KEY;

  if (!pk || !tokenAddress) {
    return null;
  }
  if (!pk.startsWith('0x') || pk.length !== 66) {
    console.error('[stc-transfer] TREASURY_PRIVATE_KEY is malformed — expected 0x + 64 hex chars');
    return null;
  }
  if (!isAddress(tokenAddress)) {
    console.error('[stc-transfer] STC token address is malformed:', tokenAddress);
    return null;
  }

  const account = privateKeyToAccount(pk as Hex);
  const transport = http(rpcUrl);
  const publicClient = createPublicClient({ chain, transport });
  const walletClient = createWalletClient({ account, chain, transport });

  console.info(`[stc-transfer] initialised on ${chain.name} for treasury ${account.address}`);
  return { chain, account, tokenAddress, publicClient, walletClient };
}

function getClients() {
  if (cachedClients) return cachedClients;
  cachedClients = buildClients();
  return cachedClients;
}

/**
 * Transfer STC from the treasury wallet to a user wallet.
 *
 * @param toAddress  recipient's EVM address
 * @param amount     amount in whole STC units (will be scaled by STC_DECIMALS)
 * @returns          { txHash } on success
 *
 * Throws:
 *   - TreasuryNotConfiguredError if env is missing
 *   - TreasuryBalanceLowError if treasury can't cover the transfer
 *   - Standard viem errors for RPC / signing / chain issues
 */
export async function transferStc(toAddress: string, amount: number): Promise<{ txHash: Hex }> {
  const clients = getClients();
  if (!clients) throw new TreasuryNotConfiguredError();
  if (!isAddress(toAddress)) throw new Error(`Recipient address is invalid: ${toAddress}`);
  if (amount <= 0) throw new Error(`Transfer amount must be positive: ${amount}`);

  const { account, tokenAddress, publicClient, walletClient } = clients;
  const scaled = parseUnits(amount.toString(), STC_DECIMALS);

  // Pre-flight balance check so we fail fast with a clear error instead of a
  // generic revert from the contract.
  const treasuryBalance = (await publicClient.readContract({
    address: tokenAddress,
    abi: STC_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [account.address]
  })) as bigint;
  if (treasuryBalance < scaled) {
    throw new TreasuryBalanceLowError(treasuryBalance, scaled);
  }

  const txHash = await walletClient.writeContract({
    address: tokenAddress,
    abi: STC_TOKEN_ABI,
    functionName: 'transfer',
    args: [toAddress, scaled]
  });

  // Wait for the receipt so we know the tx is mined and didn't revert. Caller
  // can re-throw or quarantine the request if this fails — the calling code
  // shouldn't mark transactions completed until this resolves.
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, timeout: 60_000 });
  if (receipt.status !== 'success') {
    throw new Error(`STC transfer reverted on-chain: ${txHash}`);
  }

  return { txHash };
}

/** Are we configured to actually send transfers? Lets callers fail fast. */
export function isTreasuryReady(): boolean {
  return getClients() !== null;
}
