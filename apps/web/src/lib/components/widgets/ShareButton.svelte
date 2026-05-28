<script lang="ts">
  import { Share2, Link as LinkIcon, Mail, Check } from '@lucide/svelte';
  import { SiteMeta } from '$lib/constants';

  interface Props {
    contentId: string;
    title: string;
    description?: string;
  }

  let { contentId, title, description = '' }: Props = $props();

  let open = $state(false);
  let copied = $state(false);

  const url = $derived(`${SiteMeta.link}/watch/${contentId}`);
  const encodedUrl = $derived(encodeURIComponent(url));
  const encodedTitle = $derived(encodeURIComponent(title));
  const encodedSummary = $derived(encodeURIComponent(description.slice(0, 200)));

  async function recordShare(channel: string) {
    try {
      await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, channel })
      });
    } catch {
      // Best-effort — UI proceeds regardless.
    }
  }

  async function shareNative() {
    if (!navigator.share) return false;
    try {
      await navigator.share({ title, text: description, url });
      await recordShare('native');
      open = false;
      return true;
    } catch {
      return false;
    }
  }

  async function shareLink() {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => (copied = false), 1800);
      await recordShare('link');
    } catch {
      // ignore
    }
  }

  function shareTo(channel: 'twitter' | 'facebook' | 'whatsapp' | 'email') {
    const targets: Record<typeof channel, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0A${encodedUrl}`
    };
    window.open(targets[channel], '_blank', 'noopener,noreferrer,width=600,height=600');
    void recordShare(channel);
  }

  async function onShareClick() {
    if (await shareNative()) return;
    open = !open;
  }
</script>

<div class="relative inline-block">
  <button
    type="button"
    onclick={onShareClick}
    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors"
    aria-haspopup="menu"
    aria-expanded={open}
  >
    <Share2 class="w-4 h-4" />
    Share
  </button>

  {#if open}
    <div
      role="menu"
      class="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-30"
    >
      <button type="button" role="menuitem" onclick={shareLink} class="flex w-full items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10">
        {#if copied}
          <Check class="w-4 h-4 text-green-400" />
          Link copied
        {:else}
          <LinkIcon class="w-4 h-4" />
          Copy link
        {/if}
      </button>
      <button type="button" role="menuitem" onclick={() => shareTo('twitter')} class="flex w-full items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10">
        <span class="font-bold">𝕏</span>
        Share on X
      </button>
      <button type="button" role="menuitem" onclick={() => shareTo('facebook')} class="flex w-full items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10">
        <span class="font-bold">f</span>
        Share on Facebook
      </button>
      <button type="button" role="menuitem" onclick={() => shareTo('whatsapp')} class="flex w-full items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10">
        <span>💬</span>
        WhatsApp
      </button>
      <button type="button" role="menuitem" onclick={() => shareTo('email')} class="flex w-full items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10">
        <Mail class="w-4 h-4" />
        Email
      </button>
    </div>
  {/if}
</div>

<svelte:window
  onclick={(e) => {
    const target = e.target as HTMLElement | null;
    if (!target?.closest('[role=menu]') && !target?.closest('button[aria-haspopup=menu]')) {
      open = false;
    }
  }}
/>
