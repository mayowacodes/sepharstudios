import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { transactions } from '$lib/db/schema/sepharstudios';
import { and, eq, sql } from 'drizzle-orm';

/**
 * GET /api/users/me/stc-balance
 *
 * Returns the current user's STC balance broken down by status:
 *   - pending:   earned but not yet settled (no on-chain transfer yet)
 *   - completed: settled (would be on-chain once treasury custody is wired)
 *
 * For now everything is pending because we don't yet have a server-side
 * settlement mechanism. The shape is forward-compatible — once settlement
 * lands, the `completed` total starts reflecting on-chain balance.
 */
export const GET: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

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
    .groupBy(transactions.status);

  const balance = { pending: 0, completed: 0, failed: 0 };
  for (const row of rows) {
    // `sum()` on an empty group can return null in Postgres; coerce to 0 so
    // NaN never reaches the response payload.
    const total = Number(row.total ?? 0);
    if (row.status === 'pending') balance.pending = total;
    else if (row.status === 'completed') balance.completed = total;
    else if (row.status === 'failed') balance.failed = total;
  }

  return json({
    currency: 'STC',
    pending: balance.pending,
    completed: balance.completed,
    total: balance.pending + balance.completed
  });
};
