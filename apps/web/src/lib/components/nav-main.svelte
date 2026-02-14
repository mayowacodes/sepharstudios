<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import type { Role } from '$lib/constants';
  import type { User } from '$lib/auth';
  import { cn } from '$lib/utils';
  import { page } from '$app/state';
  import { buttonVariants } from '$lib/components/ui/button';

  const user = page.data.user as User;

  let {
    items
  }: {
    items: {
      title: string;
      url: string;
      roles: Role[];
      icon?: any;
      isActive?: boolean;
      items?: { title: string; url: string; }[];
    }[];
  } = $props();
</script>

<Sidebar.Group>
  <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
  <Sidebar.Menu class="flex flex-col gap-1">
    {#each items as item (item.title)}
      {#if item.roles.includes(user.role as Role)}
        <a class="cursor-pointer" href={item.url}>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton class={cn(buttonVariants({variant: item.isActive ? 'outline' : 'ghost'}), "justify-start cursor-pointer hover:text-current")}>
              <item.icon />
              <span>{item.title}</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </a>
      {/if}
    {/each}
  </Sidebar.Menu>
</Sidebar.Group>
