<script lang="ts">
  import { onMount } from 'svelte';
  import MediaGrid from '$lib/components/MediaGrid.svelte';
  import type { MediaSection } from '$lib/types/media';

  const { data } = $props();

  let sections: MediaSection[] = $derived.by(() => {
    const content = data.content || [];
    return [
      { title: 'Teen Movies', items: content.filter((item: any) => item.mediaType === 'movie') },
      { title: 'Teen Shows', items: content.filter((item: any) => item.mediaType === 'show') },
      { title: 'Teen Documentaries', items: content.filter((item: any) => item.mediaType === 'documentary') }
    ].filter(section => section.items.length > 0);
  });

  interface WatchItem {
    id: string;
    title: string;
    thumbnail: string | null;
    positionSeconds: number;
    durationSeconds: number | null;
    completionPercent: number;
  }

  let recentItems = $state<WatchItem[]>([]);

  onMount(async () => {
    try {
      const res = await fetch('/api/watch/history?limit=4');
      if (res.ok) recentItems = await res.json();
    } catch { /* non-critical */ }
  });
</script>

<div class="min-h-screen bg-linear-to-br from-indigo-50 to-blue-100 p-4">
  <div class="container mx-auto">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-indigo-700 mb-2">Sephar Teens</h1>
      <p class="text-lg text-indigo-600">Faith-based content tailored for the next generation.</p>
    </header>

    <!-- Continue Watching -->
    {#if recentItems.length > 0}
      <section class="mb-8">
        <h2 class="text-xl font-bold text-indigo-700 mb-4">Keep Watching</h2>
        <div class="flex gap-4 overflow-x-auto pb-2">
          {#each recentItems as item (item.id)}
            <a href="/watch/{item.id}?t={item.positionSeconds}" class="w-40 shrink-0 group">
              <div class="relative aspect-video rounded-xl overflow-hidden bg-indigo-200 shadow">
                {#if item.thumbnail}
                  <img src={item.thumbnail} alt={item.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {/if}
                <div class="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                  <div class="h-full bg-indigo-500" style="width: {item.completionPercent}%"></div>
                </div>
                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-indigo-600 text-sm">▶</div>
                </div>
              </div>
              <p class="text-indigo-800 text-xs font-semibold mt-1 truncate">{item.title}</p>
            </a>
          {/each}
        </div>
      </section>
    {/if}

    {#if sections.length > 0}
      <MediaGrid {sections} />
    {:else}
      <div class="p-12 text-center bg-white/50 backdrop-blur rounded-2xl border-2 border-dashed border-indigo-200">
        <p class="text-indigo-600 font-medium">No teen content available yet. Check back soon!</p>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.container h2) {
    color: inherit !important;
  }
</style>
