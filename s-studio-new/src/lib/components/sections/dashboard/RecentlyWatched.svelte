<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  
  export let recentlyWatched = [
    {
      id: '1',
      title: 'The Chosen',
      thumbnailUrl: '/thumbnails/the-chosen.jpg',
      lastWatched: '2025-04-08',
    },
    {
      id: '2',
      title: 'Pilgrim’s Progress',
      thumbnailUrl: '/thumbnails/pilgrims-progress.jpg',
      lastWatched: '2025-04-06',
    },
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Recently Watched</h2>

  {#if recentlyWatched.length === 0}
    <p class="text-muted-foreground">You haven't watched anything recently.</p>
  {:else}
    <div class="space-y-4">
      {#each recentlyWatched as item}
        <div class="flex items-center space-x-4 bg-muted-foreground/10 p-4 rounded shadow-md">
          <img src={item.thumbnailUrl} alt={item.title} class="w-16 h-16 object-cover rounded" />
          <div class="flex-1">
            <strong>{item.title}</strong>
            <p class="text-sm text-muted">Last watched on {item.lastWatched}</p>
          </div>
          <Button variant="ghost" class="text-sm">Resume</Button>
        </div>
      {/each}
    </div>
  {/if}
</section>
