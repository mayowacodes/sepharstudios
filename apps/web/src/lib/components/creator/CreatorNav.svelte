<!-- Creator Navigation -->
<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  
  const navItems = [
    { href: '/creator', label: 'Dashboard', icon: '🏠' },
    { href: '/creator/upload', label: 'Upload', icon: '📤' },
    { href: '/creator/content', label: 'Content', icon: '🎬' },
    { href: '/creator/analytics', label: 'Analytics', icon: '📊' },
    { href: '/creator/profile', label: 'Profile', icon: '👤' },
    { href: '/creator/guidelines', label: 'Guidelines', icon: '📋' }
  ];
  
  const isActive = (path: string) => {
    if (path === '/creator') {
      return page.url.pathname === '/creator';
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
          <img src="/logo-alone-sepharstudios.png" alt="Sephar Studios" class="h-8 w-auto object-contain" />
          <span class="text-2xl font-bold">Sephar Studios</span>
        </button>
        <span class="text-purple-400 font-medium">Creator Studio</span>
      </div>
      
      <!-- Navigation Items -->
      <div class="hidden md:flex items-center space-x-1">
        {#each navItems as item}
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
        <button class="text-gray-300 hover:text-white">
          🔔
        </button>
        <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          M
        </div>
      </div>
    </div>
  </div>
</nav>
