<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  
  export let recommendations = [
    {
      id: '1',
      title: 'The Passion of the Christ',
      thumbnailUrl: '/thumbnails/the-passion-of-the-christ.jpg',
      genre: 'Drama',
    },
    {
      id: '2',
      title: 'The Ten Commandments',
      thumbnailUrl: '/thumbnails/the-ten-commandments.jpg',
      genre: 'Historical',
    },
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Recommended for You</h2>

  {#if recommendations.length === 0}
    <p class="text-muted-foreground">We couldn't find any recommendations for you right now.</p>
  {:else}
    <div class="space-y-4">
      {#each recommendations as recommendation}
        <div class="flex items-center space-x-4 bg-muted-foreground/10 p-4 rounded shadow-md">
          <img src={recommendation.thumbnailUrl} alt={recommendation.title} class="w-16 h-16 object-cover rounded" />
          <div class="flex-1">
            <strong>{recommendation.title}</strong>
            <p class="text-sm text-muted">{recommendation.genre}</p>
          </div>
          <Button variant="ghost" class="text-sm">Watch Now</Button>
        </div>
      {/each}
    </div>
  {/if}
</section>
