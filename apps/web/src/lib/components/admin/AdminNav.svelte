<!-- Admin Navigation -->
<script lang="ts">
  import { page } from '$app/state';
  import { navigateToMainSite } from '$lib/utils/portal-navigation';
  import { Bell } from '@lucide/svelte';

  const user = $derived(page.data.user as { name?: string; image?: string | null } | undefined);
  const initial = $derived((user?.name ?? 'A').trim().charAt(0).toUpperCase() || 'A');

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'Home' },
    { href: '/admin/review', label: 'Review Queue', icon: 'Review' },
    { href: '/admin/content', label: 'Content', icon: 'Content' },
    { href: '/admin/creators', label: 'Creators', icon: 'Users' },
    { href: '/admin/creator-applications', label: 'Applications', icon: 'Apply' },
    { href: '/admin/analytics', label: 'Analytics', icon: 'Stats' },
    { href: '/admin/governance', label: 'Governance', icon: 'Gov' },
    { href: '/admin/settings', label: 'Settings', icon: 'Settings' }
  ];

  const externalLinks = [
    { href: 'https://creators.sepharstudios.com/creator', label: 'Creator Portal', icon: '🎬' },
    { href: 'https://sepharstudios.com', label: 'Main Site', icon: '🏠' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return page.url.pathname === '/admin';
    return page.url.pathname.startsWith(path);
  };

  function goToMainSite() {
    navigateToMainSite();
  }
</script>

<nav class="bg-black/20 backdrop-blur-sm border-b border-white/10">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center space-x-4">
        <button type="button" onclick={goToMainSite} class="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
          <img src="/logo-alone-sepharstudios-bgless.png" alt="Sephar Studios" class="h-8 w-auto object-contain" />
          <span class="text-2xl font-bold">Sephar Studios</span>
        </button>
        <span class="text-red-400 font-medium">Admin Panel</span>
      </div>

      <div class="hidden md:flex items-center space-x-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all {isActive(item.href) ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}"
          >
            <span class="text-xs uppercase tracking-wide">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        {/each}

        <span class="mx-2 text-gray-500">|</span>

        {#each externalLinks as item}
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <span class="text-xs">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        {/each}
      </div>

      <div class="flex items-center space-x-4">
        <a
          href="/admin/communications"
          class="text-gray-300 hover:text-white transition-colors inline-flex items-center"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell class="w-5 h-5" />
        </a>
        <a
          href="/admin/settings"
          class="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white font-bold overflow-hidden transition-colors"
          aria-label={`Account settings for ${user?.name ?? 'admin'}`}
          title={user?.name ?? 'Account'}
        >
          {#if user?.image}
            <img src={user.image} alt="" class="w-full h-full object-cover" />
          {:else}
            {initial}
          {/if}
        </a>
      </div>
    </div>
  </div>
</nav>
