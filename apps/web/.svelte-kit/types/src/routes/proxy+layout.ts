// @ts-nocheck
import { api, IS_NATIVE } from '$lib/api/client';
import type { User } from '$lib/auth';
import type { LayoutLoad } from './$types';

/**
 * Rendering mode, chosen per build target.
 *
 * Web (BUILD_TARGET=node): SSR stays on. Server-rendered HTML is what makes the
 * catalog indexable, and the SEO work in docs/seo.md depends on it.
 *
 * Native (BUILD_TARGET=static): SSR off. The Capacitor/Tauri bundle ships to a
 * device with no server behind it, so every route renders client-side from the
 * SPA fallback shell.
 *
 * `__NATIVE_BUILD__` is inlined by vite `define` (see vite.config.ts), so this
 * is a compile-time constant — SvelteKit reads it during the build rather than
 * at runtime, which is required for `ssr` to have any effect.
 */
export const ssr = !__NATIVE_BUILD__;

/**
 * Nothing is prerendered. Routes are user- and session-specific, and the native
 * build relies on the `fallback: 'index.html'` shell to route everything.
 */
export const prerender = false;

type SessionResponse = { user: User } | null;

/**
 * Expose the current user to every page in the app.
 * Components read `data.user` to check auth state.
 *
 * This replaces the old `+layout.server.ts`, which read `locals.user` directly.
 * It had to go: a `+*.server.ts` load cannot run in the native bundle — with no
 * server to serve `__data.json`, the client's request for it fails and takes
 * every route down with it, since this is the root layout. A universal load
 * runs in both places instead.
 *
 * There is no SSR penalty from the switch. For a same-origin request, the
 * `fetch` SvelteKit hands a load function invokes the endpoint in-process
 * rather than going over the network, and serializes the result into the
 * hydration payload so the browser doesn't repeat the call.
 */
export const load = async ({ fetch }: Parameters<LayoutLoad>[0]) => {
	try {
		const session = await api<SessionResponse>('/api/auth/get-session', { fetch });
		return { user: session?.user ?? null };
	} catch (e) {
		// A signed-out visitor is the common case here, not an error condition —
		// the whole public catalog is browsable anonymously. Never let this
		// throw: it is the root layout, so a throw is a whole-app blank page.
		if (IS_NATIVE) console.error('[layout] session lookup failed:', e);
		return { user: null };
	}
};
