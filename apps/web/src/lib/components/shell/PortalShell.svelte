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

<div data-portal={portal} class="min-h-screen bg-background text-foreground">
  <a
    href="#portal-main"
    class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded-md"
  >Skip to main content</a>

  <Sidebar.Provider style="--sidebar-width: 14rem;">
    <Sidebar.Root collapsible="icon" class="surface-glass">
      <Sidebar.Header class="border-b border-white/10">
        <a href={portal === 'admin' ? '/admin' : '/creator'} class="flex items-center gap-2 px-2 py-1.5 text-foreground hover:opacity-80 transition-opacity">
          <img src="/logo-alone-sepharstudios-bgless.png" alt="" class="h-6 w-6 object-contain shrink-0" />
          <span class="text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">{portalLabel}</span>
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
                          <span>{item.label}</span>
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
                        <span class="truncate">{user?.name ?? 'Account'}</span>
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
      <Sidebar.Rail />
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
        <button
          type="button"
          onclick={() => (copilotOpen = !copilotOpen)}
          class="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"
          aria-label="Open Copilot (⌘J)"
        >
          <Sparkles class="w-4 h-4" />
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
  /* Portal accent overrides — admin runs red, creator runs purple. Both
     override --primary (which the sidebar active state + button styles
     all key off of). */
  :global([data-portal='admin']) {
    --primary: 0 72% 51%;
    --primary-foreground: 0 0% 100%;
    --sidebar-primary: 0 72% 51%;
    --sidebar-primary-foreground: 0 0% 100%;
  }
  :global([data-portal='creator']) {
    --primary: 270 60% 56%;
    --primary-foreground: 0 0% 100%;
    --sidebar-primary: 270 60% 56%;
    --sidebar-primary-foreground: 0 0% 100%;
  }
</style>
