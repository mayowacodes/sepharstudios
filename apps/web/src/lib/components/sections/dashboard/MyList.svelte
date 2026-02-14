<script lang="ts">
  let { myList = [
    {
      id: '1',
      title: 'The Chosen',
      thumbnailUrl: '/thumbnails/the-chosen.jpg',
      type: 'TV Show',
    },
    {
      id: '2',
      title: 'Pilgrim’s Progress',
      thumbnailUrl: '/thumbnails/pilgrims-progress.jpg',
      type: 'Movie',
    }
  ] } = $props<{
    myList?: Array<{
      id: string;
      title: string;
      thumbnailUrl: string;
      type: string;
    }>
  }>();
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">My List</h2>

  {#if myList.length === 0}
    <p class="text-muted-foreground">You haven't added anything to your list yet.</p>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {#each myList as item}
        <a href={`/media/${item.id}`} class="group relative rounded overflow-hidden shadow-sm hover:scale-105 transition border border-primary/10">
          <img src={item.thumbnailUrl} alt={item.title} class="w-full h-40 object-cover rounded" />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
            <strong class="text-xs line-clamp-1">{item.title}</strong>
            <span class="block text-[10px] text-white/70">{item.type}</span>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</section>
