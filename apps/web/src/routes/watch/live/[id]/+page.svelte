<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import VideoPlayer from '$lib/components/widgets/VideoPlayer.svelte';
  import LiveChatPanel from '$lib/components/widgets/LiveChatPanel.svelte';
  import { Radio, Eye } from '@lucide/svelte';
  import { announce } from '$lib/stores/live-region';

  const { data } = $props();
  // Initial values from the server load; SSE pushes update these in place.
  // svelte-ignore state_referenced_locally
  let status = $state<string>(data.stream.status);
  // svelte-ignore state_referenced_locally
  let viewerCount = $state<number>(data.stream.viewerCount);
  // svelte-ignore state_referenced_locally
  let playbackUrl = $state<string | null>(data.stream.playbackUrl);
  // svelte-ignore state_referenced_locally
  let recordingMediaId = $state<string | null>(data.stream.recordingMediaId);
  let sse: EventSource | null = null;

  // Stream is ended AND has a VOD recording → show the recording instead.
  const hasRecording = $derived(status === 'ended' && !!recordingMediaId);
  const recordingHref = $derived(
    recordingMediaId ? `/watch/${recordingMediaId}` : '#'
  );

  onMount(() => {
    try {
      sse = new EventSource(`/api/watch/live/${data.stream.id}/stream`);
      sse.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data) as { status?: string; viewerCount?: number; playbackUrl?: string; recordingMediaId?: string };
          if (event.status && event.status !== status) {
            const prev = status;
            status = event.status;
            if (event.status === 'live' && prev !== 'live') announce('Stream is now live.');
            if (event.status === 'ended') announce('Stream has ended.');
          }
          if (typeof event.viewerCount === 'number') viewerCount = event.viewerCount;
          if (event.playbackUrl) playbackUrl = event.playbackUrl;
          if (event.recordingMediaId) {
            recordingMediaId = event.recordingMediaId;
            announce('Recording is now available.');
          }
        } catch { /* ignore */ }
      };
    } catch { /* EventSource unavailable */ }
  });
  onDestroy(() => { if (sse) sse.close(); });
</script>

<svelte:head>
  <title>{data.stream.title} — Sephar Studios LIVE</title>
</svelte:head>

<div class="min-h-screen bg-[#0b0c10] text-white">
  <div class="max-w-[1600px] mx-auto px-2 sm:px-4 py-4 grid gap-4 lg:grid-cols-[1fr_360px]">
    <!-- Video / status column -->
    <div>
      <div class="w-full bg-black aspect-video max-h-[80vh] relative rounded-xl overflow-hidden">
        {#if status === 'live' && playbackUrl}
          <VideoPlayer src={playbackUrl} title={data.stream.title} contentId={data.stream.id} />
          <div class="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white text-xs uppercase tracking-wider px-2 py-1 rounded">
            <Radio class="w-3 h-3 animate-pulse" /> LIVE
          </div>
          <div class="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded inline-flex items-center gap-1">
            <Eye class="w-3 h-3" /> {viewerCount.toLocaleString()}
          </div>
        {:else if status === 'idle' || status === 'ingest'}
          <div class="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Radio class="w-10 h-10 animate-pulse" aria-hidden="true" />
            <p class="text-sm">Stream is starting…</p>
          </div>
        {:else if status === 'ended' && hasRecording}
          <!-- Recording is published as a normal VOD; link the viewer
               there so they get full player chrome, chapters, subtitles. -->
          <a
            href={recordingHref}
            class="w-full h-full flex flex-col items-center justify-center text-purple-200 gap-3 hover:bg-white/5 transition-colors"
          >
            {#if data.stream.thumbnailUrl}
              <img src={data.stream.thumbnailUrl} alt="" class="max-h-40 rounded-lg shadow-2xl" />
            {/if}
            <p class="text-base font-semibold">Watch the recording →</p>
            <p class="text-xs text-zinc-400">This live broadcast ended. The replay is available now.</p>
          </a>
        {:else if status === 'ended'}
          <div class="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Radio class="w-10 h-10" aria-hidden="true" />
            <p class="text-sm">This stream has ended.</p>
            {#if data.isOwner}
              <p class="text-xs text-zinc-500">Recording will appear here once processing finishes.</p>
            {/if}
          </div>
        {:else}
          <div class="w-full h-full flex flex-col items-center justify-center text-red-300 gap-2">
            <Radio class="w-10 h-10" aria-hidden="true" />
            <p class="text-sm">Stream is currently offline.</p>
          </div>
        {/if}
      </div>

      <div class="mt-4">
        <h1 class="text-2xl font-bold text-white">{data.stream.title}</h1>
        <p class="text-sm text-zinc-400 mt-1">{data.stream.creatorName ?? 'Creator'}</p>
        {#if data.stream.description}
          <p class="text-zinc-300 leading-relaxed mt-4">{data.stream.description}</p>
        {/if}
      </div>
    </div>

    <!-- Chat column -->
    <div class="lg:sticky lg:top-4 lg:self-start h-[600px] lg:h-[calc(100vh-2rem)] lg:max-h-[760px]">
      <LiveChatPanel streamId={data.stream.id} canModerate={data.canModerateChat} />
    </div>
  </div>
</div>
