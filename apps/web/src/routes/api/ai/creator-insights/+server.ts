import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { generateCreatorInsights, optimizeContentTitle, narrateBlockchainActivity } from '$lib/server/ai-creator-insights';
import { db } from '$lib/db/drizzle';
import { creators, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

/**
 * GET /api/ai/creator-insights
 * Returns AI-generated insights for the authenticated creator.
 * Fetches real analytics from DB and passes to AI.
 */
export const GET = async ({ locals }: RequestEvent) => {
	if (!locals.user) throw error(401, 'Unauthorized');

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

	const insights = await generateCreatorInsights({
		creatorName: creator.displayName,
		totalContent: content.length,
		totalViews,
		avgCompletionRate: 72, // TODO: compute from mediaWatchProgress
		avgRating: parseFloat(avgRating.toFixed(1)),
		topContentTitles,
		recentContentTitles,
		contentTypes,
		totalRevenueSTC: creator.totalEarnings ?? 0,
		totalRevenueUSD: 0, // TODO: from paystackSubscriptions revenue attribution
		followerGrowth30d: 0 // TODO: from subscriber tracking
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
