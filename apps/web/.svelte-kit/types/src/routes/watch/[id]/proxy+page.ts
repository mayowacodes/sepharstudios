// @ts-nocheck
import { apiOrError } from '$lib/api/client';
import type { PlaybackPayload } from '../../api/playback/[id]/+server';
import type { PageLoad } from './$types';

/**
 * Watch page.
 *
 * All the work lives in `/api/playback/:id`, which is the former server load
 * moved intact. It must stay on the server: that handler strips playback URLs
 * for unpurchased PPV titles, and the encoder bucket is public-read, so a URL
 * that reaches the client is a free stream. This load only forwards the query
 * string and hands the response through.
 */
export const load = async ({ params, url, fetch }: Parameters<PageLoad>[0]) => {
	// Forward ?episode= and ?locale= untouched — the endpoint reads them from
	// its own `url`, so they must travel on the request.
	return apiOrError<PlaybackPayload>(
		`/api/playback/${encodeURIComponent(params.id)}${url.search}`,
		{ fetch }
	);
};
