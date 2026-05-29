import { json, type RequestHandler } from '@sveltejs/kit';
import { searchMedia, isMeiliConfigured } from '$lib/server/meilisearch';

/**
 * GET /api/search?q=&limit=&offset=&genre=&mediaType=&ageRating=
 *
 * Fast lexical search backed by Meilisearch. Returns results in the same
 * shape as /api/ai/search so the frontend can fall back transparently.
 *
 * When Meilisearch isn't configured, returns 503 with `skipped:true`. The
 * search page handles that by routing the query to /api/ai/search.
 */

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	if (!q) return json({ results: [], q: '', source: 'meili' });

	if (!isMeiliConfigured()) {
		return json({ skipped: true, reason: 'Meilisearch is not configured.' }, { status: 503 });
	}

	const limit = Math.min(60, Math.max(1, parseInt(url.searchParams.get('limit') ?? '24', 10)));
	const offset = Math.max(0, parseInt(url.searchParams.get('offset') ?? '0', 10));

	const filters: string[] = [];
	const genre = url.searchParams.get('genre');
	if (genre) filters.push(`genres = "${genre.replace(/"/g, '\\"')}"`);
	const mediaType = url.searchParams.get('mediaType');
	if (mediaType) filters.push(`mediaType = "${mediaType.replace(/"/g, '\\"')}"`);
	const ageRating = url.searchParams.get('ageRating');
	if (ageRating) filters.push(`ageRating = "${ageRating.replace(/"/g, '\\"')}"`);

	try {
		const hits = await searchMedia(q, {
			limit,
			offset,
			filter: filters.length > 0 ? filters : undefined
		});

		const results = hits.map((h) => ({
			id: h.id,
			title: h.title,
			description: h.description ?? '',
			thumbnail: h.thumbnail ?? h.posterUrl ?? null,
			posterUrl: h.posterUrl ?? h.thumbnail ?? null,
			genres: h.genres ?? [],
			topics: h.topics ?? [],
			ageRating: h.ageRating ?? null,
			mediaType: h.mediaType ?? null,
			year: h.year ?? null,
			link: `/watch/${h.id}`
		}));

		return json({ results, q, source: 'meili', count: results.length });
	} catch (err) {
		console.error('[search] meili query failed:', err);
		return json({ error: 'Search service is temporarily unavailable.' }, { status: 502 });
	}
};
