import { j as json } from './index-BcOZ6EV9.js';
import { d as db, c as user, m as mediaLibrary, t as transactions } from './drizzle-CW7hPjGG.js';
import { sql, eq, desc, inArray } from 'drizzle-orm';
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
function formatMonth(date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}
const GET = async ({ locals, url }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const range = url.searchParams.get("range") ?? "30d";
  const now = /* @__PURE__ */ new Date();
  const days = range === "7d" ? 7 : range === "90d" ? 90 : range === "1y" ? 365 : 30;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1e3);
  const [usersAgg] = await db.select({
    totalUsers: sql`count(*)`,
    newUsers: sql`sum(case when ${user.createdAt} >= ${startDate} then 1 else 0 end)`,
    creators: sql`sum(case when ${user.role} = 'creator' then 1 else 0 end)`
  }).from(user);
  const [contentAgg] = await db.select({
    totalContent: sql`count(*)`,
    totalViews: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`,
    publishedToday: sql`sum(case when ${mediaLibrary.createdAt} >= date_trunc('day', now()) and ${mediaLibrary.isActive} = true then 1 else 0 end)`
  }).from(mediaLibrary);
  const [revenueAgg] = await db.select({
    totalRevenue: sql`coalesce(sum(${transactions.amount}), 0)`
  }).from(transactions).where(eq(transactions.type, "purchase"));
  const categories = await db.select({
    category: mediaLibrary.mediaType,
    count: sql`count(*)`,
    views: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`
  }).from(mediaLibrary).groupBy(mediaLibrary.mediaType);
  const recentUsers = await db.select({ createdAt: user.createdAt, role: user.role }).from(user).where(sql`${user.createdAt} >= ${startDate}`);
  const growthMap = /* @__PURE__ */ new Map();
  for (const row of recentUsers) {
    const dateKey = new Date(row.createdAt).toISOString().slice(0, 10);
    const existing = growthMap.get(dateKey) ?? { users: 0, creators: 0 };
    existing.users += 1;
    if (row.role === "creator") existing.creators += 1;
    growthMap.set(dateKey, existing);
  }
  const userGrowthData = Array.from(growthMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-6).map(([date, data]) => ({ date, users: data.users, creators: data.creators }));
  const revenueRows = await db.select({ amount: transactions.amount, createdAt: transactions.createdAt }).from(transactions).where(eq(transactions.type, "purchase"));
  const revenueMap = /* @__PURE__ */ new Map();
  for (const row of revenueRows) {
    const key = formatMonth(new Date(row.createdAt));
    const existing = revenueMap.get(key) ?? { revenue: 0, payouts: 0 };
    existing.revenue += Number(row.amount ?? 0);
    existing.payouts += Number(row.amount ?? 0) * 0.7;
    revenueMap.set(key, existing);
  }
  const revenueData = Array.from(revenueMap.entries()).slice(-8).map(([month, value]) => ({ month, revenue: Math.round(value.revenue), payouts: Math.round(value.payouts) }));
  const topCreators = await db.select({
    creatorId: mediaLibrary.creatorId,
    views: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`,
    content: sql`count(*)`
  }).from(mediaLibrary).where(sql`${mediaLibrary.creatorId} is not null`).groupBy(mediaLibrary.creatorId).orderBy(desc(sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`)).limit(5);
  const creatorIds = topCreators.map((c) => c.creatorId).filter(Boolean);
  const creatorUsers = creatorIds.length ? await db.select({ id: user.id, name: user.name }).from(user).where(inArray(user.id, creatorIds)) : [];
  const creatorNameMap = new Map(creatorUsers.map((c) => [c.id, c.name]));
  const topContent = await db.select({
    title: mediaLibrary.title,
    creatorId: mediaLibrary.creatorId,
    views: mediaLibrary.viewCount,
    mediaType: mediaLibrary.mediaType
  }).from(mediaLibrary).orderBy(desc(mediaLibrary.viewCount)).limit(5);
  return json({
    platformMetrics: {
      totalUsers: Number(usersAgg?.totalUsers ?? 0),
      activeCreators: Number(usersAgg?.creators ?? 0),
      totalContent: Number(contentAgg?.totalContent ?? 0),
      totalViews: Number(contentAgg?.totalViews ?? 0),
      totalRevenue: Number(revenueAgg?.totalRevenue ?? 0),
      newUsersToday: Number(usersAgg?.newUsers ?? 0),
      contentPublishedToday: Number(contentAgg?.publishedToday ?? 0),
      viewsToday: 0
    },
    contentAnalytics: categories.map((c) => ({
      category: c.category ?? "content",
      count: Number(c.count ?? 0),
      views: Number(c.views ?? 0),
      engagement: 0
    })),
    userGrowthData,
    revenueData,
    geographicData: [],
    topCreators: topCreators.map((c) => ({
      name: creatorNameMap.get(c.creatorId ?? "") ?? "Creator",
      ministry: creatorNameMap.get(c.creatorId ?? "") ?? "Creator",
      views: Number(c.views ?? 0),
      content: Number(c.content ?? 0),
      revenue: Math.round(Number(c.views ?? 0) * 0.01 * 100) / 100
    })),
    topContent: topContent.map((c) => ({
      title: c.title,
      creator: creatorNameMap.get(c.creatorId ?? "") ?? "Creator",
      views: Number(c.views ?? 0),
      engagement: 0,
      category: c.mediaType ?? "content"
    }))
  });
};

export { GET };
//# sourceMappingURL=_server.ts-z0SrTmDp.js.map
