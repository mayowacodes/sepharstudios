import { t as api } from "../../chunks/client2.js";
//#region src/routes/+layout.ts
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
var ssr = false;
/**
* Nothing is prerendered. Routes are user- and session-specific, and the native
* build relies on the `fallback: 'index.html'` shell to route everything.
*/
var prerender = false;
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
var load = async ({ fetch }) => {
	try {
		return { user: (await api("/api/auth/get-session", { fetch }))?.user ?? null };
	} catch (e) {
		console.error("[layout] session lookup failed:", e);
		return { user: null };
	}
};
//#endregion
export { load, prerender, ssr };
