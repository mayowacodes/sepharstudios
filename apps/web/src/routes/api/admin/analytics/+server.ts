import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, transactions } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq, gte, inArray, lt, sql } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

function formatMonth(date: Date) {
	return date.toLocaleDateString('en-US', { month: 'short' });
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const range = url.searchParams.get('range') ?? '30d';
	const now = new Date();
	const days = range === '7d' ? 7 : range === '90d' ? 90 : range === '1y' ? 365 : 30;
	const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

	const [usersAgg] = await db
		.select({
			totalUsers: sql<number>`count(*)`,
			newUsers: sql<number>`sum(case when ${user.createdAt} >= ${startDate.toISOString()} then 1 else 0 end)`,
			creators: sql<number>`sum(case when ${user.role} = 'creator' then 1 else 0 end)`
		})
		.from(user);

	const [contentAgg] = await db
		.select({
			totalContent: sql<number>`count(*)`,
			totalViews: sql<number>`coalesce(sum(${mediaLibrary.viewCount}), 0)`,
			publishedToday: sql<number>`sum(case when ${mediaLibrary.createdAt} >= date_trunc('day', now()) and ${mediaLibrary.isActive} = true then 1 else 0 end)`
		})
		.from(mediaLibrary);

	// Defensive: deployed `transactions` table may be missing the
	// amount/type columns (older schema, IF NOT EXISTS skipped). Fall
	// back to zero revenue so the analytics dashboard still renders.
	const [revenueAgg] = await db
		.select({
			totalRevenue: sql<number>`coalesce(sum(${transactions.amount}), 0)`
		})
		.from(transactions)
		.where(eq(transactions.type, 'purchase'))
		.catch((err) => {
			console.warn('[admin/analytics] revenue aggregate failed:', err instanceof Error ? err.message : err);
			return [{ totalRevenue: 0 }];
		});

	const categories = await db
		.select({
			category: mediaLibrary.mediaType,
			count: sql<number>`count(*)`,
			views: sql<number>`coalesce(sum(${mediaLibrary.viewCount}), 0)`
		})
		.from(mediaLibrary)
		.groupBy(mediaLibrary.mediaType);

	const recentUsers = await db
		.select({ createdAt: user.createdAt, role: user.role })
		.from(user)
		.where(gte(user.createdAt, startDate));

	const growthMap = new Map<string, { users: number; creators: number }>();
	for (const row of recentUsers) {
		const dateKey = new Date(row.createdAt).toISOString().slice(0, 10);
		const existing = growthMap.get(dateKey) ?? { users: 0, creators: 0 };
		existing.users += 1;
		if (row.role === 'creator') existing.creators += 1;
		growthMap.set(dateKey, existing);
	}
	const userGrowthData = Array.from(growthMap.entries())
		.sort((a, b) => a[0].localeCompare(b[0]))
		.slice(-6)
		.map(([date, data]) => ({ date, users: data.users, creators: data.creators }));

	const revenueRows = await db
		.select({ amount: transactions.amount, createdAt: transactions.createdAt })
		.from(transactions)
		.where(eq(transactions.type, 'purchase'))
		.catch((err) => {
			console.warn('[admin/analytics] revenueRows failed:', err instanceof Error ? err.message : err);
			return [] as Array<{ amount: number; createdAt: Date }>;
		});

	const revenueMap = new Map<string, { revenue: number; payouts: number }>();
	for (const row of revenueRows) {
		const key = formatMonth(new Date(row.createdAt));
		const existing = revenueMap.get(key) ?? { revenue: 0, payouts: 0 };
		existing.revenue += Number(row.amount ?? 0);
		existing.payouts += Number(row.amount ?? 0) * 0.7;
		revenueMap.set(key, existing);
	}
	const revenueData = Array.from(revenueMap.entries())
		.slice(-8)
		.map(([month, value]) => ({ month, revenue: Math.round(value.revenue), payouts: Math.round(value.payouts) }));

	const topCreators = await db
		.select({
			creatorId: mediaLibrary.creatorId,
			views: sql<number>`coalesce(sum(${mediaLibrary.viewCount}), 0)`,
			content: sql<number>`count(*)`
		})
		.from(mediaLibrary)
		.where(sql`${mediaLibrary.creatorId} is not null`)
		.groupBy(mediaLibrary.creatorId)
		.orderBy(desc(sql<number>`coalesce(sum(${mediaLibrary.viewCount}), 0)`))
		.limit(5);

	const creatorIds = topCreators.map(c => c.creatorId).filter(Boolean) as string[];
	const creatorUsers = creatorIds.length
		? await db.select({ id: user.id, name: user.name }).from(user).where(inArray(user.id, creatorIds))
		: [];
	const creatorNameMap = new Map(creatorUsers.map(c => [c.id, c.name]));

	const topContent = await db
		.select({
			title: mediaLibrary.title,
			creatorId: mediaLibrary.creatorId,
			views: mediaLibrary.viewCount,
			mediaType: mediaLibrary.mediaType
		})
		.from(mediaLibrary)
		.orderBy(desc(mediaLibrary.viewCount))
		.limit(5);

	// Sparklines + period-over-period deltas for the platform-metric tiles.
	const SERIES_DAYS = 30;
	const since = new Date(Date.now() - SERIES_DAYS * 86_400_000);
	const priorSince = new Date(Date.now() - SERIES_DAYS * 2 * 86_400_000);

	const dailyUsers = await db
		.select({
			day: sql<string>`to_char(date_trunc('day', ${user.createdAt}), 'YYYY-MM-DD')`,
			count: sql<number>`count(*)::int`
		})
		.from(user)
		.where(gte(user.createdAt, since))
		.groupBy(sql`date_trunc('day', ${user.createdAt})`);

	const dailyRevenue = await db
		.select({
			day: sql<string>`to_char(date_trunc('day', ${transactions.createdAt}), 'YYYY-MM-DD')`,
			amount: sql<number>`coalesce(sum(${transactions.amount}), 0)::int`
		})
		.from(transactions)
		.where(and(eq(transactions.type, 'purchase'), gte(transactions.createdAt, since)))
		.groupBy(sql`date_trunc('day', ${transactions.createdAt})`)
		.catch((err) => {
			console.warn('[admin/analytics] dailyRevenue failed:', err instanceof Error ? err.message : err);
			return [] as Array<{ day: string; amount: number }>;
		});

	const dailyContent = await db
		.select({
			day: sql<string>`to_char(date_trunc('day', ${mediaLibrary.createdAt}), 'YYYY-MM-DD')`,
			count: sql<number>`count(*)::int`
		})
		.from(mediaLibrary)
		.where(gte(mediaLibrary.createdAt, since))
		.groupBy(sql`date_trunc('day', ${mediaLibrary.createdAt})`);

	const seriesUsers = new Array(SERIES_DAYS).fill(0);
	const seriesRevenue = new Array(SERIES_DAYS).fill(0);
	const seriesContent = new Array(SERIES_DAYS).fill(0);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const bucket = (day: string, val: number, target: number[]) => {
		const ago = Math.floor((today.getTime() - new Date(day).getTime()) / 86_400_000);
		const idx = SERIES_DAYS - 1 - ago;
		if (idx >= 0 && idx < SERIES_DAYS) target[idx] = val;
	};
	for (const r of dailyUsers) bucket(r.day, Number(r.count), seriesUsers);
	for (const r of dailyRevenue) bucket(r.day, Number(r.amount), seriesRevenue);
	for (const r of dailyContent) bucket(r.day, Number(r.count), seriesContent);

	const [priorUsers] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(user)
		.where(and(gte(user.createdAt, priorSince), lt(user.createdAt, since)));
	const [priorRevenue] = await db
		.select({ amount: sql<number>`coalesce(sum(${transactions.amount}), 0)::int` })
		.from(transactions)
		.where(and(
			eq(transactions.type, 'purchase'),
			gte(transactions.createdAt, priorSince),
			lt(transactions.createdAt, since)
		))
		.catch((err) => {
			console.warn('[admin/analytics] priorRevenue failed:', err instanceof Error ? err.message : err);
			return [{ amount: 0 }];
		});
	const [priorContent] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(mediaLibrary)
		.where(and(gte(mediaLibrary.createdAt, priorSince), lt(mediaLibrary.createdAt, since)));

	const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
	const pct = (cur: number, prior: number) => prior > 0
		? Math.round(((cur - prior) / prior) * 1000) / 10
		: (cur > 0 ? 100 : 0);
	const deltas = {
		users: pct(sum(seriesUsers), Number(priorUsers?.count ?? 0)),
		revenue: pct(sum(seriesRevenue), Number(priorRevenue?.amount ?? 0)),
		content: pct(sum(seriesContent), Number(priorContent?.count ?? 0))
	};

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
		series: {
			users: seriesUsers,
			revenue: seriesRevenue,
			content: seriesContent
		},
		deltas,
		contentAnalytics: categories.map(c => ({
			category: c.category ?? 'content',
			count: Number(c.count ?? 0),
			views: Number(c.views ?? 0),
			engagement: 0
		})),
		userGrowthData,
		revenueData,
		geographicData: [],
		topCreators: topCreators.map(c => ({
			name: creatorNameMap.get(c.creatorId ?? '') ?? 'Creator',
			ministry: creatorNameMap.get(c.creatorId ?? '') ?? 'Creator',
			views: Number(c.views ?? 0),
			content: Number(c.content ?? 0),
			revenue: Math.round((Number(c.views ?? 0) * 0.01) * 100) / 100
		})),
		topContent: topContent.map(c => ({
			title: c.title,
			creator: creatorNameMap.get(c.creatorId ?? '') ?? 'Creator',
			views: Number(c.views ?? 0),
			engagement: 0,
			category: c.mediaType ?? 'content'
		}))
	});
};
