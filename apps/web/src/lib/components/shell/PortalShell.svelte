<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { Bell, LogOut, ExternalLink, User as UserIcon, Sparkles, Sun, Moon, Monitor } from '@lucide/svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Separator } from '$lib/components/ui/separator';
  import { mode, setMode, resetMode } from 'mode-watcher';
  import { ADMIN_NAV, CREATOR_NAV } from './portal-nav';
  import PortalBreadcrumb from './PortalBreadcrumb.svelte';
  import CommandPaletteAI from './CommandPaletteAI.svelte';
  import CopilotRail from './CopilotRail.svelte';
  import SlideOverHost from './SlideOverHost.svelte';

  interface Props {
    portal: 'admin' | 'creator';
    children?: import('svelte').Snippet;
  }

  let { portal, children }: Props = $props();

  const navGroups = $derived(portal === 'admin' ? ADMIN_NAV : CREATOR_NAV);
  const portalLabel = $derived(portal === 'admin' ? 'Admin' : 'Creator Studio');

  const user = $derived(page.data.user as { name?: string; image?: string | null; email?: string } | undefined);
  const initial = $derived((user?.name ?? '?').trim().charAt(0).toUpperCase() || '?');

  // Active matcher for nav items. We treat `/admin` as exact-only (so it
  // doesn't light up under every /admin/* child), but child routes match
  // any startsWith.
  function isActive(href: string): boolean {
    const path = page.url.pathname;
    if (href === '/admin' || href === '/creator') return path === href;
    return path.startsWith(href);
  }

  // Bell badge — admin shows open abuse count; creator shows unread admin
  // messages count. One poll on mount; keeps the network noise low.
  let bellCount = $state(0);
  onMount(async () => {
    try {
      const endpoint = portal === 'admin'
        ? '/api/admin/abuse?status=open&countOnly=1'
        : '/api/creator/messages?status=unread&countOnly=1';
      const res = await fetch(endpoint);
      if (res.ok) bellCount = (await res.json()).count ?? 0;
    } catch { /* best-effort */ }
  });

  // Shell-level keyboard. ⌘K → palette; ⌘J → toggle Copilot rail.
  // ⌘B is owned by the sidebar primitive itself (Provider listens for it).
  let paletteOpen = $state(false);
  let copilotOpen = $state(true);

  function onKeydown(e: KeyboardEvent) {
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      paletteOpen = !paletteOpen;
    }
    if (meta && e.key.toLowerCase() === 'j') {
      e.preventDefault();
      copilotOpen = !copilotOpen;
    }
  }

  // Bell click destination
  const bellHref = $derived(portal === 'admin' ? '/admin/abuse' : '/creator/inbox');

  function switchPortal() {
    if (portal === 'admin') goto('/creator');
    else goto('/admin');
  }
</script>

<svelte:window onkeydown={onKeydown} />

<CommandPaletteAI bind:open={paletteOpen} variant={portal} onAskCopilot={() => (copilotOpen = true)} />

<div data-portal={portal} class="min-h-screen text-[hsl(var(--portal-text))]">
  <a
    href="#portal-main"
    class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-[hsl(var(--portal-accent))] focus:text-white focus:px-3 focus:py-2 focus:rounded-md"
  >Skip to main content</a>

  <Sidebar.Provider style="--sidebar-width: 14rem;">
    <Sidebar.Root collapsible="icon" class="portal-sidebar">
      <!--
        Sidebar header is pinned to h-12 (48px) so its bottom divider
        sits flush with the main header's bottom divider. Before this,
        the logo (h-8) plus the two-line "Creator Studio / Cosmic
        Studio" label measured ~52–56px tall, so the cap of the sidebar
        sat 4–8px below the main header's bottom border and the two
        labels (sidebar "Creator Studio" vs breadcrumb "Creator Studio")
        rendered at different y-positions. Fixed-height + leading-none
        on the labels keeps the visual baseline locked.
      -->
      <Sidebar.Header class="h-12 px-0 py-0 border-b border-[hsl(var(--portal-border)/0.7)]">
        <a
          href={portal === 'admin' ? '/admin' : '/creator'}
          class="flex h-full items-center gap-2 px-2 text-[hsl(var(--portal-text))] hover:opacity-90 transition-opacity group/brand"
        >
          <div
            class="relative flex items-center justify-center h-7 w-7 rounded-lg shrink-0 border border-[hsl(var(--portal-accent)/0.4)]"
            style="background: var(--portal-gradient-cta);"
          >
            <img src="/logo-alone-sepharstudios-bgless.png" alt="" class="h-4 w-4 object-contain" />
          </div>
          <div class="flex flex-col leading-none gap-0.5 group-data-[collapsible=icon]:hidden">
            <span class="text-sm font-semibold tracking-tight leading-none">{portalLabel}</span>
            <span class="text-[10px] uppercase tracking-[0.18em] leading-none text-[hsl(var(--portal-accent))]">
              {portal === 'admin' ? 'Mission Control' : 'Cosmic Studio'}
            </span>
          </div>
        </a>
      </Sidebar.Header>

      <Sidebar.Content>
        {#each navGroups as group (group.label)}
          <Sidebar.Group>
            <Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {#each group.items as item (item.href)}
                  {@const Icon = item.icon}
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton isActive={isActive(item.href)} tooltipContent={item.label}>
                      {#snippet child({ props })}
                        <a href={item.href} {...props}>
                          <Icon />
                          <!-- Hide the label entirely in icon-collapsed
                               mode. Without this guard the label was
                               getting clipped mid-character by overflow
                               instead of disappearing, which read as
                               garbled letter bleed beside each icon. -->
                          <span class="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        </a>
                      {/snippet}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                {/each}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        {/each}
      </Sidebar.Content>

      <Sidebar.Footer class="border-t border-white/10">
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <Sidebar.MenuButton tooltipContent={user?.name ?? 'Account'}>
                    {#snippet child({ props: btnProps })}
                      <button type="button" {...props} {...btnProps}>
                        {#if user?.image}
                          <img src={user.image} alt="" class="w-5 h-5 rounded-full object-cover" />
                        {:else}
                          <div class="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{initial}</div>
                        {/if}
                        <span class="truncate group-data-[collapsible=icon]:hidden">{user?.name ?? 'Account'}</span>
                      </button>
                    {/snippet}
                  </Sidebar.MenuButton>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content side="right" align="end" class="w-56">
                {#if user?.email}
                  <div class="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                  <DropdownMenu.Separator />
                {/if}
                <DropdownMenu.Item onSelect={() => goto(portal === 'admin' ? '/admin/settings' : '/creator/profile')}>
                  <UserIcon class="w-3.5 h-3.5 mr-2" /> Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={switchPortal}>
                  <ExternalLink class="w-3.5 h-3.5 mr-2" />
                  Switch to {portal === 'admin' ? 'Creator' : 'Admin'}
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => goto('/')}>
                  <ExternalLink class="w-3.5 h-3.5 mr-2" /> Main site
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    {#if mode.current === 'light'}
                      <Sun class="w-3.5 h-3.5 mr-2" />
                    {:else if mode.current === 'dark'}
                      <Moon class="w-3.5 h-3.5 mr-2" />
                    {:else}
                      <Monitor class="w-3.5 h-3.5 mr-2" />
                    {/if}
                    Theme
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    <DropdownMenu.Item onSelect={() => setMode('light')}>
                      <Sun class="w-3.5 h-3.5 mr-2" /> Light
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => setMode('dark')}>
                      <Moon class="w-3.5 h-3.5 mr-2" /> Dark
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => resetMode()}>
                      <Monitor class="w-3.5 h-3.5 mr-2" /> System
                    </DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={() => goto('/auth/logout')}>
                  <LogOut class="w-3.5 h-3.5 mr-2" /> Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Footer>
      <!--
        Sidebar.Rail intentionally removed: it's a 16px overlay button
        absolutely positioned with -translate-x-1/2 over the right edge
        of the sidebar. In icon-collapsed mode that 8px bleed sits on
        top of the nav-icon column and applies a w/e-resize cursor +
        intercepts the click, so the icons stop responding. The same
        toggle is already exposed via the header's <Sidebar.Trigger />
        and the ⌘B global keybind — the rail was redundant.
      -->
    </Sidebar.Root>

    <Sidebar.Inset class="flex flex-col min-w-0">
      <header class="sticky top-0 z-30 h-12 shrink-0 flex items-center gap-2 px-3 surface-glass border-b border-white/10">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-1 h-4" />
        <PortalBreadcrumb {portal} />
        <span class="flex-1"></span>
        <button
          type="button"
          onclick={() => (paletteOpen = true)}
          class="hidden md:inline-flex items-center gap-1.5 surface-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open command palette (⌘K)"
        >
          <span>Search…</span>
          <kbd class="font-mono text-[10px]">⌘K</kbd>
        </button>
        <a
          href={bellHref}
          class="relative inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"
          aria-label={bellCount > 0 ? `${bellCount} unread` : 'Notifications'}
          title={bellCount > 0 ? `${bellCount} unread` : 'No new notifications'}
        >
          <Bell class="w-4 h-4" />
          {#if bellCount > 0}
            <span class="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {bellCount > 99 ? '99+' : bellCount}
            </span>
          {/if}
        </a>
        <!-- Copilot toggle. Mobile gets the icon-only chip (no rail at
             that breakpoint). Desktop gets a labeled chip that flips
             the rail open / closed so the main pane reclaims the
             right-side real estate when the creator/admin doesn't
             want AI help. ⌘J also toggles via the global keybind
             handler above. -->
        <button
          type="button"
          onclick={() => (copilotOpen = !copilotOpen)}
          class="inline-flex items-center justify-center gap-1.5 px-2 h-8 rounded-md transition-colors"
          style={copilotOpen
            ? `background: hsl(var(--portal-accent)/0.18); color: hsl(var(--portal-accent)); border: 1px solid hsl(var(--portal-accent)/0.4);`
            : `background: hsl(var(--portal-bg-elevated)/0.5); color: hsl(var(--portal-text-muted)); border: 1px solid hsl(var(--portal-border));`}
          aria-label={copilotOpen ? 'Close Copilot (⌘J)' : 'Open Copilot (⌘J)'}
          aria-pressed={copilotOpen}
          title={copilotOpen ? 'Close Copilot (⌘J)' : 'Open Copilot (⌘J)'}
        >
          <Sparkles class="w-4 h-4" />
          <span class="hidden md:inline text-[11px] font-medium">Copilot</span>
        </button>
      </header>

      <div class="flex flex-1 min-h-0">
        <main id="portal-main" class="flex-1 min-w-0 overflow-x-hidden">
          {@render children?.()}
        </main>
        <CopilotRail variant={portal} bind:open={copilotOpen} />
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
</div>

<SlideOverHost />

<!-- Mobile Copilot launcher — preserves the floating-bubble pattern on
     small screens where the right rail can't fit. -->
{#if user}
  <button
    type="button"
    onclick={() => (copilotOpen = !copilotOpen)}
    class="md:hidden fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
    aria-label="Open Copilot (⌘J)"
  >
    <Sparkles class="w-5 h-5" />
  </button>
{/if}

<style>
  /* Portal token blocks live in app.css now. This file owns just the
     sidebar chrome — the surface, the active-state sweep, and the
     hover micro-interactions on nav items. */

  /* Sidebar surface — replaces the .surface-glass class so we can pin
     the gradient + dot-grid to the portal tokens. */
  :global(.portal-sidebar) {
    background-color: hsl(var(--portal-bg-elevated)) !important;
    background-image: radial-gradient(
      circle at 1px 1px,
      hsl(var(--portal-grid-line) / 0.22) 1px,
      transparent 0
    ) !important;
    background-size: 24px 24px !important;
    border-right: 1px solid hsl(var(--portal-border) / 0.7) !important;
  }

  /* Active nav item — the [data-active="true"] attribute is set by
     shadcn-svelte's SidebarMenuButton. We add a 3px left accent bar
     (full height) + the animated sweep on it. The label gets a subtle
     text glow keyed to the portal accent. */
  :global(.portal-sidebar [data-slot='sidebar-menu-button'][data-active='true']) {
    position: relative;
    background-color: hsl(var(--portal-accent) / 0.12) !important;
    color: hsl(var(--portal-text)) !important;
  }
  :global(.portal-sidebar [data-slot='sidebar-menu-button'][data-active='true'])::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 4px;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      hsl(var(--portal-accent)) 30%,
      hsl(var(--portal-accent)) 70%,
      transparent 100%
    );
    background-size: 100% 200%;
    animation: portal-sweep 1.8s ease-in-out infinite;
  }

  /* Non-active nav row — hover slides the icon 2px right + brightens
     the row background. */
  :global(.portal-sidebar [data-slot='sidebar-menu-button']:not([data-active='true']):hover) {
    background-color: hsl(var(--portal-bg-base) / 0.6) !important;
    color: hsl(var(--portal-text)) !important;
  }
  :global(.portal-sidebar [data-slot='sidebar-menu-button']:not([data-active='true']):hover svg) {
    transform: translateX(2px);
  }
  :global(.portal-sidebar [data-slot='sidebar-menu-button'] svg) {
    transition: transform 150ms ease-out;
  }

  /* Group labels — small caps, in the portal-accent color, so the
     section structure is obvious without taking visual weight. */
  :global(.portal-sidebar [data-slot='sidebar-group-label']) {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: hsl(var(--portal-text-muted)) !important;
  }
</style>
