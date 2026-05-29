<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ForumReply from './ForumReply.svelte';

  interface ReplyNode {
    id: string;
    threadId: string;
    parentReplyId: string | null;
    authorId: string;
    authorName: string | null;
    authorImage: string | null;
    body: string;
    likeCount: number;
    status: string;
    createdAt: string;
    likedByMe: boolean;
    children: ReplyNode[];
  }

  interface Thread {
    id: string;
    authorId: string;
    title: string;
    category: string;
    body: string;
    isSticky: boolean;
    isLocked: boolean;
    likeCount: number;
    replyCount: number;
    status: string;
    createdAt: string;
    authorName: string | null;
    authorImage: string | null;
    likedByMe: boolean;
  }

  let thread = $state<Thread | null>(null);
  let replies = $state<ReplyNode[]>([]);
  let isAuthor = $state(false);
  let isAdmin = $state(false);
  let loading = $state(true);

  let newReply = $state('');
  let posting = $state(false);
  let postError = $state('');

  const threadId = $derived($page.params.id);

  $effect(() => {
    threadId; // re-run when route changes
    void load();
  });

  async function load() {
    loading = true;
    try {
      const res = await fetch(`/api/forum/threads/${threadId}`);
      if (!res.ok) {
        thread = null;
        return;
      }
      const body = await res.json();
      thread = body.thread;
      replies = body.replies;
      isAuthor = body.isAuthor;
      isAdmin = body.isAdmin;
    } finally {
      loading = false;
    }
  }

  async function toggleThreadLike() {
    if (!thread) return;
    const method = thread.likedByMe ? 'DELETE' : 'POST';
    const res = await fetch(`/api/forum/threads/${thread.id}/like`, { method });
    if (res.status === 401) {
      goto(`/auth/login?redirectTo=/creator/forum/${thread.id}`);
      return;
    }
    const body = await res.json();
    if (thread) {
      thread.likedByMe = !!body.liked;
      thread.likeCount = body.likeCount ?? thread.likeCount;
    }
  }

  async function postReply(parentReplyId: string | null) {
    if (!thread || !newReply.trim()) return;
    posting = true;
    postError = '';
    try {
      const res = await fetch(`/api/forum/threads/${thread.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newReply, parentReplyId })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Reply failed');
      newReply = '';
      await load();
    } catch (err) {
      postError = err instanceof Error ? err.message : 'Reply failed';
    } finally {
      posting = false;
    }
  }

  async function deleteThread() {
    if (!thread) return;
    if (!confirm('Delete this thread? This cannot be undone.')) return;
    const res = await fetch(`/api/forum/threads/${thread.id}`, { method: 'DELETE' });
    if (res.ok) goto('/creator/forum');
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

<div class="max-w-4xl mx-auto py-6 space-y-6">
  <a href="/creator/forum" class="text-purple-400 hover:text-purple-300 text-sm">← Back to forum</a>

  {#if loading}
    <div class="text-center text-gray-400 py-12">Loading…</div>
  {:else if !thread}
    <div class="bg-red-600/20 border border-red-600 text-red-100 rounded-lg p-6 text-center">
      Thread not found or has been removed.
    </div>
  {:else}
    <!-- Thread header -->
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap mb-2">
            {#if thread.isSticky}<span class="text-yellow-400">📌</span>{/if}
            {#if thread.isLocked}<span class="text-red-400">🔒</span>{/if}
            <h1 class="text-2xl font-bold text-white">{thread.title}</h1>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-400">
            <span>by <strong class="text-purple-400">{thread.authorName ?? 'unknown'}</strong></span>
            <span>•</span>
            <span>{relativeTime(thread.createdAt)}</span>
            <span>•</span>
            <span class="capitalize">{thread.category.replace('-', ' ')}</span>
          </div>
        </div>
        {#if isAuthor || isAdmin}
          <button type="button" onclick={deleteThread} class="text-red-300 hover:text-red-100 text-sm">Delete</button>
        {/if}
      </div>

      <p class="text-gray-200 whitespace-pre-line">{thread.body}</p>

      <div class="flex items-center gap-4 text-sm">
        <button
          type="button"
          onclick={toggleThreadLike}
          class="flex items-center gap-1 hover:text-pink-300 transition-colors {thread.likedByMe ? 'text-pink-400' : 'text-gray-300'}"
        >
          <span>❤️</span>
          <span>{thread.likeCount}</span>
        </button>
        <span class="text-gray-400 flex items-center gap-1">
          <span>💬</span><span>{thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}</span>
        </span>
      </div>
    </div>

    <!-- Reply form -->
    {#if !thread.isLocked}
      <form
        class="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3"
        onsubmit={(e) => { e.preventDefault(); postReply(null); }}
      >
        <label for="reply-body" class="text-sm font-medium text-white">Add a reply</label>
        <textarea
          id="reply-body"
          bind:value={newReply}
          rows="3"
          minlength="3"
          maxlength="5000"
          required
          class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
          placeholder="Share your thoughts…"
        ></textarea>
        {#if postError}<p class="text-red-300 text-xs">{postError}</p>{/if}
        <div class="flex justify-end">
          <button
            type="submit"
            disabled={posting || !newReply.trim()}
            class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg"
          >
            {posting ? 'Posting…' : 'Reply'}
          </button>
        </div>
      </form>
    {:else}
      <div class="bg-red-600/10 border border-red-600/40 text-red-200 rounded-lg p-4 text-sm">
        🔒 This thread is locked. New replies are disabled.
      </div>
    {/if}

    <!-- Replies (nested) -->
    {#if replies.length === 0}
      <div class="text-center text-gray-400 py-6">No replies yet — be the first.</div>
    {:else}
      <div class="space-y-3">
        {#each replies as reply (reply.id)}
          <ForumReply {reply} {isAdmin} onReload={load} />
        {/each}
      </div>
    {/if}
  {/if}
</div>
