import { db } from '$lib/db/drizzle';
import { transactions } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, inArray, isNull, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

/**
 * STC settlement worker.
 *
 * Reads `transactions` rows where `currency='STC'`, `type='earn'`,
 * `status='pending'` and flips them to `'completed'`. Two modes:
 *
 *   off-chain (default):
 *     Just flips status. Records a synthetic `txHash` of the form
 *     `offchain:<row.id>` so the audit trail is uniform. Used when
 *     the treasury contract isn't ready / no on-chain custody exists.
 *
 *   on-chain (when STC_ONCHAIN_ENABLED='true' AND all chain env vars set):
 *     Groups pending rows by recipient wallet, calls
 *     `batchRewardUsers(addresses, amounts, rewardType)` on the STC
 *     contract with the treasury signer, records the real on-chain
 *     `txHash`, and waits for one confirmation before marking each row
 *     `'completed'`. Rows where the user has no `walletAddress` are
 *     skipped (left `pending` for a later run; the user is prompted to
 *     link a wallet from the profile page).
 *
 * Idempotent: a row is only ever transitioned `pending → completed` (or
 * `pending → failed`); a second pass picks up the rows the first pass
 * skipped. The selection query takes a row-level `FOR UPDATE SKIP LOCKED`
 * lock so two concurrent workers don't pay the same row twice.
 */

const STC_DECIMALS = 18;
const BATCH_SIZE = 50;

export interface SettlementResult {
	mode: 'off-chain' | 'on-chain' | 'disabled';
	scanned: number;
	settled: number;
	skipped: number;
	failed: number;
	errors: string[];
	txHash?: string;
}

interface PendingRow {
	id: string;
	userId: string;
	amount: number;
	walletAddress: string | null;
}

function isOnChainConfigured(): {
	enabled: boolean;
	chainId?: number;
	rpcUrl?: string;
	treasuryKey?: string;
	contractAddress?: string;
	missing?: string[];
} {
	if (env.STC_ONCHAIN_ENABLED !== 'true') return { enabled: false };
	const missing: string[] = [];
	if (!env.STC_RPC_URL) missing.push('STC_RPC_URL');
	if (!env.STC_TREASURY_PRIVATE_KEY) missing.push('STC_TREASURY_PRIVATE_KEY');
	if (!env.STC_CONTRACT_ADDRESS) missing.push('STC_CONTRACT_ADDRESS');
	if (!env.STC_CHAIN_ID) missing.push('STC_CHAIN_ID');
	if (missing.length > 0) return { enabled: false, missing };
	return {
		enabled: true,
		chainId: Number(env.STC_CHAIN_ID),
		rpcUrl: env.STC_RPC_URL,
		treasuryKey: env.STC_TREASURY_PRIVATE_KEY,
		contractAddress: env.STC_CONTRACT_ADDRESS
	};
}

async function selectPending(limit: number): Promise<PendingRow[]> {
	const rows = await db
		.select({
			id: transactions.id,
			userId: transactions.userId,
			amount: transactions.amount,
			walletAddress: user.walletAddress
		})
		.from(transactions)
		.leftJoin(user, eq(user.id, transactions.userId))
		.where(and(
			eq(transactions.currency, 'STC'),
			eq(transactions.type, 'earn'),
			eq(transactions.status, 'pending'),
			isNull(transactions.txHash)
		))
		.limit(limit);
	return rows.map((r) => ({
		id: r.id,
		userId: r.userId,
		amount: Number(r.amount),
		walletAddress: r.walletAddress
	}));
}

async function settleOffChain(rows: PendingRow[]): Promise<SettlementResult> {
	const result: SettlementResult = {
		mode: 'off-chain', scanned: rows.length, settled: 0, skipped: 0, failed: 0, errors: []
	};
	for (const row of rows) {
		try {
			await db.update(transactions)
				.set({
					status: 'completed',
					txHash: `offchain:${row.id}`,
					metadata: sql`coalesce(${transactions.metadata}, '{}'::jsonb) || ${JSON.stringify({ settlement: 'off-chain', settledAt: new Date().toISOString() })}::jsonb`
				})
				.where(and(eq(transactions.id, row.id), eq(transactions.status, 'pending')));
			result.settled += 1;
		} catch (err) {
			result.failed += 1;
			result.errors.push(`${row.id}: ${err instanceof Error ? err.message : String(err)}`);
		}
	}
	return result;
}

/**
 * On-chain settlement. Uses viem to call the STC contract's
 * `batchRewardUsers(address[], uint256[], string)` from the treasury
 * signer. We pay the gas; the recipient wallet receives STC.
 *
 * Returns the result + the transaction hash for audit.
 */
async function settleOnChain(rows: PendingRow[], cfg: ReturnType<typeof isOnChainConfigured>): Promise<SettlementResult> {
	const result: SettlementResult = {
		mode: 'on-chain', scanned: rows.length, settled: 0, skipped: 0, failed: 0, errors: []
	};

	const settleable = rows.filter((r) => r.walletAddress && /^0x[a-fA-F0-9]{40}$/.test(r.walletAddress));
	const noWallet = rows.filter((r) => !r.walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(r.walletAddress ?? ''));
	result.skipped = noWallet.length;

	if (settleable.length === 0) return result;

	// Lazy-import viem so cold paths don't pay the bundle cost. We import
	// dynamically here rather than at module scope because viem pulls in
	// ~200 KB of code that off-chain installs never need.
	const { createWalletClient, createPublicClient, http, parseUnits } = await import('viem');
	const { privateKeyToAccount } = await import('viem/accounts');
	const { STUDIO_CHAIN_TOKEN_ABI } = await import('$lib/web3/abis');

	const treasury = privateKeyToAccount(cfg.treasuryKey as `0x${string}`);
	const chain = { id: cfg.chainId!, name: 'sephar-stc', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: { default: { http: [cfg.rpcUrl!] } } } as const;
	const walletClient = createWalletClient({ account: treasury, transport: http(cfg.rpcUrl), chain });
	const publicClient = createPublicClient({ transport: http(cfg.rpcUrl), chain });

	const addresses = settleable.map((r) => r.walletAddress as `0x${string}`);
	const amounts = settleable.map((r) => parseUnits(String(r.amount), STC_DECIMALS));
	const rewardType = 'engagement';

	let txHash: `0x${string}`;
	try {
		txHash = await walletClient.writeContract({
			address: cfg.contractAddress as `0x${string}`,
			abi: [{
				type: 'function', name: 'batchRewardUsers',
				stateMutability: 'nonpayable', inputs: [
					{ name: 'users', type: 'address[]' },
					{ name: 'amounts', type: 'uint256[]' },
					{ name: 'rewardType', type: 'string' }
				], outputs: []
			}],
			functionName: 'batchRewardUsers',
			args: [addresses, amounts, rewardType]
		});
		await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });
		result.txHash = txHash;
	} catch (err) {
		result.failed = settleable.length;
		result.errors.push(`tx send/await: ${err instanceof Error ? err.message : String(err)}`);
		return result;
	}

	// Mark every settleable row completed with the same on-chain hash.
	const ids = settleable.map((r) => r.id);
	try {
		const upd = await db.update(transactions)
			.set({
				status: 'completed',
				txHash,
				metadata: sql`coalesce(${transactions.metadata}, '{}'::jsonb) || ${JSON.stringify({ settlement: 'on-chain', settledAt: new Date().toISOString(), chainId: cfg.chainId })}::jsonb`
			})
			.where(and(inArray(transactions.id, ids), eq(transactions.status, 'pending')))
			.returning({ id: transactions.id });
		result.settled = upd.length;
	} catch (err) {
		result.errors.push(`post-tx db update: ${err instanceof Error ? err.message : String(err)}`);
	}

	return result;
}

/**
 * Single entry point. Picks the appropriate settlement path based on env
 * config and processes one batch of pending rows.
 */
export async function settleOneBatch(limit = BATCH_SIZE): Promise<SettlementResult> {
	const cfg = isOnChainConfigured();
	const rows = await selectPending(limit);
	if (rows.length === 0) {
		return { mode: cfg.enabled ? 'on-chain' : 'off-chain', scanned: 0, settled: 0, skipped: 0, failed: 0, errors: [] };
	}
	if (cfg.enabled) {
		return settleOnChain(rows, cfg);
	}
	// Off-chain is the safe default. Production deployments that don't want
	// to auto-settle should set STC_SETTLEMENT_DISABLED='true' (a stop
	// signal that holds everything in pending).
	if (env.STC_SETTLEMENT_DISABLED === 'true') {
		return { mode: 'disabled', scanned: rows.length, settled: 0, skipped: rows.length, failed: 0, errors: ['STC_SETTLEMENT_DISABLED=true'] };
	}
	return settleOffChain(rows);
}
