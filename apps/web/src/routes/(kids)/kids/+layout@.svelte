<!-- src/routes/kids/+layout.svelte -->
<script lang="ts">
  import KidsTopNav from '$lib/components/kids/KidsTopNav.svelte';
  import { page } from '$app/state';
  
  // Don't show navigation on profile or main kids page
  $: showNav = page.route.id !== '/(app)/kids/profile' && page.route.id !== '/(app)/kids';
</script>

{#if showNav}
  <KidsTopNav />
{/if}
<slot />