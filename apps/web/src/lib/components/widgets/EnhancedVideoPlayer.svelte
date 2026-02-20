<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Hls from 'hls.js';
  import type { AudioTrack, Chapter, Subtitle, PlayerSettings } from '$lib/types';
  import VideoControls from './VideoControls.svelte';

 
  const defaultSettings: PlayerSettings = {
    autoplay: false,
    muted: false,
    loop: false,
    controls: true,
    showControls: true,
    enableDownload: false,
    enableThumbnailPreview: false,
    enableSpeedControls: true,
    enableSeekButtons: true,
    enablePictureInPicture: false,
    enableCasting: false,
    skin: {
      color: '#ffcc00',
      theme: 'dark'
    },
    size: 'responsive',
  };


  export let videoId: string = ''; 
  export let videoUrl: string = '';
  export let title: string;
  export let thumbnailUrl = '';
  export let chapters: Chapter[] = [];
  export let subtitles: Subtitle[] = [];
  export let audioTracks: AudioTrack[] = [];
  export let settings: PlayerSettings = defaultSettings;

  let videoElement: HTMLVideoElement;
  let containerElement: HTMLDivElement;
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;
  let volume = 1;
  let isFullscreen = false;
  let showControls = true;
  let playbackRate = 1;

  let hls: Hls | null = null;
  let quality = '1080p';
  let qualities: string[] = ['4K', '1080p', '720p', '480p'];
  let currentAudioTrack: AudioTrack | null = null;
  let audioElement: HTMLAudioElement | null = null;

  const STORAGE_KEY = `video-progress-${videoId || videoUrl}`;
  let isLoaded = false;
  let loadError = '';

  // Analytics Metrics
  let startTime = 0;
  let startupTimeMs: number | null = null;

  async function fetchSignedUrl(id: string) {
    try {
      const response = await fetch(`/api/watch/${id}`);
      if (!response.ok) throw new Error('Failed to fetch playback URL');
      const data = await response.json();
      return data.playbackUrl;
    } catch (err) {
      console.error('Playback API error:', err);
      loadError = 'Failed to load secure stream.';
      return null;
    }
  }

  async function initializePlayer() {
    let finalUrl = videoUrl;

    if (videoId) {
      const signedUrl = await fetchSignedUrl(videoId);
      if (!signedUrl) return;
      finalUrl = signedUrl;
    }

    if (Hls.isSupported() && finalUrl.includes('.m3u8')) {
      hls = new Hls({ 
        maxLoadingDelay: 4, 
        maxBufferLength: 30, 
        enableWorker: true,
        // Optional: retry logic for segments
        fragLoadingMaxRetry: 3,
        levelLoadingMaxRetry: 3
      });

      // --- Analytics Hooks ---
      startTime = performance.now();

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        qualities = data.levels.map(level => `${level.height}p`);
        if (subtitles && subtitles.length > 0) {
          subtitles.forEach((subtitle: any) => {
            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.label = subtitle.language;
            track.srclang = subtitle.language;
            track.src = subtitle.url;
            videoElement.appendChild(track);
          });
        }
      });

      hls.on(Hls.Events.FRAG_CHANGED, () => {
        if (startupTimeMs === null) {
          startupTimeMs = performance.now() - startTime;
          console.log(`[VideoPlayer] Startup Time: ${startupTimeMs.toFixed(2)}ms`);
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error(`[VideoPlayer] Fatal Error: ${data.type} - ${data.details}`);
          loadError = `Playback Error: ${data.details}`;
          hls?.destroy();
        } else {
          console.warn(`[VideoPlayer] Non-fatal Error: ${data.details}`);
          // Segment error tracking
          if (data.details === Hls.ErrorDetails.FRAG_LOAD_ERROR || data.details === Hls.ErrorDetails.FRAG_LOAD_TIMEOUT) {
            console.error(`[VideoPlayer] Segment Failure: ${data.frag?.url}`);
          }
        }
      });

      hls.loadSource(finalUrl);
      hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari/iOS)
      videoElement.src = finalUrl;
    } else if (finalUrl) {
      // Fallback for direct MP4 or other types
      videoElement.src = finalUrl;
    }
  }

  onMount(() => {
    initializePlayer();

    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) videoElement.currentTime = parseFloat(savedProgress);

    if (audioTracks.length > 0) {
      currentAudioTrack = audioTracks[0];
      initializeAudioTrack();
    }

    document.addEventListener('keydown', handleKeyboardControls);
  });

  onDestroy(() => {
    hls?.destroy();
    localStorage.setItem(STORAGE_KEY, currentTime.toString());
    document.removeEventListener('keydown', handleKeyboardControls);
    audioElement?.remove();
  });

  function initializeAudioTrack() {
    if (!currentAudioTrack) return;
    audioElement?.remove();
    audioElement = new Audio(currentAudioTrack.src);
    audioElement.preload = 'auto';

    audioElement.addEventListener('loadedmetadata', () => {
      if (videoElement && audioElement) {
        audioElement.currentTime = videoElement.currentTime;
      }
    });

    videoElement.addEventListener('timeupdate', () => {
      if (audioElement && Math.abs(audioElement.currentTime - videoElement.currentTime) > 0.1) {
        audioElement.currentTime = videoElement.currentTime;
      }
    });
  }

  function switchAudioTrack(track: AudioTrack) {
    currentAudioTrack = track;
    audioElement?.pause();
    initializeAudioTrack();
    audioElement?.play();
  }

  function togglePlay() {
    if (videoElement.paused) {
      videoElement.play();
      audioElement?.play();
    } else {
      videoElement.pause();
      audioElement?.pause();
    }
    isPlaying = !videoElement.paused;
  }

  function handleTimeUpdate() {
    currentTime = videoElement.currentTime;
    if (Math.floor(currentTime) % 5 === 0) {
      localStorage.setItem(STORAGE_KEY, currentTime.toString());
    }
  }

  function seek(time: number) {
    videoElement.currentTime = Math.max(0, Math.min(time, duration));
  }

  function handleKeyboardControls(e: KeyboardEvent) {
    if (document.activeElement?.tagName === 'INPUT') return;

    switch (e.key.toLowerCase()) {
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
      case 'arrowleft':
        seek(currentTime - 10);
        break;
      case 'arrowright':
        seek(currentTime + 10);
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'm':
        settings.muted = !settings.muted;
        break;
    }
  }

  function setQuality(height: string) {
    if (!hls) return;
    const levelIndex = hls.levels.findIndex(level => `${level.height}p` === height);
    if (levelIndex > -1) {
      hls.currentLevel = levelIndex;
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      isFullscreen = false;
    } else {
      containerElement.requestFullscreen();
      isFullscreen = true;
    }
  }

  function handleVolumeChange(value: number) {
    volume = value;
    videoElement.volume = volume;
    if (audioElement) {
      audioElement.volume = volume;
    }
  }
</script>

<div
  bind:this={containerElement}
  class="relative group w-full h-full"
  role="region"
  aria-label="Video Player Controls"
  on:mousemove={() => showControls = true}
  on:mouseleave={() => showControls = false}
>
  {#if !isLoaded}
    <div class="absolute inset-0 flex items-center justify-center bg-black">
      <span class="text-white animate-pulse">Loading video...</span>
    </div>
  {/if}

  {#if loadError}
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-6 text-center">
      <span class="text-red-500 text-4xl mb-4">⚠️</span>
      <h3 class="text-white text-xl font-bold mb-2">Playback Error</h3>
      <p class="text-zinc-400 mb-6">{loadError}</p>
      <button 
        on:click={() => window.location.reload()}
        class="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition"
      >
        Retry
      </button>
    </div>
  {/if}

  {#if title}
   <h2 class="text-2xl font-bold text-white mb-4 px-4 pt-4">{title}</h2>
  {/if}


  <video
    bind:this={videoElement}
    class="w-full h-full bg-black"
    poster={thumbnailUrl}
    muted={settings.muted}
    loop={settings.loop}
    on:timeupdate={handleTimeUpdate}
    on:loadedmetadata={() => {
      duration = videoElement.duration;
      isLoaded = true;
    }}
  >
    <source src={videoUrl} type="video/mp4" />
  </video>

  {#if settings.showControls && showControls && isLoaded}
    <VideoControls
      {isPlaying}
      {currentTime}
      {duration}
      {volume}
      {quality}
      {qualities}
      {audioTracks}
      {currentAudioTrack}
      {chapters}
      isMuted={settings.muted}
      {isFullscreen}
      {playbackRate}
      onSeek={seek}
      onTogglePlay={togglePlay}
      onVolumeChange={handleVolumeChange}
      onToggleMute={() => settings.muted = !settings.muted}
      onToggleFullscreen={toggleFullscreen}
      onQualityChange={setQuality}
      onSwitchAudio={switchAudioTrack}
      onPlaybackRateChange={(rate) => {
        playbackRate = rate;
        videoElement.playbackRate = playbackRate;
      }}
    />
  {/if}
</div>
