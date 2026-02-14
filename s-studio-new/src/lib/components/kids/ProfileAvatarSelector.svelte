<script lang="ts">
  import { onMount } from 'svelte';

  export let avatars: string[] = [];
  export let redirectTo: string = '/kids';
  export let selectedAvatar: string | null = null; // input/output binding

  // Function to select avatar
  function selectAvatar(avatar: string) {
    selectedAvatar = avatar;
    localStorage.setItem('kidAvatar', avatar);
    window.location.href = redirectTo;
  }

  onMount(() => {
    const storedAvatar = localStorage.getItem('kidAvatar');
    if (storedAvatar) {
      selectedAvatar = storedAvatar;
      window.location.href = redirectTo;
    }
  });
</script>

<div class="text-center">
  <h2 class="text-2xl font-bold mb-4">Choose Your Avatar</h2>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center">
    {#each avatars as avatar}
      <button
        type="button"
        class="w-20 h-20 rounded-full border-4 hover:border-yellow-500 transition cursor-pointer p-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-yellow-500"
        on:click={() => selectAvatar(avatar)}
        aria-label="Select avatar"
      >
        <img
          src={avatar}
          alt="Avatar"
          class="w-full h-full object-cover rounded-full pointer-events-none"
        />
      </button>
    {/each}
  </div>
</div>