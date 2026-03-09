<script lang="ts">
	import { onMount } from 'svelte';
	import GovernanceStatusCard from '$lib/components/admin/governance/GovernanceStatusCard.svelte';

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

<div class="container mx-auto px-4 py-8 space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-white">Governance Control Center</h1>
		<a href="/admin/governance/create" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">New Proposal</a>
	</div>

	{#if loading}
		<div class="grid md:grid-cols-4 gap-4">
			{#each [1, 2, 3, 4] as _}
				<div class="h-24 rounded-xl bg-white/5 animate-pulse"></div>
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
			<div class="rounded-xl border border-white/10 bg-white/5 p-4">
				<h2 class="text-lg font-semibold text-white mb-2">Timelock Delays</h2>
				<p class="text-sm text-gray-300">Routine actions: {status.timelockDelays.routineHours}h</p>
				<p class="text-sm text-gray-300">Monetary changes: {status.timelockDelays.monetaryChangeHours}h</p>
			</div>
			<div class="rounded-xl border border-white/10 bg-white/5 p-4">
				<h2 class="text-lg font-semibold text-white mb-2">Multisig & Emergency</h2>
				<p class="text-sm text-gray-300 mb-2">
					Multisig threshold: {status.multisig.threshold}/{status.multisig.totalSigners}
				</p>
				<p class="text-xs text-gray-400 mb-2">Audit events: {status.metrics.auditEvents}</p>
				{#if status.incident}
					<p class="text-sm text-red-300">Active pause: {status.incident.reason}</p>
					<p class="text-xs text-gray-400 mt-1">{new Date(status.incident.triggeredAt).toLocaleString()}</p>
				{:else}
					<p class="text-sm text-green-300">No active incident.</p>
				{/if}
			</div>
		</div>
	{/if}

	<div class="grid md:grid-cols-3 gap-4">
		<a href="/admin/governance/proposals" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
			<h3 class="text-white font-semibold">Proposals</h3>
			<p class="text-xs text-gray-400 mt-1">View and review governance proposals</p>
		</a>
		<a href="/admin/governance/execution" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
			<h3 class="text-white font-semibold">Execution</h3>
			<p class="text-xs text-gray-400 mt-1">Queue and execute timelock actions</p>
		</a>
		<a href="/admin/governance/treasury" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
			<h3 class="text-white font-semibold">Treasury</h3>
			<p class="text-xs text-gray-400 mt-1">Monitor pools, inflows and runway</p>
		</a>
		<a href="/admin/governance/emergency" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
			<h3 class="text-white font-semibold">Emergency</h3>
			<p class="text-xs text-gray-400 mt-1">Pause controls and incident logs</p>
		</a>
		<a href="/admin/governance/roles" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
			<h3 class="text-white font-semibold">Roles</h3>
			<p class="text-xs text-gray-400 mt-1">Permissions matrix and admin roster</p>
		</a>
		<a href="/admin/governance/reports" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
			<h3 class="text-white font-semibold">Reports</h3>
			<p class="text-xs text-gray-400 mt-1">Generate governance transparency reports</p>
		</a>
	</div>
</div>
