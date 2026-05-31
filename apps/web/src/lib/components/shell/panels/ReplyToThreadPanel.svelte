<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Loader2, Send } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { closeSlideOver } from '../slide-over-store';

  /**
   * Quick reply to the most recent admin↔creator content thread. Surfaces
   * the most recently updated unread thread, shows the last few messages,
   * and lets the creator reply without leaving the current page. If no
   * thread exists, suggests visiting the inbox.
   */

  interface ThreadMessage {
    id: string;
    body: string;
    fromAdmin: boolean;
    createdAt: string;
  }

  interface Thread {
    contentId: string;
    contentTitle: string;
    messages: ThreadMessage[];
  }

  let thread = $state<Thread | null>(null);
  let loading = $state(true);
  let reply = $state('');
  let sending = $state(false);
  let listEl: HTMLDivElement | null = $state(null);

  onMount(async () => {
    try {
      const res = await fetch('/api/creator/messages?status=unread&limit=1');
      if (res.ok) {
        const body = await res.json();
        const first = (body.messages ?? body.items ?? [])[0];
        if (first?.contentId) {
          await loadThread(first.contentId);
        }
      }
    } finally {
      loading = false;
    }
  });

  async function loadThread(contentId: string) {
    try {
      const res = await fetch(`/api/creator/content/${contentId}/thread`);
      if (!res.ok) return;
      const body = await res.json();
      thread = {
        contentId,
        contentTitle: body.contentTitle ?? 'Content thread',
        messages: (body.messages ?? []).map((m: { id: string; body: string; isFromAdmin?: boolean; fromAdmin?: boolean; createdAt: string }) => ({
          id: m.id,
          body: m.body,
          fromAdmin: m.isFromAdmin ?? m.fromAdmin ?? false,
          createdAt: m.createdAt
        }))
      };
      await tick();
      if (listEl) listEl.scrollTop = listEl.scrollHeight;
    } catch { /* silent */ }
  }

  async function send() {
    if (!thread || !reply.trim() || sending) return;
    sending = true;
    try {
      const res = await fetch(`/api/creator/content/${thread.contentId}/thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply.trim() })
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Reply failed');
      toast.success('Reply sent');
      reply = '';
      await loadThread(thread.contentId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reply failed');
    } finally {
      sending = false;
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void send();
    }
  }
</script>

<div class="flex flex-col h-full">
  {#if loading}
    <div class="flex-1 flex items-center justify-center text-muted-foreground">
      <Loader2 class="w-5 h-5 animate-spin" />
    </div>
  {:else if !thread}
    <div class="p-4 text-center space-y-3">
      <p class="text-sm text-muted-foreground">No unread threads.</p>
      <a href="/creator/inbox" class="text-xs text-primary hover:underline">Open inbox →</a>
      <button type="button" onclick={() => closeSlideOver('reply-to-thread')} class="block text-xs text-muted-foreground hover:text-foreground underline mx-auto">
        Close
      </button>
    </div>
  {:else}
    <header class="p-3 border-b border-border/40 shrink-0">
      <div class="text-xs uppercase tracking-wide text-muted-foreground">On content</div>
      <div class="text-sm text-foreground truncate font-medium">{thread.contentTitle}</div>
    </header>

    <div bind:this={listEl} class="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
      {#each thread.messages as m (m.id)}
        <div class="flex {m.fromAdmin ? 'justify-start' : 'justify-end'}">
          <div class="max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs {m.fromAdmin ? 'surface-1 text-foreground' : 'bg-primary text-primary-foreground'}">
            <div class="whitespace-pre-line">{m.body}</div>
            <div class="text-[10px] opacity-60 mt-0.5">{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        </div>
      {/each}
    </div>

    <footer class="border-t border-border/40 p-2 shrink-0">
      <div class="relative">
        <textarea
          bind:value={reply}
          onkeydown={onKeydown}
          rows="2"
          placeholder="Type a reply… ⌘+Enter to send"
          class="w-full surface-1 rounded-md pl-2.5 pr-8 py-1.5 text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground"
        ></textarea>
        <button
          type="button"
          onclick={send}
          disabled={sending || !reply.trim()}
          class="absolute right-1.5 bottom-1.5 text-primary hover:opacity-80 disabled:opacity-40"
          aria-label="Send reply"
        >
          {#if sending}<Loader2 class="w-3.5 h-3.5 animate-spin" />{:else}<Send class="w-3.5 h-3.5" />{/if}
        </button>
      </div>
    </footer>
  {/if}
</div>
