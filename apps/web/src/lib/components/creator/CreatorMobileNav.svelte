<script lang="ts">
  import { page } from '$app/state';
  import { Home, Upload, Video, BarChart3, MessageSquare } from '@lucide/svelte';

  /**
   * Fixed bottom nav for the creator portal on small screens. Five
   * touch-targets at 44+ px high. Hidden at md: breakpoint and up so the
   * top CreatorNav takes over.
   */

  const items = [
    { href: '/creator', label: 'Home', icon: Home },
    { href: '/creator/upload', label: 'Upload', icon: Upload },
    { href: '/creator/content', label: 'Content', icon: Video },
    { href: '/creator/analytics', label: 'Stats', icon: BarChart3 },
    { href: '/creator/inbox', label: 'Inbox', icon: MessageSquare }
  ];

  const isActive = (href: string) => {
    if (href === '/creator') return page.url.pathname === '/creator';
    return page.url.pathname.startsWith(href);
  };
</script>

<nav
  aria-label="Creator portal"
  class="md:hidden fixed bottom-0 inset-x-0 z-30 bg-gray-900/95 backdrop-blur-md border-t border-white/10"
>
  <ul class="flex items-stretch justify-around">
    {#each items as item (item.href)}
      {@const Icon = item.icon}
      <li class="flex-1">
        <a
          href={item.href}
          class="flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors {isActive(item.href) ? 'text-purple-300' : 'text-gray-400 hover:text-white'}"
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <Icon class="w-5 h-5" aria-hidden="true" />
          <span class="text-[10px]">{item.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>

<!-- Spacer so content isn't covered by the fixed nav on mobile. -->
<div class="md:hidden h-14" aria-hidden="true"></div>
