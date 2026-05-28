import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import {
	creators,
	mediaLibrary,
	mediaWatchProgress,
	reviews,
	contentShares,
	watchSessionMeta
} from '$lib/db/schema/sepharstudios';
import { and, eq, gte, lt, sql, inArray } from 'drizzle-orm';
import { getRedis } from '$lib/server/redis';

/**
 * GET /api/creator/analytics?period=7d|30d|90d|all
 *
 * Returns analytics aggregates for the current creator's content.
 *
 * Sources of truth:
 *   - totalViews / watchTime / completionRate → mediaWatchProgress
 *   - totalLikes → approved reviews
 *   - totalShares → content_shares (POST /api/shares)
 *   - activeViewers → Redis sorted set updated by VideoPlayer "active" pings
 *   - growthRate → views this period vs prior period of same length
 *   - viewsByDevice / topCountries → watch_session_meta
 *
 * Demographics (age/gender) require self-reported user profile fields we
 * don't collect — those arrays stay empty until that data exists.
 */

const PERIOD_DAYS: Record<string, number | null> = {
	'7d': 7,
	'30d': 30,
	'90d': 90,
	'all': null
};

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [creator] = await db
		.select()
		.from(creators)
		.where(eq(creators.userId, session.user.id))
		.limit(1);

	if (!creator) return json({ error: 'Not a creator' }, { status: 403 });

	const period = url.searchParams.get('period') ?? '30d';
	const days = PERIOD_DAYS[period] ?? 30;
	const cutoff = days ? new Date(Date.now() - days * 86_400_000) : null;
	const priorCutoff = days ? new Date(Date.now() - days * 2 * 86_400_000) : null;

	const contentRows = await db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			viewCount: mediaLibrary.viewCount,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration,
			createdAt: mediaLibrary.createdAt
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.creatorId, session.user.id));

	if (contentRows.length === 0) {
		return json(emptyResponse(period));
	}

	const contentIds = contentRows.map((c) => c.id);
	const progressFilter = cutoff
		? and(
			inArray(mediaWatchProgress.contentId, contentIds),
			gte(mediaWatchProgress.updatedAt, cutoff)
		)
		: inArray(mediaWatchProgress.contentId, contentIds);

	const perContent = await db
		.select({
			contentId: mediaWatchProgress.contentId,
			views: sql<number>`count(*)::int`,
			completedWatches: sql<number>`sum(case when ${mediaWatchProgress.isCompleted} then 1 else 0 end)::int`,
			avgCompletion: sql<number>`coalesce(avg(${mediaWatchProgress.completionPercent}), 0)`,
			watchSeconds: sql<number>`coalesce(sum(${mediaWatchProgress.positionSeconds}), 0)`
		})
		.from(mediaWatchProgress)
		.where(progressFilter)
		.groupBy(mediaWatchProgress.contentId);

	const reviewAgg = await db
		.select({
			contentId: reviews.contentId,
			likes: sql<number>`count(*)::int`,
			avgRating: sql<number>`coalesce(avg(${reviews.rating}), 0)`
		})
		.from(reviews)
		.where(and(
			inArray(reviews.contentId, contentIds),
			eq(reviews.isApproved, true)
		))
		.groupBy(reviews.contentId);

	const reviewByContent = new Map(reviewAgg.map((r) => [r.contentId, r]));
	const progressByContent = new Map(perContent.map((p) => [p.contentId, p]));

	let totalViews = 0;
	let totalWatchSeconds = 0;
	let totalCompleted = 0;
	let totalCompletionPctSum = 0;
	let totalLikes = 0;

	const contentPerformance = contentRows.map((c) => {
		const p = progressByContent.get(c.id);
		const r = reviewByContent.get(c.id);
		const views = Number(p?.views ?? 0);
		const completed = Number(p?.completedWatches ?? 0);
		const avgCompletion = Number(p?.avgCompletion ?? 0);
		const watchSeconds = Number(p?.watchSeconds ?? 0);
		const likes = Number(r?.likes ?? 0);
		totalViews += views;
		totalWatchSeconds += watchSeconds;
		totalCompleted += completed;
		totalCompletionPctSum += avgCompletion * views;
		totalLikes += likes;
		return {
			id: c.id,
			title: c.title,
			thumbnail: c.thumbnail,
			views,
			watchTime: Math.round(watchSeconds / 60),
			likes,
			completionRate: Math.round(avgCompletion),
			engagement: views > 0 ? Number((likes / views).toFixed(2)) : 0
		};
	}).sort((a, b) => b.views - a.views);

	const avgWatchMinutes = totalViews > 0 ? Math.round((totalWatchSeconds / totalViews) / 60 * 10) / 10 : 0;
	const overallCompletionRate = totalViews > 0 ? Math.round(totalCompletionPctSum / totalViews) : 0;

	// Shares — count rows in content_shares for this creator's content in window.
	const sharesFilter = cutoff
		? and(inArray(contentShares.contentId, contentIds), gte(contentShares.createdAt, cutoff))
		: inArray(contentShares.contentId, contentIds);
	const [shareAgg] = await db
		.select({ total: sql<number>`count(*)::int` })
		.from(contentShares)
		.where(sharesFilter);
	const totalShares = Number(shareAgg?.total ?? 0);

	// Active viewers — Redis ZSET keyed per creator: each VideoPlayer ping adds
	// `viewerKey` with score=now(); we trim entries older than 60s and report
	// the cardinality. Falls back to 0 if Redis is down.
	let activeViewers = 0;
	try {
		const redis = getRedis();
		const key = `creator:active-viewers:${session.user.id}`;
		const horizon = Date.now() - 60_000;
		await redis.zremrangebyscore(key, 0, horizon);
		activeViewers = await redis.zcard(key);
	} catch {
		activeViewers = 0;
	}

	// Growth rate — views this period vs previous same-length period.
	let growthRate = 0;
	if (cutoff && priorCutoff) {
		const [priorAgg] = await db
			.select({ views: sql<number>`count(*)::int` })
			.from(mediaWatchProgress)
			.where(and(
				inArray(mediaWatchProgress.contentId, contentIds),
				gte(mediaWatchProgress.updatedAt, priorCutoff),
				lt(mediaWatchProgress.updatedAt, cutoff)
			));
		const priorViews = Number(priorAgg?.views ?? 0);
		if (priorViews > 0) {
			growthRate = Math.round(((totalViews - priorViews) / priorViews) * 100);
		} else if (totalViews > 0) {
			growthRate = 100;
		}
	}

	// viewsByDevice + topCountries — from watch_session_meta.
	const metaFilter = cutoff
		? and(inArray(watchSessionMeta.contentId, contentIds), gte(watchSessionMeta.createdAt, cutoff))
		: inArray(watchSessionMeta.contentId, contentIds);

	const deviceRows = await db
		.select({
			deviceType: watchSessionMeta.deviceType,
			count: sql<number>`count(*)::int`
		})
		.from(watchSessionMeta)
		.where(metaFilter)
		.groupBy(watchSessionMeta.deviceType);
	const deviceTotal = deviceRows.reduce((sum, r) => sum + Number(r.count), 0);
	const viewsByDevice = deviceRows
		.filter((r) => r.deviceType)
		.map((r) => ({
			device: r.deviceType ?? 'unknown',
			count: Number(r.count),
			pct: deviceTotal > 0 ? Math.round((Number(r.count) / deviceTotal) * 100) : 0
		}))
		.sort((a, b) => b.count - a.count);

	const countryRows = await db
		.select({
			country: watchSessionMeta.country,
			count: sql<number>`count(*)::int`
		})
		.from(watchSessionMeta)
		.where(metaFilter)
		.groupBy(watchSessionMeta.country)
		.orderBy(sql`count(*) desc`)
		.limit(10);
	const topCountries = countryRows
		.filter((r) => r.country)
		.map((r) => ({ country: r.country ?? 'XX', count: Number(r.count) }));

	let trends: Array<{ date: string; views: number }> = [];
	if (days && days <= 90) {
		const trendRows = await db
			.select({
				day: sql<string>`to_char(date_trunc('day', ${mediaWatchProgress.updatedAt}), 'YYYY-MM-DD')`,
				views: sql<number>`count(*)::int`
			})
			.from(mediaWatchProgress)
			.where(and(
				inArray(mediaWatchProgress.contentId, contentIds),
				gte(mediaWatchProgress.updatedAt, cutoff!)
			))
			.groupBy(sql`date_trunc('day', ${mediaWatchProgress.updatedAt})`)
			.orderBy(sql`date_trunc('day', ${mediaWatchProgress.updatedAt})`);
		trends = trendRows.map((r) => ({ date: r.day, views: Number(r.views) }));
	}

	return json({
		period,
		overview: {
			totalViews,
			totalWatchTime: Math.round(totalWatchSeconds / 60),
			averageWatchTime: avgWatchMinutes,
			completionRate: overallCompletionRate,
			totalLikes,
			totalShares,
			activeViewers,
			growthRate
		},
		contentPerformance,
		viewsByDevice,
		demographics: {
			ageGroups: [],
			genderDistribution: [],
			topCountries
		},
		engagementTrends: trends
	});
};

function emptyResponse(period: string) {
	return {
		period,
		overview: {
			totalViews: 0,
			totalWatchTime: 0,
			averageWatchTime: 0,
			completionRate: 0,
			totalLikes: 0,
			totalShares: 0,
			activeViewers: 0,
			growthRate: 0
		},
		contentPerformance: [],
		viewsByDevice: [],
		demographics: { ageGroups: [], genderDistribution: [], topCountries: [] },
		engagementTrends: []
	};
}
