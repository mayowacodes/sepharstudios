<script lang="ts">
  import { page } from '$app/state';
  import { cn } from '$lib/utils';
  import { Home, Film, Tv, Heart, History, Download } from '@lucide/svelte';

  const navigation = [
    {
      title: 'Home',
      href: '/',
      icon: Home
    },
    {
      title: 'Movies',
      href: '/movies',
      icon: Film
    },
    {
      title: 'TV Shows',
      href: '/shows',
      icon: Tv
    },
    {
      title: 'My List',
      href: '/my-list',
      icon: Heart
    },
    {
      title: 'History',
      href: '/library',
      icon: History
    },
    {
      title: 'Downloads',
      href: '/offline',
      icon: Download
    }
  ];
</script>

<aside class="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-56 border-r bg-background">
  <div class="space-y-4 py-4">
    <div class="px-3 py-2">
      <div class="space-y-1">
        {#each navigation as item}
          <a
            href={item.href}
            class={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              page.url.pathname === item.href ? "bg-accent" : "transparent"
            )}
          >
            <svelte:component this={item.icon} class="mr-2 h-4 w-4" />
            {item.title}
          </a>
        {/each}
      </div>
    </div>
  </div>
</aside>