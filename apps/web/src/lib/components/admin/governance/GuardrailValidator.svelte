<script lang="ts">
	interface Props {
		warnings: string[];
	}

	let { warnings }: Props = $props();
</script>

{#if warnings.length > 0}
	<div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
		<p class="text-xs font-semibold text-amber-300 mb-1">Guardrail Warnings</p>
		<ul class="text-xs text-amber-200 space-y-1">
			{#each warnings as warning}
				<li>- {warning}</li>
			{/each}
		</ul>
	</div>
{:else}
	<div class="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
		<p class="text-xs text-green-200">No guardrail issues detected.</p>
	</div>
{/if}

