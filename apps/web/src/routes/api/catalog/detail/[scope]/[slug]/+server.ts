import { json, error, type RequestHandler } from '@sveltejs/kit';
import { loadMediaDetail } from '$lib/server/media-detail-load';

/**
 * GET /api/catalog/detail/:scope/:slug  →  the media detail payload
 *
 * Backs the five detail routes — /movies/[slug], /shows/[slug],
 * /documentaries/[slug], /kids/kiddies/[slug] and /kids/teens/[slug] — which
 * were each a two-line `+page.server.ts` wrapping `loadMediaDetail`. Those
 * cannot run in the Capacitor/Tauri bundle, so the wrapper moved here and the
 * pages became universal loads.
 *
 * `scope` folds together two different filters that `loadMediaDetail` keeps
 * separate:
 *   - the three general catalogs select by `mediaType`
 *   - the two kids portals select by `category`, deliberately WITHOUT a
 *     mediaType filter, so one /kids/kiddies/<slug> route resolves a movie,
 *     show or documentary alike rather than needing three parallel sub-routes
 */
const SCOPES = {
	movies: { mediaType: 'movie' },
	shows: { mediaType: 'tv' },
	documentaries: { mediaType: 'documentary' },
	kiddies: { category: 'kids' },
	teens: { category: 'teens' }
} as const satisfies Record<
	string,
	{ mediaType?: 'movie' | 'tv' | 'documentary' | 'series'; category?: 'kids' | 'teens' }
>;

type Scope = keyof typeof SCOPES;

export const GET: RequestHandler = async ({ params, locals }) => {
	const scope = params.scope ?? '';
	if (!(scope in SCOPES)) throw error(404, 'Unknown catalog');

	const slug = params.slug;
	if (!slug) throw error(400, 'Missing slug');

	const session = await locals.auth.getSession();
	const detail = await loadMediaDetail({
		slug,
		...SCOPES[scope as Scope],
		userId: session?.user.id
	});

	return json(detail);
};
