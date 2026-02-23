<!-- src/routes/kids/+layout.svelte -->
<script lang="ts">
  import KidsTopNav from '$lib/components/kids/KidsTopNav.svelte';
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  // Don't show navigation on profile or main kids page
  const showNav = $derived(!page.url.pathname.endsWith('/kids') && !page.url.pathname.endsWith('/kids/profile'));
</script>

{#if showNav}
  <KidsTopNav />
{/if}
{@render children()}