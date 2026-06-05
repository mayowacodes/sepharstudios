<script lang="ts">
  import { goto } from '$app/navigation';

  let { movie }: { movie: {
    id: string;
    title: string;
    thumbnailUrl: string;
    trailerUrl?: string;
    genres?: string[];
  } } = $props();

  let isHovered = $state(false);

  function handleClick() {
    goto(`/kids/kiddies/movies/${movie.id}`);
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

  <div class="p-2 bg-pink-100">
    <h3 class="font-bold text-lg text-pink-700">{movie.title}</h3>
    {#if movie.genres?.length}
      <p class="text-xs text-gray-600">{movie.genres.join(', ')}</p>
    {/if}
  </div>
</div>
