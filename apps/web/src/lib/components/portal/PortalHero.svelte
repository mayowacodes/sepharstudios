<script lang="ts">
  import type { Snippet, Component } from 'svelte';

  /**
   * Portal hero — the full-width gradient block that opens every
   * dashboard. Replaces PageHeader on /admin and /creator landing
   * pages. Designed to feel cinematic: large title, ambient gradient,
   * optional pulsing status indicator, big icon glyph on the right.
   *
   * The gradient is driven by --portal-gradient-hero so admin and
   * creator each get a distinct identity without any portal-aware
   * logic here.
   */
  let {
    eyebrow,
    title,
    subtitle,
    statusDot,
    statusText,
    statusTone = 'neutral',
    icon,
    compact = false,
    actions,
    children
  }: {
    /** Small uppercase tracking-wide label above the title. */
    eyebrow?: string;
    /** Main h1. */
    title: string;
    /** Below the title — context line. */
    subtitle?: string;
    /** When true, render a pulsing dot before statusText. */
    statusDot?: boolean;
    statusText?: string;
    statusTone?: 'success' | 'warning' | 'danger' | 'neutral';
    /** Big right-side icon glyph (~96px). */
    icon?: Component;
    /** Compact variant for list pages (smaller padding, smaller title). */
    compact?: boolean;
    /** Optional CTA snippet rendered top-right. */
    actions?: Snippet;
    /** Default slot — for custom hero content below the title. */
    children?: Snippet;
  } = $props();

  const IconGlyph = $derived(icon);

  const toneClasses = $derived(
    statusTone === 'success'
      ? 'text-[hsl(var(--portal-success))] bg-[hsl(var(--portal-success)/0.15)]'
      : statusTone === 'warning'
      ? 'text-[hsl(var(--portal-warning))] bg-[hsl(var(--portal-warning)/0.15)]'
      : statusTone === 'danger'
      ? 'text-[hsl(var(--portal-danger))] bg-[hsl(var(--portal-danger)/0.15)]'
      : 'text-[hsl(var(--portal-text-muted))] bg-[hsl(var(--portal-bg-elevated)/0.6)]'
  );
</script>

<section
  class="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[hsl(var(--portal-border)/0.5)] portal-fade-up"
  style="background: var(--portal-gradient-hero);"
>
  <!-- Ambient gradient orb — gives the hero a subtle light source. -->
  <div
    aria-hidden="true"
    class="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-40 blur-3xl"
    style="background: radial-gradient(circle, hsl(var(--portal-accent)/0.6) 0%, transparent 70%);"
  ></div>

  <div class={`relative flex items-center justify-between gap-6 ${compact ? 'p-5 md:p-6' : 'p-6 md:p-10'}`}>
    <div class="min-w-0 flex-1 space-y-2">
      {#if eyebrow}
        <p class="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold text-[hsl(var(--portal-accent))]">
          {eyebrow}
        </p>
      {/if}

      <h1 class={`${compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl'} font-bold tracking-tight text-[hsl(var(--portal-text))]`}>
        {title}
      </h1>

      {#if subtitle}
        <p class="text-sm md:text-base text-[hsl(var(--portal-text-muted))] max-w-2xl">
          {subtitle}
        </p>
      {/if}

      {#if statusText}
        <div class={`inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full text-xs font-medium ${toneClasses}`}>
          {#if statusDot}
            <span
              class="inline-block w-2 h-2 rounded-full portal-pulse-dot"
              style:background-color={statusTone === 'success'
                ? 'hsl(var(--portal-success))'
                : statusTone === 'warning'
                ? 'hsl(var(--portal-warning))'
                : statusTone === 'danger'
                ? 'hsl(var(--portal-danger))'
                : 'hsl(var(--portal-text-muted))'}
            ></span>
          {/if}
          {statusText}
        </div>
      {/if}

      {#if children}
        <div class="pt-2">{@render children()}</div>
      {/if}
    </div>

    <div class="hidden md:flex items-start gap-3 shrink-0">
      {#if actions}
        <div class="flex items-center gap-2">{@render actions()}</div>
      {/if}
      {#if IconGlyph}
        <div
          class="relative flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-2xl border border-[hsl(var(--portal-accent)/0.3)]"
          style="background: hsl(var(--portal-bg-elevated)/0.4); backdrop-filter: blur(12px);"
        >
          <IconGlyph class="w-9 h-9 lg:w-10 lg:h-10 text-[hsl(var(--portal-accent))]" />
        </div>
      {/if}
    </div>
  </div>

  <!-- Mobile-only actions row — desktop puts them in the right column. -->
  {#if actions}
    <div class="md:hidden px-5 pb-5">
      <div class="flex items-center gap-2 flex-wrap">{@render actions()}</div>
    </div>
  {/if}
</section>
