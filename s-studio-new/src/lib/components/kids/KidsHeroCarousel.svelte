<!-- src/lib/components/kids/KidsHeroCarousel.svelte -->
<script lang="ts">
  export let mediaData: any[];
</script>

<div class="w-full overflow-x-auto whitespace-nowrap p-4 space-x-4">
  {#each mediaData.slice(0, 6) as movie (movie.title)}
    <div class="inline-block w-60 h-36 relative rounded-xl overflow-hidden border-2 border-pink-300 shadow-md">
      <img src={movie.thumbnailUrl} alt={movie.title} class="object-cover w-full h-full" />
      <div class="absolute bottom-0 left-0 right-0 bg-pink-200 text-pink-800 text-sm font-bold p-1 text-center">
        {movie.title}
      </div>
    </div>
  {/each}
</div>