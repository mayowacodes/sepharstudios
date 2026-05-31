<script lang="ts">
	import { onMount } from 'svelte';
	import { FileText } from '@lucide/svelte';
	import PageHeader from '$lib/components/dashboard/PageHeader.svelte';

	type Proposal = {
		id: string;
		title: string;
		description: string;
		type: string;
		status: string;
		riskLevel: 'low' | 'medium' | 'high';
		createdByName: string;
		createdAt: string;
		eta?: string;
		executedAt?: string;
		approvals?: string[];
		requiredApprovals?: number;
		guardrailWarnings?: string[];
	};

	let loading = $state(true);
	let proposals = $state<Proposal[]>([]);

	async function load() {
		loading = true;
		try {
			const res = await fetch('/api/admin/governance/proposals');
			if (res.ok) proposals = await res.json();
		} finally {
			loading = false;
		}
	}

	onMount(load);

	function riskClass(level: string): string {
		if (level === 'high') return 'bg-red-500/20 text-red-300';
		if (level === 'medium') return 'bg-amber-500/20 text-amber-300';
		return 'bg-green-500/20 text-green-300';
	}
</script>

<svelte:head>
	<title>Governance Proposals - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 space-y-4">
	<PageHeader icon={FileText} title="Governance Proposals" subtitle="Pending, queued, and historical DAO proposals.">
		{#snippet actions()}
			<a href="/admin/governance/create" class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium transition-opacity">+ New</a>
		{/snippet}
	</PageHeader>

	<div class="rounded-xl border border-border/40 overflow-hidden">
		<table class="w-full text-sm">
			<thead class="surface-1 text-foreground/80">
				<tr>
					<th class="px-4 py-3 text-left">Title</th>
					<th class="px-4 py-3 text-left">Type</th>
					<th class="px-4 py-3 text-left">Risk</th>
					<th class="px-4 py-3 text-left">Approvals</th>
					<th class="px-4 py-3 text-left">Status</th>
					<th class="px-4 py-3 text-left">Created</th>
				</tr>
			</thead>
			<tbody>
				{#if loading}
					<tr><td colspan="6" class="px-4 py-6 text-center text-muted-foreground">Loading proposals...</td></tr>
				{:else if proposals.length === 0}
					<tr><td colspan="6" class="px-4 py-6 text-center text-muted-foreground">No proposals yet.</td></tr>
				{:else}
					{#each proposals as p}
						<tr class="border-t border-border/40">
							<td class="px-4 py-3">
								<p class="text-foreground">{p.title}</p>
								<p class="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
							</td>
							<td class="px-4 py-3 text-foreground/80">{p.type}</td>
							<td class="px-4 py-3"><span class={`px-2 py-1 rounded text-xs ${riskClass(p.riskLevel)}`}>{p.riskLevel}</span></td>
							<td class="px-4 py-3 text-foreground/80">{p.approvals?.length ?? 0}/{p.requiredApprovals ?? 4}</td>
							<td class="px-4 py-3 text-foreground/80">{p.status}</td>
							<td class="px-4 py-3 text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</td>
						</tr>
						{#if (p.guardrailWarnings?.length ?? 0) > 0}
							<tr class="border-t border-border/40 bg-amber-500/5">
								<td colspan="6" class="px-4 py-2 text-xs text-amber-300">
									{#each p.guardrailWarnings ?? [] as w}
										<p>- {w}</p>
									{/each}
								</td>
							</tr>
						{/if}
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
