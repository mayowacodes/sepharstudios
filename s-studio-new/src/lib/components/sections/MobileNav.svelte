<script lang="ts">
  import { page } from '$app/state';
  import { cn } from '$lib/utils';
  import { Home, Play, History, Download, Search, Menu } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
  } from '$lib/components/ui/sheet';

  export let routes = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      match: /^\/$/
    },
    {
      label: 'Browse',
      icon: Play,
      href: '/browse',
      match: /^\/browse/
    },
    {
      label: 'Search',
      icon: Search,
      href: '/search',
      match: /^\/search/
    },
    {
      label: 'History',
      icon: History,
      href: '/history',
      match: /^\/history/
    },
    {
      label: 'Downloads',
      icon: Download,
      href: '/downloads',
      match: /^\/downloads/
    }
  ];

  let open = false;
</script>

<Sheet bind:open>
  <SheetTrigger>
    <Button variant="ghost" size="icon" 
    class="md:hidden" 
  >
    <Menu class="h-5 w-5" />
    <span class="sr-only">Toggle menu</span>
  </Button>
  </SheetTrigger>
  <SheetContent side="left" class="w-72">
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
    </SheetHeader>
    <nav class="mt-4">
      <ul class="space-y-2">
        {#each routes as route}
          <li>
            <Button
              href={route.href}
              class="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg" 
              onclick={() => open = false}
            >
            <svelte:component this={route.icon} className="h-4 w-4" /> 
            {route.label}
            </Button>
          </li>
        {/each}
      </ul>
    </nav>
  </SheetContent>
</Sheet>