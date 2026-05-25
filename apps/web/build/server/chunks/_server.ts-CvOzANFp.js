import { j as json } from './index-BcOZ6EV9.js';
import { d as db, c as user } from './drizzle-CW7hPjGG.js';
import { eq, sql } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const [adminUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
  if (adminUser?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
  const now = /* @__PURE__ */ new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  const [agg] = await db.select({
    totalUsers: sql`count(*)`,
    creators: sql`sum(case when ${user.role} = 'creator' then 1 else 0 end)`,
    admins: sql`sum(case when ${user.role} = 'admin' then 1 else 0 end)`,
    editors: sql`sum(case when ${user.role} = 'editor' then 1 else 0 end)`,
    banned: sql`sum(case when ${user.banned} = true then 1 else 0 end)`,
    newToday: sql`sum(case when ${user.createdAt} >= ${startOfToday} then 1 else 0 end)`,
    newWeek: sql`sum(case when ${user.createdAt} >= ${startOfWeek} then 1 else 0 end)`
  }).from(user);
  return json({
    totalUsers: Number(agg?.totalUsers ?? 0),
    creators: Number(agg?.creators ?? 0),
    admins: Number(agg?.admins ?? 0),
    editors: Number(agg?.editors ?? 0),
    banned: Number(agg?.banned ?? 0),
    newToday: Number(agg?.newToday ?? 0),
    newWeek: Number(agg?.newWeek ?? 0)
  });
};

export { GET };
//# sourceMappingURL=_server.ts-CvOzANFp.js.map
