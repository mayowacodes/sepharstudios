import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { transactions } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';
import {
  transferStc,
  isTreasuryReady,
  TreasuryNotConfiguredError,
  TreasuryBalanceLowError
} from '$lib/server/stc-transfer';
import { enforceRateLimit, AI_AGENT_LIMIT } from '$lib/server/rate-limit';
import { notify } from '$lib/server/notify';
import { track } from '$lib/server/analytics';

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
export const POST: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

  await enforceRateLimit(`stc-claim:${session.user.id}`, AI_AGENT_LIMIT);

  if (!isTreasuryReady()) {
    return json({
      error: 'STC settlement is not currently available. Please try again later.',
      reason: 'treasury_not_configured'
    }, { status: 503 });
  }

  // Wallet comes ONLY from the user's DB record. No body override — that would
  // let an attacker claim their own pending STC to a different address.
  const [userRow] = await db
    .select({ walletAddress: user.walletAddress })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const walletAddress = userRow?.walletAddress?.trim() ?? '';
  if (!walletAddress) {
    return json({
      error: 'Link a wallet to your account before claiming STC.',
      reason: 'no_wallet_linked'
    }, { status: 400 });
  }

  // ── Stage 1: lock + sum pending rows in a single tx ──────────────────────
  // We do NOT call transferStc() inside this transaction — an on-chain wait
  // can take 30+ seconds and would hold the row lock that long. Instead:
  //   tx 1: read pending rows FOR UPDATE, then update them to status='claiming'
  //         in the same transaction. Commits immediately.
  //   off-chain: transferStc(...). This is the slow part.
  //   tx 2: flip status='claiming' → 'completed' with txHash, plus the audit row.
  //         If the transfer reverted, we flip status='claiming' → 'pending' so
  //         the user can retry.
  let claimedIds: string[] = [];
  let total = 0;

  try {
    await db.transaction(async (tx) => {
      const pending = await tx.execute<{ id: string; amount: number }>(sql`
        SELECT id, amount FROM transactions
        WHERE user_id = ${session.user.id}
          AND currency = 'STC'
          AND type = 'earn'
          AND status = 'pending'
        FOR UPDATE
      `);

      // postgres-js returns rows under various shapes depending on the SDK; normalize.
      const rows = ((pending as unknown) as { rows?: Array<{ id: string; amount: number }> }).rows
        ?? (pending as unknown as Array<{ id: string; amount: number }>);

      if (!rows || rows.length === 0) {
        return;
      }

      claimedIds = rows.map((r) => r.id);
      total = rows.reduce((acc, r) => acc + Number(r.amount), 0);

      if (total <= 0) {
        // Don't lock these rows out for a zero-sum batch — clear claimedIds
        // so the post-transaction guard treats this as "nothing to do".
        claimedIds = [];
        return;
      }

      await tx
        .update(transactions)
        .set({ status: 'claiming' })
        .where(inArray(transactions.id, claimedIds));
    });
  } catch (err) {
    console.error('[stc-claim] DB transaction failed before transfer:', err);
    return json({
      error: 'Could not start the claim. Please try again.',
      reason: 'db_lock_failed'
    }, { status: 500 });
  }

  if (claimedIds.length === 0 || total <= 0) {
    return json({ error: 'No pending STC earnings to claim.', reason: 'nothing_pending' }, { status: 404 });
  }

  // ── Stage 2: on-chain transfer (outside the DB tx) ───────────────────────
  let txHash: `0x${string}`;
  try {
    const result = await transferStc(walletAddress, total);
    txHash = result.txHash;
  } catch (err) {
    // Roll the rows back to 'pending' so the user can retry. Best-effort:
    // even if THIS update fails, the rows remain in 'claiming' and we have
    // server logs pointing at them for manual reconciliation.
    await db
      .update(transactions)
      .set({ status: 'pending' })
      .where(inArray(transactions.id, claimedIds))
      .catch((rollbackErr) => {
        console.error('[stc-claim] CRITICAL: rollback to pending failed for rows', claimedIds, rollbackErr);
      });

    if (err instanceof TreasuryNotConfiguredError) {
      return json({ error: 'STC settlement is not configured.', reason: 'treasury_not_configured' }, { status: 503 });
    }
    if (err instanceof TreasuryBalanceLowError) {
      console.error('[stc-claim] treasury balance too low:', err.message);
      return json({ error: 'Settlement temporarily unavailable. We have been notified.', reason: 'treasury_balance_low' }, { status: 502 });
    }
    console.error('[stc-claim] transfer failed:', err);
    return json({
      error: 'Could not complete the transfer. Your pending earnings are unchanged — you can try again.',
      reason: 'transfer_failed',
      detail: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }

  // ── Stage 3: settle in a single tx (UPDATE + audit row together) ─────────
  // Both writes share one DB transaction so we don't end up with completed
  // rows but no audit trail (or vice-versa).
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(transactions)
        .set({ status: 'completed', txHash })
        .where(inArray(transactions.id, claimedIds));

      await tx.insert(transactions).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        type: 'transfer',
        amount: total,
        currency: 'STC',
        status: 'completed',
        txHash,
        metadata: {
          source: 'stc_claim',
          settledRowIds: claimedIds,
          toAddress: walletAddress
        }
      });
    });
  } catch (err) {
    // On-chain succeeded but DB couldn't record it. Loud log; user got tokens
    // but our records lag. A future reconciliation worker should detect rows
    // stuck in 'claiming' with a known txHash and finalise them.
    console.error('[stc-claim] CRITICAL: on-chain transfer succeeded but DB settlement failed.', {
      userId: session.user.id,
      total,
      txHash,
      claimedIds,
      error: err instanceof Error ? err.message : String(err)
    });
  }

  // Best-effort post-settlement side effects.
  await notify({
    userId: session.user.id,
    kind: 'achievement',
    title: `${total} STC claimed`,
    message: `Your earned STC has been transferred to ${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}. Tx ${txHash.slice(0, 10)}…`,
    actionUrl: `/wallet`
  });
  await track(session.user.id, 'stc_claim', { amount: total, txHash, settledRows: claimedIds.length });

  return json({ success: true, amount: total, txHash, settledRows: claimedIds.length });
};
