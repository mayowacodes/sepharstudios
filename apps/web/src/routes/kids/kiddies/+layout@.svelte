<!-- src/routes/kids/+layout.svelte -->
<script lang="ts">
  import KidsTopNav from '$lib/components/kids/KidsTopNav.svelte';
  import { page } from '$app/state';
  
  // Don't show navigation on profile or main kids page
  const showNav = $derived(page.route.id !== '/(kids)/kids/profile' && page.route.id !== '/(kids)/kids');
</script>

{#if showNav}
  <KidsTopNav />
{/if}
<slot />