import { apiSafe } from '$lib/api/client';
import { faithDocumentaries } from '$lib/data/documentaries';
import type { PageLoad } from './$types';

type CatalogResponse = { items: unknown[]; comingSoon: unknown[] };

/** Documentaries catalog. See (app)/movies/+page.ts for why this is universal. */
export const load: PageLoad = async ({ fetch }) => {
	const data = await apiSafe<CatalogResponse>(
		'/api/catalog/documentaries',
		{ items: faithDocumentaries, comingSoon: [] },
		{ fetch }
	);
	return { documentaries: data.items, comingSoon: data.comingSoon };
};
