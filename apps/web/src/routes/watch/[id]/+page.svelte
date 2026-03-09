<script lang="ts">
  import { page } from '$app/stores';
  import VideoPlayer from '$lib/components/widgets/VideoPlayer.svelte';
  import ReviewSection from '$lib/components/widgets/ReviewSection.svelte';

  const { data } = $props();
  const content = $derived(data.content);

  // Resume position from ?t= query param
  const startAt = $derived(() => {
    const t = $page.url.searchParams.get('t');
    return t ? parseInt(t, 10) : 0;
  });

  // Build HLS src — use videoUrl directly, or fall back to encoder API if only videoId
  const src = $derived(() => {
    if (content.videoUrl) return content.videoUrl;
    if (content.videoId) return `/api/watch/${content.videoId}`;
    return '';
  });

  function handleEnded() {
    // Mark completed — progress endpoint handles this via completionPercent >= 95
  }
</script>

<svelte:head>
  <title>{content.title} — Sephar Studios</title>
  <meta name="description" content={content.description ?? ''} />
</svelte:head>

<div class="min-h-screen bg-[#0b0c10] text-white">
  <!-- Video Player -->
  <div class="w-full bg-black">
    {#if src()}
      <VideoPlayer
        src={src()}
        poster={content.backdropUrl ?? content.thumbnail ?? undefined}
        contentId={content.id}
        startAt={startAt()}
        title={content.title}
        onEnded={handleEnded}
      />
    {:else}
      <div class="aspect-video flex items-center justify-center bg-zinc-900">
        <p class="text-zinc-400">Video not available yet.</p>
      </div>
    {/if}
  </div>

  <!-- Content Details -->
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Title row -->
    <div class="flex flex-wrap items-start gap-4 mb-4">
      <div class="flex-1 min-w-0">
        <h1 class="text-3xl font-bold leading-tight">{content.title}</h1>
        <div class="flex flex-wrap gap-3 mt-2 text-sm text-zinc-400">
          {#if content.year}
            <span>{content.year}</span>
          {/if}
          {#if content.duration}
            <span>{content.duration}</span>
          {/if}
          {#if content.ageRating}
            <span class="px-2 py-0.5 border border-zinc-600 rounded text-xs uppercase tracking-wide">
              {content.ageRating}
            </span>
          {/if}
          {#if content.rating}
            <span class="flex items-center gap-1">
              <span class="text-yellow-400">★</span>
              {content.rating}
            </span>
          {/if}
          {#if content.language && content.language !== 'English'}
            <span>{content.language}</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Genres -->
    {#if content.genres?.length}
      <div class="flex flex-wrap gap-2 mb-4">
        {#each content.genres as genre}
          <span class="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">{genre}</span>
        {/each}
      </div>
    {/if}

    <!-- Description -->
    {#if content.description}
      <p class="text-zinc-300 leading-relaxed mb-6 max-w-3xl">{content.description}</p>
    {/if}

    <!-- Bible Reference -->
    {#if content.bibleReference}
      <div class="flex items-center gap-2 mb-6 text-sm text-amber-400">
        <span>📖</span>
        <span>{content.bibleReference}</span>
      </div>
    {/if}

    <!-- Divider -->
    <hr class="border-zinc-800 mb-8" />

    <!-- Reviews -->
    <ReviewSection contentId={content.id} contentType={content.mediaType} />
  </div>
</div>
