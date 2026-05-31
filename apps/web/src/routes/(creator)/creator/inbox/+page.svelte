<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Inbox, Archive, MailOpen, CheckCircle2 } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import EmptyState from '$lib/components/dashboard/EmptyState.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  type Filter = 'unread' | 'all' | 'archived';

  interface Message {
    id: string;
    subject: string;
    message: string;
    type: string;
    status: string;
    isFromAdmin: boolean;
    attachments: string[];
    contentId: string | null;
    contentTitle: string | null;
    adminId: string | null;
    adminName: string | null;
    createdAt: string;
  }

  let filter = $state<Filter>('unread');
  let messages = $state<Message[]>([]);
  let loading = $state(true);
  let expanded = $state<Record<string, boolean>>({});

  // Bulk-archive selection state. We only allow archive (not delete) from
  // the bulk bar — the audit trail in adminMessages is intentionally
  // append-only on the creator side.
  let selected = $state<Record<string, boolean>>({});
  let bulkBusy = $state(false);
  const selectedIds = $derived(Object.keys(selected).filter((id) => selected[id]));
  const allVisibleSelected = $derived(
    messages.length > 0 && messages.every((m) => selected[m.id])
  );

  function toggleSelected(id: string, e: Event) {
    e.stopPropagation();
    selected[id] = !selected[id];
    selected = { ...selected };
  }
  function toggleSelectAll() {
    if (allVisibleSelected) {
      selected = {};
    } else {
      selected = Object.fromEntries(messages.map((m) => [m.id, true]));
    }
  }
  async function bulkArchive() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Archive ${selectedIds.length} message${selectedIds.length > 1 ? 's' : ''}?`)) return;
    bulkBusy = true;
    try {
      const res = await fetch('/api/creator/messages/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action: 'archive' })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Bulk archive failed');
      toast.success(`Archived ${body.updated ?? selectedIds.length} message${(body.updated ?? selectedIds.length) === 1 ? '' : 's'}`);
      selected = {};
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bulk archive failed');
    } finally {
      bulkBusy = false;
    }
  }

  async function load() {
    loading = true;
    try {
      const res = await fetch(`/api/creator/messages?status=${filter}`);
      const body = await res.json();
      messages = body.messages ?? [];
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    filter;
    // Switching filters clears any leftover selections so the bulk bar
    // doesn't show counts for messages no longer on screen.
    selected = {};
    void load();
  });

  onMount(load);

  async function toggleMessage(m: Message) {
    expanded[m.id] = !expanded[m.id];
    expanded = { ...expanded };
    if (expanded[m.id] && m.status === 'sent') {
      // Mark read on first open
      await fetch(`/api/creator/messages/${m.id}/read`, { method: 'PATCH' });
      m.status = 'read';
      messages = [...messages];
    }
  }

  async function archive(id: string) {
    const res = await fetch(`/api/creator/messages/${id}/archive`, { method: 'PATCH' });
    if (res.ok) {
      messages = messages.filter((m) => m.id !== id);
      toast.success('Archived');
    } else {
      toast.error('Failed to archive');
    }
  }

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return new Date(iso).toLocaleDateString();
  }
</script>

<div class="container mx-auto py-8 px-4 max-w-3xl space-y-6">
  <PageHeader
    icon={Inbox}
    title="Inbox"
    subtitle="Messages from Sephar Studios about your content, applications, and account."
  />

  <div class="flex flex-wrap gap-2 items-center">
    {#each (['unread', 'all', 'archived'] as Filter[]) as f (f)}
      <button
        type="button"
        onclick={() => filter = f}
        class="px-4 py-2 rounded-lg text-sm capitalize transition-colors {filter === f ? 'bg-primary text-primary-foreground' : 'surface-1 text-foreground/80 hover:surface-2'}"
      >{f}</button>
    {/each}
    {#if messages.length > 0 && filter !== 'archived'}
      <button
        type="button"
        onclick={toggleSelectAll}
        class="ml-auto text-xs text-muted-foreground hover:text-foreground underline"
      >{allVisibleSelected ? 'Clear selection' : 'Select all visible'}</button>
    {/if}
  </div>

  {#if selectedIds.length > 0}
    <div class="sticky top-4 z-20 surface-2 border border-purple-500/40 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
      <span class="text-sm text-foreground font-medium">{selectedIds.length} selected</span>
      <div class="flex gap-2 ml-auto">
        <button
          type="button"
          onclick={bulkArchive}
          disabled={bulkBusy}
          class="px-3 py-1.5 rounded text-xs bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white inline-flex items-center gap-1"
        >
          <Archive class="w-3 h-3" />{bulkBusy ? 'Archiving…' : 'Archive selected'}
        </button>
        <button
          type="button"
          onclick={() => (selected = {})}
          class="px-3 py-1.5 rounded text-xs surface-1 hover:surface-2 text-foreground"
        >Clear</button>
      </div>
    </div>
  {/if}

  {#if loading}
    <div class="space-y-2">
      {#each Array(3) as _, i (i)}
        <Skeleton class="h-16 rounded-xl" />
      {/each}
    </div>
  {:else if messages.length === 0}
    <EmptyState
      icon={filter === 'unread' ? CheckCircle2 : Inbox}
      title={filter === 'unread' ? "You're all caught up." : filter === 'archived' ? 'Nothing archived.' : 'No messages yet.'}
      description={filter === 'unread' ? 'New notes from the admin team will appear here.' : undefined}
      tone={filter === 'unread' ? 'success' : 'default'}
    />
  {:else}
    <ul class="space-y-2">
      {#each messages as m (m.id)}
        <li class="surface-1 border border-border/40 rounded-xl overflow-hidden {selected[m.id] ? 'ring-2 ring-purple-500' : ''}">
          <div class="flex items-start">
            {#if filter !== 'archived'}
              <div class="pl-4 pt-4">
                <input
                  type="checkbox"
                  checked={!!selected[m.id]}
                  onclick={(e) => toggleSelected(m.id, e)}
                  onchange={(e) => e.stopPropagation()}
                  class="w-4 h-4 accent-purple-500"
                  aria-label={`Select ${m.subject}`}
                />
              </div>
            {/if}
          <button
            type="button"
            onclick={() => toggleMessage(m)}
            class="flex-1 min-w-0 text-left px-4 py-3 hover:surface-2 transition-colors"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  {#if m.status === 'sent'}
                    <span class="w-2 h-2 rounded-full bg-purple-400" title="Unread"></span>
                  {/if}
                  <span class="text-foreground font-medium truncate">{m.subject}</span>
                  <span class="text-xs px-2 py-0.5 rounded surface-2 text-foreground/80 capitalize">{m.type}</span>
                </div>
                <div class="text-xs text-muted-foreground mt-0.5">
                  From {m.adminName ?? 'Sephar Studios'}
                  {#if m.contentTitle}· re: <a href={`/creator/content/${m.contentId}`} class="text-purple-300 hover:text-purple-200">{m.contentTitle}</a>{/if}
                  · {relativeTime(m.createdAt)}
                </div>
                {#if !expanded[m.id]}
                  <p class="text-sm text-foreground/80 mt-1 line-clamp-1">{m.message}</p>
                {/if}
              </div>
              {#if m.status !== 'archived'}
                <MailOpen class="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              {:else}
                <Archive class="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              {/if}
            </div>
          </button>
          </div>
          {#if expanded[m.id]}
            <div class="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
              <p class="text-sm text-foreground/90 whitespace-pre-line">{m.message}</p>
              {#if m.attachments && m.attachments.length > 0}
                <div class="flex flex-wrap gap-2">
                  {#each m.attachments as url (url)}
                    <a href={url} target="_blank" rel="noopener" class="text-xs px-2 py-1 rounded bg-blue-600/30 text-blue-200 hover:bg-blue-600/50">📎 Attachment</a>
                  {/each}
                </div>
              {/if}
              <div class="flex gap-2">
                {#if m.status !== 'archived'}
                  <button type="button" onclick={() => archive(m.id)} class="text-xs surface-2 hover:surface-3 text-foreground px-3 py-1.5 rounded">Archive</button>
                {/if}
                {#if m.contentId}
                  <a href={`/creator/content/${m.contentId}`} class="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded">Open content</a>
                {/if}
              </div>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
