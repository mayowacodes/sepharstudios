<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Inbox, Archive, MailOpen } from '@lucide/svelte';

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
  <div class="flex items-center gap-3">
    <Inbox class="w-7 h-7 text-purple-300" />
    <h1 class="text-2xl font-bold text-white">Inbox</h1>
  </div>
  <p class="text-sm text-gray-400">
    Messages from Sephar Studios about your content, applications, and account.
  </p>

  <div class="flex flex-wrap gap-2">
    {#each (['unread', 'all', 'archived'] as Filter[]) as f (f)}
      <button
        type="button"
        onclick={() => filter = f}
        class="px-4 py-2 rounded-lg text-sm capitalize {filter === f ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/15'}"
      >{f}</button>
    {/each}
  </div>

  {#if loading}
    <div class="text-center text-gray-400 py-12">Loading…</div>
  {:else if messages.length === 0}
    <div class="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-gray-400">
      {filter === 'unread' ? "You're all caught up." :
       filter === 'archived' ? 'Nothing archived.' : 'No messages yet.'}
    </div>
  {:else}
    <ul class="space-y-2">
      {#each messages as m (m.id)}
        <li class="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <button
            type="button"
            onclick={() => toggleMessage(m)}
            class="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  {#if m.status === 'sent'}
                    <span class="w-2 h-2 rounded-full bg-purple-400" title="Unread"></span>
                  {/if}
                  <span class="text-white font-medium truncate">{m.subject}</span>
                  <span class="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 capitalize">{m.type}</span>
                </div>
                <div class="text-xs text-gray-400 mt-0.5">
                  From {m.adminName ?? 'Sephar Studios'}
                  {#if m.contentTitle}· re: <a href={`/creator/content/${m.contentId}`} class="text-purple-300 hover:text-purple-200">{m.contentTitle}</a>{/if}
                  · {relativeTime(m.createdAt)}
                </div>
                {#if !expanded[m.id]}
                  <p class="text-sm text-gray-300 mt-1 line-clamp-1">{m.message}</p>
                {/if}
              </div>
              {#if m.status !== 'archived'}
                <MailOpen class="w-4 h-4 text-gray-500 shrink-0 mt-1" />
              {:else}
                <Archive class="w-4 h-4 text-gray-500 shrink-0 mt-1" />
              {/if}
            </div>
          </button>
          {#if expanded[m.id]}
            <div class="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
              <p class="text-sm text-gray-200 whitespace-pre-line">{m.message}</p>
              {#if m.attachments && m.attachments.length > 0}
                <div class="flex flex-wrap gap-2">
                  {#each m.attachments as url (url)}
                    <a href={url} target="_blank" rel="noopener" class="text-xs px-2 py-1 rounded bg-blue-600/30 text-blue-200 hover:bg-blue-600/50">📎 Attachment</a>
                  {/each}
                </div>
              {/if}
              <div class="flex gap-2">
                {#if m.status !== 'archived'}
                  <button type="button" onclick={() => archive(m.id)} class="text-xs bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 rounded">Archive</button>
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
