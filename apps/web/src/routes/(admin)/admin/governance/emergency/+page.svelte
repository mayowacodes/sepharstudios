<script lang="ts">
	import { onMount } from 'svelte';

	type PauseEvent = {
		id: string;
		reason: string;
		triggeredByName: string;
		triggeredAt: string;
		active: boolean;
	};

	let reason = $state('');
	let saving = $state(false);
	let error = $state('');
	let message = $state('');
	let active = $state<PauseEvent | null>(null);
	let history = $state<PauseEvent[]>([]);

	async function load() {
		const res = await fetch('/api/admin/governance/emergency/pause');
		if (!res.ok) return;
		const data = await res.json();
		active = data.active;
		history = data.history ?? [];
	}

	async function triggerPause() {
		error = '';
		message = '';
		saving = true;
		try {
			const res = await fetch('/api/admin/governance/emergency/pause', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ reason })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				error = data.error ?? 'Failed to trigger pause';
				return;
			}
			message = `Pause recorded: ${data.id}`;
			reason = '';
			await load();
		} finally {
			saving = false;
		}
	}

	onMount(load);
</script>

<svelte:head>
	<title>Governance Emergency - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 space-y-6">
	<h1 class="text-2xl font-bold text-white">Emergency Controls</h1>

	<div class="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
		<h2 class="text-lg text-white font-semibold">Trigger Emergency Pause</h2>
		<p class="text-xs text-gray-400">Use only for security incidents. Reason is mandatory and audited.</p>
		<textarea class="w-full min-h-24 bg-black/40 border border-white/15 rounded px-3 py-2 text-white" bind:value={reason}></textarea>
		<button class="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50" disabled={saving || !!active} onclick={triggerPause}>
			{saving ? 'Submitting...' : active ? 'Pause Already Active' : 'Trigger Pause'}
		</button>
		{#if message}<p class="text-sm text-green-300">{message}</p>{/if}
		{#if error}<p class="text-sm text-red-300">{error}</p>{/if}
	</div>

	<div class="rounded-xl border border-white/10 bg-white/5 p-4">
		<h2 class="text-lg text-white font-semibold mb-2">Active Incident</h2>
		{#if active}
			<p class="text-sm text-red-300">{active.reason}</p>
			<p class="text-xs text-gray-400 mt-1">By {active.triggeredByName} at {new Date(active.triggeredAt).toLocaleString()}</p>
		{:else}
			<p class="text-sm text-green-300">No active emergency pause.</p>
		{/if}
	</div>

	<div class="rounded-xl border border-white/10 bg-white/5 p-4">
		<h2 class="text-lg text-white font-semibold mb-2">Pause History</h2>
		{#if history.length === 0}
			<p class="text-sm text-gray-400">No incidents logged.</p>
		{:else}
			<ul class="space-y-2">
				{#each history as evt}
					<li class="text-sm text-gray-300 border-t border-white/10 pt-2">
						<p>{evt.reason}</p>
						<p class="text-xs text-gray-500">By {evt.triggeredByName} at {new Date(evt.triggeredAt).toLocaleString()}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

