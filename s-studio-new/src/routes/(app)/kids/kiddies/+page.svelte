<script lang="ts">
  import MediaGrid from '$lib/components/MediaGrid.svelte';
  import { kidsMovies } from '$lib/data/kidsmovies';
  import { kidsShows } from '$lib/data/kidsshows';
  import { kidsDocumentaries } from '$lib/data/kidsdocumentaries';
  import type { MediaSection } from '$lib/types/media';

  // Create sections for the MediaGrid component
  const sections: MediaSection[] = [
    {
      title: 'Kids Movies',
      items: kidsMovies
    },
    {
      title: 'Kids Shows',
      items: kidsShows
    },
    {
      title: 'Kids Documentaries',
      items: kidsDocumentaries
    }
  ];
</script>

<div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 p-4">
  <div class="container mx-auto">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-pink-700 mb-2">Faith Kids - Kiddies</h1>
      <p class="text-lg text-pink-600">Safe, fun, and faith-filled content for little ones!</p>
    </header>

    <MediaGrid {sections} mediaItems={[]} title="Kiddies Content" />
  </div>
</div>