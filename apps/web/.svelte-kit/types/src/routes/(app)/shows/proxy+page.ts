// @ts-nocheck
import { apiSafe } from '$lib/api/client';
import { faithTVShows } from '$lib/data/shows';
import type { PageLoad } from './$types';

type CatalogResponse = { items: unknown[]; comingSoon: unknown[] };

/** Shows catalog. See (app)/movies/+page.ts for why this is universal. */
export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
	const data = await apiSafe<CatalogResponse>(
		'/api/catalog/shows',
		{ items: faithTVShows, comingSoon: [] },
		{ fetch }
	);
	return { shows: data.items, comingSoon: data.comingSoon };
};
