<script lang="ts">
	import GuardrailValidator from '$lib/components/admin/governance/GuardrailValidator.svelte';

	let title = $state('');
	let description = $state('');
	let type = $state<'policy_change' | 'treasury_action' | 'emergency_action' | 'parameter_update'>('parameter_update');
	let payloadText = $state('{\n  "changePercent": 5\n}');
	let saving = $state(false);
	let resultMsg = $state('');
	let resultError = $state('');
	let guardrailWarnings = $state<string[]>([]);

	function evaluateGuardrails(): string[] {
		const warnings: string[] = [];
		try {
			const parsed = JSON.parse(payloadText);
			const percent = Number(parsed.changePercent ?? 0);
			if (type === 'parameter_update') {
				if (Number.isFinite(percent) && Math.abs(percent) > 10) {
					warnings.push('Change exceeds 10%; governance supermajority is recommended.');
				}
				if (Number.isFinite(percent) && Math.abs(percent) > 25) {
					warnings.push('Change exceeds 25%; likely outside policy guardrails.');
				}
			}
			if (type === 'policy_change') {
				warnings.push('Policy changes use extended timelock and high scrutiny.');
			}
			if (type === 'emergency_action') {
				warnings.push('Emergency action requires incident ID and postmortem timeline.');
			}
		} catch {
			warnings.push('Payload JSON is invalid.');
		}
		return warnings;
	}

	async function submit() {
		resultMsg = '';
		resultError = '';
		saving = true;
		try {
			let payload: Record<string, unknown> = {};
			try {
				payload = JSON.parse(payloadText);
			} catch {
				resultError = 'Payload must be valid JSON.';
				return;
			}
			guardrailWarnings = evaluateGuardrails();

			const res = await fetch('/api/admin/governance/proposals', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, description, type, payload })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				resultError = data.error ?? 'Failed to create proposal';
				return;
			}
			resultMsg = `Proposal created: ${data.id}`;
			title = '';
			description = '';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Create Governance Proposal - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-3xl space-y-4">
	<h1 class="text-2xl font-bold text-white">Create Governance Proposal</h1>

	<div class="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
		<div>
			<label for="proposal-title" class="text-xs text-gray-300">Title</label>
			<input id="proposal-title" class="mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-white" bind:value={title} />
		</div>

		<div>
			<label for="proposal-type" class="text-xs text-gray-300">Type</label>
			<select id="proposal-type" class="mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-white" bind:value={type}>
				<option value="parameter_update">parameter_update</option>
				<option value="treasury_action">treasury_action</option>
				<option value="policy_change">policy_change</option>
				<option value="emergency_action">emergency_action</option>
			</select>
		</div>

		<div>
			<label for="proposal-description" class="text-xs text-gray-300">Description</label>
			<textarea id="proposal-description" class="mt-1 w-full min-h-24 bg-black/40 border border-white/15 rounded px-3 py-2 text-white" bind:value={description}></textarea>
		</div>

		<div>
			<label for="proposal-payload" class="text-xs text-gray-300">Payload (JSON)</label>
			<textarea id="proposal-payload" class="mt-1 w-full min-h-32 bg-black/40 border border-white/15 rounded px-3 py-2 text-white font-mono text-xs" bind:value={payloadText}></textarea>
		</div>

		<GuardrailValidator warnings={evaluateGuardrails()} />

		<div class="flex items-center gap-3">
			<button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50" disabled={saving} onclick={submit}>
				{saving ? 'Creating...' : 'Create Proposal'}
			</button>
			<a href="/admin/governance/proposals" class="text-sm text-gray-300 hover:text-white">Back to proposals</a>
		</div>

		{#if resultMsg}
			<p class="text-sm text-green-300">{resultMsg}</p>
		{/if}
		{#if resultError}
			<p class="text-sm text-red-300">{resultError}</p>
		{/if}
		{#if guardrailWarnings.length > 0 && resultMsg}
			<p class="text-xs text-amber-300">Submitted with warnings; review required before queue.</p>
		{/if}
	</div>
</div>
