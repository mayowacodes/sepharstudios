import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { scoreWatchEngagement, analyzeUserEngagementPattern } from '$lib/server/ai-token-scoring';

/**
 * POST /api/ai/token-score
 * Scores engagement quality to determine STC token reward amounts.
 *
 * Body types:
 *   { type: 'watch', ...watch session data }
 *   { type: 'pattern', ...30-day stats }
 */
export const POST = async ({ request, locals }: RequestEvent) => {
	if (!locals.user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { type } = body;

	if (!type) throw error(400, 'type is required');

	switch (type) {
		case 'watch': {
			const {
				completionPercent = 0,
				watchTimeSeconds = 0,
				totalDurationSeconds = 0,
				leftReview = false,
				leftComment = false,
				sharedContent = false,
				addedToWatchlist = false,
				baseStcReward = 10
			} = body;

			const result = await scoreWatchEngagement({
				completionPercent,
				watchTimeSeconds,
				totalDurationSeconds,
				leftReview,
				leftComment,
				sharedContent,
				addedToWatchlist,
				baseStcReward
			});

			if (!result) throw error(503, 'Scoring service unavailable');
			return json(result);
		}

		case 'pattern': {
			const {
				last30DaysWatchSessions = 0,
				avgSessionDurationSeconds = 0,
				avgCompletionPercent = 0,
				reviewsLeft = 0,
				commentsLeft = 0,
				uniqueContentsWatched = 0,
				stcEarned30Days = 0,
				accountAgedays = 0
			} = body;

			const result = await analyzeUserEngagementPattern({
				userId: locals.user.id,
				last30DaysWatchSessions,
				avgSessionDurationSeconds,
				avgCompletionPercent,
				reviewsLeft,
				commentsLeft,
				uniqueContentsWatched,
				stcEarned30Days,
				accountAgedays
			});

			if (!result) throw error(503, 'Pattern analysis unavailable');
			return json(result);
		}

		default:
			throw error(400, `Unknown type: ${type}`);
	}
};
