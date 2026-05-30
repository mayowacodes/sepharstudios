import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
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
