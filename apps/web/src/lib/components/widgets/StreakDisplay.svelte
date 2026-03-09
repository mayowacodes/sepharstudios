<script lang="ts">
	import { onMount } from 'svelte';

	let streak = $state(0);
	let longest = $state(0);

	onMount(async () => {
		try {
			const res = await fetch('/api/achievements');
			if (res.ok) {
				const data = await res.json();
				streak = data.streak?.currentStreak ?? 0;
				longest = data.streak?.longestStreak ?? 0;
			}
		} catch {
			// Non-critical
		}
	});
</script>

{#if streak > 0}
	<div class="flex items-center gap-2 text-sm">
		<span class="text-xl" title="Watching streak">{streak >= 7 ? '🔥' : '✨'}</span>
		<div>
			<span class="text-white font-semibold">{streak}</span>
			<span class="text-gray-400"> day streak</span>
		</div>
		{#if longest > streak}
			<span class="text-gray-600 text-xs">· best: {longest}</span>
		{/if}
	</div>
{/if}
