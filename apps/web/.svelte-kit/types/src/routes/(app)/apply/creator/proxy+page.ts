// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/**
 * Creator application form — sign-in required.
 *
 * Universal so the native bundle can render it. The guard is unchanged in
 * effect: on the web build this still runs server-side during SSR, and the POST
 * endpoint the form submits to authenticates independently, so the redirect is
 * a UX affordance rather than the security boundary.
 */
export const load = async ({ parent, url }: Parameters<PageLoad>[0]) => {
	const { user } = await parent();
	if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	return {};
};
