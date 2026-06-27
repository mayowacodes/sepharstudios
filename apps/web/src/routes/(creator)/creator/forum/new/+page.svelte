<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft, MessageSquarePlus } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';

  const categories = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'technical', title: 'Technical Help', icon: '⚙️' },
    { id: 'content-creation', title: 'Content Creation', icon: '🎬' },
    { id: 'ministry', title: 'Ministry & Faith', icon: '✝️' },
    { id: 'community', title: 'Community', icon: '❤️' }
  ];

  let title = $state('');
  let category = $state('');
  let body = $state('');
  let submitting = $state(false);
  let error = $state('');

  async function submit() {
    error = '';
    if (!title || !category || !body) {
      error = 'Title, category, and body are all required.';
      return;
    }
    submitting = true;
    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, body })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Submission failed');
      if (result.status === 'hidden') {
        alert('Your post was flagged by automated moderation and is pending admin review. You can still see it on your profile until then.');
        goto('/creator/forum');
      } else {
        goto(`/creator/forum/${result.id}`);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Submission failed';
    } finally {
      submitting = false;
    }
  }
</script>

<div class="container mx-auto max-w-3xl py-8 px-4 space-y-6">
  <a href="/creator/forum" class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">
    <ArrowLeft class="w-3 h-3" /> Back to forum
  </a>
  <PortalHero compact eyebrow="Community" title="Start a discussion" subtitle="All posts are moderated by AI before publishing. Be kind and on-topic." icon={MessageSquarePlus} />

  <form
    class="surface-2 backdrop-blur-sm rounded-xl p-6 space-y-4"
    onsubmit={(e) => { e.preventDefault(); submit(); }}
  >
    <div>
      <label for="thread-title" class="block text-foreground font-medium mb-2">Title *</label>
      <input
        id="thread-title"
        type="text"
        bind:value={title}
        minlength="5"
        maxlength="255"
        required
        class="w-full px-4 py-2 surface-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500"
      />
    </div>

    <div>
      <label for="thread-category" class="block text-foreground font-medium mb-2">Category *</label>
      <select
        id="thread-category"
        bind:value={category}
        required
        class="w-full px-4 py-2 surface-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500"
      >
        <option value="">Choose a category</option>
        {#each categories as cat (cat.id)}
          <option value={cat.id}>{cat.icon} {cat.title}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="thread-body" class="block text-foreground font-medium mb-2">Body *</label>
      <textarea
        id="thread-body"
        bind:value={body}
        rows="8"
        minlength="20"
        maxlength="10000"
        required
        class="w-full px-4 py-2 surface-2 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500"
        placeholder="Share your question, idea, or testimony…"
      ></textarea>
    </div>

    {#if error}
      <div class="bg-red-600/20 border border-red-600 text-red-100 rounded-lg p-3 text-sm">{error}</div>
    {/if}

    <div class="flex justify-end gap-2">
      <button type="button" onclick={() => goto('/creator/forum')} class="px-4 py-2 text-foreground/80 hover:text-foreground">Cancel</button>
      <button
        type="submit"
        disabled={submitting}
        class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium"
      >
        {submitting ? 'Posting…' : 'Post Discussion'}
      </button>
    </div>
  </form>
</div>
