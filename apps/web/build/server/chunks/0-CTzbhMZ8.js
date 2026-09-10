import { a as api } from './client2-BoVNkloV.js';
import './index.js-DwRgOKlO.js';

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
var ssr = true;
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
		return { user: null };
	}
};

var _layout_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load,
	prerender: prerender,
	ssr: ssr
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-9ryr3ZwP.js')).default;
const universal_id = "src/routes/+layout.ts";
const imports = ["_app/immutable/nodes/0.Dfd5Cuin.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/CVvb29p6.js","_app/immutable/chunks/DRUPmJi1.js","_app/immutable/chunks/B3nkk3ZW2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/B9LjkC4M2.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/BWkGkCHl2.js","_app/immutable/chunks/BIatSNj92.js","_app/immutable/chunks/Bh1jI0ca.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/jz5m4ZJj2.js","_app/immutable/chunks/PIDQPO3q2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/PWAInstallPrompt.Cw6HcEey.css","_app/immutable/assets/0.BK5z3ecK.css","_app/immutable/assets/app.BxdWYkJq.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=0-CTzbhMZ8.js.map
