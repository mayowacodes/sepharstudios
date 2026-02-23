<script lang="ts">
  import type { AudioTrack, Chapter } from '$lib/types';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";

  export let isPlaying: boolean;
  export let currentTime: number;
  export let duration: number;
  export let volume: number;
  export let isMuted: boolean;
  export let quality: string;
  export let qualities: string[] = [];
  export let audioTracks: AudioTrack[] = [];
  export let currentAudioTrack: AudioTrack | null;
  export let chapters: Chapter[] = [];
  export let playbackRate: number;
  export let isFullscreen: boolean;

  // Function Props (Replaces createEventDispatcher)
  export let onSeek: (time: number) => void;
  export let onTogglePlay: () => void;
  export let onVolumeChange: (volume: number) => void;
  export let onToggleMute: () => void;
  export let onQualityChange: (quality: string) => void;
  export let onSwitchAudio: (track: AudioTrack) => void;
  export let onPlaybackRateChange: (rate: number) => void;
  export let onToggleFullscreen: () => void;

  let showAudioTracks = false;
  let showQualityOptions = false;

  const playbackRates = [0.5, 1, 1.5, 2];

  function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function handleSeek(e: MouseEvent): void {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    onSeek(pos * duration);
  }

  function handleKeydownSeek(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const pos = (rect.width * 0.5) / rect.width;
      onSeek(pos * duration);
    }
  }

  function handleKeydownTogglePlay(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      onTogglePlay();
    }
  }

  function handleKeydownSeekBackward(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      onSeek(currentTime - 10);
    }
  }

  function handleKeydownSeekForward(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      onSeek(currentTime + 10);
    }
  }

  function handleKeydownMute(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggleMute();
    }
  }

  function handleKeydownQualityChange(e: KeyboardEvent, quality: string): void {
    if (e.key === 'Enter' || e.key === ' ') {
      onQualityChange(quality);
      showQualityOptions = false;
    }
  }

  function handleKeydownAudioChange(e: KeyboardEvent, track: AudioTrack): void {
    if (e.key === 'Enter' || e.key === ' ') {
      onSwitchAudio(track);
      showAudioTracks = false;
    }
  }

  function handleKeydownFullscreen(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggleFullscreen();
    }
  }
</script>

<div class="absolute bottom-0 left-0 right-0 p-4 space-y-3 transition-opacity duration-300">
  <!-- Progress Bar -->
  <div
    class="relative w-full h-1.5 bg-white/20 cursor-pointer group rounded-full"
    role="slider"
    tabindex="0"
    on:click={handleSeek}
    on:keydown={(e: KeyboardEvent) => handleKeydownSeek(e)}
    aria-valuenow={currentTime}
    aria-valuemin={0}
    aria-valuemax={duration}
  >
    <div
      class="absolute h-full bg-[#FF5E0E] rounded-full"
      style="width: {(currentTime / duration) * 100}%"
    ></div>
    <div
      class="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.35)]"
      style="left: calc({(currentTime / duration) * 100}% - 6px)"
    ></div>
    {#each chapters as chapter}
      <div
        class="absolute w-1 h-3 bg-white -top-1 rounded-full"
        style="left: {(chapter.time / duration) * 100}%"
        title={chapter.title}
      ></div>
    {/each}
  </div>

  <!-- Controls -->
  <div class="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md px-4 py-2">
    <button
      class="text-white hover:text-[var(--primary)]"
      on:click={onTogglePlay}
      on:keydown={(e: KeyboardEvent) => handleKeydownTogglePlay(e)}
    >
      {#if isPlaying}
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      {:else}
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      {/if}
    </button>

    <button
      class="text-white hover:text-[var(--primary)]"
      on:click={() => onSeek(currentTime - 10)}
      on:keydown={(e: KeyboardEvent) => handleKeydownSeekBackward(e)}
    >
      -10s
    </button>

    <button
      class="text-white hover:text-[var(--primary)]"
      on:click={() => onSeek(currentTime + 10)}
      on:keydown={(e: KeyboardEvent) => handleKeydownSeekForward(e)}
    >
      +10s
    </button>

    <div class="text-white/80 text-sm">
      {formatTime(currentTime)} / {formatTime(duration)}
    </div>

    <div class="ml-auto flex items-center gap-4">
      <!-- Audio Tracks -->
      {#if audioTracks.length > 0}
        <div class="relative">
          <button
            class="text-white hover:text-[var(--primary)]"
            on:click={() => showAudioTracks = !showAudioTracks}
            on:keydown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                showAudioTracks = !showAudioTracks;
              }
            }}
          >
            {currentAudioTrack?.label || 'Audio'}
          </button>
          {#if showAudioTracks}
            <div class="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[200px] border border-white/10">
              {#each audioTracks as track}
                <button
                  class="w-full px-3 py-2 text-left text-sm hover:bg-white/10 text-white"
                  class:bg-[var(--primary)]="{currentAudioTrack?.id === track.id}"
                  on:click={() => { onSwitchAudio(track); showAudioTracks = false; }}
                  on:keydown={(e: KeyboardEvent) => handleKeydownAudioChange(e, track)}
                >
                  {track.label}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Quality Selection -->
      <div class="relative">
        <button
          class="text-white hover:text-[var(--primary)]"
          on:click={() => showQualityOptions = !showQualityOptions}
          on:keydown={(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              showQualityOptions = !showQualityOptions;
            }
          }}
        >
          {quality}
        </button>
        {#if showQualityOptions}
          <div class="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[120px] border border-white/10">
            {#each qualities as q}
              <button
                class="w-full px-3 py-2 text-left text-sm hover:bg-white/10 text-white"
                class:bg-[var(--primary)]={quality === q}
                on:click={() => { onQualityChange(q); showQualityOptions = false; }}
                on:keydown={(e: KeyboardEvent) => handleKeydownQualityChange(e, q)}
              >
                {q}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Playback Rate Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" class="text-white hover:text-[var(--primary)]">{playbackRate}x</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="bg-black/90 text-white min-w-[120px] border border-white/10">
          {#each playbackRates as rate}
            <DropdownMenuItem
              onclick={() => onPlaybackRateChange(rate)}
              onkeydown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onPlaybackRateChange(rate);
                }
              }}
              class={playbackRate === rate ? 'bg-[var(--primary)]' : ''}
            >
              {rate}x
            </DropdownMenuItem>
          {/each}
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Volume -->
      <div class="flex items-center gap-2">
        <button
          class="text-white hover:text-[var(--primary)]"
          on:click={onToggleMute}
          on:keydown={(e: KeyboardEvent) => handleKeydownMute(e)}
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            {#if isMuted}
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            {:else}
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            {/if}
          </svg>
        </button>
        <input type="range" min="0" max="1" step="0.1" value={volume} on:input={(e) => onVolumeChange(parseFloat(e.currentTarget.value))} class="w-20 accent-[#FF5E0E]" />
      </div>

      <!-- Fullscreen -->
      <button
        class="text-white hover:text-[var(--primary)]"
        on:click={onToggleFullscreen}
        on:keydown={(e: KeyboardEvent) => handleKeydownFullscreen(e)}
      >
        {#if isFullscreen}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6h12v12H6z" /></svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3m-18 0v3a2 2 0 0 0 2 2h3"/></svg>
        {/if}
      </button>
    </div>
  </div>
</div>
