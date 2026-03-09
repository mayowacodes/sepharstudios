<script lang="ts">
	import { onMount } from 'svelte';

	let daysLeft = $state<number | null>(null);
	let isTrial = $state(false);
	let plan = $state('');
	let dismissed = $state(false);

	onMount(async () => {
		try {
			const res = await fetch('/api/subscriptions/status');
			if (!res.ok) return;
			const data = await res.json();
			isTrial = data.isTrial;
			daysLeft = data.trialDaysLeft;
			plan = data.plan ?? '';
		} catch {
			// Silently fail — banner is non-critical
		}
	});
</script>

{#if isTrial && daysLeft !== null && !dismissed}
	<div class="relative flex items-center justify-between gap-4 bg-[#FFBF00]/10 border border-[#FFBF00]/30 text-[#FFBF00] px-4 py-2 text-sm rounded-lg">
		<div class="flex items-center gap-2">
			<span class="text-base">⏳</span>
			{#if daysLeft > 7}
				<span>You're on a free trial of the <strong class="capitalize">{plan}</strong> plan. Enjoy!</span>
			{:else if daysLeft > 0}
				<span><strong>{daysLeft} day{daysLeft === 1 ? '' : 's'}</strong> left on your free trial. Your card will be charged when it ends.</span>
			{:else}
				<span>Your free trial ends <strong>today</strong>. You'll be charged at midnight.</span>
			{/if}
		</div>
		<div class="flex items-center gap-3 shrink-0">
			<a href="/profile" class="underline underline-offset-2 hover:opacity-80 transition-opacity">Manage</a>
			<button
				onclick={() => (dismissed = true)}
				class="text-[#FFBF00]/60 hover:text-[#FFBF00] transition-colors"
				aria-label="Dismiss"
			>✕</button>
		</div>
	</div>
{/if}
