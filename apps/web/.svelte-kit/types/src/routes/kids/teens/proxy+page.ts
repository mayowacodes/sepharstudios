// @ts-nocheck
import { apiSafe } from '$lib/api/client';
import type { MediaItem } from '$lib/types/media';
import type { PageLoad } from './$types';

/** Teens portal feed. See kids/kiddies/+page.ts. */
export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
	return apiSafe<{ content: MediaItem[] }>(
		'/api/catalog/audience/teens',
		{ content: [] },
		{ fetch }
	);
};
