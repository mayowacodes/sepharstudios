// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

/**
 * Guards every route under (creator)/*. Admins can view creator pages too —
 * they often need to inspect a creator's workspace for moderation.
 *
 * Universal rather than server-side for the reason documented in
 * (admin)/+layout.ts: a server load cannot run in the native bundle, and the
 * real authorisation boundary is the /api/creator/* endpoints.
 */
export const load = async ({ parent }: Parameters<LayoutLoad>[0]) => {
	const { user } = await parent();
	if (!user) throw error(401, 'Sign in required');
	if (user.role !== 'creator' && user.role !== 'admin') {
		throw error(403, 'Forbidden: you are not a creator');
	}
	return { user };
};
