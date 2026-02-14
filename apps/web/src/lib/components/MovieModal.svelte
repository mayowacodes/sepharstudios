<script lang="ts">
  import { onDestroy } from 'svelte';
  import { mediaModalStore } from '$lib/stores/mediaModalStore';
  import EnhancedVideoPlayer from '$lib/components/widgets/EnhancedVideoPlayer.svelte';
  import type { MediaItem } from '../types/media';

  let media: MediaItem | null = null;
  let isOpen = false;
  let isImageLoaded = false;
  let isVideoLoaded = false;

  let videoEl: HTMLVideoElement;

  const unsubscribe = mediaModalStore.subscribe((state) => {
    isOpen = state.isOpen;
    media = state.media;

    if (isOpen) {
      isImageLoaded = false;
      isVideoLoaded = false;
      
      // Fallback timeout - if video doesn't load within 3 seconds, show modal anyway
      setTimeout(() => {
        if (!isVideoLoaded) {
          isVideoLoaded = true;
        }
      }, 3000);
    }
  });

  onDestroy(unsubscribe);

  const onImageLoad = () => {
    isImageLoaded = true;
  };

  const onVideoCanPlay = () => {
    isVideoLoaded = true;
  };

  const onVideoError = () => {
    isVideoLoaded = true; // Still allow modal to show even if video fails
  };

  const closeModal = () => {
    mediaModalStore.close();
  };

  $: isModalReady = isImageLoaded && isVideoLoaded;
</script>
{#if $mediaModalStore.isOpen && $mediaModalStore.media}
<div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
  {#if !isModalReady}
    <!-- Skeleton Loader -->
    <div class="w-11/12 sm:w-3/4 lg:w-1/2 p-6 bg-zinc-800 rounded-lg animate-pulse text-white space-y-4">
      <div class="h-48 bg-zinc-700 rounded"></div>
      <div class="h-6 bg-zinc-600 rounded w-1/2"></div>
      <div class="h-4 bg-zinc-600 rounded w-full"></div>
      <div class="h-4 bg-zinc-600 rounded w-3/4"></div>
    </div>
  {:else}
    <!-- Actual Modal Content -->
    <div class="relative bg-zinc-900 rounded-lg overflow-hidden w-11/12 sm:w-3/4 lg:w-1/2">
      <img
        src={$mediaModalStore.media.backdrop_url}
        alt={$mediaModalStore.media.title}
        class="absolute inset-0 w-full h-full object-cover opacity-30"
        on:load={onImageLoad}
      />

      <div class="relative z-10 p-6 text-white">
        <button class="absolute top-4 right-4 bg-red-500 hover:bg-red-700 rounded-full p-2" on:click={closeModal}>
          ✕
        </button>

        <h2 class="text-2xl font-bold">{$mediaModalStore.media.title}</h2>
        <p class="mb-2">{$mediaModalStore.media.description}</p>

        <video
          bind:this={videoEl}
          src={$mediaModalStore.media.trailerUrl || $mediaModalStore.media.link}
          class="w-full rounded mt-4"
          autoplay
          muted
          loop
          playsinline
          on:canplaythrough={onVideoCanPlay}
          on:error={onVideoError}
        ></video>

        {#if $mediaModalStore.media.ageRating}
          <p class="mt-2 text-sm text-white/80">
            <strong>Age Rating:</strong> {$mediaModalStore.media.ageRating}
          </p>
        {/if}
      </div>
    </div>
  {/if}
</div>
{/if}