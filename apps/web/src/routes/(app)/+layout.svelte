<script lang="ts">
  import Header from '$lib/components/sections/header.svelte';
  import Footer from '$lib/components/sections/footer.svelte';
  let { children } = $props();
</script>

<div class="min-h-screen bg-linear-to-b from-background to-accent/10">
  <Header />
  <main class="flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
