// @ts-nocheck
import { apiSafe } from '$lib/api/client';
import type { PageLoad } from './$types';

/**
 * Dedicated Coming Soon listing. The page groups items by month client-side
 * from `scheduledPublishAt`, so the endpoint returns the full set unlimited.
 */
export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
	const data = await apiSafe<{ items: unknown[] }>(
		'/api/catalog/coming-soon',
		{ items: [] },
		{ fetch }
	);
	return { items: data.items };
};
