<!-- src/lib/components/kids/ProfileAgeGate.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';

  function choose(ageGroup: 'kiddies' | 'teens') {
    localStorage.setItem('ageGroup', ageGroup);
    goto(`/kids/${ageGroup}/profile`);
  }
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-100 text-center">
  <h1 class="text-4xl font-bold mb-6 text-pink-700">Who Are You?</h1>
  <div class="flex gap-8">
    <button on:click={() => choose('kiddies')} class="bg-yellow-300 text-white font-bold text-xl px-6 py-3 rounded-xl hover:bg-yellow-400">I'm a Kiddie!</button>
    <button on:click={() => choose('teens')} class="bg-purple-400 text-white font-bold text-xl px-6 py-3 rounded-xl hover:bg-purple-500">I’m a Teen!</button>
  </div>
</main>