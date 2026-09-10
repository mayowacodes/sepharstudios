// @ts-nocheck
import { apiOrError } from '$lib/api/client';
import type { LivePlaybackPayload } from '../../../api/playback/live/[id]/+server';
import type { PageLoad } from './$types';

/**
 * Live stream watch page. The visibility and moderation checks live in
 * `/api/playback/live/:id` so they run server-side; this only forwards.
 */
export const load = async ({ params, fetch }: Parameters<PageLoad>[0]) => {
	return apiOrError<LivePlaybackPayload>(
		`/api/playback/live/${encodeURIComponent(params.id)}`,
		{ fetch }
	);
};
