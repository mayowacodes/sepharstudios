<script lang="ts">
  import MediaGrid from '$lib/components/MediaGrid.svelte';
  import type { MediaSection } from '$lib/types/media';

  const { data } = $props();
  
  // Group content into sections based on mediaType
  let sections: MediaSection[] = $derived.by(() => {
    const content = data.content || [];
    return [
      {
        title: 'Teen Movies',
        items: content.filter(item => item.mediaType === 'movie')
      },
      {
        title: 'Teen Shows',
        items: content.filter(item => item.mediaType === 'show')
      },
      {
        title: 'Teen Documentaries',
        items: content.filter(item => item.mediaType === 'documentary')
      }
    ].filter(section => section.items.length > 0);
  });
</script>

<div class="min-h-screen bg-linear-to-br from-indigo-50 to-blue-100 p-4">
  <div class="container mx-auto">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-indigo-700 mb-2">Sephar Teens</h1>
      <p class="text-lg text-indigo-600">Faith-based content tailored for the next generation.</p>
    </header>

    {#if sections.length > 0}
      <MediaGrid {sections} mediaItems={[]} title="Teens Content" />
    {:else}
      <div class="p-12 text-center bg-white/50 backdrop-blur rounded-2xl border-2 border-dashed border-indigo-200">
        <p class="text-indigo-600 font-medium">No teen content available yet. Check back soon!</p>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Override MediaGrid white text for this light theme if needed */
  :global(.container h2) {
    color: inherit !important;
  }
</style>
