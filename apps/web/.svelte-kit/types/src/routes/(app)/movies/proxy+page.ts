// @ts-nocheck
import { apiSafe } from '$lib/api/client';
import { faithMovies } from '$lib/data/movies';
import type { PageLoad } from './$types';

type CatalogResponse = { items: unknown[]; comingSoon: unknown[] };

/**
 * Movies catalog.
 *
 * Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
 * render this route — a server load has no server to answer it there. On the
 * web build this still executes on the server during SSR, and SvelteKit invokes
 * the same-origin endpoint in-process rather than over the network, so there is
 * no extra round trip and no SEO change.
 *
 * `apiSafe` preserves the previous behaviour on failure: the old load caught its
 * own errors and rendered a fallback rather than throwing a 500.
 */
export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
	const data = await apiSafe<CatalogResponse>(
		'/api/catalog/movies',
		{ items: faithMovies, comingSoon: [] },
		{ fetch }
	);
	// The component reads `data.movies`; the endpoint is generic across catalogs.
	return { movies: data.items, comingSoon: data.comingSoon };
};
