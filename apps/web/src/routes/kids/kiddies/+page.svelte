<script lang="ts">
  import MediaGrid from '$lib/components/MediaGrid.svelte';
  import type { MediaSection } from '$lib/types/media';

  const { data } = $props();
  
  // Group content into sections based on mediaType
  let sections: MediaSection[] = $derived.by(() => {
    const content = data.content || [];
    return [
      {
        title: 'Kiddies Movies',
        items: content.filter(item => item.mediaType === 'movie')
      },
      {
        title: 'Kiddies Shows',
        items: content.filter(item => item.mediaType === 'show')
      },
      {
        title: 'Kiddies Documentaries',
        items: content.filter(item => item.mediaType === 'documentary')
      }
    ].filter(section => section.items.length > 0);
  });
</script>

<div class="min-h-screen bg-linear-to-br from-yellow-50 to-pink-100 p-4">
  <div class="container mx-auto">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-pink-700 mb-2">Faith Kids - Kiddies</h1>
      <p class="text-lg text-pink-600">Safe, fun, and faith-filled content for little ones!</p>
    </header>

    {#if sections.length > 0}
      <MediaGrid {sections} mediaItems={[]} title="Kiddies Content" />
    {:else}
      <div class="p-12 text-center bg-white/50 backdrop-blur rounded-2xl border-2 border-dashed border-pink-200">
        <p class="text-pink-600 font-medium">No kiddies content available yet. Check back soon!</p>
      </div>
    {/if}
  </div>
</div>