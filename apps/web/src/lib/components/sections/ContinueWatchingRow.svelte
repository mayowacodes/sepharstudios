<!--
  ContinueWatchingRow — the "pick up where you left off" carousel for
  the home page. Each card shows the title's backdrop (with a thin
  progress bar burned in along the bottom), the title text, and either
  an episode chip (S2 E5) or the remaining time.

  Click → goes to the audience-specific detail page (with the resume
  CTA already populated by media-detail-load), NOT directly to /watch.
  Lets the viewer confirm what they're jumping into and dovetails with
  the My List / Watch Next CTAs already on the detail page.

  Empty: parent decides whether to render this component at all. We
  short-circuit at render if the prop is empty so the carousel doesn't
  spit out a blank row in case a parent forgets to guard.
-->
<script lang="ts">
  import { Play } from '@lucide/svelte';

  interface ContinueWatchingItem {
    contentId: string;
    slug: string | null;
    category: string | null;
    title: string;
    thumbnail: string | null;
    posterUrl: string | null;
    backdropUrl: string | null;
    mediaType: string | null;
    positionSeconds: number;
    durationSeconds: number | null;
    completionPercent: number;
    episodeId: string | null;
    episodeSeason: number | null;
    episodeNumber: number | null;
    episodeTitle: string | null;
  }

  interface Props {
    items: ContinueWatchingItem[];
  }

  let { items }: Props = $props();

  // Build the detail-page URL using the same routing rules every
  // other surface uses — see MovieCard / TVShowCard / watchlist.
  function detailHref(item: ContinueWatchingItem): string {
    const slug = item.slug || item.contentId;
    if (item.category === 'kids') return `/kids/kiddies/${slug}`;
    if (item.category === 'teens') return `/kids/teens/${slug}`;
    if (item.mediaType === 'tv' || item.mediaType === 'series') return `/shows/${slug}`;
    if (item.mediaType === 'documentary') return `/documentaries/${slug}`;
    return `/movies/${slug}`;
  }

  // Direct-to-player URL for the "Resume now" hover shortcut. Skips
  // the detail page when the viewer already knows what they're
  // jumping into — same `?t=` + optional `?episode=` shape the
  // detail page's Resume CTA emits.
  function resumeHref(item: ContinueWatchingItem): string {
    const slug = item.slug || item.contentId;
    const params = new URLSearchParams();
    params.set('t', String(Math.max(0, Math.floor(item.positionSeconds))));
    if (item.episodeId) params.set('episode', item.episodeId);
    return `/watch/${slug}?${params.toString()}`;
  }

  // Pretty time-remaining label. "12 min left" reads more friendly than
  // "0:12:34 / 1:30:00" while keeping the urgency cue intact. Falls
  // back to bare completion percent when the duration is unknown.
  function remainingLabel(item: ContinueWatchingItem): string {
    if (!item.durationSeconds || item.durationSeconds <= 0) {
      return `${item.completionPercent}% watched`;
    }
    const remainingSec = Math.max(0, item.durationSeconds - item.positionSeconds);
    if (remainingSec < 60) return 'Less than a minute left';
    const minutes = Math.round(remainingSec / 60);
    if (minutes < 60) return `${minutes} min left`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hours}h left` : `${hours}h ${mins}m left`;
  }
</script>

{#if items.length > 0}
  <section class="space-y-4">
    <div class="flex items-end justify-between">
      <h2 class="text-xl font-bold">Continue Watching</h2>
      <span class="text-xs text-white/40">Pick up where you left off</span>
    </div>
    <div class="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory">
      {#each items as item (item.contentId)}
        <!-- Card root is a div, not <a>, because we host TWO links
             inside: the artwork itself navigates to the detail page,
             the orange "Resume now" pill skips straight to /watch.
             Nested <a> isn't valid HTML so we split them. -->
        <div class="group w-72 sm:w-80 shrink-0 snap-start space-y-2">
          <div class="aspect-video rounded-lg overflow-hidden bg-zinc-900 relative">
            <a href={detailHref(item)} class="block w-full h-full" aria-label={`Open details for ${item.title}`}>
              {#if item.backdropUrl || item.thumbnail}
                <img
                  src={item.backdropUrl ?? item.thumbnail ?? ''}
                  alt={item.title}
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              {/if}
            </a>
            <!-- Hover veil + "Resume now" shortcut. The artwork still
                 navigates to the detail page (safer default — viewer
                 can confirm); the inner orange button short-circuits
                 straight to /watch with the saved position, for the
                 case where the viewer is sure. -->
            <div class="pointer-events-none absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a
                href={resumeHref(item)}
                class="pointer-events-auto inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#FF5E0E] text-white text-sm font-semibold shadow-lg hover:scale-105 transition-transform"
                aria-label={`Resume ${item.title} now`}
              >
                <Play class="w-4 h-4 fill-white" />
                Resume now
              </a>
            </div>
            <!-- Burned-in progress bar along the bottom, mirroring the
                 detail-page resume bar so the language is consistent -->
            <div class="absolute inset-x-0 bottom-0 h-1 bg-black/40 pointer-events-none">
              <div
                class="h-full bg-[#FF5E0E]"
                style="width: {Math.max(2, Math.min(100, item.completionPercent))}%"
              ></div>
            </div>
          </div>
          <a href={detailHref(item)} class="block space-y-0.5">
            <p class="text-sm font-semibold text-white truncate" title={item.title}>
              {item.title}
            </p>
            {#if item.episodeSeason != null && item.episodeNumber != null}
              <p class="text-xs text-white/60 truncate">
                S{item.episodeSeason} E{item.episodeNumber}{item.episodeTitle ? ` · ${item.episodeTitle}` : ''}
              </p>
            {/if}
            <p class="text-xs text-white/40">{remainingLabel(item)}</p>
          </a>
        </div>
      {/each}
    </div>
  </section>
{/if}
