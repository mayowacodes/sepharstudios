<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { Pin, Send, Trash2, EyeOff, CheckCircle2 } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { announce } from '$lib/stores/live-region';

  interface ChatMessage {
    id: string;
    body: string;
    status: string;
    pinned: boolean;
    createdAt: string;
    authorId: string;
    authorName: string | null;
    authorImage: string | null;
  }

  interface Props {
    streamId: string;
    /** True when the signed-in user can moderate (creator or admin). */
    canModerate?: boolean;
  }

  let { streamId, canModerate = false }: Props = $props();

  let messages = $state<ChatMessage[]>([]);
  let loading = $state(true);
  let composeText = $state('');
  let sending = $state(false);
  let listEl: HTMLDivElement | null = $state(null);
  let sse: EventSource | null = null;

  // Track scroll position so we only announce() new messages to assistive
  // tech when the user can't see them already (i.e. they've scrolled up,
  // OR the page isn't focused). Default true so initial mount doesn't
  // spam announcements.
  let isAtBottom = $state(true);

  // Derived: pinned messages first, then chronological published. Hidden
  // messages only show to mods; removed never show.
  const visible = $derived.by(() => {
    const filtered = messages.filter((m) => m.status !== 'removed' && (canModerate || m.status === 'published'));
    const pinned = filtered.filter((m) => m.pinned);
    const rest = filtered.filter((m) => !m.pinned);
    return [...pinned, ...rest];
  });

  // Pending-moderation count — mods see a badge they can click to focus
  // the first pending message. Viewers never see pending messages so this
  // is always 0 for them.
  const pendingCount = $derived(canModerate ? messages.filter((m) => m.status === 'pending').length : 0);

  function onScroll() {
    if (!listEl) return;
    // "At bottom" with a 40px slack so a tiny scroll-up still counts as
    // following along.
    isAtBottom = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight < 40;
  }

  function jumpToFirstPending() {
    if (!listEl) return;
    const pending = listEl.querySelector('[data-pending="1"]') as HTMLElement | null;
    if (pending) pending.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function load() {
    loading = true;
    try {
      const res = await fetch(`/api/live/${streamId}/chat`);
      if (!res.ok) return;
      const body = await res.json();
      messages = body.messages ?? [];
      await tick();
      if (listEl) listEl.scrollTop = listEl.scrollHeight;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    void load();
    try {
      sse = new EventSource(`/api/live/${streamId}/chat/stream`);
      sse.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (event.type === 'new-message') {
            messages = [...messages, event as ChatMessage];
            // Only announce when the user isn't actively watching the
            // bottom of the chat (or when the page is hidden) — otherwise
            // a fast room would deafen screen-reader users.
            const pageHidden = typeof document !== 'undefined' && document.hidden;
            if (!isAtBottom || pageHidden) {
              announce(`${event.authorName ?? 'Viewer'} said ${event.body}`);
            }
            void tick().then(() => {
              if (listEl && isAtBottom) listEl.scrollTop = listEl.scrollHeight;
            });
          } else if (event.type === 'update') {
            messages = messages.map((m) => m.id === event.id
              ? { ...m, pinned: event.pinned ?? m.pinned, status: event.status ?? m.status }
              : m
            );
          } else if (event.type === 'removed') {
            messages = messages.map((m) => m.id === event.id ? { ...m, status: 'removed' } : m);
          }
        } catch { /* ignore */ }
      };
    } catch { /* EventSource unavailable */ }
  });

  onDestroy(() => { if (sse) sse.close(); });

  async function send() {
    const text = composeText.trim();
    if (!text || sending) return;
    sending = true;
    try {
      const res = await fetch(`/api/live/${streamId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Failed to send');
      composeText = '';
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Send failed');
    } finally {
      sending = false;
    }
  }

  async function modAction(m: ChatMessage, action: 'pin' | 'unpin' | 'approve' | 'hide') {
    try {
      const res = await fetch(`/api/live/${streamId}/chat/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error('Failed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    }
  }

  async function remove(m: ChatMessage) {
    if (!confirm('Remove this message?')) return;
    const res = await fetch(`/api/live/${streamId}/chat/${m.id}`, { method: 'DELETE' });
    if (!res.ok) toast.error('Remove failed');
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  function initial(name: string | null): string {
    return (name ?? '?').trim().charAt(0).toUpperCase();
  }

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return 'now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
    return new Date(iso).toLocaleDateString();
  }
</script>

<aside class="surface-1 rounded-xl flex flex-col h-full max-h-[600px]" aria-label="Live chat">
  <header class="px-3 py-2 border-b border-white/10 text-xs font-semibold text-white flex items-center gap-2">
    <span>Live chat</span>
    {#if canModerate}
      <span class="text-purple-300">· moderator</span>
    {/if}
    {#if pendingCount > 0}
      <button
        type="button"
        onclick={jumpToFirstPending}
        class="ml-auto inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors"
        aria-label={`${pendingCount} message${pendingCount === 1 ? '' : 's'} pending review`}
      >
        {pendingCount} pending
      </button>
    {/if}
  </header>

  <div bind:this={listEl} onscroll={onScroll} class="flex-1 overflow-y-auto px-2 py-2 space-y-1.5">
    {#if loading}
      <div class="text-xs text-gray-500 text-center py-6">Loading…</div>
    {:else if visible.length === 0}
      <div class="text-xs text-gray-500 text-center py-6">Say hi.</div>
    {:else}
      {#each visible as m (m.id)}
        <div
          data-pending={m.status === 'pending' ? '1' : undefined}
          class="flex items-start gap-2 group {m.status === 'pending' ? 'bg-yellow-500/10 rounded px-2 py-1' : ''} {m.status === 'hidden' ? 'opacity-50' : ''}"
        >
          {#if m.authorImage}
            <img src={m.authorImage} alt="" class="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
          {:else}
            <div class="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {initial(m.authorName)}
            </div>
          {/if}
          <div class="flex-1 min-w-0 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="font-medium text-purple-200">{m.authorName ?? 'Viewer'}</span>
              {#if m.pinned}<Pin class="w-3 h-3 text-yellow-300" aria-label="Pinned" />{/if}
              {#if m.status === 'pending'}<span class="text-yellow-300 text-[10px]">pending</span>{/if}
              {#if m.status === 'hidden'}<span class="text-red-300 text-[10px]">hidden</span>{/if}
              <span class="text-gray-500 text-[10px] ml-auto">{relativeTime(m.createdAt)}</span>
            </div>
            <div class="text-gray-100 break-words">{m.body}</div>
            {#if canModerate}
              <div class="flex gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {#if m.status === 'pending'}
                  <button type="button" onclick={() => modAction(m, 'approve')} class="text-[10px] text-green-300 hover:text-green-100 inline-flex items-center gap-0.5"><CheckCircle2 class="w-3 h-3" /> approve</button>
                {/if}
                {#if m.pinned}
                  <button type="button" onclick={() => modAction(m, 'unpin')} class="text-[10px] text-gray-300 hover:text-white">unpin</button>
                {:else}
                  <button type="button" onclick={() => modAction(m, 'pin')} class="text-[10px] text-yellow-300 hover:text-yellow-100">pin</button>
                {/if}
                {#if m.status !== 'hidden'}
                  <button type="button" onclick={() => modAction(m, 'hide')} class="text-[10px] text-orange-300 hover:text-orange-100 inline-flex items-center gap-0.5"><EyeOff class="w-3 h-3" /> hide</button>
                {/if}
                <button type="button" onclick={() => remove(m)} class="text-[10px] text-red-300 hover:text-red-100 inline-flex items-center gap-0.5"><Trash2 class="w-3 h-3" /> remove</button>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <footer class="border-t border-white/10 p-2">
    <div class="relative">
      <input
        type="text"
        bind:value={composeText}
        onkeydown={onKeydown}
        maxlength="280"
        placeholder="Say something…"
        class="w-full surface-2 rounded-lg pl-3 pr-9 py-2 text-xs text-white placeholder-gray-500"
        aria-label="Chat message"
      />
      <button
        type="button"
        onclick={send}
        disabled={sending || !composeText.trim()}
        class="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-200 disabled:opacity-40"
        aria-label="Send"
      >
        <Send class="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  </footer>
</aside>
