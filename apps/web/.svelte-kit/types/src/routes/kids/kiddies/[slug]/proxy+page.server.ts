// @ts-nocheck
import type { PageServerLoad } from './$types';
import { loadMediaDetail } from '$lib/server/media-detail-load';

// Kids detail page — resolves any media row with `category='kids'`.
// We don't restrict by mediaType: a single /kids/kiddies/<slug> works
// regardless of whether it's a movie, show, or documentary, so the
// kids portal doesn't need three parallel sub-routes for each content
// type the way the general /movies, /shows, /documentaries do.
export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const session = await locals.auth.getSession();
	return loadMediaDetail({
		slug: params.slug,
		category: 'kids',
		userId: session?.user.id
	});
};
