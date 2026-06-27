<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Bell, BellRing } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import type { MediaItem } from '$lib/types/media';

  // Coming Soon card. Sized to match MovieCard so it fits the same
  // carousel slot. Does NOT play a hover trailer — these aren't watchable
  // yet, the hover behavior would mislead.
  let { item }: { item: MediaItem & { scheduledPublishAt?: string | Date | null } } = $props();

  // Subscription state is hydrated from /api/coming-soon/<id>/notify on
  // mount. Anonymous viewers see the bell but clicking prompts sign-in.
  let subscribed = $state(false);
  let busy = $state(false);
  let signedIn = $state(true);

  const detailPath = (m: MediaItem) => {
    const slug = m.slug || m.id;
    if (m.category === 'kids') return `/kids/kiddies/${slug}`;
    if (m.category === 'teens') return `/kids/teens/${slug}`;
    return `/movies/${slug}`;
  };

  onMount(async () => {
    try {
      const res = await fetch(`/api/coming-soon/${item.id}/notify`);
      if (!res.ok) return;
      const body = await res.json();
      subscribed = !!body.subscribed;
      signedIn = body.signedIn ?? true;
    } catch {
      // ignore — the card still renders, just without a hydrated state
    }
  });

  async function toggleNotify(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (busy) return;
    if (!signedIn) {
      void goto(`/auth/login?redirectTo=${encodeURIComponent(`/movies/${item.slug || item.id}`)}`);
      return;
    }
    busy = true;
    const previous = subscribed;
    subscribed = !subscribed; // optimistic
    try {
      const res = await fetch(`/api/coming-soon/${item.id}/notify`, { method: 'POST' });
      if (!res.ok) {
        subscribed = previous;
        toast.error("Couldn't update reminder");
        return;
      }
      const body = await res.json();
      subscribed = !!body.subscribed;
      toast.success(subscribed
        ? `We'll notify you when ${item.title} drops`
        : `Reminder removed for ${item.title}`);
    } catch {
      subscribed = previous;
      toast.error('Network error');
    } finally {
      busy = false;
    }
  }

  // "RELEASES Mar 15" badge. Falls through scheduledPublishAt →
  // releaseDate (legacy varchar) → empty so the card never crashes
  // on a half-populated row.
  const releaseLabel = $derived.by(() => {
    const raw = item.scheduledPublishAt ?? item.releaseDate ?? null;
    if (!raw) return null;
    const ts = raw instanceof Date ? raw.getTime() : Date.parse(String(raw));
    if (Number.isNaN(ts)) return null;
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  });
</script>

<a
  href={detailPath(item)}
  class="relative group block w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:scale-[1.02]"
  aria-label={`Coming soon: ${item.title}`}
>
  <div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">
    <img
      src={item.posterUrl || item.thumbnail || '/placeholder-vertical.jpg'}
      alt=""
      width="280"
      height="420"
      loading="lazy"
      decoding="async"
      class="w-full h-full object-cover"
    />
    <!-- Veil so the release badge + hover overlay stay readable -->
    <div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

    <!-- Bell CTA — top-right so it doesn't fight the release badge at
         the bottom. Always visible (not hover-only) so taps on mobile
         find it without a hover. -->
    <button
      type="button"
      onclick={toggleNotify}
      disabled={busy}
      aria-pressed={subscribed}
      aria-label={subscribed ? `Stop notifying me about ${item.title}` : `Notify me when ${item.title} drops`}
      class="absolute top-2 right-2 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-md transition-all disabled:opacity-60
        {subscribed
          ? 'bg-[#FF5E0E] text-white shadow-[0_0_18px_rgba(255,94,14,0.55)]'
          : 'bg-black/40 text-white/85 hover:bg-black/60 border border-white/15'}"
    >
      {#if subscribed}
        <BellRing class="h-4 w-4" />
      {:else}
        <Bell class="h-4 w-4" />
      {/if}
    </button>

    <!-- Release-date badge — burned into the bottom-left so it reads
         as an indicator. Only shows when we have a real date. -->
    {#if releaseLabel}
      <div class="absolute bottom-2 left-2 z-20 inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow">
        Releases {releaseLabel}
      </div>
    {/if}
  </div>

  <!-- Title sits inside an overlay that appears on hover, matching the
       MovieCard hover behavior so the row feels consistent. -->
  <div class="absolute inset-0 p-3 flex flex-col justify-end z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none">
    <h3 class="text-sm font-semibold line-clamp-2 text-white drop-shadow">{item.title}</h3>
  </div>
</a>
