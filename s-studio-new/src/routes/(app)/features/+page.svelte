<script lang="ts">
    import HeroCarousel from '$lib/components/HeroCarousel.svelte';
    import MediaGrid from '$lib/components/MediaGrid.svelte';
    import MediaModal from '$lib/components/MovieModal.svelte';
    import type { MediaItem } from '$lib/types/media';
    
    import { faithMovies } from '$lib/data/movies';
    import { faithTVShows } from '$lib/data/shows';
    import { faithDocumentaries } from '$lib/data/documentaries';
    
    // Select featured content (could also be a separate featured.ts file)
    const featuredContent = [
      ...faithMovies.filter(m => m.featured),
      ...faithTVShows.filter(s => s.featured),
      ...faithDocumentaries.filter(d => d.featured)
    ];
    
    let activeModal: MediaItem | null = null;
    let activeScripture: string | null = null;
  </script>
  
  <main class="space-y-12 pb-12">
    <!-- Hero Carousel Section -->
    <section class="relative">
      <HeroCarousel 
      mediaItems={featuredContent} 
        on:play={e => { /* handle play action */ }}
        on:moreInfo={e => activeModal = e.detail}
        on:showScripture={e => activeScripture = e.detail}
      />
    </section>
    
    <!-- Movies Section -->
    <section class="container mx-auto px-4">
      <MediaGrid mediaItems={faithMovies} title="Faith-Based Movies" />
    </section>
    
    <!-- TV Shows Section -->
    <section class="container mx-auto px-4">
      <MediaGrid mediaItems={faithTVShows} title="Christian TV Shows" />
    </section>
    
    <!-- Documentaries Section -->
    <section class="container mx-auto px-4">
      <MediaGrid mediaItems={faithDocumentaries} title="Christian Documentaries" />
    </section>
    
    <!-- Modal for detailed view -->
    {#if activeModal}
      <MediaModal  />
    {/if}
    
    <!-- Scripture Modal -->
    {#if activeScripture}
      <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div class="bg-[#1A1A1A] rounded-lg max-w-md w-full p-6">
          <h3 class="text-xl font-bold text-[#FF5E0E] mb-4">Scripture Reference</h3>
          <p class="text-white mb-6">{activeScripture}</p>
          <button 
            on:click={() => activeScripture = null}
            class="w-full py-2 bg-[#FF5E0E] text-white rounded hover:bg-[#FFBF00] transition"
          >
            Close
          </button>
        </div>
      </div>
    {/if}
  </main>