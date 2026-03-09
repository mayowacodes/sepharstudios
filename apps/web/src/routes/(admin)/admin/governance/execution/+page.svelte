<script lang="ts">
	import { onMount } from 'svelte';
	import TimelockQueueTable from '$lib/components/admin/governance/TimelockQueueTable.svelte';
	import MultisigApprovalsPanel from '$lib/components/admin/governance/MultisigApprovalsPanel.svelte';

	type Proposal = {
		id: string;
		title: string;
		type: string;
		status: string;
		eta?: string;
		approvals?: string[];
		requiredApprovals?: number;
		guardrailWarnings?: string[];
	};

	let loading = $state(true);
	let submitted = $state<Proposal[]>([]);
	let queue = $state<Proposal[]>([]);
	let message = $state('');

	async function load() {
		loading = true;
		try {
			const [proposalsRes, queueRes] = await Promise.all([
				fetch('/api/admin/governance/proposals'),
				fetch('/api/admin/governance/timelock-queue')
			]);
			if (proposalsRes.ok) {
				const all = await proposalsRes.json() as Proposal[];
				submitted = all.filter((p) => p.status === 'submitted');
			}
			if (queueRes.ok) queue = await queueRes.json();
		} finally {
			loading = false;
		}
	}

	async function queueProposal(id: string) {
		const res = await fetch('/api/admin/governance/queue', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ proposalId: id })
		});
		const data = await res.json().catch(() => ({}));
		message = res.ok ? `Queued: ${data.title}` : (data.error ?? 'Queue failed');
		await load();
	}

	async function approveProposal(id: string) {
		const res = await fetch('/api/admin/governance/approve', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ proposalId: id })
		});
		const data = await res.json().catch(() => ({}));
		message = res.ok ? `Approved: ${data.title}` : (data.error ?? 'Approval failed');
		await load();
	}

	async function execute(id: string) {
		const res = await fetch('/api/admin/governance/execute', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ proposalId: id })
		});
		const data = await res.json().catch(() => ({}));
		message = res.ok ? `Executed: ${data.title}` : (data.error ?? 'Execute failed');
		await load();
	}

	onMount(load);
</script>

<svelte:head>
	<title>Governance Execution - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 space-y-6">
	<h1 class="text-2xl font-bold text-white">Timelock Queue & Execution</h1>

	{#if message}
		<p class="text-sm text-cyan-300">{message}</p>
	{/if}

	<div class="rounded-xl border border-white/10 bg-white/5 p-4">
		<h2 class="text-lg font-semibold text-white mb-3">Submitted Proposals</h2>
		{#if loading}
			<p class="text-sm text-gray-400">Loading...</p>
		{:else if submitted.length === 0}
			<p class="text-sm text-gray-400">No submitted proposals awaiting queue.</p>
		{:else}
			<div class="space-y-2">
				{#each submitted as p}
					<div class="rounded-lg bg-black/30 border border-white/10 px-3 py-2">
						<div class="flex items-center justify-between gap-3">
							<div class="space-y-1">
							<p class="text-white text-sm">{p.title}</p>
							<p class="text-xs text-gray-400">{p.type}</p>
							{#if (p.guardrailWarnings?.length ?? 0) > 0}
								<p class="text-xs text-amber-300">Has guardrail warnings</p>
							{/if}
							</div>
							<div class="flex items-center gap-2">
								<button class="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-xs" onclick={() => approveProposal(p.id)}>Approve</button>
								<button
									class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-xs disabled:opacity-40"
									disabled={(p.approvals?.length ?? 0) < (p.requiredApprovals ?? 4)}
									onclick={() => queueProposal(p.id)}
								>
									Queue
								</button>
							</div>
						</div>
						<div class="mt-3">
							<MultisigApprovalsPanel
								approvals={p.approvals?.length ?? 0}
								required={p.requiredApprovals ?? 4}
							/>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div>
		<h2 class="text-lg font-semibold text-white mb-3">Queued Actions</h2>
		<TimelockQueueTable items={queue} onExecute={execute} />
	</div>
</div>
