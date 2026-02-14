<script lang="ts">
  import { page } from '$app/state';
  import { cn } from '$lib/utils';
  import { Home, Play, History, Download, Search, Settings } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';

  const routes = [
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
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      match: /^\/settings/
    }
  ];
</script>

<nav class="hidden md:flex">
  <ul class="flex items-center gap-1">
    {#each routes as route}
      {@const isActive = route.match.test(page.url.pathname)}
      <li>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          size="sm"
          href={route.href}
          class={cn(  // Changed 'class' to 'className'
          "gap-2",
          isActive && "pointer-events-none"
      )}
        >
          <svelte:component this={route.icon} class="h-4 w-4" />
          {route.label}
        </Button>
      </li>
    {/each}
  </ul>
</nav>