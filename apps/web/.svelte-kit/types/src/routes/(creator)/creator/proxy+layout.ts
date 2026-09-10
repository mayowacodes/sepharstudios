// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

/**
 * Role guard for every route under /creator. Admins pass too — they need to
 * inspect a creator's workspace for moderation.
 *
 * Placed at `(creator)/creator/` rather than `(creator)/` for the same reason
 * documented in (admin)/admin/+layout.ts: the `+layout@.svelte` reset in this
 * directory removes the `(creator)` group node from the route chain, so a guard
 * one level up never executes.
 */
export const load = async ({ parent }: Parameters<LayoutLoad>[0]) => {
	const { user } = await parent();
	if (!user) throw error(401, 'Sign in required');
	if (user.role !== 'creator' && user.role !== 'admin') {
		throw error(403, 'Forbidden: you are not a creator');
	}
	return { user };
};
