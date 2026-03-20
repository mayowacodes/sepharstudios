import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const user = locals.user;
	if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	return {};
}) satisfies PageServerLoad;
