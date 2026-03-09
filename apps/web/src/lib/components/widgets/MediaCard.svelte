<script lang="ts">
  type Media = {
    id?: string;
    title: string;
    description: string;
    thumbnail: string;
    link: string;
    trailerUrl?: string;
    rating?: string;
    duration?: string;
    quality?: string;
    backdrop_url?: string;
    year?: string;
    genres?: string[];
    bibleReference?: string;
    ageRating?: string;
    slug?: string;
    language?: string;
    isNew?: boolean;
  };

  export let media: Media;
  export let onClick: () => void = () => {};
  export let onHover: () => void = () => {};

  let addedToList = false;

  async function toggleMyList() {
    try {
      if (addedToList) {
        // Find the default playlist and remove
        const playlists = await fetch('/api/playlists').then(r => r.json()).catch(() => []);
        const def = playlists.find((p: {isDefault: boolean; id: string}) => p.isDefault);
        if (def) {
          await fetch(`/api/playlists/${def.id}/items?contentId=${media.id}`, { method: 'DELETE' });
          addedToList = false;
        }
      } else {
        // Ensure default playlist exists
        const playlists = await fetch('/api/playlists').then(r => r.json()).catch(() => []);
        let def = playlists.find((p: {isDefault: boolean; id: string}) => p.isDefault);
        if (!def) {
          def = await fetch('/api/playlists', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({}) }).then(r => r.json());
        }
        await fetch(`/api/playlists/${def.id}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId: media.id, contentType: 'movie' })
        });
        addedToList = true;
      }
    } catch {
      // Non-critical - fail silently
    }
  }

  let videoRef: HTMLVideoElement;
  let isHovered = false;
  let previewTimeout: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    isHovered = true;
    onHover?.();
    previewTimeout = setTimeout(() => videoRef?.play(), 500);
  };

  const handleMouseLeave = () => {
    isHovered = false;
    clearTimeout(previewTimeout);
    if (videoRef) {
      videoRef.pause();
      videoRef.currentTime = 0;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick();
    }
  };

  const genreColor = (genre: string) => {
    switch (genre.toLowerCase()) {
      case 'drama': return 'bg-purple-600 text-white';
      case 'action': return 'bg-red-600 text-white';
      case 'comedy': return 'bg-yellow-400 text-black';
      case 'animation': return 'bg-pink-500 text-white';
      case 'documentary': return 'bg-blue-500 text-white';
      case 'family': return 'bg-green-500 text-white';
      case 'faith':
      case 'christian': return 'bg-indigo-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };
</script>

<div
  role="button"
  tabindex="0"
  aria-label={media.title}
  class="relative group w-40 sm:w-48 lg:w-52 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:click={onClick}
  on:keydown={handleKeyDown}
>
  <div class="relative aspect-2/3 bg-muted rounded-xl overflow-hidden">
    {#if isHovered && media.trailerUrl}
      <video
        bind:this={videoRef}
        src={media.trailerUrl}
        class="absolute inset-0 w-full h-full object-cover z-0"
        loop
        muted
        playsinline
      ></video>
    {:else}
      <img
        src={media.thumbnail || '/placeholder-vertical.jpg'}
        alt={media.title}
        class="w-full h-full object-cover"
        loading="lazy"
      />
    {/if}
  </div>

  {#if media.isNew}
    <div class="absolute top-2 left-2 bg-green-600 dark:bg-green-400 text-white dark:text-black text-xs px-2 py-0.5 rounded-full z-30">
      New Episode
    </div>
  {/if}

  <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0">
    <h3 class="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white">{media.title}</h3>

    <div class="text-xs mt-1 flex flex-wrap gap-1 text-gray-700 dark:text-gray-300">
      {#if media.rating}<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">{media.rating}</span>{/if}
      {#if media.duration}<span>{media.duration}</span>{/if}
      {#if media.quality}<span>{media.quality}</span>{/if}
    </div>

    {#if media.genres?.length}
      <div class="mt-2 flex flex-wrap gap-1">
        {#each media.genres as genre}
          <span class={`text-[10px] px-2 py-0.5 rounded-full ${genreColor(genre)}`}>
            {genre}
          </span>
        {/each}
      </div>
    {/if}

    <p class="text-xs mt-2 text-white-700 dark:text-gray-300 line-clamp-3 transition-opacity duration-300">
      {media.description}
    </p>
  </div>

  {#if isHovered}
    <div class="absolute top-2 right-2 z-30 flex gap-1">
      <button
        type="button"
        aria-label={`Play ${media.title}`}
        on:click|stopPropagation={onClick}
        class="bg-white/10 hover:bg-white/20 dark:bg-black/30 dark:hover:bg-black/50 p-1.5 rounded-full text-white text-sm"
      >&#9654;</button>
      <button
        type="button"
        aria-label={addedToList ? `Remove ${media.title} from My List` : `Add ${media.title} to My List`}
        title={addedToList ? 'In My List' : 'Add to My List'}
        on:click|stopPropagation={toggleMyList}
        class="bg-white/10 hover:bg-white/20 dark:bg-black/30 dark:hover:bg-black/50 p-1.5 rounded-full text-white text-sm transition-colors {addedToList ? 'text-[#FFBF00]' : ''}"
      >{addedToList ? '✓' : '+'}</button>
    </div>

    <div class="absolute bottom-2 left-2 z-30">
      <a
        href={media.link}
        class="inline-block text-primary font-medium hover:underline text-xs"
      >
        Watch Now
      </a>
    </div>
  {/if}
</div>
