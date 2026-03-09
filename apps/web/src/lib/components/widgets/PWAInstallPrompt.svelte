<script lang="ts">
	import { onMount } from 'svelte';

	let deferredPrompt = $state<Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null>(null);
	let visible = $state(false);
	let dismissed = $state(false);
	let installed = $state(false);

	onMount(() => {
		// Already installed as PWA?
		if (window.matchMedia('(display-mode: standalone)').matches) {
			installed = true;
			return;
		}

		const handler = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e as typeof deferredPrompt;
			if (!dismissed) visible = true;
		};

		window.addEventListener('beforeinstallprompt', handler);
		return () => window.removeEventListener('beforeinstallprompt', handler);
	});

	async function install() {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') installed = true;
		deferredPrompt = null;
		visible = false;
	}

	function dismiss() {
		dismissed = true;
		visible = false;
	}
</script>

{#if visible && !installed}
	<div class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50">
		<div class="bg-[#1a1a2e] border border-[#FFBF00]/30 rounded-2xl p-4 shadow-2xl shadow-black/60 flex items-start gap-3">
			<div class="w-10 h-10 rounded-xl bg-[#FFBF00]/15 flex items-center justify-center text-xl shrink-0">📱</div>
			<div class="flex-1 min-w-0">
				<p class="text-white font-semibold text-sm">Install Sephar Studios</p>
				<p class="text-gray-400 text-xs mt-0.5">Add to your home screen for the best experience</p>
				<div class="flex gap-2 mt-3">
					<button
						onclick={install}
						class="bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
					>Install</button>
					<button
						onclick={dismiss}
						class="text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
					>Not now</button>
				</div>
			</div>
			<button onclick={dismiss} class="text-gray-600 hover:text-white transition-colors shrink-0" aria-label="Close">✕</button>
		</div>
	</div>
{/if}
