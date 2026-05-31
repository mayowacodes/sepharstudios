<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { X, Pin, PinOff } from '@lucide/svelte';
  import { fly } from 'svelte/transition';
  import {
    slideOverStack,
    closeSlideOver,
    closeTopSlideOver,
    pinSlideOver,
    dropUnpinnedSlideOvers
  } from './slide-over-store';

  // Drop unpinned panels whenever the route changes — pinned ones
  // persist (the "📌 keep open" affordance in the header).
  let lastPath = $state(page.url.pathname);
  $effect(() => {
    if (page.url.pathname !== lastPath) {
      lastPath = page.url.pathname;
      dropUnpinnedSlideOvers();
    }
  });

  onMount(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeTopSlideOver();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

{#if $slideOverStack.length > 0}
  <!-- Backdrop only on mobile (full-screen sheet). Desktop slide-overs
       dock beside content; the underlying page remains interactive. -->
  <div class="md:hidden fixed inset-0 bg-black/40 z-40" aria-hidden="true" onclick={closeTopSlideOver} onkeydown={() => {}} role="presentation"></div>
{/if}

<div class="fixed top-12 right-0 bottom-0 z-50 flex pointer-events-none">
  {#each $slideOverStack as panel, idx (panel.id)}
    {@const PanelComponent = panel.component}
    <div
      in:fly={{ x: 32, duration: 200 }}
      out:fly={{ x: 32, duration: 160 }}
      class="pointer-events-auto w-full md:w-[400px] max-w-full bg-background border-l border-white/10 shadow-2xl flex flex-col {idx > 0 ? 'border-l-2 border-l-primary/40' : ''}"
      style="z-index: {50 + idx};"
      role="dialog"
      aria-label={panel.title}
      aria-modal="false"
    >
      <header class="h-12 px-3 border-b border-white/10 flex items-center gap-2 shrink-0">
        <span class="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{panel.title}</span>
        <span class="flex-1"></span>
        <button
          type="button"
          onclick={() => pinSlideOver(panel.id, !panel.pinned)}
          class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/5"
          aria-label={panel.pinned ? 'Unpin panel' : 'Pin panel'}
          title={panel.pinned ? 'Unpin (closes on navigate)' : 'Pin (stays open across pages)'}
        >
          {#if panel.pinned}
            <PinOff class="w-3.5 h-3.5" />
          {:else}
            <Pin class="w-3.5 h-3.5" />
          {/if}
        </button>
        <button
          type="button"
          onclick={() => closeSlideOver(panel.id)}
          class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/5"
          aria-label="Close"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </header>
      <div class="flex-1 overflow-y-auto">
        <PanelComponent {...(panel.props ?? {})} />
      </div>
    </div>
  {/each}
</div>
