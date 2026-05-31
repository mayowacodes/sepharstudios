<script lang="ts">
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import VideoPlayer from '$lib/components/widgets/VideoPlayer.svelte';
  import PPVPaywall from '$lib/components/widgets/PPVPaywall.svelte';
  import { invalidateAll } from '$app/navigation';
  import ReviewSection from '$lib/components/widgets/ReviewSection.svelte';
  import ShareButton from '$lib/components/widgets/ShareButton.svelte';
  import ReportButton from '$lib/components/ReportButton.svelte';
  import { copilotContext } from '$lib/stores/copilot';
  import { SiteMeta } from '$lib/constants';
  import { translateRole, sectionLabel } from '$lib/i18n/role-labels';

  const { data } = $props();
  const content = $derived(data.content);

  // schema.org VideoObject — surfaces this title in Google Video search +
  // rich-result carousels. Required fields per Google's docs: name,
  // description, thumbnailUrl, uploadDate. contentUrl is omitted because
  // playback is auth/subscription-gated; we expose the watch page URL only.
  const videoSchema = $derived.by(() => {
    if (!content) return null;
    const watchUrl = `${SiteMeta.link}/watch/${content.id}`;
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: content.title,
      description: content.description ?? '',
      thumbnailUrl: content.thumbnail || content.posterUrl || `${SiteMeta.link}${SiteMeta.ogimage}`,
      uploadDate: content.createdAt
        ? new Date(content.createdAt).toISOString()
        : undefined,
      duration: content.duration ?? undefined,
      contentRating: content.ageRating ?? undefined,
      genre: (content.genres ?? []).filter(Boolean),
      inLanguage: content.language ?? 'en',
      url: watchUrl,
      ...(content.trailerUrl ? { trailer: { '@type': 'VideoObject', contentUrl: content.trailerUrl } } : {}),
      isFamilyFriendly: content.ageRating === 'All' || content.ageRating === '7+' || content.category === 'kids'
    };
  });

  // Feed the AI Copilot what we're watching so it can answer in-context
  // ("what's the main message?", "what verses apply?", etc.).
  $effect(() => {
    if (!content) return;
    copilotContext.set({
      contentTitle: content.title,
      contentDescription: content.description ?? '',
      contentType: content.mediaType ?? 'movie',
      bibleReference: content.bibleReference ?? '',
      genres: (content.genres ?? []) as string[],
      topics: (content.topics ?? []) as string[]
    });
  });

  onDestroy(() => copilotContext.set(null));

  // Resume position from ?t= query param
  const startAt = $derived(() => {
    const t = $page.url.searchParams.get('t');
    return t ? parseInt(t, 10) : 0;
  });

  // Build HLS src — use videoUrl directly, or fall back to encoder API if only videoId
  const src = $derived(() => {
    if (content.playbackUrl) return content.playbackUrl;
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

  <!-- Per-page OG override — share images get the actual poster, not the
       generic site screenshot. The root layout's og:* tags are overridden
       because <svelte:head> tags later in the tree win. -->
  <meta property="og:type" content="video.other" />
  <meta property="og:title" content={`${content.title} — Sephar Studios`} />
  <meta property="og:description" content={content.description ?? ''} />
  <meta property="og:image" content={content.posterUrl || content.thumbnail || `${SiteMeta.link}${SiteMeta.ogimage}`} />
  <meta name="twitter:title" content={`${content.title} — Sephar Studios`} />
  <meta name="twitter:description" content={content.description ?? ''} />
  <meta name="twitter:image" content={content.posterUrl || content.thumbnail || `${SiteMeta.link}${SiteMeta.ogimage}`} />

  {#if videoSchema}
    {@html `<script type="application/ld+json">${JSON.stringify(videoSchema)}</script>`}
  {/if}
</svelte:head>

<div class="min-h-screen bg-[#0b0c10] text-white">
  <!-- Video Player / paywall -->
  <div class="w-full bg-black">
    {#if data.paywall?.required}
      <!-- PPV-gated: show the paywall instead of the player. Successful
           purchase invalidates the load() to flip `paywall.required=false`
           and reveal the player. -->
      <div class="aspect-video flex items-center justify-center bg-zinc-900">
        <PPVPaywall
          contentId={content.id}
          contentTitle={content.title}
          priceCents={data.paywall.priceCents}
          onPurchased={() => void invalidateAll()}
        />
      </div>
    {:else if src()}
      <VideoPlayer
        src={src()}
        poster={content.backdropUrl ?? content.thumbnail ?? content.posterAutoUrl ?? undefined}
        contentId={content.id}
        startAt={startAt()}
        title={content.title}
        subtitles={data.subtitles}
        descriptions={data.descriptions}
        chapters={content.chapters ?? []}
        endScreen={data.nextUp ?? []}
        previewVtt={content.previewThumbnailsVtt ?? undefined}
        previewSprites={content.previewSpriteUrls ?? []}
        enableAds={true}
        onEnded={handleEnded}
      />
    {:else}
      <div class="aspect-video flex items-center justify-center bg-zinc-900">
        <p class="text-zinc-400">
          {content.processingStatus === 'ready' ? 'Video not available yet.' : 'Video is still processing.'}
        </p>
      </div>
    {/if}
  </div>

  <!-- Content Details -->
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Title row -->
    <div class="flex flex-wrap items-start gap-4 mb-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-3">
          <h1 class="text-3xl font-bold leading-tight flex-1">{content.title}</h1>
          <ShareButton contentId={content.id} title={content.title} description={content.description ?? ''} />
          <ReportButton targetType="content" targetId={content.id} />
        </div>
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

    <!-- Cast & crew accordion -->
    {#if (content.cast && content.cast.length > 0) || (content.crew && content.crew.length > 0)}
      <details class="mb-6 surface-1 rounded-xl">
        <summary class="cursor-pointer px-4 py-3 text-sm font-medium text-white">
          {sectionLabel('castAndCrew', data.viewerLocale)}
        </summary>
        <div class="px-4 pb-4 space-y-4">
          {#if content.cast && content.cast.length > 0}
            <div>
              <div class="text-xs uppercase tracking-wide text-gray-400 mb-2">{sectionLabel('cast', data.viewerLocale)}</div>
              <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {#each content.cast as p (p.name + p.role)}
                  <li class="flex items-center gap-2">
                    {#if p.photoUrl}
                      <img src={p.photoUrl} alt="" class="w-8 h-8 rounded-full object-cover" />
                    {:else}
                      <div class="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                        {(p.name ?? '?').charAt(0).toUpperCase()}
                      </div>
                    {/if}
                    <div class="min-w-0">
                      <div class="text-sm text-white truncate">{p.name}</div>
                      <div class="text-xs text-gray-400 truncate">
                        {p.characterName ? `${sectionLabel('as', data.viewerLocale)} ${p.characterName}` : translateRole(p.role, data.viewerLocale)}
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
          {#if content.crew && content.crew.length > 0}
            <div>
              <div class="text-xs uppercase tracking-wide text-gray-400 mb-2">{sectionLabel('crew', data.viewerLocale)}</div>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {#each content.crew as p (p.name + p.role)}
                  <li class="flex justify-between text-gray-200">
                    <span>{p.name}</span>
                    <span class="text-gray-400">{translateRole(p.role, data.viewerLocale)}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </details>
    {/if}

    <!-- Divider -->
    <hr class="border-zinc-800 mb-8" />

    <!-- Reviews -->
    <ReviewSection contentId={content.id} contentType={content.mediaType} />
  </div>
</div>
