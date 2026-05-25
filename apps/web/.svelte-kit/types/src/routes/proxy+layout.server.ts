// @ts-nocheck
import type { ServerLoad } from '@sveltejs/kit';

/**
 * Expose the current user to every page in the app.
 * Components read `data.user` to check auth state.
 * The AICopilot widget uses this to render auth-gated vs. guest UI.
 */
export const load = async ({ locals }: Parameters<ServerLoad>[0]) => {
	return {
		user: locals.user ?? null
	};
};
