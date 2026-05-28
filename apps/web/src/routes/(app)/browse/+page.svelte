<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import MediaGrid from "$lib/components/MediaGrid.svelte";
  import RecentlyWatched from "$lib/components/sections/dashboard/RecentlyWatched.svelte";
  import Recommendations from "$lib/components/sections/dashboard/Recommendations.svelte";
  import type { MediaSection } from "$lib/types/media";

  const { data } = $props();

  let isMounted = $state(false);

  const contentSections = $derived<MediaSection[]>([
    { title: "Trending Movies", items: (data.movies || []) as any[] },
    { title: "Popular Shows", items: (data.shows || []) as any[] },
    { title: "Documentaries", items: (data.documentaries || []) as any[] }
  ]);

  onMount(() => {
    isMounted = true;
  });
</script>

<svelte:head>
  <title>Browse - Sephar Studios</title>
</svelte:head>

<div class="relative min-h-screen bg-(--surface-charcoal) text-white">
  <div class="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.12),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.12),transparent_40%)] pointer-events-none"></div>

  <main class="container relative z-10 pt-28 pb-16 mx-auto px-4">
    {#if isMounted}
      <section in:fly={{ y: 30, duration: 600 }} class="pb-10">
        <h1 class="text-3xl font-bold">Browse</h1>
        <p class="text-white/60 mt-1">Discover faith-based content for the whole family</p>
      </section>

      <section in:fly={{ y: 30, duration: 600, delay: 100 }} class="pb-12 max-w-7xl mx-auto w-full space-y-10">
        <RecentlyWatched />
        <Recommendations />
      </section>

      <section in:fly={{ y: 30, duration: 600, delay: 200 }} class="pb-12 max-w-7xl mx-auto w-full">
        <MediaGrid sections={contentSections} />
      </section>
    {/if}
  </main>
</div>
