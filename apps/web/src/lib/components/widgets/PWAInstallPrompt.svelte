<script lang="ts">
	import { onMount } from 'svelte';
	import { Download, X, Smartphone } from '@lucide/svelte';

	const DISMISSED_KEY = 'pwa-install-dismissed';
	const INSTALLED_KEY = 'pwa-installed';
	const SHOWN_KEY = 'pwa-install-shown';

	let deferredPrompt = $state<Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null>(null);
	let visible = $state(false);
	let animateIn = $state(false);
	let autoDismissTimer: ReturnType<typeof setTimeout> | null = null;

	onMount(() => {
		if (window.matchMedia('(display-mode: standalone)').matches) {
			localStorage.setItem(INSTALLED_KEY, 'true');
			return;
		}

		if (localStorage.getItem(DISMISSED_KEY) === 'permanent' || localStorage.getItem(INSTALLED_KEY) === 'true' || localStorage.getItem(SHOWN_KEY) === 'true') {
			return;
		}

		const handler = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e as typeof deferredPrompt;
			localStorage.setItem(SHOWN_KEY, 'true');
			setTimeout(() => {
				visible = true;
				requestAnimationFrame(() => {
					requestAnimationFrame(() => { animateIn = true; });
				});
				autoDismissTimer = setTimeout(() => {
					slideOut();
				}, 6000);
			}, 2500);
		};

		window.addEventListener('beforeinstallprompt', handler);
		return () => {
			window.removeEventListener('beforeinstallprompt', handler);
			if (autoDismissTimer) clearTimeout(autoDismissTimer);
		};
	});

	async function install() {
		if (autoDismissTimer) clearTimeout(autoDismissTimer);
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			localStorage.setItem(INSTALLED_KEY, 'true');
		}
		deferredPrompt = null;
		slideOut();
	}

	function slideOut(permanent = false) {
		if (autoDismissTimer) clearTimeout(autoDismissTimer);
		animateIn = false;
		localStorage.setItem(SHOWN_KEY, 'true');
		if (permanent) {
			localStorage.setItem(DISMISSED_KEY, 'permanent');
		}
		setTimeout(() => {
			visible = false;
		}, 400);
	}
</script>

{#if visible}
	<div
		class="pwa-banner"
		class:animate-in={animateIn}
		role="banner"
		aria-label="Install Sephar Studios app"
	>
		<div class="pwa-icon">
			<Smartphone size={18} />
		</div>

		<div class="pwa-text">
			<p class="pwa-title">Install Sephar Studios</p>
			<p class="pwa-sub">Add to home screen for the best experience</p>
		</div>

		<div class="pwa-actions">
			<button class="pwa-install-btn" onclick={install}>
				<Download size={13} />
				Install
			</button>
			<button class="pwa-dismiss-btn" onclick={() => slideOut(true)} aria-label="Dismiss">
				<X size={15} />
			</button>
		</div>

		<div class="pwa-progress" class:running={animateIn}></div>
	</div>
{/if}

<style>
	.pwa-banner {
		position: fixed;
		top: 4.5rem;
		left: 50%;
		transform: translateX(-50%) translateY(-140%);
		z-index: 9990;
		width: min(480px, calc(100vw - 2rem));
		background: rgba(18, 18, 22, 0.96);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 1rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0.875rem;
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
		opacity: 0;
		overflow: hidden;
	}

	.pwa-banner.animate-in {
		transform: translateX(-50%) translateY(0);
		opacity: 1;
	}

	.pwa-icon {
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.6rem;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.6);
		flex-shrink: 0;
	}

	.pwa-text {
		flex: 1;
		min-width: 0;
	}

	.pwa-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		margin: 0;
		line-height: 1.3;
	}

	.pwa-sub {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.35);
		margin: 0.1rem 0 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pwa-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.pwa-install-btn {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.35rem 0.75rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
		transition: background 0.15s;
		white-space: nowrap;
	}

	.pwa-install-btn:hover {
		background: rgba(255, 255, 255, 0.16);
	}

	.pwa-dismiss-btn {
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.25);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		border-radius: 0.375rem;
		transition: color 0.15s;
	}

	.pwa-dismiss-btn:hover {
		color: rgba(255, 255, 255, 0.6);
	}

	.pwa-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		width: 100%;
		background: rgba(255, 255, 255, 0.06);
	}

	.pwa-progress::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255, 0.15);
		transform-origin: left;
		transform: scaleX(1);
		transition: none;
	}

	.pwa-progress.running::after {
		transform: scaleX(0);
		transition: transform 6s linear;
	}

	@media (max-width: 480px) {
		.pwa-banner {
			top: 4rem;
			padding: 0.625rem 0.75rem;
		}

		.pwa-sub {
			display: none;
		}
	}
</style>
