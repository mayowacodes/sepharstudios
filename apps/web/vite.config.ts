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
        manualChunks: {
          // Keep large UI libraries separate
          'ui-libs': ['bits-ui', 'vaul-svelte']
        }
      }
    }
  }
});
