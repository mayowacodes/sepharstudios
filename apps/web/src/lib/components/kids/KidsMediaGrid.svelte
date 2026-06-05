<!-- src/lib/components/kids/KidsMediaGrid.svelte -->
<script lang="ts">
  import KidsMovieCard from './KidsMovieCard.svelte';
  let { mediaData }: { mediaData: any[] } = $props();
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
  {#each mediaData as movie (movie.title)}
    <KidsMovieCard movie={movie} />
  {/each}
</div>