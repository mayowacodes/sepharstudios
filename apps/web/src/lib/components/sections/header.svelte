<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import { writable } from 'svelte/store';
  import MyStudiosDrawer from '$lib/components/sections/MyStudiosDrawer.svelte';

  import Logo from '$lib/components/Logo.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Sheet, SheetTrigger, SheetContent } from '$lib/components/ui/sheet';
  import { Menu } from '@lucide/svelte';
  import User from '../widgets/User.svelte';
  import type { User as UserType } from '$lib/auth';

  export const isNotificationOpen = writable(false);

  const user = $derived(page.data.user as UserType | undefined);
  const isAuthenticated = $derived(!!user);

  // Hide header completely on kids pages since they have their own navigation
  const isKidsPage = $derived(page.url.pathname.startsWith('/kids/'));

  let previousScrollY = 0;
  let hideHeader = $state(false);
  let kidsMenuRef = $state<HTMLDetailsElement | null>(null);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/shows', label: 'TV Shows' },
    { href: '/documentaries', label: 'Documentaries' },
    { href: '/token', label: 'STC Token' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return page.url.pathname === '/';
    }
    return page.url.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    `relative inline-flex items-center h-9 text-sm font-medium leading-none transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#FF5E0E] after:transition-all after:duration-300 ${isActive(path) ? 'after:w-full text-white' : 'after:w-0 hover:after:w-full text-white/80'}`;

  onMount(() => {
    const handleScroll = async () => {
      const currentY = window.scrollY;
      hideHeader = currentY > previousScrollY && currentY > 60;
      previousScrollY = currentY;
      await tick();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

{#if !isKidsPage}
<header class={`transition-transform duration-300 ease-in-out sticky top-0 z-40 w-full border-b border-white/10 surface-glass ${hideHeader ? '-translate-y-full' : ''}`}>
  <!-- Tighter padding + smaller gap on mobile so the brand + right cluster
       both fit comfortably in the 64px bar. justify-between keeps the
       left + right groups locked to their edges at every breakpoint
       (was sm: only — caused jumbled layout on phones). -->
  <div class="flex h-16 items-center justify-between gap-2 mx-auto px-3 sm:px-4 max-w-(--breakpoint-2xl)">
    <div class="flex items-center gap-2 md:gap-8 min-w-0">
      <!-- Mobile Menu -->
      <Sheet>
        <SheetTrigger>
          {#snippet child({ props })}
            <Button variant="ghost" size="icon" class="md:hidden text-white/80 hover:text-white -ml-1 shrink-0" {...props}>
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle menu</span>
            </Button>
          {/snippet}
        </SheetTrigger>
        <SheetContent side="left" class="p-0 surface-glass border-white/10 w-[min(320px,85vw)]">
          <!-- Tap-target sized list. Each link is a 48px row so finger
               targets are comfortable; section dividers + uppercase
               labels keep the hierarchy obvious instead of a wall of
               text. -->
          <div class="h-full overflow-y-auto py-4">
            <div class="px-4 mb-2 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Browse</div>
            {#each navItems as item}
              <a
                href={item.href}
                onclick={() => isNotificationOpen.set(false)}
                class="block px-4 py-3 text-base font-medium text-white/90 hover:bg-white/5 hover:text-white {isActive(item.href) ? 'text-white bg-white/5 border-l-2 border-[#FF5E0E]' : ''}"
              >
                {item.label}
              </a>
            {/each}

            <div class="px-4 mt-4 mb-2 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Kids</div>
            <a href="/kids/kiddies" onclick={() => isNotificationOpen.set(false)} class="block px-4 py-3 text-base font-medium text-white/90 hover:bg-white/5 hover:text-white">Kiddies</a>
            <a href="/kids/teens" onclick={() => isNotificationOpen.set(false)} class="block px-4 py-3 text-base font-medium text-white/90 hover:bg-white/5 hover:text-white">Teens</a>

            {#if isAuthenticated}
              <div class="px-4 mt-4 mb-2 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Your stuff</div>
              <a href="/my-studios?tab=downloads" onclick={() => isNotificationOpen.set(false)} class="block px-4 py-3 text-base font-medium text-white/90 hover:bg-white/5 hover:text-white">Downloads</a>
              <a href="/my-studios?tab=recent" onclick={() => isNotificationOpen.set(false)} class="block px-4 py-3 text-base font-medium text-white/90 hover:bg-white/5 hover:text-white">Recently Watched</a>
              <a href="/settings" onclick={() => isNotificationOpen.set(false)} class="block px-4 py-3 text-base font-medium text-white/90 hover:bg-white/5 hover:text-white">Settings</a>
            {/if}
          </div>
        </SheetContent>
      </Sheet>

      <!-- Logo or Brand. min-w-0 + truncate inside MyStudiosDrawer keep
           it from blowing past the viewport on small phones. -->
      <div class="min-w-0">
        {#if isAuthenticated}
          <MyStudiosDrawer />
        {:else}
          <Logo />
        {/if}
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex gap-5 lg:gap-6 items-center text-white/80">
        {#each navItems as { href, label }}
          <a href={href} class={navLinkClass(href)}>{label}</a>
        {/each}

        <!-- Kids Accessible Dropdown -->
        <details class="relative group" bind:this={kidsMenuRef}>
          <summary class={`relative inline-flex items-center h-9 leading-none cursor-pointer list-none text-sm font-medium transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#FF5E0E] after:transition-all after:duration-300 ${page.url.pathname.startsWith('/kids/') ? 'after:w-full text-white' : 'after:w-0 hover:after:w-full'}`}>Kids</summary>
          <div class="absolute left-0 mt-2 w-48 rounded-lg z-50 surface-glass border-white/10">
            <a
              href="/kids/kiddies"
              onclick={() => { if (kidsMenuRef) kidsMenuRef.open = false; }}
              class="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
            >
              Kiddies
            </a>
            <a
              href="/kids/teens"
              onclick={() => { if (kidsMenuRef) kidsMenuRef.open = false; }}
              class="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
            >
              Teens
            </a>
          </div>
        </details>
      </nav>
    </div>

    <!-- Right cluster. shrink-0 so the search + avatar never get crushed
         by an overflowing brand on narrow phones. -->
    <div class="flex items-center gap-1 sm:gap-2 shrink-0">
      <a href="/search" aria-label="Search" title="Search" class="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </a>
      <User />
    </div>
  </div>
</header>
{/if}
