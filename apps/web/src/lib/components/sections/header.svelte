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
  <div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto px-4">
    <div class="flex gap-6 md:gap-10 items-center">
      <!-- Mobile Menu -->
      <Sheet>
        <SheetTrigger>
          {#snippet child({ props })}
            <Button variant="ghost" size="icon" class="md:hidden text-white/80 hover:text-white" {...props}>
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle menu</span>
            </Button>
          {/snippet}
        </SheetTrigger>
        <SheetContent side="left" class="p-4 space-y-4 surface-glass border-white/10">
          {#each navItems as item}
            <a href={item.href} onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">{item.label}</a>
          {/each}
          <hr class="border-white/10" />
          <a href="/kids/kiddies" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold pl-4 text-white/90 hover:text-white">Kiddies</a>
          <a href="/kids/teens" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold pl-4 text-white/90 hover:text-white">Teens</a>
          <a href="/archive" onclick={() => isNotificationOpen.set(false)} class="block font-semibold pl-4 text-sm text-muted-foreground">Archive Videos</a>
          <a href="/mayowa" onclick={() => isNotificationOpen.set(false)} class="block font-semibold pl-4 text-sm text-muted-foreground">Mayowa's Films</a>
          {#if isAuthenticated}
            <hr class="border-white/10" />
            <a href="/watchlist" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">My List</a>
            <a href="/my-studios?tab=downloads" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">Downloads</a>
            <a href="/my-studios?tab=recent" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">Recently Watched</a>
            <a href="/settings" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">Settings</a>
          {/if}
        </SheetContent>
      </Sheet>

      <!-- Logo or Brand -->
      {#if isAuthenticated}
        <MyStudiosDrawer />
      {:else}
        <Logo />
      {/if}

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex gap-6 items-center text-white/80">
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
            <hr class="my-1 border-white/10" />
            <a 
              href="/archive" 
              onclick={() => { if (kidsMenuRef) kidsMenuRef.open = false; }}
              class="block px-4 py-2 hover:bg-white/10 transition-colors text-sm text-muted-foreground"
            >
              Archive Videos
            </a>
            <a 
              href="/mayowa" 
              onclick={() => { if (kidsMenuRef) kidsMenuRef.open = false; }}
              class="block px-4 py-2 hover:bg-white/10 transition-colors text-sm text-muted-foreground"
            >
              Mayowa's Films
            </a>
          </div>
        </details>

        {#if isAuthenticated}
          <a href="/watchlist" class={navLinkClass('/watchlist')}>My List</a>
        {/if}
      </nav>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <a href="/search" aria-label="Search" title="Search" class="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </a>
      <User />
    </div>
  </div>
</header>
{/if}
