<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  /**
   * Portal-scoped button. Five variants drive the entire CTA system
   * across /admin and /creator. Read CSS variables from PortalShell
   * (--portal-accent, --portal-gradient-cta, etc.), so a single
   * component renders portal-correct chrome without any portal-aware
   * logic here.
   */
  type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'icon';
  type Size = 'sm' | 'md' | 'lg';

  let {
    variant = 'primary',
    size = 'md',
    href,
    type = 'button',
    disabled = false,
    loading = false,
    class: className = '',
    children,
    ...rest
  }: {
    variant?: Variant;
    size?: Size;
    href?: string;
    type?: HTMLButtonAttributes['type'];
    disabled?: boolean;
    loading?: boolean;
    class?: string;
    children?: Snippet;
  } & (HTMLButtonAttributes | HTMLAnchorAttributes) = $props();

  const base =
    'relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-[hsl(var(--portal-accent))] focus-visible:ring-offset-[hsl(var(--portal-bg-base))] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ' +
    'transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]';

  const sizeClasses: Record<Size, string> = {
    sm: 'text-xs px-2.5 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2 rounded-lg',
    lg: 'text-base px-5 py-2.5 rounded-xl'
  };

  const iconSizeClasses: Record<Size, string> = {
    sm: 'w-7 h-7 rounded-md',
    md: 'w-9 h-9 rounded-lg',
    lg: 'w-11 h-11 rounded-xl'
  };

  // Primary uses the portal's gradient CTA (defined in app.css per
  // portal). Hover gets the accent glow + a tiny upward lift.
  const variantClasses: Record<Variant, string> = {
    primary:
      'text-white shadow-md hover:-translate-y-px ' +
      'hover:shadow-[var(--portal-accent-glow)] ' +
      '[background:var(--portal-gradient-cta)]',
    secondary:
      'text-[hsl(var(--portal-accent))] backdrop-blur-md ' +
      'border border-[hsl(var(--portal-border))] bg-[hsl(var(--portal-bg-elevated)/0.5)] ' +
      'hover:border-[hsl(var(--portal-accent))] hover:bg-[hsl(var(--portal-bg-elevated)/0.8)] ' +
      'hover:shadow-[var(--portal-accent-glow)]',
    ghost:
      'text-[hsl(var(--portal-text-muted))] hover:text-[hsl(var(--portal-text))] ' +
      'hover:bg-[hsl(var(--portal-bg-elevated)/0.5)]',
    destructive:
      'text-white bg-[hsl(var(--portal-danger))] hover:bg-[hsl(var(--portal-danger)/0.85)] ' +
      'hover:-translate-y-px hover:shadow-md',
    icon:
      'text-[hsl(var(--portal-text))] backdrop-blur-md ' +
      'border border-[hsl(var(--portal-border))] bg-[hsl(var(--portal-bg-elevated)/0.6)] ' +
      'hover:scale-105 hover:border-[hsl(var(--portal-accent))] ' +
      'hover:shadow-[var(--portal-accent-glow)]'
  };

  const finalClass = $derived(
    `${base} ${variant === 'icon' ? iconSizeClasses[size] : sizeClasses[size]} ${variantClasses[variant]} ${className}`
  );
</script>

{#if href}
  <a {href} class={finalClass} aria-disabled={disabled} {...rest as HTMLAnchorAttributes}>
    {#if loading}
      <span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
    {/if}
    {@render children?.()}
  </a>
{:else}
  <button
    {type}
    {disabled}
    class={finalClass}
    {...rest as HTMLButtonAttributes}
  >
    {#if loading}
      <span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
    {/if}
    {@render children?.()}
  </button>
{/if}
