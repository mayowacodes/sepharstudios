<script lang="ts">
  import { page } from '$app/state';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { useSidebar } from '$lib/components/ui/sidebar/index.js';
  import type { User } from '$lib/auth';
  import { cn } from '$lib/utils';
  import { Home } from '@lucide/svelte';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import LogOutIcon from '@lucide/svelte/icons/log-out';
  import { buttonVariants } from '$lib/components/ui/button';
  import { Role } from '$lib/constants';
  import { getNavigation } from '$lib/constants';

  let { user }: { user: User } = $props();
  const sidebar = useSidebar();
  const navItems = getNavigation(page.url.pathname);
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" {...props}>
            <Avatar.Root class="size-8 rounded-lg">
              <Avatar.Image src={user.image} alt={user.name} />
              <Avatar.Fallback class="rounded-lg">{user.name.slice(0,2)}</Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{user.name}</span>
              <span class="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon class="ml-auto size-4" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg" side={sidebar.isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar.Root class="size-8 rounded-lg">
              <Avatar.Image src={user.image} alt={user.name} />
              <Avatar.Fallback class="rounded-lg">{user.name.slice(0,2)}</Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{user.name}</span>
              <span class="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group class="flex flex-col gap-1">
          <DropdownMenu.Item class="cursor-pointer" onclick={() => (location.href = '/')}>
            <Home />Home
          </DropdownMenu.Item>
          {#each navItems.navMain as item, i}
            {#if item.roles.includes(user.role as Role)}
              <DropdownMenu.Item class={cn(buttonVariants({ variant: item.isActive ? 'outline' : 'ghost'}), 'cursor-pointer justify-start')} onclick={() => (location.href = item.url)}>
                <item.icon />{item.title}
              </DropdownMenu.Item>
            {/if}
          {/each}
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={() => (location.href = '/auth/logout')}>
          <LogOutIcon />Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
