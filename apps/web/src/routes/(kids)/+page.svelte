<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  onMount(() => {
    if (browser) {
      const ageGroup = localStorage.getItem('ageGroup');
      const avatar = localStorage.getItem('avatar');
      
      if (ageGroup && avatar) {
        // User has completed setup, redirect to their section
        goto(`/kids/${ageGroup}`, { replaceState: true });
      }
      // Always show age selection first - even if they have a profile, 
      // they might want to switch between kids/teens
    }
  });

  function chooseAge(group: 'kiddies' | 'teens') {
    // Store the selected age group and go to profile selection
    localStorage.setItem('selectedAgeGroup', group);
    goto('/kids/profile');
  }
</script>

<main class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-pink-300 text-center p-4">
  <!-- Age Group Selection -->
  <h1 class="text-5xl font-extrabold text-pink-700 mb-10">Welcome to Faith Kids!</h1>
  <p class="text-lg text-pink-800 mb-8">Choose your adventure:</p>
  <div class="space-x-4">
    <button 
      on:click={() => chooseAge('kiddies')} 
      class="text-xl bg-yellow-400 px-6 py-3 rounded-xl hover:bg-yellow-500 transition-colors"
    >
      I'm a Kiddie 👶
    </button>
    <button 
      on:click={() => chooseAge('teens')} 
      class="text-xl bg-blue-400 px-6 py-3 rounded-xl hover:bg-blue-500 transition-colors"
    >
      I'm a Teen 👦👧
    </button>
  </div>
</main>
