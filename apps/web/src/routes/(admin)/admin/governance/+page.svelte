<script lang="ts">
	import { onMount } from 'svelte';
	import GovernanceStatusCard from '$lib/components/admin/governance/GovernanceStatusCard.svelte';
	import { Landmark } from '@lucide/svelte';
	import PortalHero from '$lib/components/portal/PortalHero.svelte';
	import PortalButton from '$lib/components/portal/PortalButton.svelte';

	type StatusResponse = {
		policyMode: string;
		mintAuthorityEnabled: boolean;
		timelockDelays: { routineHours: number; monetaryChangeHours: number };
		multisig: { threshold: number; totalSigners: number };
		metrics: {
			activeSubscriptions: number;
			activeContentItems: number;
			totalProposals: number;
			queuedActions: number;
			auditEvents: number;
		};
		incident: { id: string; reason: string; triggeredAt: string } | null;
	};

	let loading = $state(true);
	let status = $state<StatusResponse | null>(null);

	onMount(async () => {
		try {
			const res = await fetch('/api/admin/governance/status');
			if (res.ok) status = await res.json();
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Governance - Admin</title>
</svelte:head>

<div class="mx-auto px-4 py-8 space-y-6 max-w-7xl">
	<PortalHero
		compact
		eyebrow="DAO"
		title="Governance"
		subtitle="DAO proposals, treasury, and on-chain controls."
		icon={Landmark}
	>
		{#snippet actions()}
			<PortalButton href="/admin/governance/create" variant="primary" size="sm">+ New Proposal</PortalButton>
		{/snippet}
	</PortalHero>

	{#if loading}
		<div class="grid md:grid-cols-4 gap-4">
			{#each [1, 2, 3, 4] as _}
				<div class="h-24 rounded-xl surface-1 animate-pulse"></div>
			{/each}
		</div>
	{:else if status}
		<div class="grid md:grid-cols-4 gap-4">
			<GovernanceStatusCard title="Policy Mode" value={status.policyMode} tone="good" />
			<GovernanceStatusCard title="Mint Authority" value={status.mintAuthorityEnabled ? 'Enabled' : 'Disabled'} tone={status.mintAuthorityEnabled ? 'danger' : 'good'} />
			<GovernanceStatusCard title="Queued Actions" value={status.metrics.queuedActions} subtitle={`${status.metrics.totalProposals} proposals total`} tone="warn" />
			<GovernanceStatusCard title="Active Subs" value={status.metrics.activeSubscriptions} subtitle={`${status.metrics.activeContentItems} active content`} />
		</div>

		<div class="grid md:grid-cols-2 gap-4">
			<div class="rounded-xl border border-border/40 surface-1 p-4">
				<h2 class="text-lg font-semibold text-foreground mb-2">Timelock Delays</h2>
				<p class="text-sm text-foreground/80">Routine actions: {status.timelockDelays.routineHours}h</p>
				<p class="text-sm text-foreground/80">Monetary changes: {status.timelockDelays.monetaryChangeHours}h</p>
			</div>
			<div class="rounded-xl border border-border/40 surface-1 p-4">
				<h2 class="text-lg font-semibold text-foreground mb-2">Multisig & Emergency</h2>
				<p class="text-sm text-foreground/80 mb-2">
					Multisig threshold: {status.multisig.threshold}/{status.multisig.totalSigners}
				</p>
				<p class="text-xs text-muted-foreground mb-2">Audit events: {status.metrics.auditEvents}</p>
				{#if status.incident}
					<p class="text-sm text-red-300">Active pause: {status.incident.reason}</p>
					<p class="text-xs text-muted-foreground mt-1">{new Date(status.incident.triggeredAt).toLocaleString()}</p>
				{:else}
					<p class="text-sm text-green-300">No active incident.</p>
				{/if}
			</div>
		</div>
	{/if}

	<div class="grid md:grid-cols-3 gap-4">
		<a href="/admin/governance/proposals" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors">
			<h3 class="text-foreground font-semibold">Proposals</h3>
			<p class="text-xs text-muted-foreground mt-1">View and review governance proposals</p>
		</a>
		<a href="/admin/governance/execution" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors">
			<h3 class="text-foreground font-semibold">Execution</h3>
			<p class="text-xs text-muted-foreground mt-1">Queue and execute timelock actions</p>
		</a>
		<a href="/admin/governance/treasury" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors">
			<h3 class="text-foreground font-semibold">Treasury</h3>
			<p class="text-xs text-muted-foreground mt-1">Monitor pools, inflows and runway</p>
		</a>
		<a href="/admin/governance/emergency" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors">
			<h3 class="text-foreground font-semibold">Emergency</h3>
			<p class="text-xs text-muted-foreground mt-1">Pause controls and incident logs</p>
		</a>
		<a href="/admin/governance/roles" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors">
			<h3 class="text-foreground font-semibold">Roles</h3>
			<p class="text-xs text-muted-foreground mt-1">Permissions matrix and admin roster</p>
		</a>
		<a href="/admin/governance/reports" class="rounded-xl border border-border/40 surface-1 p-4 hover:surface-2 transition-colors">
			<h3 class="text-foreground font-semibold">Reports</h3>
			<p class="text-xs text-muted-foreground mt-1">Generate governance transparency reports</p>
		</a>
	</div>
</div>
