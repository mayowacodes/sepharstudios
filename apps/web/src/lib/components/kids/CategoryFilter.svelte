<script lang="ts">
  export let categories: string[] = [];
  export let selected: string | null;
</script>

<div class="text-center mb-6">
  <label for="genre-select" class="text-md font-semibold mr-2">
    🎬 Choose a Genre:
  </label>
  <select
    id="genre-select"
    bind:value={selected}
    class="p-2 border border-yellow-400 rounded bg-white text-gray-800"
  >
    <option value={null}>All</option>
    {#each categories as cat}
      <option value={cat}>{cat}</option>
    {/each}
  </select>
</div>
