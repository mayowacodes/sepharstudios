<script lang="ts">
	import { onMount } from 'svelte';

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
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-white">Governance Proposals</h1>
		<a href="/admin/governance/create" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">Create Proposal</a>
	</div>

	<div class="rounded-xl border border-white/10 overflow-hidden">
		<table class="w-full text-sm">
			<thead class="bg-white/5 text-gray-300">
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
					<tr><td colspan="6" class="px-4 py-6 text-center text-gray-400">Loading proposals...</td></tr>
				{:else if proposals.length === 0}
					<tr><td colspan="6" class="px-4 py-6 text-center text-gray-400">No proposals yet.</td></tr>
				{:else}
					{#each proposals as p}
						<tr class="border-t border-white/10">
							<td class="px-4 py-3">
								<p class="text-white">{p.title}</p>
								<p class="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
							</td>
							<td class="px-4 py-3 text-gray-300">{p.type}</td>
							<td class="px-4 py-3"><span class={`px-2 py-1 rounded text-xs ${riskClass(p.riskLevel)}`}>{p.riskLevel}</span></td>
							<td class="px-4 py-3 text-gray-300">{p.approvals?.length ?? 0}/{p.requiredApprovals ?? 4}</td>
							<td class="px-4 py-3 text-gray-300">{p.status}</td>
							<td class="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleString()}</td>
						</tr>
						{#if (p.guardrailWarnings?.length ?? 0) > 0}
							<tr class="border-t border-white/10 bg-amber-500/5">
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
