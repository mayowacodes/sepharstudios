<script lang="ts">
	import { onMount } from 'svelte';
	import { Coins, Flame, Sparkles } from '@lucide/svelte';

	interface Props {
		/** compact = small nav chip; detailed = full card with progress bar */
		variant?: 'compact' | 'detailed';
	}
	let { variant = 'compact' }: Props = $props();

	let currentStreak = $state(0);
	let longestStreak = $state(0);
	let balance = $state(0);
	let hoursWatched = $state(0);
	let hoursToNextToken = $state(20);
	let hoursPerToken = $state(20);
	let dailyCapRemaining = $state(5);
	let readyToClaim = $state(false);
	let loading = $state(true);

	async function load() {
		try {
			const [ach, bal] = await Promise.all([
				fetch('/api/achievements').then((r) => (r.ok ? r.json() : null)),
				fetch('/api/users/me/stc-balance').then((r) => (r.ok ? r.json() : null))
			]);
			if (ach?.streak) {
				currentStreak = ach.streak.currentStreak ?? 0;
				longestStreak = ach.streak.longestStreak ?? 0;
			}
			if (bal) {
				balance = bal.total ?? 0;
				hoursWatched = bal.hoursWatched ?? 0;
				hoursToNextToken = bal.hoursToNextToken ?? hoursPerToken;
				hoursPerToken = bal.hoursPerToken ?? 20;
				dailyCapRemaining = bal.dailyCapRemaining ?? 5;
				readyToClaim = bal.readyToClaim ?? false;
			}
		} catch {
			// Non-critical — widget simply stays at zero.
		} finally {
			loading = false;
		}
	}

	onMount(load);

	const pct = $derived(
		hoursPerToken > 0
			? Math.min(100, Math.round(((hoursPerToken - hoursToNextToken) / hoursPerToken) * 100))
			: 0
	);
	// Capitalized so it renders directly as a dynamic component —
	// <svelte:component> is deprecated in runes mode.
	const StreakIcon = $derived(currentStreak >= 7 ? Flame : Sparkles);
</script>

{#if variant === 'compact'}
	<div class="flex items-center gap-3 text-sm">
		<span class="flex items-center gap-1" title="Watching streak">
			{#if currentStreak > 0}
				<StreakIcon class="w-4 h-4 text-orange-400" />
				<span class="text-white font-semibold">{currentStreak}</span>
			{/if}
		</span>
		<span class="flex items-center gap-1" title="STC balance">
			<Coins class="w-4 h-4 text-yellow-400" />
			<span class="text-white font-semibold">{balance}</span>
		</span>
	</div>
{:else}
	<div class="rounded-2xl border border-border bg-card/60 p-5 space-y-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				{#if currentStreak > 0}
					<StreakIcon class="w-5 h-5 text-orange-400" />
					<div>
						<div class="text-white font-semibold leading-tight">{currentStreak}-day streak</div>
						{#if longestStreak > currentStreak}
							<div class="text-xs text-muted-foreground">best: {longestStreak}</div>
						{/if}
					</div>
				{:else}
					<Sparkles class="w-5 h-5 text-muted-foreground" />
					<div class="text-sm text-muted-foreground">No streak yet — start watching!</div>
				{/if}
			</div>
			<div class="flex items-center gap-1.5 text-yellow-400">
				<Coins class="w-5 h-5" />
				<span class="text-lg font-bold text-white">{balance}</span>
				<span class="text-xs text-muted-foreground">STC</span>
			</div>
		</div>

		<div>
			<div class="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
				<span>
					{readyToClaim
						? '🎉 Token ready to claim!'
						: `${hoursToNextToken.toFixed(1)}h to next STC token`}
				</span>
				<span>{hoursWatched.toFixed(1)}h watched</span>
			</div>
			<div class="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
				<div
					class="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
					style="width: {pct}%"
				></div>
			</div>
			<div class="mt-1.5 text-[11px] text-muted-foreground">
				1 STC per {hoursPerToken}h watched · max {dailyCapRemaining} more today
			</div>
		</div>
	</div>
{/if}
