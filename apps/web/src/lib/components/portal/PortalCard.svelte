<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  /**
   * Portal-scoped glass card. Replaces the ad-hoc surface-1/surface-2
   * div wrappers across portal pages so:
   *   - The hover treatment is consistent (subtle lift + accent ring)
   *   - The portal accent stripe can be opted-in with one prop
   *   - Three sizes pick up consistent padding + radius
   */
  type Size = 'compact' | 'default' | 'hero';

  let {
    size = 'default',
    accent = false,
    interactive = false,
    class: className = '',
    children,
    ...rest
  }: {
    size?: Size;
    /** Show the 4px left-edge accent stripe in --portal-accent. */
    accent?: boolean;
    /** Hover lift + accent glow + pointer cursor. */
    interactive?: boolean;
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement> = $props();

  const sizeClasses: Record<Size, string> = {
    compact: 'rounded-xl p-3',
    default: 'rounded-2xl p-5',
    hero: 'rounded-3xl p-6 md:p-8'
  };

  const base =
    'relative overflow-hidden backdrop-blur-md ' +
    'bg-[hsl(var(--portal-bg-card)/0.7)] ' +
    'border border-[hsl(var(--portal-border)/0.6)] ' +
    'transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]';

  const interactiveClasses = $derived(
    interactive
      ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[hsl(var(--portal-accent)/0.6)] hover:shadow-[var(--portal-accent-glow)]'
      : ''
  );
</script>

<div class={`${base} ${sizeClasses[size]} ${interactiveClasses} ${className}`} {...rest}>
  {#if accent}
    <span
      class="pointer-events-none absolute left-0 top-4 bottom-4 w-0.75 rounded-r-full bg-[hsl(var(--portal-accent))]"
      aria-hidden="true"
    ></span>
  {/if}
  {@render children?.()}
</div>
