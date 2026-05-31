<!-- Creator Navigation -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { navigateToMainSite } from '$lib/utils/portal-navigation';
  import { Bell } from '@lucide/svelte';

  const navItems = [
    { href: '/creator', label: 'Dashboard', icon: '🏠' },
    { href: '/creator/upload', label: 'Upload', icon: '📤' },
    { href: '/creator/live', label: 'Live', icon: '📡' },
    { href: '/creator/content', label: 'Content', icon: '🎬' },
    { href: '/creator/analytics', label: 'Analytics', icon: '📊' },
    { href: '/creator/moderation', label: 'Moderation', icon: '🛡️' },
    { href: '/creator/profile', label: 'Profile', icon: '👤' },
    { href: '/creator/guidelines', label: 'Guidelines', icon: '📋' }
  ];

  const user = $derived(page.data.user as { name?: string; image?: string | null } | undefined);
  const initial = $derived((user?.name ?? 'M').trim().charAt(0).toUpperCase() || 'M');

  // Unread admin-message count for the Bell badge. Polls on mount only —
  // refreshes whenever the creator navigates anywhere.
  let unreadCount = $state(0);
  onMount(async () => {
    try {
      const res = await fetch('/api/creator/messages?status=unread&countOnly=1');
      if (res.ok) unreadCount = (await res.json()).count ?? 0;
    } catch {
      // silent — badge stays at 0
    }
  });

  const isActive = (path: string) => {
    if (path === '/creator') {
      return page.url.pathname === '/creator';
    }
    return page.url.pathname.startsWith(path);
  };

  function goToMainSite() {
    navigateToMainSite();
  }
</script>

<nav class="bg-black/20 backdrop-blur-sm border-b border-white/10">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center space-x-4">
        <button type="button" onclick={goToMainSite} class="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
          <img src="/logo-alone-sepharstudios-bgless.png" alt="Sephar Studios" class="h-8 w-auto object-contain" />
          <span class="text-2xl font-bold">Sephar Studios</span>
        </button>
        <a
          href="/creator"
          class="text-purple-400 hover:text-purple-200 font-medium transition-colors"
          aria-label="Creator Studio home"
        >
          Creator Studio
        </a>
      </div>

      <!-- Navigation Items -->
      <div class="hidden md:flex items-center space-x-1">
        {#each navItems as item (item.href)}
          <a
            href={item.href}
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all {isActive(item.href) ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        {/each}
      </div>

      <!-- User Menu -->
      <div class="flex items-center space-x-4">
        <!-- ⌘K hint chip -->
        <span class="hidden md:inline-flex items-center gap-1 text-[10px] text-gray-400 surface-1 rounded-md px-2 py-1 font-mono">
          <kbd>⌘</kbd><kbd>K</kbd>
        </span>
        <a
          href="/creator/inbox"
          class="relative text-gray-300 hover:text-white transition-colors inline-flex items-center"
          aria-label={unreadCount > 0 ? `Inbox (${unreadCount} unread)` : 'Inbox'}
          title="Inbox"
        >
          <Bell class="w-5 h-5" aria-hidden="true" />
          {#if unreadCount > 0}
            <span
              class="absolute -top-1 -right-2 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center glow-card"
              aria-hidden="true"
            >{unreadCount > 99 ? '99+' : unreadCount}</span>
          {/if}
        </a>
        <a
          href="/creator/profile"
          class="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white font-bold overflow-hidden transition-colors"
          aria-label={`Profile for ${user?.name ?? 'creator'}`}
          title={user?.name ?? 'Profile'}
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
