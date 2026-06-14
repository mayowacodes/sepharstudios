<!--
  MediaPreviewPlayer — the muted, time-clamped preview on detail pages.

  Behaviour:
    - Mounts a <video> attached to an HLS master playlist (.m3u8) via
      lazy-loaded hls.js. Direct MP4 URLs use the native <video src>.
    - Autoplays muted (browsers require muted for unattended autoplay).
    - Plays from `startAt` (default 0) and pauses at `startAt + maxDurationSec`.
    - After the clip ends, shows a small "Replay preview" button overlay.
    - Provides a small mute toggle so curious viewers can hear the clip.

  This is intentionally simpler than VideoPlayer.svelte:
    - No chapters, no end-screen, no subtitles, no analytics, no ad break.
    - No keyboard shortcuts (spacebar etc.) — the detail-page CTA is the
      "real" Watch action, this is just a vibe preview.

  Keep it minimal — the watch page is the place for fully-featured playback.
-->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type HlsType from 'hls.js';
  import { Volume2, VolumeX, Repeat } from '@lucide/svelte';

  interface Props {
    src: string;
    poster?: string;
    /** Start playback at this many seconds into the source. */
    startAt?: number;
    /** Stop playback after this many seconds elapsed since `startAt`. */
    maxDurationSec?: number;
  }

  let { src, poster, startAt = 0, maxDurationSec = 60 }: Props = $props();

  let videoEl: HTMLVideoElement | null = $state(null);
  let hlsInstance: HlsType | null = null;
  let HlsCtor: typeof HlsType | null = null;
  let ended = $state(false);
  let userUnmuted = $state(false);

  // Compute the effective stop time once — handles startAt=0 too.
  const stopAt = $derived(startAt + maxDurationSec);

  async function attach(): Promise<void> {
    if (!videoEl || !src) return;
    if (src.endsWith('.m3u8')) {
      // Native HLS in Safari + iOS WebKit; everyone else gets hls.js.
      if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = src;
      } else {
        HlsCtor ??= (await import('hls.js')).default;
        if (HlsCtor && HlsCtor.isSupported()) {
          hlsInstance = new HlsCtor();
          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(videoEl);
        } else {
          videoEl.src = src;
        }
      }
    } else {
      videoEl.src = src;
    }
    videoEl.muted = true;
    videoEl.currentTime = startAt;
    // .play() returns a promise; if browser blocks autoplay we just sit
    // on the poster, the user can click anywhere to start it.
    try {
      await videoEl.play();
    } catch {
      /* autoplay blocked — silent fallback */
    }
  }

  function onTimeUpdate(): void {
    if (!videoEl) return;
    if (videoEl.currentTime >= stopAt) {
      videoEl.pause();
      ended = true;
    }
  }

  async function replay(): Promise<void> {
    if (!videoEl) return;
    videoEl.currentTime = startAt;
    ended = false;
    try {
      await videoEl.play();
    } catch {
      /* ignore */
    }
  }

  function toggleMute(): void {
    if (!videoEl) return;
    videoEl.muted = !videoEl.muted;
    userUnmuted = !videoEl.muted;
  }

  onMount(() => {
    void attach();
  });

  onDestroy(() => {
    if (hlsInstance) {
      try { hlsInstance.destroy(); } catch { /* ignore */ }
      hlsInstance = null;
    }
  });
</script>

<div class="relative w-full h-full bg-black rounded-xl overflow-hidden group">
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={videoEl}
    poster={poster}
    class="w-full h-full object-cover"
    playsinline
    preload="metadata"
    ontimeupdate={onTimeUpdate}
  ></video>

  <!-- Mute toggle, top-right. Subtle until hover. -->
  <button
    type="button"
    onclick={toggleMute}
    aria-label={userUnmuted ? 'Mute preview' : 'Unmute preview'}
    class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-60 group-hover:opacity-100 transition-opacity"
  >
    {#if userUnmuted}
      <Volume2 class="w-4 h-4" />
    {:else}
      <VolumeX class="w-4 h-4" />
    {/if}
  </button>

  <!-- Replay overlay — appears when the preview clamp fires. -->
  {#if ended}
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
      <button
        type="button"
        onclick={replay}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white text-sm font-medium shadow-lg transition-colors"
      >
        <Repeat class="w-4 h-4" />
        Replay preview
      </button>
      <div class="mt-2 text-[10px] uppercase tracking-wider text-white/70">
        {maxDurationSec}-second preview · Press Watch for the full title
      </div>
    </div>
  {/if}
</div>
