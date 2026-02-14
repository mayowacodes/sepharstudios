<script lang="ts">
  // Replace with real API call or store
  let myList = [
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
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">My List</h2>

  {#if myList.length === 0}
    <p class="text-muted-foreground">You haven't added anything to your list yet.</p>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {#each myList as item}
        <a href={`/media/${item.id}`} class="group relative rounded overflow-hidden shadow hover:scale-105 transition">
          <img src={item.thumbnailUrl} alt={item.title} class="w-full h-48 object-cover rounded" />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-sm">
            <strong>{item.title}</strong>
            <span class="block text-xs text-muted">{item.type}</span>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</section>
