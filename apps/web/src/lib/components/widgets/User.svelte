<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { User } from '$lib/auth';
  import { Button } from "$lib/components/ui/button";
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
  import { Sheet, SheetTrigger } from "$lib/components/ui/sheet";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";
  import { Bell, UserIcon, LogOut, Settings, Download } from "@lucide/svelte";
  import NotificationCenter from "$lib/components/NotificationCenter.svelte";
  import Search from "$lib/components/Search.svelte";

  const user = page.data.user as User | undefined;
  let isNotificationOpen = $state(false);
  let isLoading = $state(false);

  // PWA install — reads the same localStorage keys as PWAInstallPrompt
  let canInstall = $state(false);
  let deferredInstallPrompt = $state<any>(null);

  onMount(() => {
    // Already running as installed PWA or user already installed/dismissed permanently
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('pwa-installed') === 'true') return;

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
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
      }
      deferredInstallPrompt = null;
      canInstall = false;
    } else {
      goto('/device-support#install');
    }
  }

  function getUserInitials(user: User | undefined): string {
    if (!user) return 'U';
    if (user.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  }

  async function handleSignOut() {
    isLoading = true;
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      isLoading = false;
    }
  }
</script>

<div class="flex items-center gap-4">
  {#if user}
    <!-- Search for authenticated users -->
    <Search />

    <!-- Notifications -->
    <Sheet bind:open={isNotificationOpen}>
      <SheetTrigger>
        {#snippet child({ props })}
          <Button variant="ghost" size="icon" {...props}>
            <Bell class="h-5 w-5" />
            <span class="sr-only">Open notifications</span>
          </Button>
        {/snippet}
      </SheetTrigger>
      <NotificationCenter open={isNotificationOpen} onOpenChange={val => isNotificationOpen = val} />
    </Sheet>

    <!-- User Menu -->
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet child({ props })}
          <Button variant="ghost" class="relative h-10 w-10 rounded-full" {...props}>
            <Avatar class="h-10 w-10">
              {#if user.image}
                <AvatarImage src={user.image} alt={user.name || user.email} />
              {/if}
              <AvatarFallback class="bg-primary text-primary-foreground">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
          </Button>
        {/snippet}
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56 surface-glass border-white/10" align="end">
        <DropdownMenuLabel class="font-normal">
          <div class="flex flex-col space-y-1">
            {#if user.name}
              <p class="text-sm font-medium leading-none">{user.name}</p>
            {/if}
            <p class="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onclick={() => goto('/profile')}>
          <UserIcon class="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onclick={() => goto('/settings')}>
          <Settings class="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        {#if canInstall}
          <DropdownMenuSeparator />
          <DropdownMenuItem onclick={triggerInstall} class="text-[#FFBF00] focus:text-[#FFBF00]">
            <Download class="mr-2 h-4 w-4" />
            Install App
          </DropdownMenuItem>
        {/if}
        <DropdownMenuSeparator />
        <DropdownMenuItem onclick={handleSignOut} disabled={isLoading}>
          <LogOut class="mr-2 h-4 w-4" />
          {isLoading ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  {:else}
    <!-- Sign In button for non-authenticated users -->
    <Button href="/auth/login" variant="ghost" class="h-9">
      Sign In
    </Button>
    <Button href="/plans" size="sm" class="h-9 ml-4 bg-primary hover:bg-primary/90">
      Get Started
    </Button>
  {/if}
</div>
