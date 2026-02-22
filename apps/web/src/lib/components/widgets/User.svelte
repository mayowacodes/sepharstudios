<script lang="ts">
  import { page } from '$app/state';
  import type { User } from '$lib/auth';
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
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
  import { Bell, UserIcon, LogOut, Settings } from "@lucide/svelte";
  import NotificationCenter from "$lib/components/NotificationCenter.svelte";
  import Search from "$lib/components/Search.svelte";

  const user = page.data.user as User | undefined;
  let isNotificationOpen = false;
  let isLoading = false;

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
        <Button variant="ghost" size="icon">
          <Bell class="h-5 w-5" />
          <span class="sr-only">Open notifications</span>
        </Button>
      </SheetTrigger>
      <NotificationCenter bind:open={isNotificationOpen} onOpenChange={val => isNotificationOpen = val} />
    </Sheet>

    <!-- User Menu -->
    <DropdownMenu>
      <DropdownMenuTrigger asChild let:builder>
        <Button variant="ghost" class="relative h-10 w-10 rounded-full" builders={[builder]}>
          <Avatar class="h-10 w-10">
            {#if user.image}
              <AvatarImage src={user.image} alt={user.name || user.email} />
            {/if}
            <AvatarFallback class="bg-primary text-primary-foreground">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56" align="end">
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
        <DropdownMenuItem href="/profile">
          <UserIcon class="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem href="/settings">
          <Settings class="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem on:click={handleSignOut} disabled={isLoading}>
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
    <Button href="/plans" size="sm" class="h-9 bg-primary hover:bg-primary/90">
      Get Started
    </Button>
  {/if}
</div>
