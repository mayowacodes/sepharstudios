<script lang="ts">
	import { onMount } from 'svelte';
	import TreasuryPoolsTable from '$lib/components/admin/governance/TreasuryPoolsTable.svelte';
	import GovernanceStatusCard from '$lib/components/admin/governance/GovernanceStatusCard.svelte';
	import { Wallet } from '@lucide/svelte';
	import PortalHero from '$lib/components/portal/PortalHero.svelte';

	type TreasuryData = {
		pools: Array<{ key: string; label: string; control: string; status: string }>;
		revenue: {
			ppvRevenueCents: number;
			estimatedSubscriptionRevenueCents: number;
			estimatedMonthlyRevenueCents: number;
			estimatedAnnualRevenueUsd: number;
		};
		runway: { baseCaseYears: number; targetYears: number };
		activity: { activeSubscriptions: number; watchEvents: number };
	};

	let loading = $state(true);
	let data = $state<TreasuryData | null>(null);

	onMount(async () => {
		try {
			const res = await fetch('/api/admin/governance/treasury');
			if (res.ok) data = await res.json();
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Governance Treasury - Admin</title>
</svelte:head>

<div class="mx-auto px-4 py-8 space-y-6 max-w-7xl">
	<PortalHero compact eyebrow="DAO · Vault" title="Treasury monitor" subtitle="Pool balances, flows, and buyback execution." icon={Wallet} />

	{#if loading}
		<p class="text-sm text-muted-foreground">Loading treasury data...</p>
	{:else if data}
		<div class="grid md:grid-cols-4 gap-4">
			<GovernanceStatusCard title="Active Subs" value={data.activity.activeSubscriptions} />
			<GovernanceStatusCard title="Monthly Revenue (est.)" value={`$${(data.revenue.estimatedMonthlyRevenueCents / 100).toLocaleString()}`} tone="good" />
			<GovernanceStatusCard title="Runway (base)" value={`${data.runway.baseCaseYears} years`} tone={data.runway.baseCaseYears >= data.runway.targetYears ? 'good' : 'warn'} />
			<GovernanceStatusCard title="Watch Events" value={data.activity.watchEvents.toLocaleString()} />
		</div>

		<div class="rounded-xl border border-border/40 surface-1 p-4">
			<h2 class="text-lg font-semibold text-foreground mb-3">Pool Control Status</h2>
			<TreasuryPoolsTable pools={data.pools} />
		</div>
	{/if}
</div>

