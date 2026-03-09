<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Hls from 'hls.js';

  interface Props {
    src: string;           // HLS manifest URL (.m3u8) or direct video URL
    poster?: string;
    contentId?: string;    // for progress reporting
    startAt?: number;      // seconds to resume from
    title?: string;
    subtitles?: Array<{ label: string; src: string; srclang: string }>;
    onEnded?: () => void;
  }

  let { src, poster, contentId, startAt = 0, title, subtitles = [], onEnded }: Props = $props();

  let videoEl = $state<HTMLVideoElement | undefined>();
  let containerEl = $state<HTMLDivElement | undefined>();
  let hls: Hls | null = null;

  // Playback state
  let playing = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let buffered = $state(0);
  let volume = $state(1);
  let muted = $state(false);
  let fullscreen = $state(false);
  let controlsVisible = $state(true);
  let controlsTimer: ReturnType<typeof setTimeout>;

  // Quality levels
  let levels = $state<Array<{ height: number; bitrate: number; index: number }>>([]);
  let currentLevel = $state(-1); // -1 = auto
  let showQualityMenu = $state(false);

  // Speed
  let speed = $state(1);
  let showSpeedMenu = $state(false);
  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Progress reporting
  let progressInterval: ReturnType<typeof setInterval>;
  let lastReportedTime = 0;

  async function reportProgress() {
    if (!contentId || !videoEl || duration === 0) return;
    const pos = Math.floor(videoEl.currentTime);
    if (Math.abs(pos - lastReportedTime) < 5) return; // only if moved 5+ seconds
    lastReportedTime = pos;
    try {
      await fetch('/api/watch/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          positionSeconds: pos,
          durationSeconds: Math.floor(duration)
        })
      });
    } catch { /* non-critical */ }
  }

  function initHls(video: HTMLVideoElement, url: string) {
    if (hls) { hls.destroy(); hls = null; }

    if (Hls.isSupported() && url.includes('.m3u8')) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        startLevel: -1 // auto
      });
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        levels = data.levels.map((l, i) => ({ height: l.height, bitrate: l.bitrate, index: i }));
        if (startAt > 0) video.currentTime = startAt;
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        currentLevel = data.level;
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari)
      video.src = url;
      if (startAt > 0) {
        video.addEventListener('loadedmetadata', () => { video.currentTime = startAt; }, { once: true });
      }
      video.play().catch(() => {});
    } else {
      // Fallback: direct src
      video.src = url;
      if (startAt > 0) video.currentTime = startAt;
    }
  }

  function setQuality(index: number) {
    if (hls) {
      hls.currentLevel = index;
      currentLevel = index;
    }
    showQualityMenu = false;
  }

  function setSpeed(s: number) {
    speed = s;
    if (videoEl) videoEl.playbackRate = s;
    showSpeedMenu = false;
  }

  function togglePlay() {
    if (!videoEl) return;
    if (videoEl.paused) videoEl.play();
    else videoEl.pause();
  }

  function seek(e: MouseEvent) {
    if (!videoEl || !duration) return;
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    videoEl.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }

  function toggleMute() {
    if (!videoEl) return;
    muted = !muted;
    videoEl.muted = muted;
  }

  function changeVolume(e: Event) {
    volume = parseFloat((e.target as HTMLInputElement).value);
    if (videoEl) { videoEl.volume = volume; videoEl.muted = volume === 0; }
  }

  async function toggleFullscreen() {
    if (!containerEl) return;
    if (!document.fullscreenElement) {
      await containerEl.requestFullscreen();
      fullscreen = true;
    } else {
      await document.exitFullscreen();
      fullscreen = false;
    }
  }

  function showControls() {
    controlsVisible = true;
    clearTimeout(controlsTimer);
    if (playing) {
      controlsTimer = setTimeout(() => { controlsVisible = false; }, 3000);
    }
  }

  function formatTime(s: number) {
    if (!s || isNaN(s)) return '0:00';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
      : `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!videoEl) return;
    switch (e.key) {
      case ' ': case 'k': e.preventDefault(); togglePlay(); break;
      case 'ArrowRight': videoEl.currentTime = Math.min(videoEl.currentTime + 10, duration); break;
      case 'ArrowLeft': videoEl.currentTime = Math.max(videoEl.currentTime - 10, 0); break;
      case 'ArrowUp': volume = Math.min(1, volume + 0.1); if (videoEl) videoEl.volume = volume; break;
      case 'ArrowDown': volume = Math.max(0, volume - 0.1); if (videoEl) videoEl.volume = volume; break;
      case 'f': toggleFullscreen(); break;
      case 'm': toggleMute(); break;
    }
  }

  const progressPct = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
  const bufferedPct = $derived(duration > 0 ? (buffered / duration) * 100 : 0);
  const qualityLabel = $derived(
    currentLevel === -1 ? 'Auto' : levels[currentLevel] ? `${levels[currentLevel].height}p` : 'Auto'
  );

  onMount(() => {
    if (!videoEl) return;

    const v = videoEl;
    v.volume = volume;

    initHls(v, src);

    v.addEventListener('play', () => { playing = true; showControls(); });
    v.addEventListener('pause', () => { playing = false; controlsVisible = true; clearTimeout(controlsTimer); });
    v.addEventListener('timeupdate', () => { currentTime = v.currentTime; });
    v.addEventListener('durationchange', () => { duration = v.duration; });
    v.addEventListener('progress', () => {
      if (v.buffered.length > 0) buffered = v.buffered.end(v.buffered.length - 1);
    });
    v.addEventListener('ended', () => { onEnded?.(); reportProgress(); });
    v.addEventListener('volumechange', () => { volume = v.volume; muted = v.muted; });

    document.addEventListener('fullscreenchange', () => { fullscreen = !!document.fullscreenElement; });

    // Report progress every 30 seconds
    progressInterval = setInterval(reportProgress, 30_000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(controlsTimer);
    };
  });

  onDestroy(() => {
    reportProgress();
    hls?.destroy();
    clearInterval(progressInterval);
    clearTimeout(controlsTimer);
  });

  // Re-init when src changes
  $effect(() => {
    if (videoEl && src) initHls(videoEl, src);
  });
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={containerEl}
  class="relative bg-black w-full aspect-video select-none group"
  onmousemove={showControls}
  onclick={() => { togglePlay(); showControls(); }}
>
  <!-- Video element -->
  <video
    bind:this={videoEl}
    {poster}
    class="w-full h-full"
    playsinline
  >
    {#each subtitles as sub}
      <track kind="subtitles" label={sub.label} src={sub.src} srclang={sub.srclang} />
    {/each}
  </video>

  <!-- Controls overlay -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 {controlsVisible ? 'opacity-100' : 'opacity-0'}"
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Title -->
    {#if title}
      <div class="absolute top-4 left-4 text-white text-sm font-medium drop-shadow">{title}</div>
    {/if}

    <!-- Progress bar -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="mx-4 mb-2 h-1.5 bg-white/20 rounded-full cursor-pointer group/bar hover:h-3 transition-all relative"
      onclick={seek}
    >
      <!-- Buffered -->
      <div class="absolute inset-y-0 left-0 bg-white/30 rounded-full" style="width: {bufferedPct}%"></div>
      <!-- Played -->
      <div class="absolute inset-y-0 left-0 bg-[#FF5E0E] rounded-full" style="width: {progressPct}%">
        <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow"></div>
      </div>
    </div>

    <!-- Controls row -->
    <div class="flex items-center gap-3 px-4 pb-4">
      <!-- Play/Pause -->
      <button onclick={togglePlay} class="text-white hover:text-[#FF5E0E] transition-colors">
        {#if playing}
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        {:else}
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
        {/if}
      </button>

      <!-- Skip back/forward -->
      <button onclick={() => { if (videoEl) videoEl.currentTime -= 10; }} class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">
        ↺10
      </button>
      <button onclick={() => { if (videoEl) videoEl.currentTime += 10; }} class="text-white hover:text-[#FF5E0E] transition-colors text-xs font-bold">
        10↻
      </button>

      <!-- Time -->
      <span class="text-white text-xs tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Volume -->
      <div class="flex items-center gap-2">
        <button onclick={toggleMute} class="text-white hover:text-[#FF5E0E] transition-colors">
          {#if muted || volume === 0}
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
          {:else if volume < 0.5}
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
          {:else}
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          {/if}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          oninput={changeVolume}
          class="w-20 h-1 accent-[#FF5E0E] cursor-pointer"
        />
      </div>

      <!-- Playback speed -->
      <div class="relative">
        <button
          onclick={(e) => { e.stopPropagation(); showSpeedMenu = !showSpeedMenu; showQualityMenu = false; }}
          class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors px-1"
        >
          {speed}x
        </button>
        {#if showSpeedMenu}
          <div class="absolute bottom-8 right-0 bg-black/90 border border-white/10 rounded-lg overflow-hidden w-20 z-50">
            {#each SPEEDS as s}
              <button
                onclick={(e) => { e.stopPropagation(); setSpeed(s); }}
                class="block w-full px-3 py-1.5 text-xs text-left hover:bg-white/10 transition-colors {speed === s ? 'text-[#FF5E0E]' : 'text-white'}"
              >{s}x</button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Quality -->
      {#if levels.length > 0}
        <div class="relative">
          <button
            onclick={(e) => { e.stopPropagation(); showQualityMenu = !showQualityMenu; showSpeedMenu = false; }}
            class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors px-1"
          >
            {qualityLabel}
          </button>
          {#if showQualityMenu}
            <div class="absolute bottom-8 right-0 bg-black/90 border border-white/10 rounded-lg overflow-hidden w-24 z-50">
              <button
                onclick={(e) => { e.stopPropagation(); setQuality(-1); }}
                class="block w-full px-3 py-1.5 text-xs text-left hover:bg-white/10 transition-colors {currentLevel === -1 ? 'text-[#FF5E0E]' : 'text-white'}"
              >Auto</button>
              {#each levels as level}
                <button
                  onclick={(e) => { e.stopPropagation(); setQuality(level.index); }}
                  class="block w-full px-3 py-1.5 text-xs text-left hover:bg-white/10 transition-colors {currentLevel === level.index ? 'text-[#FF5E0E]' : 'text-white'}"
                >{level.height}p</button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Subtitles toggle (if available) -->
      {#if subtitles.length > 0}
        <button
          onclick={(e) => { e.stopPropagation(); if (videoEl) { const t = videoEl.textTracks[0]; if (t) t.mode = t.mode === 'showing' ? 'hidden' : 'showing'; } }}
          class="text-white text-xs font-bold hover:text-[#FF5E0E] transition-colors"
          title="Toggle subtitles"
        >CC</button>
      {/if}

      <!-- Fullscreen -->
      <button onclick={toggleFullscreen} class="text-white hover:text-[#FF5E0E] transition-colors">
        {#if fullscreen}
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
        {:else}
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Center play button (shown when paused) -->
  {#if !playing && controlsVisible}
    <button
      type="button"
      aria-label="Play video"
      onclick={togglePlay}
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div class="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white">
        <svg class="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
      </div>
    </button>
  {/if}
</div>
