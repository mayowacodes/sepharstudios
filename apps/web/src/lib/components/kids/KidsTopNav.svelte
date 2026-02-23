<!-- src/lib/components/kids/KidsTopNav.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  
  let avatar = '';
  let avatarType = '';
  let mounted = false;
  
  const avatars = [
    { name: 'Lambie', emoji: '🐑' },
    { name: 'Dove', emoji: '🕊️' },
    { name: 'Lionheart', emoji: '🦁' },
    { name: 'Angel', emoji: '👼' },
  ];

  onMount(() => {
    mounted = true;
    avatar = localStorage.getItem('avatar') || '0';
    avatarType = localStorage.getItem('avatarType') || 'emoji';
  });
  
  // Get current age group from the URL path
  $: currentAgeGroup = page.url.pathname.includes('/teens') ? 'teens' : 'kiddies';
  
  function navigateTo(section: string) {
    goto(`/kids/${currentAgeGroup}/${section}`);
  }
  
  function changeProfile() {
    goto('/kids/profile');
  }
  
  function goHome() {
    goto(`/kids/${currentAgeGroup}`);
  }
  
  function switchAgeGroup(newAgeGroup: 'kiddies' | 'teens') {
    // Update localStorage to remember user's preference
    localStorage.setItem('ageGroup', newAgeGroup);
    goto(`/kids/${newAgeGroup}`);
  }
  
  function goToMain() {
    goto('/');
  }
  
  // Get avatar display based on type
  function getAvatarDisplay() {
    if (avatarType === 'image') {
      return { type: 'image', data: avatar };
    } else {
      const avatarIndex = parseInt(avatar) || 0;
      return { type: 'emoji', data: avatars[avatarIndex]?.emoji || '😊', name: avatars[avatarIndex]?.name || 'Profile' };
    }
  }
  
  $: avatarDisplay = mounted ? getAvatarDisplay() : { type: 'emoji', data: '😊', name: 'Profile' };
</script>

{#if mounted}
<nav class="bg-linear-to-r from-pink-100 to-yellow-100 border-b-4 border-yellow-300 shadow-sm">
  <div class="container flex items-center justify-between py-3">
  <div class="flex items-center gap-4">
    <button on:click={goHome} class="text-2xl font-bold text-pink-700 hover:text-pink-600 transition-colors">
      Faith Kids
    </button>
    
    <!-- Age Group Switcher -->
    <div class="flex items-center gap-1 bg-white/60 rounded-lg p-1">
      <button 
        on:click={() => switchAgeGroup('kiddies')}
        class="px-3 py-1 text-sm font-semibold rounded-md transition-all {currentAgeGroup === 'kiddies' ? 'bg-yellow-300 text-pink-700 shadow-sm' : 'text-pink-600 hover:bg-yellow-100'}"
      >
        👶 Kiddies
      </button>
      <button 
        on:click={() => switchAgeGroup('teens')}
        class="px-3 py-1 text-sm font-semibold rounded-md transition-all {currentAgeGroup === 'teens' ? 'bg-blue-300 text-purple-700 shadow-sm' : 'text-purple-600 hover:bg-blue-100'}"
      >
        👦👧 Teens
      </button>
    </div>
  </div>
  
  <!-- Navigation Menu -->
  <div class="flex items-center gap-4">
    <div class="hidden md:flex items-center gap-2">
      <button 
        on:click={() => navigateTo('movies')}
        class="px-3 py-1 text-sm font-medium text-pink-700 hover:bg-pink-200 rounded-lg transition-colors"
      >
        🎬 Movies
      </button>
      <button 
        on:click={() => navigateTo('shows')}
        class="px-3 py-1 text-sm font-medium text-pink-700 hover:bg-pink-200 rounded-lg transition-colors"
      >
        📺 Shows  
      </button>
      <button 
        on:click={() => navigateTo('documentaries')}
        class="px-3 py-1 text-sm font-medium text-pink-700 hover:bg-pink-200 rounded-lg transition-colors"
      >
        📚 Docs
      </button>
    </div>
    
    <!-- Profile Section -->
    <button 
      on:click={changeProfile}
      class="flex items-center gap-2 bg-white/80 hover:bg-white px-3 py-2 rounded-lg transition-colors border border-pink-200"
      title="Change Profile"
    >
      {#if avatarDisplay.type === 'image'}
        <img 
          src={avatarDisplay.data} 
          alt="Profile" 
          class="w-8 h-8 rounded-full object-cover border-2 border-pink-300" 
        />
      {:else}
        <span class="text-2xl">{avatarDisplay.data}</span>
      {/if}
      <span class="text-sm font-medium text-pink-700 hidden sm:block">
        {avatarDisplay.type === 'image' ? 'Profile' : avatarDisplay.name}
      </span>
    </button>
    
    <!-- Back to Main Site Button -->
    <button 
      on:click={goToMain}
      class="flex items-center gap-1 px-3 py-1 text-sm font-medium text-purple-700 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
      title="Back to Main Site"
    >
      ← Adult Content
    </button>
  </div>
  </div>
</nav>
{/if}