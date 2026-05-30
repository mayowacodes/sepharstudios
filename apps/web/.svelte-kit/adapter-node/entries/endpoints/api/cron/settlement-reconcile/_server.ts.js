import { n as public_env, t as private_env } from "../../../../../chunks/shared-server.js";
import { et as transactions, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq, isNotNull, lt, sql } from "drizzle-orm";
import { createPublicClient, http, isAddress } from "viem";
import { polygon, polygonAmoy } from "viem/chains";
//#region src/routes/api/cron/settlement-reconcile/+server.ts
/**
* POST /api/cron/settlement-reconcile
*
* Reconciles STC ledger rows that were created with a `txHash` but never had
* their `status` flipped to `completed`/`failed` — usually because the worker
* died between `transferStc()` returning and `db.update()` committing.
*
* For each row with `status='pending'` and a non-null `tx_hash` older than
* RECONCILE_AGE_MS:
*   1. Look up the transaction receipt on-chain.
*   2. If `status === 'success'`, mark the row `completed`.
*   3. If `status === 'reverted'`, mark the row `failed` + add a
*      `reconciledReason` metadata field so an operator can investigate.
*   4. If the receipt isn't yet available (not mined), leave it for the
*      next run.
*
* Rows in `pending` with NO `tx_hash` are by design — they're owed-but-not-
* sent ledger entries (e.g. watch-completion STC awaiting a settlement run).
* We leave those alone.
*
* Auth: same `CRON_SECRET` bearer as the other cron endpoints.
* Recommended schedule: every 10 minutes.
*/
var RECONCILE_AGE_MS = 5 * 6e4;
var BATCH_SIZE = 50;
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
var POST = async ({ request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured on server" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	const { chain, rpcUrl, tokenAddress } = resolveChain();
	if (!tokenAddress || !isAddress(tokenAddress)) return json({
		ok: true,
		skipped: true,
		reason: "STC token address not configured"
	});
	const client = createPublicClient({
		chain,
		transport: http(rpcUrl)
	});
	const cutoff = new Date(Date.now() - RECONCILE_AGE_MS);
	const pending = await db.select().from(transactions).where(and(eq(transactions.status, "pending"), isNotNull(transactions.txHash), lt(transactions.createdAt, cutoff))).limit(BATCH_SIZE);
	const result = {
		processed: 0,
		completed: 0,
		failed: 0,
		unmined: 0,
		errors: []
	};
	for (const row of pending) {
		result.processed += 1;
		if (!row.txHash) continue;
		try {
			const receipt = await client.getTransactionReceipt({ hash: row.txHash });
			if (receipt.status === "success") {
				await db.update(transactions).set({
					status: "completed",
					metadata: sql`coalesce(${transactions.metadata}, '{}'::jsonb) || ${JSON.stringify({
						reconciledAt: (/* @__PURE__ */ new Date()).toISOString(),
						blockNumber: Number(receipt.blockNumber)
					})}::jsonb`
				}).where(eq(transactions.id, row.id));
				result.completed += 1;
			} else {
				await db.update(transactions).set({
					status: "failed",
					metadata: sql`coalesce(${transactions.metadata}, '{}'::jsonb) || ${JSON.stringify({
						reconciledAt: (/* @__PURE__ */ new Date()).toISOString(),
						reconciledReason: "on-chain revert"
					})}::jsonb`
				}).where(eq(transactions.id, row.id));
				result.failed += 1;
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			if (/not found|TransactionReceiptNotFound/.test(msg)) result.unmined += 1;
			else result.errors.push(`${row.id}: ${msg}`);
		}
	}
	return json({
		ok: true,
		runAt: (/* @__PURE__ */ new Date()).toISOString(),
		...result
	});
};
//#endregion
export { POST };
