<script lang="ts">
  import { onMount } from 'svelte';
  import EnhancedVideoPlayer from '$lib/components/widgets/EnhancedVideoPlayer.svelte';
  import type { PlayerSettings } from '$lib/types';

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

  let videos = $state<{ identifier: string; title: string; description: string; year: string }[]>([]);
  let selectedVideo = $state<{ title: string; identifier: string } | null>(null);
  let loading = $state(true);

  const fetchVideos = async () => {
    const query =
      'https://archive.org/advancedsearch.php' +
      '?q=collection%3Achristian-movies' +
      '&fl[]=identifier&fl[]=title&fl[]=description&fl[]=year' +
      '&rows=12&page=1&output=json';

    // archive.org is routinely slow. Without a hard timeout this mount would
    // block the entire Browse page until the upstream response (or never)
    // resolved. 2.5s lets us bail out and render an empty list instead.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const res = await fetch(query, { signal: controller.signal });
      const data = await res.json();
      videos = data.response.docs;
    } catch (err) {
      // Includes both AbortError on timeout and any network/parse failure.
      console.warn('archive.org fetch failed or timed out:', err);
      videos = [];
    } finally {
      clearTimeout(timeoutId);
      loading = false;
    }
  };

  const getMp4Url = (identifier: string) =>
    `https://archive.org/download/${identifier}/${identifier}.mp4`;

  const getThumbnailUrl = (identifier: string) =>
    `https://archive.org/services/img/${identifier}`;

  onMount(fetchVideos);
</script>

{#if selectedVideo}
  <div class="space-y-4">
    <button
      onclick={() => (selectedVideo = null)}
      class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
    >
      ⬅ Back to Video List
    </button>

    <EnhancedVideoPlayer
      videoUrl={getMp4Url(selectedVideo.identifier)}  
      title={selectedVideo.title}
      settings={defaultSettings}
    />
  </div>
{:else}
  {#if loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {#each Array(6) as _, i}
        <div class="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
      {/each}
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {#each videos as video}
        <button
          role="link"
          onclick={() => (selectedVideo = video)}
          onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? (selectedVideo = video) : null}
          class="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer bg-white border"
        >
          <img
            src={getThumbnailUrl(video.identifier)}
            alt={video.title}
            class="w-full h-48 object-cover"
            onerror={(e) => {
              if (e.target) {
                (e.target as HTMLImageElement).style.display = 'none';
              }
            }}
          />

          <div class="p-4 space-y-1">
            <h3 class="font-semibold text-lg line-clamp-2">{video.title}</h3>

            {#if video.year}
              <p class="text-sm text-gray-600">📅 {video.year}</p>
            {/if}

            {#if video.description}
              <p class="text-sm text-gray-500 line-clamp-3">
                {@html video.description.replace(/(<([^>]+)>)/gi, '')}
              </p>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
{/if}
