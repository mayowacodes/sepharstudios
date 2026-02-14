<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import { writable } from 'svelte/store';
  import { currentProfile } from '$lib/stores/profileStores';
  import MyStudiosDrawer from '$lib/components/sections/MyStudiosDrawer.svelte';

  import Logo from '$lib/components/Logo.svelte';
  import { Button } from '$lib/components/ui/button';
  import Search from '$lib/components/Search.svelte';
  import ProfileMenu from '$lib/components/profile/ProfileMenu.svelte';
  import NotificationCenter from '$lib/components/NotificationCenter.svelte';
  import { Sheet, SheetTrigger, SheetContent } from '$lib/components/ui/sheet';
  import { Menu, Bell } from 'lucide-svelte';
  import User from '../widgets/User.svelte';
  import type { UserType } from '$lib/types';

  interface UserType {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }

  export const isNotificationOpen = writable(false);

  $: user = (page.data.user as UserType) || null;
  $: isAuthenticated = !!user;
  
  // Hide header completely on kids pages since they have their own navigation
  $: isKidsPage = page.url.pathname.startsWith('/kids/');

  let hasUnreadNotifications = true; // Replace with actual fetch later
  let previousScrollY = 0;
  let hideHeader = false;
  let kidsMenuOpen = false;

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/shows', label: 'TV Shows' },
    { href: '/documentaries', label: 'Documentaries' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return page.url.pathname === '/';
    }
    return page.url.pathname.startsWith(path);
  };

  const closeKidsMenu = () => {
    kidsMenuOpen = false;
  };

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
<header class={`transition-transform duration-300 ease-in-out sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${hideHeader ? '-translate-y-full' : ''}`}>
  <div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
    <div class="flex gap-6 md:gap-10 items-center">

      <!-- Mobile Menu -->
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" class="md:hidden">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" class="p-4 space-y-4">
          {#each navItems as item}
            <a href={item.href} on:click={() => isNotificationOpen.set(false)} class="block text-lg font-semibold">{item.label}</a>
          {/each}
          {#if isAuthenticated}
            <hr />
            <a href="/downloads" class="block text-lg font-semibold">Downloads</a>
            <a href="/my-list" class="block text-lg font-semibold">My List</a>
            <a href="/recently-watched" class="block text-lg font-semibold">Recently Watched</a>
            <a href="/settings" class="block text-lg font-semibold">Settings</a>
            <a href="/account" class="block text-lg font-semibold">Account</a>
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
      <nav class="hidden md:flex gap-6 items-center">
        {#each navItems as { href, label }}
          <a
            href={href}
            class={`relative text-sm font-medium after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#FF5E0E] after:transition-all after:duration-300 ${isActive(href) ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
          >
            {label}
          </a>
        {/each}

        <!-- Accessible Dropdown -->
        <details class="relative group" bind:open={kidsMenuOpen}>
          <summary class="cursor-pointer list-none text-sm font-medium">Kids</summary>
          <div class="absolute left-0 mt-2 w-48 bg-background rounded shadow-lg z-50 border">
            <a 
              href="/kids/kiddies" 
              class="block px-4 py-2 hover:bg-muted transition-colors"
              on:click={closeKidsMenu}
            >
              👶 Kiddies
            </a>
            <a 
              href="/kids/teens" 
              class="block px-4 py-2 hover:bg-muted transition-colors"
              on:click={closeKidsMenu}
            >
              👦👧 Teens
            </a>
            <hr class="my-1" />
            <a 
              href="/archive" 
              class="block px-4 py-2 hover:bg-muted transition-colors text-sm text-muted-foreground"
              on:click={closeKidsMenu}
            >
              📚 Archive Videos
            </a>
            <a 
              href="/mayowa" 
              class="block px-4 py-2 hover:bg-muted transition-colors text-sm text-muted-foreground"
              on:click={closeKidsMenu}
            >
              🎬 Mayowa's Films
            </a>
          </div>
        </details>

        {#if isAuthenticated}
          <a href="/my-list" class="text-sm font-medium" aria-current={isActive('/my-list') ? 'page' : undefined}>My List</a>
          <a href="/library" class="text-sm font-medium" aria-current={isActive('/library') ? 'page' : undefined}>Library</a>
        {/if}
      </nav>
    </div>

    <!-- Right Controls -->
    <div class="flex flex-1 items-center justify-end space-x-4">
      {#if isAuthenticated}
        <Search />

        <!-- Notifications -->
        <Sheet bind:open={$isNotificationOpen}>
          <SheetTrigger>
            <Button variant="ghost" size="icon" class="relative">
              <Bell class="h-5 w-5" />
              {#if hasUnreadNotifications}
                <span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background animate-ping"></span>
              {/if}
              <span class="sr-only">Open notifications</span>
            </Button>
          </SheetTrigger>
          <NotificationCenter bind:open={$isNotificationOpen} onOpenChange={val => isNotificationOpen.set(val)} />
        </Sheet>

        <ProfileMenu />
      {/if}
    </div>

    <User />
  </div>
</header>
{/if}
