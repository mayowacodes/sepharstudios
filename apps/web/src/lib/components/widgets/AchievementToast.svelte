<script lang="ts">
	import { onMount } from 'svelte';

	interface Achievement {
		code: string;
		name: string;
		icon?: string;
		stcReward: number;
	}

	interface Props {
		achievement: Achievement;
		onDismiss?: () => void;
	}

	let { achievement, onDismiss }: Props = $props();
	let visible = $state(false);

	onMount(() => {
		// Animate in
		requestAnimationFrame(() => { visible = true; });
		// Auto-dismiss after 5s
		const t = setTimeout(() => {
			visible = false;
			setTimeout(() => onDismiss?.(), 300);
		}, 5000);
		return () => clearTimeout(t);
	});
</script>

<div
	class="fixed bottom-6 right-6 z-50 transition-all duration-300 {visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}"
>
	<div class="bg-[#1a1a2e] border border-[#FFBF00]/40 rounded-2xl p-4 shadow-2xl shadow-black/60 max-w-xs flex items-start gap-3">
		<div class="w-12 h-12 rounded-full bg-[#FFBF00]/15 flex items-center justify-center text-2xl shrink-0">
			{achievement.icon ?? '🏆'}
		</div>
		<div class="min-w-0">
			<div class="text-xs text-[#FFBF00] font-semibold uppercase tracking-wider mb-0.5">Achievement Unlocked!</div>
			<div class="text-white font-bold text-sm">{achievement.name}</div>
			{#if achievement.stcReward > 0}
				<div class="text-[#FFBF00] text-xs mt-0.5">+{achievement.stcReward} STC earned</div>
			{/if}
		</div>
		<button onclick={() => { visible = false; setTimeout(() => onDismiss?.(), 300); }} class="text-gray-500 hover:text-white shrink-0 transition-colors" aria-label="Dismiss">✕</button>
	</div>
</div>
