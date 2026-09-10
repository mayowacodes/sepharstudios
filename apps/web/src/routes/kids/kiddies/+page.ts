import { apiSafe } from '$lib/api/client';
import type { MediaItem } from '$lib/types/media';
import type { PageLoad } from './$types';

/**
 * Kids portal feed. Universal so the native bundle can render it; the previous
 * server load swallowed its own errors and rendered an empty grid, which
 * `apiSafe` preserves.
 */
export const load: PageLoad = async ({ fetch }) => {
	return apiSafe<{ content: MediaItem[] }>(
		'/api/catalog/audience/kids',
		{ content: [] },
		{ fetch }
	);
};
