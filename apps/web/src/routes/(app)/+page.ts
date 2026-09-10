import { apiSafe } from '$lib/api/client';
import type { HomePayload } from '../api/home/+server';
import type { PageLoad } from './$types';

/**
 * Landing page.
 *
 * The previous server load swallowed its own errors and rendered empty rows
 * rather than failing the highest-traffic route in the app — `apiSafe` keeps
 * exactly that behaviour.
 */
export const load: PageLoad = async ({ fetch }) => {
	return apiSafe<HomePayload>(
		'/api/home',
		{ shows: [], movies: [], documentaries: [], continueWatching: [], comingSoon: [] },
		{ fetch }
	);
};
