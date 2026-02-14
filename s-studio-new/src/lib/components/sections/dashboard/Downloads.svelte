<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  
  export let downloads = [
    {
      id: '1',
      title: 'The Chosen',
      thumbnailUrl: '/thumbnails/the-chosen.jpg',
      downloadDate: '2025-04-08',
    },
    {
      id: '2',
      title: 'Pilgrim’s Progress',
      thumbnailUrl: '/thumbnails/pilgrims-progress.jpg',
      downloadDate: '2025-04-06',
    },
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Downloads</h2>

  {#if downloads.length === 0}
    <p class="text-muted-foreground">No downloads available.</p>
  {:else}
    <div class="space-y-4">
      {#each downloads as download}
        <div class="flex items-center space-x-4 bg-muted-foreground/10 p-4 rounded shadow-md">
          <img src={download.thumbnailUrl} alt={download.title} class="w-16 h-16 object-cover rounded" />
          <div class="flex-1">
            <strong>{download.title}</strong>
            <p class="text-sm text-muted">Downloaded on {download.downloadDate}</p>
          </div>
          <Button variant="ghost" class="text-sm">Delete</Button>
        </div>
      {/each}
    </div>
  {/if}
</section>
