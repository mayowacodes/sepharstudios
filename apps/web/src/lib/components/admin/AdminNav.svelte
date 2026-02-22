<!-- Admin Navigation -->
<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/review', label: 'Review Queue', icon: '👁️' },
    { href: '/admin/content', label: 'Content', icon: '🎬' },
    { href: '/admin/creators', label: 'Creators', icon: '👥' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];
  
  const isActive = (path: string) => {
    if (path === '/admin') {
      return page.url.pathname === '/admin';
    }
    return page.url.pathname.startsWith(path);
  };
  
  function goToMainSite() {
    goto('/');
  }
</script>

<nav class="bg-black/20 backdrop-blur-sm border-b border-white/10">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center space-x-4">
        <button on:click={goToMainSite} class="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
          <img src="/asl-logo.png" alt="ASL Logo" class="h-8 w-auto object-contain" />
          <span class="text-2xl font-bold">Sephar Studios</span>
        </button>
        <span class="text-red-400 font-medium">Admin Panel</span>
      </div>
      
      <!-- Navigation Items -->
      <div class="hidden md:flex items-center space-x-1">
        {#each navItems as item}
          <a 
            href={item.href} 
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all {isActive(item.href) ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        {/each}
      </div>
      
      <!-- Admin User Menu -->
      <div class="flex items-center space-x-4">
        <button class="text-gray-300 hover:text-white">
          🔔
        </button>
        <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </div>
  </div>
</nav>
