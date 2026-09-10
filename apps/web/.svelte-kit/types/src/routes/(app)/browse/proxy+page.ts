// @ts-nocheck
import { apiSafe } from '$lib/api/client';
import type { PageLoad } from './$types';

type BrowseResponse = { shows: unknown[]; movies: unknown[]; documentaries: unknown[] };

/** Browse landing rows. See (app)/movies/+page.ts for why this is universal. */
export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
	return apiSafe<BrowseResponse>(
		'/api/catalog/browse',
		{ shows: [], movies: [], documentaries: [] },
		{ fetch }
	);
};
