import { j as json } from './index-BcOZ6EV9.js';
import { d as db, z as adminTokenomicsSettings, c as user, t as transactions } from './drizzle-CW7hPjGG.js';
import { sql, eq, and } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { session: null, error: json({ error: "Unauthorized" }, { status: 401 }) };
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return { session: null, error: json({ error: "Forbidden" }, { status: 403 }) };
  return { session, error: null };
}
const defaultDistribution = {
  platformOperations: 55,
  creatorRevenue: 30,
  stcBuyback: 8,
  userRewards: 4,
  platformReserve: 3
};
const GET = async ({ locals }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const settingsRow = await db.select().from(adminTokenomicsSettings).then((r) => r[0]);
  const revenueDistribution = settingsRow?.revenueDistribution || defaultDistribution;
  const now = /* @__PURE__ */ new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [creatorCount] = await db.select({ totalCreators: sql`count(*)` }).from(user).where(eq(user.role, "creator"));
  const [earnings] = await db.select({ totalPayments: sql`coalesce(sum(${transactions.amount}), 0)` }).from(transactions).where(and(eq(transactions.type, "earn"), sql`${transactions.createdAt} >= ${monthStart}`));
  const totalPayments = Number(earnings?.totalPayments ?? 0);
  const totalCreators = Number(creatorCount?.totalCreators ?? 0);
  const averageRevenue = totalCreators > 0 ? Math.round(totalPayments / totalCreators) : 0;
  return json({
    revenueDistribution,
    creatorStats: {
      totalCreators,
      averageRevenue,
      topCreatorEarnings: Math.round(totalPayments * 0.15),
      totalPayments
    },
    stakingTiers: {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0
    }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-DGDfLtNt.js.map
