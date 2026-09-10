import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';

// Single source of truth for "is this the Capacitor/Tauri bundle?". Driven by
// the same BUILD_TARGET that svelte.config.js uses to pick the adapter, so the
// two can never disagree. Inlined at build time, so `ssr = !__NATIVE_BUILD__`
// in the root layout is a compile-time constant SvelteKit can act on.
const NATIVE = process.env.BUILD_TARGET === 'static';

export default defineConfig({
  define: {
    __NATIVE_BUILD__: JSON.stringify(NATIVE),
    // Where /api/* lives. Empty for the web build (same-origin, so SSR and the
    // browser both just hit the current host). The native builds have no host
    // of their own, so they must be pinned to the deployed origin at build time.
    __API_ORIGIN__: JSON.stringify(
      NATIVE ? (process.env.PUBLIC_API_ORIGIN ?? 'https://sepharstudios.com') : ''
    )
  },
  plugins: [
    sveltekit(),
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html',
      open: false, // Changed to false to avoid opening on every build
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // Rolldown (used by Vite 8) requires the function form; the legacy
        // object form errors out. Same chunking strategy as before — UI libs
        // and layerchart get their own bundles so non-admin routes never
        // download them.
        manualChunks(id) {
          if (id.includes('node_modules/bits-ui') || id.includes('node_modules/vaul-svelte')) {
            return 'ui-libs';
          }
          if (id.includes('node_modules/layerchart')) {
            return 'chart-lib';
          }
        }
      }
    }
  }
});
