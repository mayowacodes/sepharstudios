import { w as db, ag as user, ae as transactions } from './drizzle-CKUH7ukq.js';
import { n as notify } from './notify-DpHZNtZn.js';
import { e as enforceRateLimit, A as AI_AGENT_LIMIT } from './rate-limit-C3y7GHEd.js';
import { t as track } from './analytics-C04NmVoh.js';
import { i as isTreasuryReady, t as transferStc, a as TreasuryNotConfiguredError, T as TreasuryBalanceLowError } from './stc-transfer-CbRR3mYX.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, sql, inArray } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './redis-B0W1dNO5.js';
import 'ioredis';
import '@openpanel/sdk';
import './stringify-CbXG6ciN.js';
import './utils-BQDJK5Ro.js';
import 'node:crypto';
import './parseUnits-CaMrifPu.js';
import './sendRawTransaction-C51V1yWv.js';
import './chain-Bx4XJ_Uj.js';
import './sha2-Cn2-4DsP.js';
import './parseAbi-DF0R0BTC.js';
import './http-DCIt3x9N.js';
import './privateKeyToAccount-DUKyWGys.js';
import './secp256k1-eLPjhWhb.js';
import './hmac-DQSDUlCl.js';
import './serializeSignature-D75oUNUr.js';
import './serializeAuthorizationList-BL8JUsZH.js';
import './createPublicClient-CTNXUmkN.js';
import './localBatchGatewayRequest-Dfgi4jpN.js';
import './parseAbiParameters-quw_kf-z.js';
import './createWalletClient-nsfdJzeG.js';
import './polygon-CgisD_XL.js';
import './polygonAmoy-Wi4okCT7.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/users/me/stc-claim/+server.ts
/**
* POST /api/users/me/stc-claim
*
* Batches all pending STC earnings into a single on-chain transfer to the
* user's linked wallet address.
*
* Concurrency model (fixes a race that existed in the first version):
*
*   The "read pending rows → transfer on-chain → mark rows completed" sequence
*   is now wrapped in a single Postgres transaction with `SELECT ... FOR UPDATE`
*   on the read. That row-lock means two concurrent claim requests for the same
*   user serialize: the second one waits until the first commits, then sees
*   zero pending rows and exits with 404. Without this, both could read the
*   same rows and double-spend on-chain.
*
*   Recipient is always `user.walletAddress` from the DB — there is no body
*   override. (An earlier version accepted `walletAddress` in the body, which
*   would have let a user redirect their own earnings to an arbitrary wallet.)
*
* Failure modes:
*   - 401: not signed in
*   - 400: no wallet linked
*   - 404: no pending earnings (returned whether nothing-pending or zero-sum)
*   - 429: rate-limited
*   - 502: treasury balance too low (ops issue, ping admin)
*   - 503: treasury not configured (env missing or contract address unset)
*   - 500: on-chain revert or RPC failure (retryable: pending rows unchanged)
*/
var POST = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	await enforceRateLimit(`stc-claim:${session.user.id}`, AI_AGENT_LIMIT);
	if (!isTreasuryReady()) return json({
		error: "STC settlement is not currently available. Please try again later.",
		reason: "treasury_not_configured"
	}, { status: 503 });
	const [userRow] = await db.select({ walletAddress: user.walletAddress }).from(user).where(eq(user.id, session.user.id)).limit(1);
	const walletAddress = userRow?.walletAddress?.trim() ?? "";
	if (!walletAddress) return json({
		error: "Link a wallet to your account before claiming STC.",
		reason: "no_wallet_linked"
	}, { status: 400 });
	let claimedIds = [];
	let total = 0;
	try {
		await db.transaction(async (tx) => {
			const pending = await tx.execute(sql`
        SELECT id, amount FROM transactions
        WHERE user_id = ${session.user.id}
          AND currency = 'STC'
          AND type = 'earn'
          AND status = 'pending'
        FOR UPDATE
      `);
			const rows = pending.rows ?? pending;
			if (!rows || rows.length === 0) return;
			claimedIds = rows.map((r) => r.id);
			total = rows.reduce((acc, r) => acc + Number(r.amount), 0);
			if (total <= 0) {
				claimedIds = [];
				return;
			}
			await tx.update(transactions).set({ status: "claiming" }).where(inArray(transactions.id, claimedIds));
		});
	} catch (err) {
		console.error("[stc-claim] DB transaction failed before transfer:", err);
		return json({
			error: "Could not start the claim. Please try again.",
			reason: "db_lock_failed"
		}, { status: 500 });
	}
	if (claimedIds.length === 0 || total <= 0) return json({
		error: "No pending STC earnings to claim.",
		reason: "nothing_pending"
	}, { status: 404 });
	let txHash;
	try {
		txHash = (await transferStc(walletAddress, total)).txHash;
	} catch (err) {
		await db.update(transactions).set({ status: "pending" }).where(inArray(transactions.id, claimedIds)).catch((rollbackErr) => {
			console.error("[stc-claim] CRITICAL: rollback to pending failed for rows", claimedIds, rollbackErr);
		});
		if (err instanceof TreasuryNotConfiguredError) return json({
			error: "STC settlement is not configured.",
			reason: "treasury_not_configured"
		}, { status: 503 });
		if (err instanceof TreasuryBalanceLowError) {
			console.error("[stc-claim] treasury balance too low:", err.message);
			return json({
				error: "Settlement temporarily unavailable. We have been notified.",
				reason: "treasury_balance_low"
			}, { status: 502 });
		}
		console.error("[stc-claim] transfer failed:", err);
		return json({
			error: "Could not complete the transfer. Your pending earnings are unchanged — you can try again.",
			reason: "transfer_failed",
			detail: err instanceof Error ? err.message : String(err)
		}, { status: 500 });
	}
	try {
		await db.transaction(async (tx) => {
			await tx.update(transactions).set({
				status: "completed",
				txHash
			}).where(inArray(transactions.id, claimedIds));
			await tx.insert(transactions).values({
				id: crypto.randomUUID(),
				userId: session.user.id,
				type: "transfer",
				amount: total,
				currency: "STC",
				status: "completed",
				txHash,
				metadata: {
					source: "stc_claim",
					settledRowIds: claimedIds,
					toAddress: walletAddress
				}
			});
		});
	} catch (err) {
		console.error("[stc-claim] CRITICAL: on-chain transfer succeeded but DB settlement failed.", {
			userId: session.user.id,
			total,
			txHash,
			claimedIds,
			error: err instanceof Error ? err.message : String(err)
		});
	}
	await notify({
		userId: session.user.id,
		kind: "achievement",
		title: `${total} STC claimed`,
		message: `Your earned STC has been transferred to ${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}. Tx ${txHash.slice(0, 10)}…`,
		actionUrl: `/wallet`
	});
	await track(session.user.id, "stc_claim", {
		amount: total,
		txHash,
		settledRows: claimedIds.length
	});
	return json({
		success: true,
		amount: total,
		txHash,
		settledRows: claimedIds.length
	});
};

export { POST };
//# sourceMappingURL=_server.ts-BJq-nzLs.js.map
