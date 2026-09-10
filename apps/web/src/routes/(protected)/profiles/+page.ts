import { apiOrError } from '$lib/api/client';
import { redirect } from '@sveltejs/kit';
import type { ProfilesOverviewPayload } from '../../api/profiles/overview/+server';
import type { PageLoad } from './$types';

/**
 * Profile picker. The endpoint coerces each PIN to a boolean before returning,
 * so no PIN reaches the client.
 */
export const load: PageLoad = async ({ parent, fetch }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, '/auth/login?redirectTo=/profiles');
	return apiOrError<ProfilesOverviewPayload>('/api/profiles/overview', { fetch });
};
