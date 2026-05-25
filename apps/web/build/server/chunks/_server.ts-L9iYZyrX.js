import { j as json } from './index-BcOZ6EV9.js';
import { d as db, m as mediaLibrary, c as user } from './drizzle-CW7hPjGG.js';
import { sql, eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { error: json({ error: "Unauthorized" }, { status: 401 }) };
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return { error: json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}
const GET = async ({ locals }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const rows = await db.select({
    totalProcessed: sql`sum(case when ${mediaLibrary.status} in ('approved','published','rejected') then 1 else 0 end)`,
    pendingReviews: sql`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
    approved: sql`sum(case when ${mediaLibrary.status} in ('approved','published') then 1 else 0 end)`,
    rejected: sql`sum(case when ${mediaLibrary.status} = 'rejected' then 1 else 0 end)`,
    avgSeconds: sql`avg(extract(epoch from (${mediaLibrary.reviewedAt} - ${mediaLibrary.createdAt})))`
  }).from(mediaLibrary);
  const stats = rows[0];
  const reviewedTotal = Number(stats?.approved ?? 0) + Number(stats?.rejected ?? 0);
  const approvalRate = reviewedTotal > 0 ? Math.round(Number(stats?.approved ?? 0) / reviewedTotal * 100) : 0;
  const avgDays = stats?.avgSeconds ? Number(stats.avgSeconds) / 86400 : 0;
  return json({
    totalProcessed: Number(stats?.totalProcessed ?? 0),
    avgProcessingTime: Number(avgDays.toFixed(1)),
    approvalRate,
    pendingReviews: Number(stats?.pendingReviews ?? 0)
  });
};

export { GET };
//# sourceMappingURL=_server.ts-L9iYZyrX.js.map
