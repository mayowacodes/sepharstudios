import { t as private_env } from "../../../../../chunks/shared-server.js";
import { a as user, gt as transactions, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
//#region src/lib/server/stc-settlement.ts
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
var STC_DECIMALS = 18;
var BATCH_SIZE = 50;
function isOnChainConfigured() {
	if (private_env.STC_ONCHAIN_ENABLED !== "true") return { enabled: false };
	const missing = [];
	if (!private_env.STC_RPC_URL) missing.push("STC_RPC_URL");
	if (!private_env.STC_TREASURY_PRIVATE_KEY) missing.push("STC_TREASURY_PRIVATE_KEY");
	if (!private_env.STC_CONTRACT_ADDRESS) missing.push("STC_CONTRACT_ADDRESS");
	if (!private_env.STC_CHAIN_ID) missing.push("STC_CHAIN_ID");
	if (missing.length > 0) return {
		enabled: false,
		missing
	};
	return {
		enabled: true,
		chainId: Number(private_env.STC_CHAIN_ID),
		rpcUrl: private_env.STC_RPC_URL,
		treasuryKey: private_env.STC_TREASURY_PRIVATE_KEY,
		contractAddress: private_env.STC_CONTRACT_ADDRESS
	};
}
async function selectPending(limit) {
	return (await db.select({
		id: transactions.id,
		userId: transactions.userId,
		amount: transactions.amount,
		walletAddress: user.walletAddress
	}).from(transactions).leftJoin(user, eq(user.id, transactions.userId)).where(and(eq(transactions.currency, "STC"), eq(transactions.type, "earn"), eq(transactions.status, "pending"), isNull(transactions.txHash))).limit(limit)).map((r) => ({
		id: r.id,
		userId: r.userId,
		amount: Number(r.amount),
		walletAddress: r.walletAddress
	}));
}
async function settleOffChain(rows) {
	const result = {
		mode: "off-chain",
		scanned: rows.length,
		settled: 0,
		skipped: 0,
		failed: 0,
		errors: []
	};
	for (const row of rows) try {
		await db.update(transactions).set({
			status: "completed",
			txHash: `offchain:${row.id}`,
			metadata: sql`coalesce(${transactions.metadata}, '{}'::jsonb) || ${JSON.stringify({
				settlement: "off-chain",
				settledAt: (/* @__PURE__ */ new Date()).toISOString()
			})}::jsonb`
		}).where(and(eq(transactions.id, row.id), eq(transactions.status, "pending")));
		result.settled += 1;
	} catch (err) {
		result.failed += 1;
		result.errors.push(`${row.id}: ${err instanceof Error ? err.message : String(err)}`);
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
async function settleOnChain(rows, cfg) {
	const result = {
		mode: "on-chain",
		scanned: rows.length,
		settled: 0,
		skipped: 0,
		failed: 0,
		errors: []
	};
	const settleable = rows.filter((r) => r.walletAddress && /^0x[a-fA-F0-9]{40}$/.test(r.walletAddress));
	result.skipped = rows.filter((r) => !r.walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(r.walletAddress ?? "")).length;
	if (settleable.length === 0) return result;
	const { createWalletClient, createPublicClient, http, parseUnits } = await import("viem");
	const { privateKeyToAccount } = await import("viem/accounts");
	const { STUDIO_CHAIN_TOKEN_ABI } = await import("../../../../../chunks/abis.js");
	const treasury = privateKeyToAccount(cfg.treasuryKey);
	const chain = {
		id: cfg.chainId,
		name: "sephar-stc",
		nativeCurrency: {
			name: "ETH",
			symbol: "ETH",
			decimals: 18
		},
		rpcUrls: { default: { http: [cfg.rpcUrl] } }
	};
	const walletClient = createWalletClient({
		account: treasury,
		transport: http(cfg.rpcUrl),
		chain
	});
	const publicClient = createPublicClient({
		transport: http(cfg.rpcUrl),
		chain
	});
	const addresses = settleable.map((r) => r.walletAddress);
	const amounts = settleable.map((r) => parseUnits(String(r.amount), STC_DECIMALS));
	const rewardType = "engagement";
	let txHash;
	try {
		txHash = await walletClient.writeContract({
			address: cfg.contractAddress,
			abi: [{
				type: "function",
				name: "batchRewardUsers",
				stateMutability: "nonpayable",
				inputs: [
					{
						name: "users",
						type: "address[]"
					},
					{
						name: "amounts",
						type: "uint256[]"
					},
					{
						name: "rewardType",
						type: "string"
					}
				],
				outputs: []
			}],
			functionName: "batchRewardUsers",
			args: [
				addresses,
				amounts,
				rewardType
			]
		});
		await publicClient.waitForTransactionReceipt({
			hash: txHash,
			confirmations: 1
		});
		result.txHash = txHash;
	} catch (err) {
		result.failed = settleable.length;
		result.errors.push(`tx send/await: ${err instanceof Error ? err.message : String(err)}`);
		return result;
	}
	const ids = settleable.map((r) => r.id);
	try {
		result.settled = (await db.update(transactions).set({
			status: "completed",
			txHash,
			metadata: sql`coalesce(${transactions.metadata}, '{}'::jsonb) || ${JSON.stringify({
				settlement: "on-chain",
				settledAt: (/* @__PURE__ */ new Date()).toISOString(),
				chainId: cfg.chainId
			})}::jsonb`
		}).where(and(inArray(transactions.id, ids), eq(transactions.status, "pending"))).returning({ id: transactions.id })).length;
	} catch (err) {
		result.errors.push(`post-tx db update: ${err instanceof Error ? err.message : String(err)}`);
	}
	return result;
}
/**
* Single entry point. Picks the appropriate settlement path based on env
* config and processes one batch of pending rows.
*/
async function settleOneBatch(limit = BATCH_SIZE) {
	const cfg = isOnChainConfigured();
	const rows = await selectPending(limit);
	if (rows.length === 0) return {
		mode: cfg.enabled ? "on-chain" : "off-chain",
		scanned: 0,
		settled: 0,
		skipped: 0,
		failed: 0,
		errors: []
	};
	if (cfg.enabled) return settleOnChain(rows, cfg);
	if (private_env.STC_SETTLEMENT_DISABLED === "true") return {
		mode: "disabled",
		scanned: rows.length,
		settled: 0,
		skipped: rows.length,
		failed: 0,
		errors: ["STC_SETTLEMENT_DISABLED=true"]
	};
	return settleOffChain(rows);
}
//#endregion
//#region src/routes/api/cron/stc-settle/+server.ts
/**
* POST /api/cron/stc-settle
*
* Periodically processes pending STC earn transactions: moves them from
* `pending` to `completed` (off-chain) or transfers STC on-chain via the
* treasury wallet and writes the resulting tx hash. Behavior is controlled
* by env: see `lib/server/stc-settlement.ts` for the matrix.
*
* Recommended schedule: every 5 minutes when settlement is enabled.
*
* Auth: CRON_SECRET bearer.
*/
var POST = async ({ request, url }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	const result = await settleOneBatch(Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10))));
	return json({
		ok: true,
		runAt: (/* @__PURE__ */ new Date()).toISOString(),
		...result
	});
};
//#endregion
export { POST };
