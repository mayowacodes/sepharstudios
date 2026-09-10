// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

/**
 * Guards every route under (admin)/* with a role check.
 *
 * Was a `+layout.server.ts`. It had to become a universal load so the native
 * bundle can render these routes at all — a server load has no server to answer
 * it there, and this one gates the whole route group.
 *
 * The defence-in-depth property is preserved on web: universal loads still run
 * on the server during SSR, so an /admin/* request on the apex domain is still
 * refused before any HTML is produced. On native the check runs client-side,
 * which is not a weakening either — it was never the real boundary. Every
 * /api/admin/* endpoint authorises independently, so a bypassed client guard
 * yields an empty shell, not data.
 */
export const load = async ({ parent }: Parameters<LayoutLoad>[0]) => {
	const { user } = await parent();
	if (!user) throw error(401, 'Sign in required');
	if (user.role !== 'admin') throw error(403, 'Forbidden: you are not an admin');
	return { user };
};
