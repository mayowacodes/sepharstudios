<script lang="ts">
  import MediaGrid from '$lib/components/MediaGrid.svelte';
  import { teenagersMovies } from '$lib/data/teenMovies';
  import { teenagersShows } from '$lib/data/teenagersShows';
  import { teenagersDocumentaries } from '$lib/data/teenagersDocumentaries';
  import type { MediaSection } from '$lib/types/media';

  // Create sections for the MediaGrid component
  const sections: MediaSection[] = [
    {
      title: 'Teen Movies',
      items: teenagersMovies
    },
    {
      title: 'Teen Shows',
      items: teenagersShows
    },
    {
      title: 'Teen Documentaries',
      items: teenagersDocumentaries
    }
  ];
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 p-4">
  <div class="container mx-auto">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-purple-700 mb-2">Faith Kids - Teens</h1>
      <p class="text-lg text-purple-600">Inspiring and faith-filled content for teenagers!</p>
    </header>

    <MediaGrid {sections} mediaItems={[]} title="Teen Content" />
  </div>
</div>