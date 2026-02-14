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


  export let videoUrl: string;
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

  const STORAGE_KEY = `video-progress-${videoUrl}`;
  let isLoaded = false;

  onMount(() => {
    if (Hls.isSupported() && videoUrl.includes('.m3u8')) {
      hls = new Hls({ maxLoadingDelay: 4, maxBufferLength: 30, enableWorker: true });
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        qualities = data.levels.map(level => `${level.height}p`);
        if (subtitles.length > 0) {
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
    }

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
