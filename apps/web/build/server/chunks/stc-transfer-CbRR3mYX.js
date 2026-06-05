import { p as private_env, a as public_env } from './shared-server-DUDL94jl.js';
import { q as isAddress } from './stringify-CbXG6ciN.js';
import { p as parseUnits } from './parseUnits-CaMrifPu.js';
import { ad as formatUnits } from './chain-Bx4XJ_Uj.js';
import { p as parseAbi } from './parseAbi-DF0R0BTC.js';
import { p as privateKeyToAccount } from './privateKeyToAccount-DUKyWGys.js';
import { z as http } from './http-DCIt3x9N.js';
import { c as createPublicClient } from './createPublicClient-CTNXUmkN.js';
import { c as createWalletClient } from './createWalletClient-nsfdJzeG.js';
import { p as polygon } from './polygon-CgisD_XL.js';
import { p as polygonAmoy } from './polygonAmoy-Wi4okCT7.js';

//#region src/lib/server/stc-transfer.ts
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
var STC_TOKEN_ABI = parseAbi([
	"function transfer(address to, uint256 amount) returns (bool)",
	"function balanceOf(address owner) view returns (uint256)",
	"function decimals() view returns (uint8)"
]);
var STC_DECIMALS = Number(private_env.STC_TOKEN_DECIMALS ?? "18");
var TreasuryNotConfiguredError = class extends Error {
	constructor() {
		super("Treasury wallet is not configured. Set TREASURY_PRIVATE_KEY and PUBLIC_STC_TOKEN_AMOY (or _POLYGON).");
		this.name = "TreasuryNotConfiguredError";
	}
};
var TreasuryBalanceLowError = class extends Error {
	constructor(have, need) {
		super(`Treasury STC balance too low: have ${formatUnits(have, STC_DECIMALS)}, need ${formatUnits(need, STC_DECIMALS)}.`);
		this.name = "TreasuryBalanceLowError";
	}
};
/** Choose chain + token address based on env. Defaults to Amoy testnet. */
function resolveChain() {
	const network = (private_env.STC_NETWORK ?? "amoy").toLowerCase();
	if (network === "polygon" || network === "mainnet") return {
		chain: polygon,
		rpcUrl: private_env.POLYGON_RPC_URL ?? "https://polygon-rpc.com",
		tokenAddress: public_env.PUBLIC_STC_TOKEN_POLYGON
	};
	return {
		chain: polygonAmoy,
		rpcUrl: private_env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
		tokenAddress: public_env.PUBLIC_STC_TOKEN_AMOY
	};
}
var cachedClients = null;
function buildClients() {
	const { chain, rpcUrl, tokenAddress } = resolveChain();
	const pk = private_env.TREASURY_PRIVATE_KEY;
	if (!pk || !tokenAddress) return null;
	if (!pk.startsWith("0x") || pk.length !== 66) {
		console.error("[stc-transfer] TREASURY_PRIVATE_KEY is malformed — expected 0x + 64 hex chars");
		return null;
	}
	if (!isAddress(tokenAddress)) {
		console.error("[stc-transfer] STC token address is malformed:", tokenAddress);
		return null;
	}
	const account = privateKeyToAccount(pk);
	const transport = http(rpcUrl);
	const publicClient = createPublicClient({
		chain,
		transport
	});
	const walletClient = createWalletClient({
		account,
		chain,
		transport
	});
	console.info(`[stc-transfer] initialised on ${chain.name} for treasury ${account.address}`);
	return {
		chain,
		account,
		tokenAddress,
		publicClient,
		walletClient
	};
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
async function transferStc(toAddress, amount) {
	const clients = getClients();
	if (!clients) throw new TreasuryNotConfiguredError();
	if (!isAddress(toAddress)) throw new Error(`Recipient address is invalid: ${toAddress}`);
	if (amount <= 0) throw new Error(`Transfer amount must be positive: ${amount}`);
	const { account, tokenAddress, publicClient, walletClient } = clients;
	const scaled = parseUnits(amount.toString(), STC_DECIMALS);
	const treasuryBalance = await publicClient.readContract({
		address: tokenAddress,
		abi: STC_TOKEN_ABI,
		functionName: "balanceOf",
		args: [account.address]
	});
	if (treasuryBalance < scaled) throw new TreasuryBalanceLowError(treasuryBalance, scaled);
	const txHash = await walletClient.writeContract({
		address: tokenAddress,
		abi: STC_TOKEN_ABI,
		functionName: "transfer",
		args: [toAddress, scaled]
	});
	if ((await publicClient.waitForTransactionReceipt({
		hash: txHash,
		timeout: 6e4
	})).status !== "success") throw new Error(`STC transfer reverted on-chain: ${txHash}`);
	return { txHash };
}
/** Are we configured to actually send transfers? Lets callers fail fast. */
function isTreasuryReady() {
	return getClients() !== null;
}

export { TreasuryBalanceLowError as T, TreasuryNotConfiguredError as a, isTreasuryReady as i, transferStc as t };
//# sourceMappingURL=stc-transfer-CbRR3mYX.js.map
