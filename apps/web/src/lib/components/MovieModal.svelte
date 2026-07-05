<script lang="ts">
  import { onDestroy } from 'svelte';
  import { afterNavigate, goto } from '$app/navigation';
  import { X, Play, Bookmark, BookmarkCheck, Info } from '@lucide/svelte';
  import { mediaModalStore } from '$lib/stores/mediaModalStore';
  import { myList } from '$lib/stores/myList';

  /**
   * Quick-view modal — the Netflix-style overlay that opens when a
   * catalog card is clicked. Trailer (muted autoplay) or backdrop on
   * top; title, meta, description below; Play / My List / More info
   * actions. Mounted ONCE globally in the (app) layout via
   * LazyMovieModal — cards just call mediaModalStore.open(media).
   */

  const media = $derived($mediaModalStore.media);
  const isOpen = $derived($mediaModalStore.isOpen && !!media);

  let closeBtn = $state<HTMLButtonElement | undefined>();

  // Artwork fallback chain: full backdrop → 16:9 landscape poster →
  // landscape thumbnail → portrait poster → legacy snake_case (the
  // hardcoded features-page data still ships backdrop_url).
  const artworkUrl = $derived(
    media
      ? (media.backdropUrl || media.posterLandscapeUrl || media.thumbnail || media.posterUrl || media.backdrop_url || media.poster_url || null)
      : null
  );

  // Detail-page routing — same audience/type switch the search endpoint
  // uses, so "More info" always lands on the right portal's page.
  const detailHref = $derived.by(() => {
    if (!media) return '/movies';
    const slug = media.slug || media.id;
    if (media.category === 'kids') return `/kids/kiddies/${slug}`;
    if (media.category === 'teens') return `/kids/teens/${slug}`;
    if (media.mediaType === 'tv' || media.mediaType === 'series' || media.mediaType === 'show') return `/shows/${slug}`;
    if (media.mediaType === 'documentary') return `/documentaries/${slug}`;
    return `/movies/${slug}`;
  });

  const watchHref = $derived(media ? `/watch/${media.slug || media.id}` : '/');

  const inMyList = $derived(media ? $myList.ids.has(media.id) : false);
  const myListPending = $derived(media ? $myList.pending.has(media.id) : false);

  function close(): void {
    mediaModalStore.close();
  }

  function onKeydown(e: KeyboardEvent): void {
    if (isOpen && e.key === 'Escape') close();
  }

  // Play / More info navigate — close first so the overlay doesn't
  // linger over the destination page. afterNavigate below also covers
  // any other navigation source (browser back, in-page links).
  function playNow(): void {
    const href = watchHref;
    close();
    void goto(href);
  }
  function moreInfo(): void {
    const href = detailHref;
    close();
    void goto(href);
  }

  function toggleMyList(): void {
    if (!media) return;
    void myList.toggle({
      contentId: media.id,
      contentTitle: media.title,
      contentType: media.mediaType ?? 'movie'
    });
  }

  afterNavigate(() => {
    if ($mediaModalStore.isOpen) mediaModalStore.close();
  });

  // Scroll-lock the page while the modal is open + focus the close
  // button so Esc/tab behave. Restore on close/unmount.
  $effect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
      return () => { document.body.style.overflow = prev; };
    }
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  });
</script>

<svelte:window onkeydown={onKeydown} />

{#if isOpen && media}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    onclick={(e) => { if (e.target === e.currentTarget) close(); }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label={media.title}
      class="relative w-full max-w-4xl surface-glass rounded-2xl overflow-hidden border border-white/10 my-8"
    >
      <button
        bind:this={closeBtn}
        class="absolute top-4 right-4 z-30 rounded-full bg-black/50 hover:bg-black/70 p-2 text-white transition-colors"
        onclick={close}
        aria-label="Close"
      >
        <X class="h-5 w-5" />
      </button>

      <!-- Preview: muted looping trailer when one exists, artwork
           otherwise. Bare <video> (not VideoPlayer) — no watch-progress
           pollution, no HLS machinery for a short MP4 teaser. -->
      <div class="relative aspect-video w-full bg-black">
        {#if media.trailerUrl}
          <!-- svelte-ignore a11y_media_has_caption -->
          <video
            src={media.trailerUrl}
            poster={artworkUrl ?? undefined}
            class="w-full h-full object-cover"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
          ></video>
        {:else if artworkUrl}
          <img src={artworkUrl} alt="" class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full flex items-center justify-center text-xs text-white/50">
            No preview available yet.
          </div>
        {/if}
        <!-- Bottom fade so the title block reads over the frame -->
        <div class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/90 to-transparent pointer-events-none"></div>

        <!-- Title + primary actions anchored over the preview's bottom edge -->
        <div class="absolute bottom-4 left-6 right-6 z-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-white text-display drop-shadow mb-3">{media.title}</h2>
          <div class="flex flex-wrap items-center gap-2">
            <button
              class="tap-target inline-flex items-center gap-2 rounded-full bg-[#FF5E0E] px-5 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"
              onclick={playNow}
              aria-label={`Play ${media.title}`}
            >
              <Play class="h-4 w-4" />
              Play
            </button>
            <button
              class="tap-target inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/60 px-4 py-2 text-sm font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
              onclick={toggleMyList}
              disabled={myListPending}
              aria-label={inMyList ? `Remove ${media.title} from My List` : `Add ${media.title} to My List`}
            >
              {#if inMyList}
                <BookmarkCheck class="h-4 w-4" />
              {:else}
                <Bookmark class="h-4 w-4" />
              {/if}
              My List
            </button>
            <button
              class="tap-target inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
              onclick={moreInfo}
              aria-label={`More info about ${media.title}`}
            >
              <Info class="h-4 w-4" />
              More info
            </button>
          </div>
        </div>
      </div>

      <!-- Meta + description -->
      <div class="p-6 space-y-3">
        <div class="text-sm text-white/60 flex flex-wrap gap-3">
          {#if media.ageRating}
            <span class="px-2 py-0.5 border border-white/25 rounded text-[11px] uppercase tracking-wider">{media.ageRating}</span>
          {/if}
          {#if media.year}<span>{media.year}</span>{/if}
          {#if media.duration}<span>{media.duration}</span>{/if}
          {#if media.quality}<span>{media.quality}</span>{/if}
          {#if media.mediaType}<span class="capitalize">{media.mediaType}</span>{/if}
        </div>
        {#if media.description}
          <p class="text-white/75 leading-relaxed line-clamp-4">{media.description}</p>
        {/if}
        {#if media.genres && media.genres.length > 0}
          <div class="flex flex-wrap gap-2 pt-1">
            {#each media.genres.slice(0, 5) as g (g)}
              <span class="text-xs text-white/55 bg-white/8 border border-white/10 rounded-full px-2.5 py-0.5">{g}</span>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
