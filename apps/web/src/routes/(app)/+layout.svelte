<script lang="ts">
  import Header from '$lib/components/sections/header.svelte';
  import Footer from '$lib/components/sections/footer.svelte';
  let { children } = $props();
</script>

<div class="min-h-screen bg-linear-to-b from-background to-accent/10">
  <!--
    Skip-to-content link per WCAG SC 2.4.1 (Bypass Blocks). Invisible to mouse
    users; becomes visible on keyboard focus and lets Tab users jump past the
    header navigation directly to <main>.
  -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary"
  >
    Skip to main content
  </a>
  <Header />
  <main id="main-content" tabindex="-1" class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
