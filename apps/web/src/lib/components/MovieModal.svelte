<script lang="ts">
  import { onDestroy } from 'svelte';
  import { X, Play, Bookmark } from '@lucide/svelte';
  import { mediaModalStore } from '$lib/stores/mediaModalStore';
  import EnhancedVideoPlayer from '$lib/components/widgets/EnhancedVideoPlayer.svelte';
  import type { MediaItem } from '../types/media';

  let media: MediaItem | null = null;
  let isOpen = false;
  let isImageLoaded = false;

  const unsubscribe = mediaModalStore.subscribe((state) => {
    isOpen = state.isOpen;
    media = state.media;
    if (isOpen) isImageLoaded = false;
  });

  onDestroy(unsubscribe);

  const onImageLoad = () => { isImageLoaded = true; };
  const closeModal = () => { mediaModalStore.close(); };

</script>

{#if $mediaModalStore.isOpen && $mediaModalStore.media}
  <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="relative w-full max-w-5xl surface-glass rounded-2xl overflow-hidden border border-white/10">
      <img
        src={$mediaModalStore.media.backdrop_url}
        alt={$mediaModalStore.media.title}
        class="absolute inset-0 w-full h-full object-cover opacity-25"
        on:load={onImageLoad}
      />
      <div class="absolute inset-0 veil-strong"></div>

      {#if !isImageLoaded}
        <div class="absolute inset-0 flex items-center justify-center z-20">
          <div class="flex items-center gap-3 text-white/70">
            <span class="h-2 w-2 rounded-full bg-[#FF5E0E] animate-pulse"></span>
            <span class="text-sm tracking-widest uppercase">Loading</span>
          </div>
        </div>
      {/if}

      <button
        class="absolute top-4 right-4 z-20 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white"
        on:click={closeModal}
        aria-label="Close"
      >
        <X class="h-4 w-4" />
      </button>

      <div class="relative z-10 grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr]">
        <div class="space-y-4">
          <div class="aspect-video w-full rounded-xl overflow-hidden border border-white/10">
            <EnhancedVideoPlayer
              videoId={$mediaModalStore.media.id}
              videoUrl={$mediaModalStore.media.trailerUrl || $mediaModalStore.media.link}
              title={$mediaModalStore.media.title}
              thumbnailUrl={$mediaModalStore.media.backdrop_url}
            />
          </div>
          <div class="flex items-center gap-3">
            <button class="tap-target inline-flex items-center gap-2 rounded-full bg-[#FF5E0E] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition" aria-label="Play">
              <Play class="h-4 w-4" />
              Play
            </button>
            <button class="tap-target inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/60 px-4 py-2 text-sm font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition" aria-label="Add to My List">
              <Bookmark class="h-4 w-4" />
              My List
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h2 class="text-3xl font-bold text-white text-display">{$mediaModalStore.media.title}</h2>
            <div class="mt-2 text-sm text-white/60 flex flex-wrap gap-3">
              {#if $mediaModalStore.media.year}<span>{$mediaModalStore.media.year}</span>{/if}
              {#if $mediaModalStore.media.duration}<span>{$mediaModalStore.media.duration}</span>{/if}
              {#if $mediaModalStore.media.quality}<span>{$mediaModalStore.media.quality}</span>{/if}
              {#if $mediaModalStore.media.ageRating}<span>Rated {$mediaModalStore.media.ageRating}</span>{/if}
            </div>
          </div>
          <p class="text-white/70 leading-relaxed">{$mediaModalStore.media.description}</p>
        </div>
      </div>
    </div>
  </div>
{/if}
