<script lang="ts">
  import type { Component, Snippet } from 'svelte';

  /**
   * Standard empty-state for portal pages — replaces the ad-hoc "no
   * results" blocks that mixed emoji icons + huge text + inconsistent
   * spacing across the admin and creator portals.
   *
   * Use:
   *   <EmptyState icon={CheckCircle2} title="All caught up" description="No pending reviews." />
   *
   * For an action slot:
   *   <EmptyState icon={Inbox} title="Inbox is empty">
   *     {#snippet action()}
   *       <a href="…">Compose new</a>
   *     {/snippet}
   *   </EmptyState>
   */

  interface Props {
    icon?: Component;
    title: string;
    description?: string;
    /** Optional CTA button(s). */
    action?: Snippet;
    /** Tone — "default" muted, "success" green tint (e.g. all done!). */
    tone?: 'default' | 'success';
  }

  let { icon: Icon, title, description, action, tone = 'default' }: Props = $props();

  const iconClass = $derived(tone === 'success' ? 'text-green-500/80' : 'text-muted-foreground/70');
</script>

<div class="text-center py-12 space-y-3">
  {#if Icon}
    <div class="inline-flex items-center justify-center w-12 h-12 rounded-full surface-1 mb-1">
      <Icon class="w-5 h-5 {iconClass}" />
    </div>
  {/if}
  <div>
    <h3 class="text-sm font-medium text-foreground">{title}</h3>
    {#if description}
      <p class="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">{description}</p>
    {/if}
  </div>
  {#if action}
    <div class="pt-2">
      {@render action()}
    </div>
  {/if}
</div>
