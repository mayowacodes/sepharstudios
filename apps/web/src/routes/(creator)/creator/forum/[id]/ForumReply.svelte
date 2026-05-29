<script lang="ts">
  import Self from './ForumReply.svelte';

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

  interface Props {
    reply: ReplyNode;
    isAdmin: boolean;
    depth?: number;
    onReload: () => Promise<void>;
  }

  let { reply, isAdmin, depth = 0, onReload }: Props = $props();

  let replyOpen = $state(false);
  let replyText = $state('');
  let posting = $state(false);
  let postError = $state('');

  async function toggleLike() {
    const method = reply.likedByMe ? 'DELETE' : 'POST';
    const res = await fetch(`/api/forum/replies/${reply.id}/like`, { method });
    if (!res.ok) return;
    const body = await res.json();
    reply.likedByMe = !!body.liked;
    reply.likeCount = body.likeCount ?? reply.likeCount;
  }

  async function submitReply() {
    if (!replyText.trim()) return;
    posting = true;
    postError = '';
    try {
      const res = await fetch(`/api/forum/threads/${reply.threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyText, parentReplyId: reply.id })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Reply failed');
      replyText = '';
      replyOpen = false;
      await onReload();
    } catch (err) {
      postError = err instanceof Error ? err.message : 'Reply failed';
    } finally {
      posting = false;
    }
  }

  async function deleteReply() {
    if (!confirm('Delete this reply?')) return;
    const res = await fetch(`/api/forum/replies/${reply.id}`, { method: 'DELETE' });
    if (res.ok) await onReload();
  }

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
    return `${Math.floor(diff / 86_400_000)}d`;
  }
</script>

<div class="bg-white/5 border border-white/10 rounded-lg p-3 {depth > 0 ? 'ml-6' : ''}">
  <div class="flex items-start gap-3">
    <div class="bg-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-bold shrink-0">
      {(reply.authorName ?? '?').charAt(0).toUpperCase()}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 text-xs text-gray-400 mb-1">
        <strong class="text-purple-300">{reply.authorName ?? 'unknown'}</strong>
        <span>·</span>
        <span>{relativeTime(reply.createdAt)}</span>
        {#if reply.status === 'hidden'}
          <span class="text-yellow-400">(pending review)</span>
        {/if}
      </div>
      <p class="text-gray-100 text-sm whitespace-pre-line">{reply.body}</p>

      <div class="flex items-center gap-4 mt-2 text-xs">
        <button
          type="button"
          onclick={toggleLike}
          class="flex items-center gap-1 hover:text-pink-300 transition-colors {reply.likedByMe ? 'text-pink-400' : 'text-gray-400'}"
        >
          <span>❤️</span><span>{reply.likeCount}</span>
        </button>
        <button
          type="button"
          onclick={() => replyOpen = !replyOpen}
          class="text-gray-400 hover:text-white"
        >Reply</button>
        {#if isAdmin || reply.status === 'published'}
          <button
            type="button"
            onclick={deleteReply}
            class="text-red-300 hover:text-red-100"
          >Delete</button>
        {/if}
      </div>

      {#if replyOpen}
        <form class="mt-3 space-y-2" onsubmit={(e) => { e.preventDefault(); submitReply(); }}>
          <textarea
            bind:value={replyText}
            rows="2"
            class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500"
            placeholder="Reply…"
          ></textarea>
          {#if postError}<p class="text-red-300 text-xs">{postError}</p>{/if}
          <div class="flex justify-end gap-2">
            <button type="button" onclick={() => replyOpen = false} class="text-xs text-gray-300">Cancel</button>
            <button
              type="submit"
              disabled={posting || !replyText.trim()}
              class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded"
            >
              {posting ? 'Posting…' : 'Send'}
            </button>
          </div>
        </form>
      {/if}

      {#if reply.children.length > 0}
        <div class="mt-3 space-y-2">
          {#each reply.children as child (child.id)}
            <Self reply={child} {isAdmin} depth={depth + 1} {onReload} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
