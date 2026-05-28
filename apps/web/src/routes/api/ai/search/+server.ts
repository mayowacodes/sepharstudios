import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { semanticSearch } from '$lib/server/recommendations';
import { enforceRateLimit, AI_SEARCH_LIMIT } from '$lib/server/rate-limit';

/**
 * GET /api/ai/search?q=something+emotional+but+uplifting&limit=12
 * Semantic search: natural language → AI intent classification → scored content results
 */
export const GET = async ({ url, locals }: RequestEvent) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	await enforceRateLimit(`ai:search:${locals.user.id}`, AI_SEARCH_LIMIT);

	const query = url.searchParams.get('q')?.trim();
	if (!query || query.length < 3) throw error(400, 'q must be at least 3 characters');

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '12'), 50);

	const results = await semanticSearch(query, limit);

	return json({
		query,
		count: results.length,
		results: results.map((r) => ({
			id: r.id,
			title: r.title,
			description: r.description,
			thumbnail: r.thumbnail,
			posterUrl: r.posterUrl,
			genres: r.genres,
			topics: r.topics,
			ageRating: r.ageRating,
			mediaType: r.mediaType,
			year: r.year,
			link: r.link
		}))
	});
};
