<script lang="ts">
  import { Flag } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';

  interface Props {
    targetType: 'review' | 'forum_thread' | 'forum_reply' | 'content' | 'user';
    targetId: string;
    /** Override the default Flag icon button with a slot or a label string. */
    label?: string;
    /** Visual variant — "icon" is the bare flag, "button" is a labeled chip. */
    variant?: 'icon' | 'button';
    class?: string;
  }

  let { targetType, targetId, label, variant = 'icon', class: klass = '' }: Props = $props();

  let open = $state(false);
  let category = $state('');
  let description = $state('');
  let submitting = $state(false);

  const CATEGORIES = [
    { value: 'spam', label: 'Spam or misleading' },
    { value: 'harassment', label: 'Harassment or hate' },
    { value: 'sexual', label: 'Sexual content' },
    { value: 'violence', label: 'Violence or threats' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'copyright', label: 'Copyright violation' },
    { value: 'self_harm', label: 'Self-harm' },
    { value: 'illegal', label: 'Illegal activity' },
    { value: 'other', label: 'Other' }
  ];

  async function submit() {
    if (!category) {
      toast.error('Please choose a reason');
      return;
    }
    submitting = true;
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, category, description })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to submit report');
      }
      toast.success('Report submitted. Our moderators will review it.');
      open = false;
      category = '';
      description = '';
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      submitting = false;
    }
  }
</script>

{#if variant === 'icon'}
  <button
    type="button"
    onclick={() => (open = true)}
    class="text-gray-400 hover:text-red-400 transition-colors {klass}"
    title={label ?? 'Report'}
    aria-label="Report"
  >
    <Flag class="w-4 h-4" />
  </button>
{:else}
  <button
    type="button"
    onclick={() => (open = true)}
    class="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors {klass}"
  >
    <Flag class="w-3.5 h-3.5" />
    <span>{label ?? 'Report'}</span>
  </button>
{/if}

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) open = false; }}
    onkeydown={(e) => { if (e.key === 'Escape') open = false; }}
  >
    <div class="bg-gray-900 border border-white/10 rounded-xl max-w-md w-full p-6 space-y-4">
      <div>
        <h2 class="text-lg font-semibold text-white">Report this {targetType.replace('_', ' ')}</h2>
        <p class="text-xs text-gray-400 mt-1">
          Reports are reviewed by our moderation team. Repeated false reports may impact your account.
        </p>
      </div>

      <div class="space-y-2">
        <label for="report-reason" class="block text-sm text-gray-300">Reason</label>
        <select
          id="report-reason"
          bind:value={category}
          class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="">Choose a reason…</option>
          {#each CATEGORIES as c (c.value)}
            <option value={c.value}>{c.label}</option>
          {/each}
        </select>
      </div>

      <div class="space-y-2">
        <label for="report-description" class="block text-sm text-gray-300">Additional details (optional)</label>
        <textarea
          id="report-description"
          bind:value={description}
          rows="3"
          maxlength="2000"
          placeholder="What's wrong with this? (optional)"
          class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none"
        ></textarea>
      </div>

      <div class="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onclick={() => (open = false)}
          class="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10"
        >Cancel</button>
        <button
          type="button"
          onclick={submit}
          disabled={submitting || !category}
          class="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >{submitting ? 'Submitting…' : 'Submit report'}</button>
      </div>
    </div>
  </div>
{/if}
