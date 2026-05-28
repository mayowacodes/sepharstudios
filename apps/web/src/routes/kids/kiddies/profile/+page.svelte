<!-- src/routes/kids/teens/profile/+page.svelte -->
<script lang="ts">
    let selectedAvatar = localStorage.getItem('avatar') || '/avatars/teen-1.png';
  
    const avatars = [
      '/avatars/teen-1.png',
      '/avatars/teen-2.png',
      '/avatars/teen-3.png',
      '/avatars/teen-4.png'
    ];
  
    function selectAvatar(avatar: string) {
      selectedAvatar = avatar;
      localStorage.setItem('avatar', avatar);
    }
  </script>
  
  <main class="p-8">
    <h1 class="text-3xl font-bold text-purple-700 mb-4">Choose Your Teen Avatar</h1>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {#each avatars as avatar}
        <button
          type="button"
          on:click={() => selectAvatar(avatar)}
          aria-label="Choose avatar"
          aria-pressed={selectedAvatar === avatar}
          class="rounded-full focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <img
            src={avatar}
            alt=""
            class="w-24 h-24 rounded-full border-4 {selectedAvatar === avatar ? 'border-purple-500' : 'border-transparent'} hover:scale-110 transition"
          />
        </button>
      {/each}
    </div>
    <p class="mt-6 text-lg">Your selected avatar will appear in the top navigation.</p>
  </main>
  