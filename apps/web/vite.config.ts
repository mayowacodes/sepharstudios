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
          // Ensure Web3 code is in separate chunks
          'web3-core': ['@sephar/web3'],
          // Keep large UI libraries separate
          'ui-libs': ['bits-ui', 'vaul-svelte'],
          // Video player separate chunk
          'video': ['hls.js']
        }
      }
    }
  },
  optimizeDeps: {
    // Exclude Web3 from pre-bundling to ensure proper lazy loading
    exclude: ['@sephar/web3']
  }
});
