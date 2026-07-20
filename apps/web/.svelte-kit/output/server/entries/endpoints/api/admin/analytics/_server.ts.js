import { K as mediaLibrary, a as user, bt as transactions, q as mediaWatchProgress, t as db } from "../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
//#region src/routes/api/admin/analytics/+server.ts
function formatMonth(date) {
	return date.toLocaleDateString("en-US", { month: "short" });
}
var GET = async ({ locals, url }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const range = url.searchParams.get("range") ?? "30d";
	const now = /* @__PURE__ */ new Date();
	const days = range === "7d" ? 7 : range === "90d" ? 90 : range === "1y" ? 365 : 30;
	const startDate = /* @__PURE__ */ new Date(now.getTime() - days * 24 * 60 * 60 * 1e3);
	const [usersAgg] = await db.select({
		totalUsers: sql`count(*)`,
		newUsers: sql`sum(case when ${user.createdAt} >= ${startDate.toISOString()} then 1 else 0 end)`,
		creators: sql`sum(case when ${user.role} = 'creator' then 1 else 0 end)`
	}).from(user);
	const [contentAgg] = await db.select({
		totalContent: sql`count(*)`,
		totalViews: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`,
		publishedToday: sql`sum(case when ${mediaLibrary.createdAt} >= date_trunc('day', now()) and ${mediaLibrary.isActive} = true then 1 else 0 end)`
	}).from(mediaLibrary);
	const [revenueAgg] = await db.select({ totalRevenue: sql`coalesce(sum(${transactions.amount}), 0)` }).from(transactions).where(eq(transactions.type, "purchase")).catch((err) => {
		console.warn("[admin/analytics] revenue aggregate failed:", err instanceof Error ? err.message : err);
		return [{ totalRevenue: 0 }];
	});
	const categories = await db.select({
		category: mediaLibrary.mediaType,
		count: sql`count(*)`,
		views: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`
	}).from(mediaLibrary).groupBy(mediaLibrary.mediaType);
	const recentUsers = await db.select({
		createdAt: user.createdAt,
		role: user.role
	}).from(user).where(gte(user.createdAt, startDate));
	const growthMap = /* @__PURE__ */ new Map();
	for (const row of recentUsers) {
		const dateKey = new Date(row.createdAt).toISOString().slice(0, 10);
		const existing = growthMap.get(dateKey) ?? {
			users: 0,
			creators: 0
		};
		existing.users += 1;
		if (row.role === "creator") existing.creators += 1;
		growthMap.set(dateKey, existing);
	}
	const userGrowthData = Array.from(growthMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-6).map(([date, data]) => ({
		date,
		users: data.users,
		creators: data.creators
	}));
	const revenueRows = await db.select({
		amount: transactions.amount,
		createdAt: transactions.createdAt
	}).from(transactions).where(eq(transactions.type, "purchase")).catch((err) => {
		console.warn("[admin/analytics] revenueRows failed:", err instanceof Error ? err.message : err);
		return [];
	});
	const revenueMap = /* @__PURE__ */ new Map();
	for (const row of revenueRows) {
		const key = formatMonth(new Date(row.createdAt));
		const existing = revenueMap.get(key) ?? {
			revenue: 0,
			payouts: 0
		};
		existing.revenue += Number(row.amount ?? 0);
		existing.payouts += Number(row.amount ?? 0) * .7;
		revenueMap.set(key, existing);
	}
	const revenueData = Array.from(revenueMap.entries()).slice(-8).map(([month, value]) => ({
		month,
		revenue: Math.round(value.revenue),
		payouts: Math.round(value.payouts)
	}));
	const topCreators = await db.select({
		creatorId: mediaLibrary.creatorId,
		views: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`,
		content: sql`count(*)`
	}).from(mediaLibrary).where(sql`${mediaLibrary.creatorId} is not null`).groupBy(mediaLibrary.creatorId).orderBy(desc(sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`)).limit(5);
	const creatorIds = topCreators.map((c) => c.creatorId).filter(Boolean);
	const creatorUsers = creatorIds.length ? await db.select({
		id: user.id,
		name: user.name
	}).from(user).where(inArray(user.id, creatorIds)) : [];
	const creatorNameMap = new Map(creatorUsers.map((c) => [c.id, c.name]));
	const topContent = await db.select({
		title: mediaLibrary.title,
		creatorId: mediaLibrary.creatorId,
		views: mediaLibrary.viewCount,
		mediaType: mediaLibrary.mediaType
	}).from(mediaLibrary).orderBy(desc(mediaLibrary.viewCount)).limit(5);
	const SERIES_DAYS = 30;
	const since = /* @__PURE__ */ new Date(Date.now() - SERIES_DAYS * 864e5);
	const priorSince = /* @__PURE__ */ new Date(Date.now() - SERIES_DAYS * 2 * 864e5);
	const dailyUsers = await db.select({
		day: sql`to_char(date_trunc('day', ${user.createdAt}), 'YYYY-MM-DD')`,
		count: sql`count(*)::int`
	}).from(user).where(gte(user.createdAt, since)).groupBy(sql`date_trunc('day', ${user.createdAt})`);
	const dailyRevenue = await db.select({
		day: sql`to_char(date_trunc('day', ${transactions.createdAt}), 'YYYY-MM-DD')`,
		amount: sql`coalesce(sum(${transactions.amount}), 0)::int`
	}).from(transactions).where(and(eq(transactions.type, "purchase"), gte(transactions.createdAt, since))).groupBy(sql`date_trunc('day', ${transactions.createdAt})`).catch((err) => {
		console.warn("[admin/analytics] dailyRevenue failed:", err instanceof Error ? err.message : err);
		return [];
	});
	const dailyContent = await db.select({
		day: sql`to_char(date_trunc('day', ${mediaLibrary.createdAt}), 'YYYY-MM-DD')`,
		count: sql`count(*)::int`
	}).from(mediaLibrary).where(gte(mediaLibrary.createdAt, since)).groupBy(sql`date_trunc('day', ${mediaLibrary.createdAt})`);
	const seriesUsers = new Array(SERIES_DAYS).fill(0);
	const seriesRevenue = new Array(SERIES_DAYS).fill(0);
	const seriesContent = new Array(SERIES_DAYS).fill(0);
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const bucket = (day, val, target) => {
		const ago = Math.floor((today.getTime() - new Date(day).getTime()) / 864e5);
		const idx = SERIES_DAYS - 1 - ago;
		if (idx >= 0 && idx < SERIES_DAYS) target[idx] = val;
	};
	for (const r of dailyUsers) bucket(r.day, Number(r.count), seriesUsers);
	for (const r of dailyRevenue) bucket(r.day, Number(r.amount), seriesRevenue);
	for (const r of dailyContent) bucket(r.day, Number(r.count), seriesContent);
	const [priorUsers] = await db.select({ count: sql`count(*)::int` }).from(user).where(and(gte(user.createdAt, priorSince), lt(user.createdAt, since)));
	const [priorRevenue] = await db.select({ amount: sql`coalesce(sum(${transactions.amount}), 0)::int` }).from(transactions).where(and(eq(transactions.type, "purchase"), gte(transactions.createdAt, priorSince), lt(transactions.createdAt, since))).catch((err) => {
		console.warn("[admin/analytics] priorRevenue failed:", err instanceof Error ? err.message : err);
		return [{ amount: 0 }];
	});
	const [priorContent] = await db.select({ count: sql`count(*)::int` }).from(mediaLibrary).where(and(gte(mediaLibrary.createdAt, priorSince), lt(mediaLibrary.createdAt, since)));
	const sum = (arr) => arr.reduce((a, b) => a + b, 0);
	const pct = (cur, prior) => prior > 0 ? Math.round((cur - prior) / prior * 1e3) / 10 : cur > 0 ? 100 : 0;
	const deltas = {
		users: pct(sum(seriesUsers), Number(priorUsers?.count ?? 0)),
		revenue: pct(sum(seriesRevenue), Number(priorRevenue?.amount ?? 0)),
		content: pct(sum(seriesContent), Number(priorContent?.count ?? 0))
	};
	const startOfToday = /* @__PURE__ */ new Date();
	startOfToday.setHours(0, 0, 0, 0);
	let viewsTodayCount = 0;
	try {
		const [row] = await db.select({ c: sql`count(*)` }).from(mediaWatchProgress).where(gte(mediaWatchProgress.updatedAt, startOfToday));
		viewsTodayCount = Number(row?.c ?? 0);
	} catch (err) {
		console.warn("[admin/analytics] viewsToday query failed", err);
	}
	return json({
		platformMetrics: {
			totalUsers: Number(usersAgg?.totalUsers ?? 0),
			activeCreators: Number(usersAgg?.creators ?? 0),
			totalContent: Number(contentAgg?.totalContent ?? 0),
			totalViews: Number(contentAgg?.totalViews ?? 0),
			totalRevenue: Number(revenueAgg?.totalRevenue ?? 0),
			newUsersToday: Number(usersAgg?.newUsers ?? 0),
			contentPublishedToday: Number(contentAgg?.publishedToday ?? 0),
			viewsToday: viewsTodayCount
		},
		series: {
			users: seriesUsers,
			revenue: seriesRevenue,
			content: seriesContent
		},
		deltas,
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
			revenue: Math.round(Number(c.views ?? 0) * .01 * 100) / 100
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
//#endregion
export { GET };
