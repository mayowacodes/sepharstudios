<script lang="ts">
	interface Props {
		profileId: string;
		profileName: string;
		onSuccess?: () => void;
		onCancel?: () => void;
	}

	let { profileId, profileName, onSuccess, onCancel }: Props = $props();

	let pin = $state('');
	let error = $state('');
	let loading = $state(false);

	async function verify() {
		if (pin.length !== 4) { error = 'Enter a 4-digit PIN.'; return; }
		loading = true;
		error = '';
		try {
			const res = await fetch(`/api/profiles/${profileId}/pin`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'verify', pin })
			});
			const data = await res.json();
			if (data.valid) {
				onSuccess?.();
			} else {
				error = 'Incorrect PIN. Please try again.';
				pin = '';
			}
		} catch {
			error = 'Could not verify PIN. Please try again.';
		} finally {
			loading = false;
		}
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter') verify();
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
	<div class="bg-[#0f0f1a] border border-white/10 rounded-2xl p-8 w-full max-w-sm space-y-5 shadow-2xl">
		<div class="text-center space-y-1">
			<div class="text-3xl mb-2">🔒</div>
			<h2 class="text-white font-bold text-lg">Enter PIN</h2>
			<p class="text-gray-400 text-sm">Enter the PIN for <strong class="text-white">{profileName}</strong></p>
		</div>

		<div class="flex gap-3 justify-center">
			{#each [0, 1, 2, 3] as i}
				<div class="w-12 h-12 rounded-xl border-2 {pin.length > i ? 'border-[#FFBF00] bg-[#FFBF00]/10' : 'border-white/20 bg-white/5'} flex items-center justify-center text-xl text-white font-bold transition-all">
					{pin.length > i ? '●' : ''}
				</div>
			{/each}
		</div>

		<input
			type="password"
			maxlength="4"
			inputmode="numeric"
			pattern="[0-9]*"
			bind:value={pin}
			onkeydown={handleKey}
			class="sr-only"
			autofocus
		/>

		<!-- PIN pad -->
		<div class="grid grid-cols-3 gap-2">
			{#each [1,2,3,4,5,6,7,8,9,'',0,'⌫'] as key}
				<button
					onclick={() => {
						if (key === '⌫') { pin = pin.slice(0, -1); error = ''; }
						else if (key !== '' && pin.length < 4) { pin += key.toString(); error = ''; }
					}}
					disabled={key === ''}
					class="h-12 rounded-xl text-white font-semibold text-lg transition-colors
						{key === '' ? 'pointer-events-none' : 'bg-white/10 hover:bg-white/20 active:bg-white/30'}"
				>{key}</button>
			{/each}
		</div>

		{#if error}
			<p class="text-red-400 text-sm text-center">{error}</p>
		{/if}

		<div class="flex gap-3">
			<button
				onclick={() => onCancel?.()}
				class="flex-1 py-2 rounded-xl border border-white/20 text-gray-400 hover:text-white text-sm transition-colors"
			>Cancel</button>
			<button
				onclick={verify}
				disabled={loading || pin.length !== 4}
				class="flex-1 py-2 rounded-xl bg-[#FFBF00] hover:bg-[#FFBF00]/90 disabled:opacity-50 text-black font-semibold text-sm transition-colors"
			>{loading ? '...' : 'Unlock'}</button>
		</div>
	</div>
</div>
