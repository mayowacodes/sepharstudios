<script lang="ts">
  import ComingSoonCard from '$lib/components/ComingSoonCard.svelte';
  import { Sparkles } from '@lucide/svelte';
  import type { MediaItem } from '$lib/types/media';

  // Horizontal carousel of Coming Soon titles. Shape mirrors the
  // MediaGrid section pattern so it visually slots into existing
  // catalog rows. Renders nothing when the list is empty so callers
  // don't need to gate.
  let {
    items,
    title = 'Coming Soon',
    seeMoreHref = '/coming-soon'
  }: {
    items: Array<MediaItem & { scheduledPublishAt?: string | Date | null }>;
    title?: string;
    seeMoreHref?: string;
  } = $props();
</script>

{#if items.length > 0}
  <section class="mb-10">
    <div class="flex items-center justify-between mb-3 px-4">
      <div class="flex items-center gap-3">
        <span class="h-5 w-1 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.4)]"></span>
        <h2 class="text-xl font-semibold text-white inline-flex items-center gap-2">
          <Sparkles class="h-5 w-5 text-[#FFBF00]" />
          {title}
        </h2>
      </div>
      <a href={seeMoreHref} class="text-sm text-white/60 hover:text-white">See all →</a>
    </div>

    <div class="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth snap-x">
      {#each items as item (item.id)}
        <div class="shrink-0 w-44 sm:w-48 lg:w-56 snap-start">
          <ComingSoonCard {item} />
        </div>
      {/each}
    </div>
  </section>
{/if}
