<script lang="ts">
  import ComingSoonCard from '$lib/components/ComingSoonCard.svelte';
  import { Sparkles, CalendarDays } from '@lucide/svelte';
  import type { MediaItem } from '$lib/types/media';

  const { data } = $props();

  // Group items by month of scheduledPublishAt. Within a month we
  // preserve the asc-by-date order from the server load.
  type Item = MediaItem & { scheduledPublishAt?: string | Date | null };
  const grouped = $derived.by(() => {
    const out = new Map<string, { label: string; items: Item[] }>();
    for (const item of (data.items ?? []) as Item[]) {
      const raw = item.scheduledPublishAt ?? item.releaseDate ?? null;
      if (!raw) continue;
      const ts = raw instanceof Date ? raw.getTime() : Date.parse(String(raw));
      if (Number.isNaN(ts)) continue;
      const d = new Date(ts);
      // Key by year-month so calendar order is preserved even across
      // year boundaries (Dec 2026 → Jan 2027 → Feb 2027 …).
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      const label = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      if (!out.has(key)) out.set(key, { label, items: [] });
      out.get(key)!.items.push(item);
    }
    return [...out.entries()].map(([key, group]) => ({ key, ...group }));
  });
</script>

<svelte:head>
  <title>Coming Soon · Sephar Studios</title>
  <meta name="description" content="Faith-inspiring movies, shows, and documentaries dropping soon on Sephar Studios. Get notified when your most-anticipated titles go live." />
</svelte:head>

<div class="relative overflow-hidden min-h-screen bg-(--surface-charcoal) text-white">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div>
  <main class="w-full max-w-7xl mx-auto px-6 md:px-8 py-10 relative z-10">
    <section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto">
      <div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60"></div>
      <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">
        <Sparkles class="h-3.5 w-3.5" />
        Coming Soon
      </div>
      <h1 class="text-5xl sm:text-6xl font-extrabold text-display">Releasing soon</h1>
      <p class="text-white/70 text-lg">Tap the bell on any title and we'll let you know the moment it goes live.</p>
    </section>

    {#if grouped.length === 0}
      <div class="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-white/70">
        <CalendarDays class="mx-auto h-10 w-10 mb-3 opacity-60" />
        <p class="text-lg">Nothing scheduled right now.</p>
        <p class="text-sm text-white/50 mt-1">Check back soon — creators are uploading.</p>
      </div>
    {:else}
      {#each grouped as group (group.key)}
        <section class="mb-12">
          <header class="flex items-center gap-3 mb-4">
            <span class="h-5 w-1 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.4)]"></span>
            <h2 class="text-2xl font-semibold text-white">{group.label}</h2>
            <span class="text-sm text-white/50">{group.items.length} title{group.items.length === 1 ? '' : 's'}</span>
          </header>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {#each group.items as item (item.id)}
              <ComingSoonCard {item} />
            {/each}
          </div>
        </section>
      {/each}
    {/if}
  </main>
</div>
