import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * One codebase, two shipping shapes.
 *
 *   BUILD_TARGET=node   (default) → adapter-node → build/       → Docker image
 *   BUILD_TARGET=static           → adapter-static → build-static/ → Capacitor APK + Tauri desktop
 *
 * The static target is a pure SPA: no server at runtime, so every route's data
 * has to come from `+page.ts` universal loads hitting /api/* on the deployed
 * origin. That is why `+page.server.ts` is being retired app-wide — a universal
 * load still runs on the server for the web build (so SSR/SEO is unaffected),
 * but can *also* run in a WebView where no server exists.
 *
 * `fallback: 'index.html'` makes every unmatched path boot the SPA shell, which
 * is what a file:// / capacitor:// origin needs. `strict: false` is required
 * because nothing is prerendered — the fallback handles all routing.
 */
const target = process.env.BUILD_TARGET ?? 'node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter:
			target === 'static'
				? adapterStatic({
						pages: 'build-static',
						assets: 'build-static',
						fallback: 'index.html',
						precompress: false,
						strict: false
					})
				: adapterNode()
	}
};

export default config;
