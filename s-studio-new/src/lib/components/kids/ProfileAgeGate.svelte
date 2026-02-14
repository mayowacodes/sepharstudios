<script lang="ts">
  import { ageGroup, type AgeGroup } from '$lib/stores/ageGroup';
  import { goto } from '$app/navigation';

  function setAgeGroup(group: AgeGroup) {
    ageGroup.set(group);
    // Store in localStorage for persistence
    if (group) {
      localStorage.setItem('ageGroup', group);
      // Navigate to the selected age group section
      goto(`/kids/${group}`);
    }
  }
</script>

<div class="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
  <button
    on:click={() => setAgeGroup('kiddies')}
    class="text-xl font-semibold bg-yellow-300 hover:bg-yellow-400 transition-colors px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
  >
    I'm a Kiddie
  </button>

  <button
    on:click={() => setAgeGroup('teens')}
    class="text-xl font-semibold bg-blue-400 hover:bg-blue-500 transition-colors px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
  >
    I'm a Teen
  </button>
</div>