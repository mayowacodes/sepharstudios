<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/state';
  import { writable } from 'svelte/store';
  import MyStudiosDrawer from '$lib/components/sections/MyStudiosDrawer.svelte';

  import Logo from '$lib/components/Logo.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Sheet, SheetTrigger, SheetContent } from '$lib/components/ui/sheet';
  import { Menu, Download } from '@lucide/svelte';
  import User from '../widgets/User.svelte';
  import type { User as UserType } from '$lib/auth';

  export const isNotificationOpen = writable(false);

  // PWA install
  let canInstall = $state(false);
  let deferredInstallPrompt = $state<any>(null);

  onMount(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    const handler = (e: Event) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      canInstall = true;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  });

  async function triggerInstall() {
    if (deferredInstallPrompt) {
      await deferredInstallPrompt.prompt();
      deferredInstallPrompt = null;
      canInstall = false;
    } else {
      window.location.href = '/device-support#install';
    }
  }

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
          <a href="/token" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-[#FFBF00] hover:text-[#FFBF00]/80">STC Token</a>
          <hr class="border-white/10" />
          <a href="/kids/kiddies" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold pl-4 text-white/90 hover:text-white">Kiddies</a>
          <a href="/kids/teens" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold pl-4 text-white/90 hover:text-white">Teens</a>
          <a href="/archive" onclick={() => isNotificationOpen.set(false)} class="block font-semibold pl-4 text-sm text-muted-foreground">Archive Videos</a>
          <a href="/mayowa" onclick={() => isNotificationOpen.set(false)} class="block font-semibold pl-4 text-sm text-muted-foreground">Mayowa's Films</a>
          {#if isAuthenticated}
            <hr class="border-white/10" />
            <a href="/downloads" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">Downloads</a>
            <a href="/my-list" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">My List</a>
            <a href="/recently-watched" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">Recently Watched</a>
            <a href="/settings" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">Settings</a>
            <a href="/account" onclick={() => isNotificationOpen.set(false)} class="block text-lg font-semibold text-white/90 hover:text-white">Account</a>
          {/if}
          <hr class="border-white/10" />
          <button
            onclick={triggerInstall}
            class="flex items-center gap-2 text-lg font-semibold text-[#FFBF00] hover:text-[#FFBF00]/80 w-full text-left"
          >
            <Download class="w-4 h-4" />
            Install App
          </button>
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
          <a
            href={href}
            class={`relative inline-flex items-center h-9 text-sm font-medium leading-none transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#FF5E0E] after:transition-all after:duration-300 ${isActive(href) ? 'after:w-full text-white' : 'after:w-0 hover:after:w-full'}`}
          >
            {label}
          </a>
        {/each}

        <!-- Accessible Dropdown -->
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
          <a href="/my-list" class="inline-flex items-center h-9 text-sm font-medium leading-none text-white/80 hover:text-white" aria-current={isActive('/my-list') ? 'page' : undefined}>My List</a>
          <a href="/library" class="inline-flex items-center h-9 text-sm font-medium leading-none text-white/80 hover:text-white" aria-current={isActive('/library') ? 'page' : undefined}>Library</a>
        {/if}
      </nav>
    </div>

    <div class="ml-auto flex items-center gap-2">
      {#if canInstall}
        <button
          onclick={triggerInstall}
          title="Install Sephar Studios app"
          class="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#FFBF00] hover:text-[#FFBF00]/80 border border-[#FFBF00]/30 hover:border-[#FFBF00]/60 px-3 py-1.5 rounded-full transition-colors"
        >
          <Download class="w-3.5 h-3.5" />
          Install App
        </button>
      {/if}
      <User />
    </div>
  </div>
</header>
{/if}
