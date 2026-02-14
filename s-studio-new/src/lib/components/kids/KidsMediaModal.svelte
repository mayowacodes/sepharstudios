<script lang="ts">
  import { mediaModalStore } from '$lib/stores/mediaModalStore';
  import { onDestroy } from 'svelte';
  import type { MediaItem } from '$lib/types/media';

  let media: MediaItem | null = null;

  const unsubscribe = mediaModalStore.subscribe((state) => {
    media = state.media;
  });

  function closeModal() {
    mediaModalStore.close();
  }

  onDestroy(() => {
    unsubscribe();
  });
</script>


{#if media}
  <div class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl p-4 relative">
      <button on:click={closeModal} class="absolute top-2 right-2 text-2xl">✖️</button>

      <h2 class="text-xl font-bold mb-2">{media.title}</h2>

      <video src={media.trailerUrl} autoplay controls class="w-full rounded">
        <track kind="captions" label="English captions" />
      </video>

      <p class="mt-4 text-gray-700">{media.description}</p>

      {#if media.genres?.length}
        <p class="text-sm text-gray-500 mt-2">Genres: {media.genres.join(', ')}</p>
      {/if}
    </div>
  </div>
{/if}
