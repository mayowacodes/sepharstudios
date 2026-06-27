<script lang="ts">
  import type { Component, Snippet } from 'svelte';

  /**
   * Portal-themed empty state. Drop-in replacement for the older
   * `dashboard/EmptyState.svelte` — same prop shape but uses the
   * `--portal-*` tokens so it tints correctly under both the admin
   * (Mission Control teal) and creator (Cosmic Maker cyan) palettes,
   * and gets the portal-fade-up entrance.
   *
   * Use:
   *   <PortalEmptyState icon={CheckCircle2} title="All caught up" description="No pending reviews." />
   *
   * Action slot mirrors the old API:
   *   <PortalEmptyState icon={Inbox} title="Inbox is empty">
   *     {#snippet action()}
   *       <PortalButton href="…">Compose new</PortalButton>
   *     {/snippet}
   *   </PortalEmptyState>
   */

  interface Props {
    icon?: Component;
    title: string;
    description?: string;
    action?: Snippet;
    /** Tone — 'default' (subtle), 'success' (positive, accent ring),
     *  'warning' (orange-yellow), 'danger' (warm red). */
    tone?: 'default' | 'success' | 'warning' | 'danger';
    /** Compact variant cuts padding in half — for inline-block lists. */
    compact?: boolean;
  }

  let { icon: Icon, title, description, action, tone = 'default', compact = false }: Props = $props();

  const ringColor = $derived(
    tone === 'success' ? 'hsl(var(--portal-success))'
    : tone === 'warning' ? 'hsl(45 95% 60%)'
    : tone === 'danger' ? 'hsl(var(--portal-danger))'
    : 'hsl(var(--portal-accent))'
  );
  const iconColor = $derived(
    tone === 'success' ? 'hsl(var(--portal-success))'
    : tone === 'warning' ? 'hsl(45 95% 70%)'
    : tone === 'danger' ? 'hsl(var(--portal-danger))'
    : 'hsl(var(--portal-text-muted))'
  );
</script>

<div
  class="text-center {compact ? 'py-6' : 'py-12'} space-y-3 portal-fade-up"
>
  {#if Icon}
    <!-- Halo ring + glow on the icon — gives empty states a real
         presence instead of looking like a missing-page placeholder.
         The pulse is gentle (2.4s) and respects reduced-motion. -->
    <div
      class="relative inline-flex items-center justify-center {compact ? 'w-12 h-12' : 'w-16 h-16'} rounded-full"
      style="background: hsl(var(--portal-bg-elevated)/0.7); border: 1px solid {ringColor + '/0.35'}; box-shadow: 0 0 32px {ringColor + '/0.15'};"
    >
      <Icon class={compact ? 'w-5 h-5' : 'w-7 h-7'} style="color: {iconColor};" />
      <span
        class="portal-halo-pulse absolute inset-0 rounded-full pointer-events-none"
        style="--ring: {ringColor};"
        aria-hidden="true"
      ></span>
    </div>
  {/if}
  <div>
    <h3
      class="{compact ? 'text-sm' : 'text-base'} font-semibold"
      style="color: hsl(var(--portal-text));"
    >{title}</h3>
    {#if description}
      <p
        class="{compact ? 'text-xs' : 'text-sm'} mt-1 max-w-md mx-auto leading-relaxed"
        style="color: hsl(var(--portal-text-muted));"
      >{description}</p>
    {/if}
  </div>
  {#if action}
    <div class="pt-2 inline-flex items-center gap-2">
      {@render action()}
    </div>
  {/if}
</div>

<style>
  .portal-halo-pulse {
    border: 1px solid var(--ring);
    opacity: 0.35;
    animation: portal-halo 2.4s ease-in-out infinite;
  }

  @keyframes portal-halo {
    0%, 100% { transform: scale(1); opacity: 0.35; }
    50%      { transform: scale(1.08); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .portal-halo-pulse {
      animation: none;
      opacity: 0.25;
    }
  }
</style>
