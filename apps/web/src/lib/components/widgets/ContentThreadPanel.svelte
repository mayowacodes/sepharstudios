<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Send, Paperclip, MessageSquare } from '@lucide/svelte';
  import { announce } from '$lib/stores/live-region';

  interface ThreadMessage {
    id: string;
    message: string;
    subject?: string | null;
    type: string;
    status: string;
    isFromAdmin: boolean;
    attachments: string[];
    createdAt: string;
    senderName: string | null;
    senderImage: string | null;
  }

  interface Props {
    contentId: string;
    /** 'admin' renders the admin variant (admin on right, creator on left).
     *  'creator' renders the creator variant (creator on right, admin on left). */
    variant: 'admin' | 'creator';
  }

  let { contentId, variant }: Props = $props();

  let messages = $state<ThreadMessage[]>([]);
  let loading = $state(true);
  let sending = $state(false);
  let composeText = $state('');
  let listEl = $state<HTMLElement | null>(null);

  const baseUrl = $derived(
    variant === 'admin'
      ? `/api/admin/content/${contentId}/thread`
      : `/api/creator/content/${contentId}/thread`
  );

  async function load() {
    loading = true;
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error ?? 'Failed to load thread');
        return;
      }
      const body = await res.json();
      messages = body.messages ?? [];
      await tick();
      if (listEl) listEl.scrollTop = listEl.scrollHeight;
    } finally {
      loading = false;
    }
  }

  async function send() {
    const text = composeText.trim();
    if (!text || sending) return;
    sending = true;
    try {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to send');
      }
      composeText = '';
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Send failed');
    } finally {
      sending = false;
    }
  }

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return new Date(iso).toLocaleDateString();
  }

  function isMine(m: ThreadMessage): boolean {
    if (variant === 'admin') return m.isFromAdmin;
    return !m.isFromAdmin;
  }

  function initial(name: string | null): string {
    return (name ?? '?').trim().charAt(0).toUpperCase();
  }

  // Real-time SSE subscription. Re-loads the thread whenever the other
   // party posts so both sides see the message immediately.
  let sse: EventSource | null = null;
  onMount(() => {
    const streamUrl = variant === 'admin'
      ? `/api/admin/content/${contentId}/thread/stream`
      : `/api/creator/content/${contentId}/thread/stream`;
    try {
      sse = new EventSource(streamUrl);
      sse.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data) as { type?: string };
          if (event.type === 'new-message') {
            announce(variant === 'admin' ? 'New reply from creator.' : 'New note from admin.');
            void load();
          }
        } catch { /* ignore */ }
      };
    } catch { /* EventSource not available */ }
  });
  onDestroy(() => {
    if (sse) { sse.close(); sse = null; }
  });

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void send();
    }
  }

  onMount(() => { void load(); });
</script>

<div class="surface-1 rounded-xl flex flex-col" style="min-height: 360px; max-height: 600px;">
  <header class="px-4 py-3 border-b border-white/10 flex items-center gap-2">
    <MessageSquare class="w-4 h-4 text-purple-300" />
    <h3 class="text-sm font-semibold text-white">
      {variant === 'admin' ? 'Discussion with creator' : 'Notes from admin'}
    </h3>
    {#if messages.length > 0}
      <span class="text-xs text-gray-500 ml-auto">{messages.length} message{messages.length === 1 ? '' : 's'}</span>
    {/if}
  </header>

  <div bind:this={listEl} class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
    {#if loading}
      <div class="text-center text-gray-400 text-sm py-8">Loading…</div>
    {:else if messages.length === 0}
      <div class="text-center text-gray-400 text-sm py-8">
        No messages yet. Start the conversation below.
      </div>
    {:else}
      {#each messages as m (m.id)}
        {@const mine = isMine(m)}
        <div class="flex gap-2 {mine ? 'flex-row-reverse' : ''}">
          <div class="shrink-0">
            {#if m.senderImage}
              <img src={m.senderImage} alt="" class="w-7 h-7 rounded-full object-cover" />
            {:else}
              <div class="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                {initial(m.senderName)}
              </div>
            {/if}
          </div>
          <div class="flex-1 max-w-[80%] {mine ? 'text-right' : ''}">
            <div class="text-xs text-gray-400 mb-1">
              <span class="text-gray-300">{m.senderName ?? (m.isFromAdmin ? 'Admin' : 'Creator')}</span>
              <span class="text-gray-500"> · {relativeTime(m.createdAt)}</span>
              {#if m.isFromAdmin}
                <span class="ml-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide bg-red-600/30 text-red-200">Admin</span>
              {/if}
            </div>
            <div class="inline-block text-left rounded-lg px-3 py-2 text-sm whitespace-pre-line {mine ? 'bg-purple-600/30 text-purple-50' : 'bg-white/10 text-gray-100'}">
              {m.message}
            </div>
            {#if m.attachments && m.attachments.length > 0}
              <div class="mt-1 flex flex-wrap gap-1 {mine ? 'justify-end' : ''}">
                {#each m.attachments as url (url)}
                  <a href={url} target="_blank" rel="noopener" class="text-xs px-2 py-0.5 rounded bg-blue-600/30 text-blue-200 inline-flex items-center gap-1">
                    <Paperclip class="w-3 h-3" />Attachment
                  </a>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <footer class="border-t border-white/10 p-3 space-y-2">
    <textarea
      bind:value={composeText}
      onkeydown={onKeydown}
      placeholder={variant === 'admin' ? 'Write a note to the creator…' : 'Reply to admin…'}
      rows="2"
      class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
    ></textarea>
    <div class="flex items-center justify-between">
      <span class="text-[11px] text-gray-500">Ctrl + Enter to send</span>
      <button
        type="button"
        onclick={send}
        disabled={sending || !composeText.trim()}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm"
      >
        <Send class="w-3.5 h-3.5" />
        {sending ? 'Sending…' : 'Send'}
      </button>
    </div>
  </footer>
</div>
