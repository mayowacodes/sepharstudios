import { j as json } from './index-BcOZ6EV9.js';
import { d as db, m as mediaLibrary, t as transactions } from './drizzle-CW7hPjGG.js';
import { sql, eq } from 'drizzle-orm';
import { R as Role } from './index-DDpoV-rm.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import './ui-libs-Yf6h8PPk.js';
import './Icon-DVHDtCfs.js';
import './layout-dashboard-xPr2miEu.js';
import './users-B4M3or-k.js';
import './user-CxFDLytf.js';

const GET = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  const creatorId = session.user.id;
  const now = /* @__PURE__ */ new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [counts] = await db.select({
    totalContent: sql`count(*)`,
    published: sql`sum(case when ${mediaLibrary.isActive} then 1 else 0 end)`,
    pendingReview: sql`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
    totalViews: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`
  }).from(mediaLibrary).where(eq(mediaLibrary.creatorId, creatorId));
  const [earningsRow] = await db.select({
    monthlyEarnings: sql`coalesce(sum(${transactions.amount}), 0)`
  }).from(transactions).where(
    sql`${transactions.userId} = ${creatorId} and ${transactions.type} = 'earn' and ${transactions.createdAt} >= ${monthStart}`
  );
  return json({
    totalContent: Number(counts?.totalContent ?? 0),
    published: Number(counts?.published ?? 0),
    pendingReview: Number(counts?.pendingReview ?? 0),
    totalViews: Number(counts?.totalViews ?? 0),
    monthlyEarnings: Number(earningsRow?.monthlyEarnings ?? 0)
  });
};

export { GET };
//# sourceMappingURL=_server.ts-FC90B8pq.js.map
