<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { ShieldCheck, AlertTriangle, MessageSquare } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  type Tab = 'reviews' | 'forum';
  type ReviewFilter = 'pending' | 'flagged' | 'all';

  interface ReviewRow {
    id: string;
    contentId: string;
    userId: string;
    rating: number;
    reviewText: string | null;
    isApproved: boolean;
    createdAt: string;
    reviewerName: string | null;
    reviewerImage: string | null;
    openReports: number;
    content: { id: string; title: string; thumbnail: string | null } | null;
  }

  interface ForumThread {
    id: string;
    title: string;
    isLocked: boolean;
    replyCount: number;
    createdAt: string;
  }

  interface ForumReply {
    id: string;
    threadId: string;
    body: string;
    status: string;
    authorName: string | null;
    createdAt: string;
    openReports: number;
  }

  let tab = $state<Tab>('reviews');
  let reviewFilter = $state<ReviewFilter>('pending');
  let reviews = $state<ReviewRow[]>([]);
  let threads = $state<ForumThread[]>([]);
  let replies = $state<ForumReply[]>([]);
  let loading = $state(true);
  let initialLoad = $state(true);

  async function loadReviews() {
    if (initialLoad) loading = true;
    try {
      const res = await fetch(`/api/creator/moderation/reviews?filter=${reviewFilter}`);
      if (!res.ok) {
        console.error('[moderation] loadReviews HTTP', res.status);
        reviews = [];
        return;
      }
      const body = await res.json().catch(() => ({}));
      reviews = body.reviews ?? [];
    } catch (err) {
      console.error('[moderation] loadReviews failed:', err);
      reviews = [];
    } finally {
      loading = false;
      initialLoad = false;
    }
  }

  async function loadForum() {
    if (initialLoad) loading = true;
    try {
      const res = await fetch('/api/creator/moderation/forum');
      if (!res.ok) {
        console.error('[moderation] loadForum HTTP', res.status);
        threads = [];
        replies = [];
        return;
      }
      const body = await res.json().catch(() => ({}));
      threads = body.threads ?? [];
      replies = body.replies ?? [];
    } catch (err) {
      console.error('[moderation] loadForum failed:', err);
      threads = [];
      replies = [];
    } finally {
      loading = false;
      initialLoad = false;
    }
  }

  $effect(() => {
    if (tab === 'reviews') { reviewFilter; void loadReviews(); }
    else void loadForum();
  });

  onMount(() => {
    // Ensure initial load happens immediately on mount.
    // The $effect above depends on tab/reviewFilter which are already set,
    // but we explicitly trigger here to guarantee no blank page on first render.
    if (tab === 'reviews') void loadReviews();
    else void loadForum();
  });

  async function actOnReview(id: string, action: 'approve' | 'hide') {
    const res = await fetch(`/api/creator/moderation/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    if (res.ok) {
      toast.success(action === 'approve' ? 'Review approved' : 'Review hidden');
      reviews = reviews.filter((r) => r.id !== id);
    } else {
      toast.error('Failed');
    }
  }

  // AI draft-reply state. Keyed by review id so multiple drafts can co-exist.
  let drafts = $state<Record<string, string>>({});
  let drafting = $state<Record<string, boolean>>({});

  async function draftReply(r: ReviewRow) {
    drafting[r.id] = true;
    drafting = { ...drafting };
    try {
      const res = await fetch('/api/ai/suggest/review-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: r.reviewText ?? '',
          rating: r.rating,
          contentTitle: r.content?.title ?? ''
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'AI failed');
      drafts[r.id] = body.reply ?? '';
      drafts = { ...drafts };
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI failed');
    } finally {
      drafting[r.id] = false;
      drafting = { ...drafting };
    }
  }

  function copyDraft(id: string) {
    const text = drafts[id] ?? '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => toast.success('Copied to clipboard'));
  }

  async function hideReply(id: string) {
    const res = await fetch(`/api/creator/moderation/forum/replies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'hide' })
    });
    if (res.ok) {
      toast.success('Reply hidden');
      replies = replies.map((r) => r.id === id ? { ...r, status: 'hidden' } : r);
    } else {
      toast.error('Failed');
    }
  }

  async function toggleLock(thread: ForumThread) {
    const res = await fetch(`/api/creator/moderation/forum/threads/${thread.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLocked: !thread.isLocked })
    });
    if (res.ok) {
      thread.isLocked = !thread.isLocked;
      threads = [...threads];
      toast.success(thread.isLocked ? 'Thread locked' : 'Thread unlocked');
    } else {
      toast.error('Failed');
    }
  }

  function repliesForThread(threadId: string) {
    return replies.filter((r) => r.threadId === threadId);
  }

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return new Date(iso).toLocaleDateString();
  }
</script>

<div class="mx-auto py-8 px-4 max-w-5xl space-y-6">
  <PortalHero
    compact
    eyebrow="Community"
    title="Moderation"
    subtitle="Review feedback and forum activity on your content. Hide spam, approve thoughtful reviews, or lock heated threads."
    icon={ShieldCheck}
  />

  <div class="flex gap-2">
    <button
      type="button"
      onclick={() => tab = 'reviews'}
      class="px-4 py-2 rounded-lg text-sm {tab === 'reviews' ? 'bg-purple-600 text-foreground' : 'surface-2 text-white/80 hover:surface-3'}"
    >Reviews on my content</button>
    <button
      type="button"
      onclick={() => tab = 'forum'}
      class="px-4 py-2 rounded-lg text-sm {tab === 'forum' ? 'bg-purple-600 text-foreground' : 'surface-2 text-white/80 hover:surface-3'}"
    >My forum threads</button>
  </div>

  {#if tab === 'reviews'}
    <div class="flex flex-wrap gap-2">
      {#each (['pending', 'flagged', 'all'] as ReviewFilter[]) as f (f)}
        <button
          type="button"
          onclick={() => reviewFilter = f}
          class="px-3 py-1.5 rounded text-xs capitalize {reviewFilter === f ? 'bg-purple-700 text-foreground' : 'surface-1 text-white/80 hover:surface-2'}"
        >{f}</button>
      {/each}
    </div>

    {#if loading}
      <div class="space-y-2">
        {#each Array(3) as _, i (i)}
          <Skeleton class="h-24 rounded-xl" />
        {/each}
      </div>
    {:else if reviews.length === 0}
      <div class="surface-1 border border-border/40 rounded-xl p-12 text-center text-muted-foreground">
        Nothing to moderate.
      </div>
    {:else}
      <ul class="space-y-3">
        {#each reviews as r (r.id)}
          <li class="surface-1 border border-border/40 rounded-xl p-4 space-y-3">
            <div class="flex items-start gap-3">
              {#if r.content?.thumbnail}
                <img src={r.content.thumbnail} alt="" class="w-16 h-10 rounded object-cover" />
              {/if}
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{r.reviewerName ?? 'Unknown'}</span>
                  <span>·</span>
                  <span>{relativeTime(r.createdAt)}</span>
                  <span>·</span>
                  <span class="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  {#if r.openReports > 0}
                    <span class="inline-flex items-center gap-1 text-red-300">
                      <AlertTriangle class="w-3 h-3" />{r.openReports} flag{r.openReports > 1 ? 's' : ''}
                    </span>
                  {/if}
                </div>
                {#if r.content}
                  <a href={`/creator/content/${r.content.id}`} class="text-xs text-purple-300 hover:text-purple-200">{r.content.title}</a>
                {/if}
                {#if r.reviewText}
                  <p class="text-sm text-foreground/90 mt-1 whitespace-pre-line">{r.reviewText}</p>
                {/if}
              </div>
            </div>
            {#if drafts[r.id]}
              <div class="surface-1 rounded p-3 space-y-2">
                <div class="text-[10px] uppercase tracking-wide text-purple-300">AI draft reply</div>
                <textarea
                  bind:value={drafts[r.id]}
                  rows="2"
                  class="w-full text-sm surface-1 border border-border/40 rounded px-2 py-1.5 text-foreground resize-none"
                ></textarea>
                <div class="flex gap-2 justify-end text-xs">
                  <button type="button" onclick={() => copyDraft(r.id)} class="text-purple-300 hover:text-purple-200">Copy</button>
                  <button type="button" onclick={() => { drafts[r.id] = ''; drafts = { ...drafts }; }} class="text-muted-foreground hover:text-foreground">Dismiss</button>
                </div>
              </div>
            {/if}
            <div class="flex gap-2 justify-end">
              <button
                type="button"
                onclick={() => draftReply(r)}
                disabled={drafting[r.id]}
                class="px-3 py-1.5 rounded text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40 inline-flex items-center gap-1"
              >✨ {drafting[r.id] ? 'Drafting…' : 'Draft reply'}</button>
              {#if !r.isApproved}
                <button
                  type="button"
                  onclick={() => actOnReview(r.id, 'approve')}
                  class="px-3 py-1.5 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                >Approve</button>
              {/if}
              <button
                type="button"
                onclick={() => actOnReview(r.id, 'hide')}
                class="px-3 py-1.5 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
              >Hide</button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  {:else}
    {#if loading}
      <div class="space-y-2">
        {#each Array(3) as _, i (i)}
          <Skeleton class="h-24 rounded-xl" />
        {/each}
      </div>
    {:else if threads.length === 0}
      <div class="surface-1 border border-border/40 rounded-xl p-12 text-center text-muted-foreground">
        You haven't authored any forum threads yet.
      </div>
    {:else}
      <ul class="space-y-3">
        {#each threads as t (t.id)}
          <li class="surface-1 border border-border/40 rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <a href={`/creator/forum/${t.id}`} class="text-foreground font-medium hover:text-purple-300">{t.title}</a>
                <div class="text-xs text-muted-foreground mt-1">
                  <span class="inline-flex items-center gap-1"><MessageSquare class="w-3 h-3" />{t.replyCount}</span>
                  · {relativeTime(t.createdAt)}
                  {#if t.isLocked}<span class="text-red-300">· locked</span>{/if}
                </div>
              </div>
              <button
                type="button"
                onclick={() => toggleLock(t)}
                class="px-3 py-1.5 rounded text-xs {t.isLocked ? 'bg-yellow-600 hover:bg-yellow-700' : 'surface-2 hover:surface-3'} text-white"
              >{t.isLocked ? 'Unlock' : 'Lock'}</button>
            </div>

            {#if repliesForThread(t.id).length > 0}
              <ul class="space-y-2 pl-3 border-l border-border/40">
                {#each repliesForThread(t.id) as r (r.id)}
                  <li class="text-xs">
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex-1 min-w-0">
                        <div class="text-muted-foreground">
                          {r.authorName ?? 'Unknown'} · {relativeTime(r.createdAt)}
                          {#if r.openReports > 0}<span class="text-red-300"> · {r.openReports} flag{r.openReports > 1 ? 's' : ''}</span>{/if}
                          {#if r.status === 'hidden'}<span class="text-yellow-400"> · hidden</span>{/if}
                        </div>
                        <p class="text-foreground/90 mt-0.5 line-clamp-2">{r.body}</p>
                      </div>
                      {#if r.status !== 'hidden'}
                        <button
                          type="button"
                          onclick={() => hideReply(r.id)}
                          class="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white shrink-0"
                        >Hide</button>
                      {/if}
                    </div>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>
