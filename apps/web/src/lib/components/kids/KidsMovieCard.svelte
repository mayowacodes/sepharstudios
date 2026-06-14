<script lang="ts">
  import { goto } from '$app/navigation';
  import { Bookmark, BookmarkCheck } from '@lucide/svelte';
  import { myList } from '$lib/stores/myList';

  let { movie }: { movie: {
    id: string;
    slug?: string | null;
    title: string;
    thumbnailUrl: string;
    trailerUrl?: string;
    genres?: string[];
    progressPercent?: number;
  } } = $props();

  let isHovered = $state(false);

  // Card click now lands on the shared kids detail page
  // (/kids/kiddies/<slug>) where MediaDetailPage renders in kids mode
  // with a 15s preview + bright/friendly palette. The detail's Play CTA
  // is what hops to /watch for full playback.
  function handleClick() {
    goto(`/kids/kiddies/${movie.slug || movie.id}`);
  }

  function toggleList(e: MouseEvent): void {
    e.stopPropagation();
    void myList.toggle({
      contentId: movie.id,
      contentTitle: movie.title,
      contentType: 'movie'
    });
  }
</script>

<div
  class="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border-4 border-yellow-300 bg-white text-center cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
  onclick={handleClick}
  role="button"
  tabindex="0"
  aria-label={`Watch ${movie.title}`}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleClick())}
>
  {#if isHovered && movie.trailerUrl}
    <video
      src={movie.trailerUrl}
      autoplay
      muted
      loop
      playsinline
      class="w-full h-48 object-cover"
    >
      <track kind="captions" label="English captions" />
    </video>
  {:else}
    <img
      src={movie.thumbnailUrl}
      alt={movie.title}
      width="320"
      height="192"
      loading="lazy"
      decoding="async"
      class="w-full h-48 object-cover"
    />
  {/if}

  {#if typeof movie.progressPercent === 'number' && movie.progressPercent > 0 && movie.progressPercent < 95}
    <!-- Kid-themed pink progress strip — same affordance as the adult
         cards but pink to match the kids portal palette. -->
    <div class="absolute inset-x-0 bottom-14 sm:bottom-13 h-1.5 bg-pink-900/30 z-30">
      <div
        class="h-full bg-pink-500"
        style="width: {Math.max(2, Math.min(100, movie.progressPercent))}%"
      ></div>
    </div>
  {/if}

  <!-- Kid-friendly bookmark heart in the top-right corner. Lives outside
       the click-to-watch surface so a tap doesn't accidentally start
       playback. Bigger tap target than the adult cards' bookmark chip
       since little fingers aim less precisely. -->
  <button
    type="button"
    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/95 border-2 border-pink-300 shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 hover:scale-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
    onclick={toggleList}
    disabled={$myList.pending.has(movie.id)}
    aria-label={$myList.ids.has(movie.id) ? `Remove ${movie.title} from My List` : `Save ${movie.title} for later`}
  >
    {#if $myList.ids.has(movie.id)}
      <BookmarkCheck class="w-5 h-5" />
    {:else}
      <Bookmark class="w-5 h-5" />
    {/if}
  </button>

  <div class="p-2 bg-pink-100">
    <h3 class="font-bold text-lg text-pink-700">{movie.title}</h3>
    {#if movie.genres?.length}
      <p class="text-xs text-gray-600">{movie.genres.join(', ')}</p>
    {/if}
  </div>
</div>
