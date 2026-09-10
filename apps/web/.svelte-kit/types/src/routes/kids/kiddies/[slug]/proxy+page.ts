// @ts-nocheck
import { apiOrError } from '$lib/api/client';
import type { loadMediaDetail } from '$lib/server/media-detail-load';
import type { PageLoad } from './$types';

/**
 * The endpoint returns `loadMediaDetail`'s payload verbatim, so its return type
 * is the contract. Deriving it here rather than restating the shape keeps the
 * page's `data` typing correct automatically when the helper changes.
 *
 * `import type` is erased before the module graph is built, so this does not
 * pull server-only code into the client bundle.
 */
type MediaDetail = Awaited<ReturnType<typeof loadMediaDetail>>;

/**
 * Kids detail page. Resolves any media row with category='kids' regardless of media type, so one route serves movies, shows and documentaries alike.
 *
 * Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
 * render this route. `apiOrError` maps the endpoint's 404 onto SvelteKit's
 * error page, matching what `loadMediaDetail` did when it ran server-side.
 */
export const load = async ({ params, fetch }: Parameters<PageLoad>[0]) => {
	return apiOrError<MediaDetail>('/api/catalog/detail/kiddies/' + encodeURIComponent(params.slug), { fetch });
};
