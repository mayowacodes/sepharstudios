<script lang="ts">
  import { onMount } from 'svelte';
  import { Loader2, Check, X, SkipForward, ExternalLink } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { closeSlideOver } from '../slide-over-store';

  /**
   * Quick-approve slide-over — pulls the next pending content review,
   * shows the essentials, lets admin Approve / Reject / Skip without
   * leaving the current page. Reuses /api/admin/content endpoints.
   */

  interface NextItem {
    id: string;
    title: string;
    description: string | null;
    creatorName: string | null;
    ageRating: string | null;
    duration: string | null;
    thumbnail: string | null;
    contentScanStatus: string | null;
  }

  let item = $state<NextItem | null>(null);
  let loading = $state(true);
  let working = $state(false);

  async function loadNext() {
    loading = true;
    try {
      const res = await fetch('/api/admin/content?status=submitted&limit=1');
      if (res.ok) {
        const body = await res.json();
        const list = Array.isArray(body) ? body : (body.items ?? body.content ?? []);
        item = list[0] ?? null;
      }
    } finally {
      loading = false;
    }
  }

  onMount(loadNext);

  async function decide(decision: 'approved' | 'rejected') {
    if (!item || working) return;
    working = true;
    try {
      const res = await fetch(`/api/admin/content/${item.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: decision })
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Decision failed');
      toast.success(decision === 'approved' ? 'Approved' : 'Rejected');
      await loadNext();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      working = false;
    }
  }

  function done() {
    closeSlideOver('approve-next-review');
  }
</script>

<div class="p-4 space-y-4">
  {#if loading}
    <div class="text-center text-muted-foreground py-12">
      <Loader2 class="w-5 h-5 mx-auto animate-spin" />
    </div>
  {:else if !item}
    <div class="text-center py-12 space-y-3">
      <Check class="w-8 h-8 text-green-400 mx-auto" />
      <p class="text-sm text-foreground">Review queue is empty.</p>
      <button type="button" onclick={done} class="text-xs text-muted-foreground hover:text-foreground underline">
        Close panel
      </button>
    </div>
  {:else}
    {#if item.thumbnail}
      <img src={item.thumbnail} alt="" class="w-full aspect-video object-cover rounded-md bg-black/30" />
    {/if}

    <div>
      <h3 class="text-base font-semibold text-foreground">{item.title}</h3>
      {#if item.creatorName}
        <p class="text-xs text-muted-foreground mt-0.5">{item.creatorName}</p>
      {/if}
    </div>

    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="surface-1 rounded px-2 py-1.5">
        <div class="text-[10px] uppercase text-muted-foreground">Age</div>
        <div class="text-foreground">{item.ageRating ?? '—'}</div>
      </div>
      <div class="surface-1 rounded px-2 py-1.5">
        <div class="text-[10px] uppercase text-muted-foreground">Duration</div>
        <div class="text-foreground">{item.duration ?? '—'}</div>
      </div>
      <div class="surface-1 rounded px-2 py-1.5 col-span-2">
        <div class="text-[10px] uppercase text-muted-foreground">Scan</div>
        <div class="text-foreground">{item.contentScanStatus ?? 'idle'}</div>
      </div>
    </div>

    {#if item.description}
      <p class="text-xs text-foreground/80 line-clamp-5">{item.description}</p>
    {/if}

    <a
      href={`/admin/review/${item.id}`}
      class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
    >
      Open full review <ExternalLink class="w-3 h-3" />
    </a>

    <div class="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
      <button
        type="button"
        onclick={() => decide('approved')}
        disabled={working}
        class="px-2 py-2 rounded bg-green-600/20 hover:bg-green-600/30 text-green-100 text-xs font-medium disabled:opacity-50 inline-flex items-center justify-center gap-1"
      >
        <Check class="w-3.5 h-3.5" /> Approve
      </button>
      <button
        type="button"
        onclick={() => decide('rejected')}
        disabled={working}
        class="px-2 py-2 rounded bg-red-600/20 hover:bg-red-600/30 text-red-100 text-xs font-medium disabled:opacity-50 inline-flex items-center justify-center gap-1"
      >
        <X class="w-3.5 h-3.5" /> Reject
      </button>
      <button
        type="button"
        onclick={loadNext}
        disabled={working}
        class="px-2 py-2 rounded bg-white/5 hover:bg-white/10 text-foreground text-xs font-medium disabled:opacity-50 inline-flex items-center justify-center gap-1"
      >
        <SkipForward class="w-3.5 h-3.5" /> Skip
      </button>
    </div>
  {/if}
</div>
