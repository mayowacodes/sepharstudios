<script lang="ts">
  import type { MediaSection, MediaItem } from '../types/media';
  import MovieCard from './MovieCard.svelte';

  interface Props {
    sections?: MediaSection[];
    mediaItems?: MediaItem[];
    title?: string;
  }

  let { sections = [], mediaItems = [], title = 'Featured' }: Props = $props();

  const resolvedSections = $derived.by(() => {
    if (sections.length > 0) return sections;
    if (mediaItems.length > 0) return [{ title, items: mediaItems }];
    return [];
  });

  // The grid USED to push the clicked row into the legacy
  // mediaModalStore quick-view overlay AND let the card navigate at
  // the same time. The modal opened, briefly captured scroll/focus,
  // then the navigation landed underneath it — the visual effect was
  // a flash of overlay followed by what looked like "the page jumped
  // to the top" because viewers never saw the new page render. The
  // MovieCard now owns the click and routes via goto(); the grid
  // should not pass an onClick that re-opens the legacy modal.
</script>

<div class="space-y-10">
  {#each resolvedSections as section}
    <section>
      <div class="flex items-center gap-3 mb-3 px-4">
        <span class="h-5 w-1 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.4)]"></span>
        <h2 class="text-xl font-semibold text-white">{section.title}</h2>
      </div>

      {#if section.items.length === 0}
        <div class="mx-4 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          No titles available yet.
        </div>
      {:else}
        <div
          class="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth snap-x snap-mandatory"
        >
          {#each section.items as item (item.id)}
            <div class="shrink-0 w-44 sm:w-48 lg:w-56 snap-start">
              <MovieCard movie={item} />
            </div>
          {/each}
        </div>
      {/if}
    </section>
  {/each}
</div>
