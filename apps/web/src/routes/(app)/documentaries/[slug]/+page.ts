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
 * Documentary detail page.
 *
 * Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
 * render this route. `apiOrError` maps the endpoint's 404 onto SvelteKit's
 * error page, matching what `loadMediaDetail` did when it ran server-side.
 */
export const load: PageLoad = async ({ params, fetch }) => {
	return apiOrError<MediaDetail>('/api/catalog/detail/documentaries/' + encodeURIComponent(params.slug), { fetch });
};
