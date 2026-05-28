import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { generateCreatorInsights, optimizeContentTitle, narrateBlockchainActivity } from '$lib/server/ai-creator-insights';
import { db } from '$lib/db/drizzle';
import { creators, mediaLibrary, mediaWatchProgress, transactions, creatorFollowers } from '$lib/db/schema/sepharstudios';
import { and, eq, gte, sql, inArray } from 'drizzle-orm';
import { enforceRateLimit, AI_AGENT_LIMIT } from '$lib/server/rate-limit';

/**
 * GET /api/ai/creator-insights
 * Returns AI-generated insights for the authenticated creator.
 * Fetches real analytics from DB and passes to AI.
 */
export const GET = async ({ locals }: RequestEvent) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	await enforceRateLimit(`ai:creator-insights:${locals.user.id}`, AI_AGENT_LIMIT);

	// Fetch creator profile
	const [creator] = await db
		.select()
		.from(creators)
		.where(eq(creators.userId, locals.user.id))
		.limit(1);

	if (!creator) throw error(404, 'Creator profile not found');

	// Fetch their content
	const content = await db
		.select({
			title: mediaLibrary.title,
			viewCount: mediaLibrary.viewCount,
			mediaType: mediaLibrary.mediaType,
			voteAverage: mediaLibrary.voteAverage,
			createdAt: mediaLibrary.createdAt
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.creatorId, locals.user.id))
		.limit(50);

	if (content.length === 0) {
		return json({ message: 'No content yet — upload your first piece to get insights!' });
	}

	// Derive stats
	const totalViews = content.reduce((sum, c) => sum + (c.viewCount ?? 0), 0);
	const avgRating =
		content.reduce((sum, c) => sum + parseFloat(c.voteAverage ?? '0'), 0) / content.length;
	const contentTypes = [...new Set(content.map((c) => c.mediaType))];

	const sortedByViews = [...content].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
	const topContentTitles = sortedByViews.slice(0, 5).map((c) => c.title);
	const recentContentTitles = [...content]
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 3)
		.map((c) => c.title);

	// Get the real content IDs to query for stats below.
	const contentIdsRows = await db
		.select({ id: mediaLibrary.id })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.creatorId, locals.user.id));
	const contentIds = contentIdsRows.map((r) => r.id);

	// Real avgCompletionRate: average over all watch-progress rows for this
	// creator's content. Zero when no one's watched anything yet (honest).
	let avgCompletionRate = 0;
	if (contentIds.length > 0) {
		const [completionRow] = await db
			.select({
				avg: sql<number>`coalesce(avg(${mediaWatchProgress.completionPercent}), 0)`
			})
			.from(mediaWatchProgress)
			.where(inArray(mediaWatchProgress.contentId, contentIds));
		avgCompletionRate = Math.round(Number(completionRow?.avg ?? 0));
	}

	// Real totalRevenueUSD: sum of all completed creator_payout transactions
	// for this user in USD. STC payouts excluded (already counted separately).
	const [revRow] = await db
		.select({
			total: sql<number>`coalesce(sum(${transactions.amount}), 0)`
		})
		.from(transactions)
		.where(and(
			eq(transactions.userId, locals.user.id),
			eq(transactions.type, 'creator_payout'),
			eq(transactions.status, 'completed'),
			eq(transactions.currency, 'USD')
		));
	const totalRevenueUSD = Number(revRow?.total ?? 0) / 100; // cents → dollars

	// followerGrowth30d: net new followers in the last 30 days.
	const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);
	const [followRow] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(creatorFollowers)
		.where(and(
			eq(creatorFollowers.creatorId, creator.id),
			gte(creatorFollowers.createdAt, thirtyDaysAgo),
			eq(creatorFollowers.status, 'active')
		));
	const followerGrowth30d = Number(followRow?.count ?? 0);

	const insights = await generateCreatorInsights({
		creatorName: creator.displayName,
		totalContent: content.length,
		totalViews,
		avgCompletionRate,
		avgRating: parseFloat(avgRating.toFixed(1)),
		topContentTitles,
		recentContentTitles,
		contentTypes,
		totalRevenueSTC: creator.totalEarnings ?? 0,
		totalRevenueUSD,
		followerGrowth30d
	});

	if (!insights) throw error(503, 'AI insights unavailable');
	return json(insights);
};

/**
 * POST /api/ai/creator-insights
 * Body types:
 *   { type: 'optimize_title', contentId or title+description+genres+bibleReference+contentType }
 *   { type: 'narrate_activity', transactions[] }
 */
export const POST = async ({ request, locals }: RequestEvent) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	await enforceRateLimit(`ai:creator-insights:${locals.user.id}`, AI_AGENT_LIMIT);

	const body = await request.json();
	const { type } = body;

	switch (type) {
		case 'optimize_title': {
			const { contentId, title, description = '', genres = [], bibleReference = '', contentType = 'movie' } = body;

			let resolvedTitle = title;
			if (contentId) {
				const [content] = await db
					.select({ title: mediaLibrary.title })
					.from(mediaLibrary)
					.where(eq(mediaLibrary.id, contentId))
					.limit(1);
				if (content) resolvedTitle = content.title;
			}

			if (!resolvedTitle) throw error(400, 'title or contentId required');

			const result = await optimizeContentTitle({
				currentTitle: resolvedTitle,
				description,
				genres,
				bibleReference,
				contentType
			});

			if (!result) throw error(503, 'Title optimizer unavailable');
			return json(result);
		}

		case 'narrate_activity': {
			const { transactions = [] } = body;
			const narrative = await narrateBlockchainActivity(transactions);
			if (!narrative) throw error(503, 'Activity narration unavailable');
			return json({ narrative });
		}

		default:
			throw error(400, `Unknown type: ${type}`);
	}
};
