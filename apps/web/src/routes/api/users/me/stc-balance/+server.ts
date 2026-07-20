import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { transactions } from '$lib/db/schema/sepharstudios';
import { and, eq, sql } from 'drizzle-orm';
import { getStcProgress, HOURS_PER_TOKEN, MAX_TOKENS_PER_DAY } from '$lib/server/stc-hours';

/**
 * GET /api/users/me/stc-balance
 *
 * Returns the current user's STC balance broken down by status:
 *   - pending:   earned but not yet settled (the next settlement cron
 *                will flip these to completed)
 *   - completed: settled. txHash will be `offchain:<id>` for off-chain
 *                settlements and a real on-chain hash when STC_ONCHAIN_
 *                ENABLED='true' and the treasury has funds.
 *   - failed:    settlement attempt failed; admin can re-run the cron.
 *
 * Settlement runs from /api/cron/stc-settle (see lib/server/stc-
 * settlement.ts for mode selection).
 */
export const GET: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

  // Defensive: the deployed `transactions` table may be missing columns
  // the migration declares — return zero balance instead of 500'ing the
  // STC widget on every wallet/profile page.
  const rows = await db
    .select({
      status: transactions.status,
      total: sql<number>`coalesce(sum(${transactions.amount}), 0)`
    })
    .from(transactions)
    .where(and(
      eq(transactions.userId, session.user.id),
      eq(transactions.currency, 'STC'),
      eq(transactions.type, 'earn')
    ))
    .groupBy(transactions.status)
    .catch((err) => {
      console.warn('[stc-balance] transactions query failed:', err instanceof Error ? err.message : err);
      return [] as Array<{ status: string; total: number }>;
    });

  const balance = { pending: 0, completed: 0, failed: 0 };
  for (const row of rows) {
    // `sum()` on an empty group can return null in Postgres; coerce to 0 so
    // NaN never reaches the response payload.
    const total = Number(row.total ?? 0);
    if (row.status === 'pending') balance.pending = total;
    else if (row.status === 'completed') balance.completed = total;
    else if (row.status === 'failed') balance.failed = total;
  }

  const progress = await getStcProgress(session.user.id).catch(() => null);

  return json({
    currency: 'STC',
    pending: balance.pending,
    completed: balance.completed,
    total: balance.pending + balance.completed,
    hoursPerToken: HOURS_PER_TOKEN,
    maxTokensPerDay: MAX_TOKENS_PER_DAY,
    hoursWatched: progress?.hoursWatched ?? 0,
    hoursToNextToken: progress?.hoursToNextToken ?? HOURS_PER_TOKEN,
    dailyCapRemaining: progress?.dailyCapRemaining ?? MAX_TOKENS_PER_DAY,
    readyToClaim: progress?.readyToClaim ?? false
  });
};
