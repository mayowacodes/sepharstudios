import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { moderateComment, moderateContentMetadata, scoreReviewQuality } from '$lib/server/ai-moderation';

/**
 * POST /api/ai/moderate
 * Unified moderation endpoint.
 *
 * Body types:
 *   { type: 'comment', text, contentTitle }
 *   { type: 'content', title, description, genres, topics, bibleReference, contentType }
 *   { type: 'review', reviewText, rating, contentTitle }
 */
export const POST = async ({ request, locals }: RequestEvent) => {
	if (!locals.user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { type } = body;

	if (!type) throw error(400, 'type is required');

	switch (type) {
		case 'comment': {
			const { text, contentTitle } = body;
			if (!text || !contentTitle) throw error(400, 'text and contentTitle required');
			const result = await moderateComment(text, contentTitle);
			if (!result) {
				// AI down — default to approve (human review will catch issues)
				return json({ verdict: 'approve', reason: 'AI unavailable — defaulting to approve', aiProvider: 'none' });
			}
			return json(result);
		}

		case 'content': {
			const { title, description, genres = [], topics = [], bibleReference = '', contentType = 'movie' } = body;
			if (!title || !description) throw error(400, 'title and description required');
			const result = await moderateContentMetadata(title, description, genres, topics, bibleReference, contentType);
			if (!result) {
				return json({ verdict: 'flag', reason: 'AI unavailable — flagged for manual review', aiProvider: 'none' });
			}
			return json(result);
		}

		case 'review': {
			const { reviewText, rating, contentTitle } = body;
			if (!reviewText || !contentTitle) throw error(400, 'reviewText and contentTitle required');
			const result = await scoreReviewQuality(reviewText, rating ?? 3, contentTitle);
			if (!result) {
				return json({ qualityScore: 5, isGenuine: true, isThoughtful: false, hasFaithInsight: false, tokenRewardMultiplier: 0.5, aiProvider: 'none' });
			}
			return json(result);
		}

		default:
			throw error(400, `Unknown moderation type: ${type}`);
	}
};
