<script lang="ts">
	import { onMount } from 'svelte';
	import { BarChart3, Download } from '@lucide/svelte';
	import PortalHero from '$lib/components/portal/PortalHero.svelte';
	import PortalButton from '$lib/components/portal/PortalButton.svelte';

	type ReportData = {
		generatedAt: string;
		summary: {
			totalProposals: number;
			executedProposals: number;
			queuedProposals: number;
			executionRate: number;
		};
		entries: Array<{
			id: string;
			title: string;
			type: string;
			status: string;
			createdByName: string;
			createdAt: string;
			executedAt?: string;
		}>;
		auditEntries?: Array<{
			id: string;
			action: string;
			actorName: string;
			note: string;
			createdAt: string;
		}>;
	};

	let loading = $state(true);
	let report = $state<ReportData | null>(null);

	async function load() {
		loading = true;
		try {
			const res = await fetch('/api/admin/governance/reports');
			if (res.ok) report = await res.json();
		} finally {
			loading = false;
		}
	}

	function exportCsv() {
		if (!report) return;
		const rows = [
			['id', 'title', 'type', 'status', 'createdBy', 'createdAt', 'executedAt'],
			...report.entries.map((e) => [e.id, e.title, e.type, e.status, e.createdByName, e.createdAt, e.executedAt ?? ''])
		];
		const csv = rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `governance-report-${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	onMount(load);
</script>

<svelte:head>
	<title>Governance Reports - Admin</title>
</svelte:head>

<div class="mx-auto px-4 py-8 space-y-6 max-w-7xl">
	<PortalHero
		compact
		eyebrow="DAO · Reports"
		title="Governance reports"
		subtitle="Voting activity, proposal outcomes, treasury flows."
		icon={BarChart3}
	>
		{#snippet actions()}
			<PortalButton variant="secondary" size="sm" onclick={exportCsv} disabled={!report}>
				<Download class="w-3.5 h-3.5" /> Export CSV
			</PortalButton>
		{/snippet}
	</PortalHero>

	{#if loading}
		<p class="text-sm text-muted-foreground">Generating report...</p>
	{:else if report}
		<div class="grid md:grid-cols-4 gap-4">
			<div class="rounded-xl border border-border/40 surface-1 p-4">
				<p class="text-xs text-muted-foreground">Total Proposals</p>
				<p class="text-2xl font-bold text-foreground">{report.summary.totalProposals}</p>
			</div>
			<div class="rounded-xl border border-border/40 surface-1 p-4">
				<p class="text-xs text-muted-foreground">Executed</p>
				<p class="text-2xl font-bold text-green-300">{report.summary.executedProposals}</p>
			</div>
			<div class="rounded-xl border border-border/40 surface-1 p-4">
				<p class="text-xs text-muted-foreground">Queued</p>
				<p class="text-2xl font-bold text-amber-300">{report.summary.queuedProposals}</p>
			</div>
			<div class="rounded-xl border border-border/40 surface-1 p-4">
				<p class="text-xs text-muted-foreground">Execution Rate</p>
				<p class="text-2xl font-bold text-cyan-300">{report.summary.executionRate}%</p>
			</div>
		</div>

		<div class="rounded-xl border border-border/40 surface-1 p-4">
			<p class="text-xs text-muted-foreground mb-3">Generated at {new Date(report.generatedAt).toLocaleString()}</p>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="text-muted-foreground">
						<tr>
							<th class="text-left py-2">Title</th>
							<th class="text-left py-2">Type</th>
							<th class="text-left py-2">Status</th>
							<th class="text-left py-2">Created By</th>
							<th class="text-left py-2">Created At</th>
						</tr>
					</thead>
					<tbody>
						{#each report.entries as e}
							<tr class="border-t border-border/40">
								<td class="py-2 text-foreground">{e.title}</td>
								<td class="py-2 text-foreground/80">{e.type}</td>
								<td class="py-2 text-foreground/80">{e.status}</td>
								<td class="py-2 text-foreground/80">{e.createdByName}</td>
								<td class="py-2 text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<div class="rounded-xl border border-border/40 surface-1 p-4">
			<h2 class="text-lg font-semibold text-foreground mb-3">Audit Trail</h2>
			{#if (report.auditEntries?.length ?? 0) === 0}
				<p class="text-sm text-muted-foreground">No audit entries yet.</p>
			{:else}
				<div class="space-y-2">
					{#each report.auditEntries ?? [] as a}
						<div class="border-t border-border/40 pt-2">
							<p class="text-sm text-foreground">{a.action} · {a.actorName}</p>
							<p class="text-xs text-foreground/80">{a.note}</p>
							<p class="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
