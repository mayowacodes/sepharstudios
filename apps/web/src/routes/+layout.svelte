<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { SiteMeta } from '$lib/constants';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import PWAInstallPrompt from '$lib/components/widgets/PWAInstallPrompt.svelte';
	import AICopilot from '$lib/components/widgets/AICopilot.svelte';
	import LiveRegion from '$lib/components/LiveRegion.svelte';

	let { data, children } = $props();

	// AICopilot is only mounted for logged-in users on PUBLIC pages. The
	// admin + creator portals have their own Copilot rail (PortalShell)
	// so the floating bubble would double up on those routes.
	let isPortalRoute = $derived(
		page.url.pathname.startsWith('/admin') || page.url.pathname.startsWith('/creator')
	);
	let isLoggedIn = $derived(!!data?.user && !isPortalRoute);

	// Canonical URL — strip query strings + trailing slash so duplicate-content
	// signals don't fragment. Per-page <svelte:head> can override with a more
	// specific <link rel="canonical"> if needed (e.g., paginated views).
	let canonical = $derived(() => {
		const base = SiteMeta.link.replace(/\/$/, '');
		const path = page.url.pathname.replace(/\/$/, '') || '/';
		return `${base}${path}`;
	});

	onMount(() => {
		if ('serviceWorker' in navigator) {
			// updateViaCache: 'none' — always fetch sw.js from the network
			// when checking for updates, and reg.update() forces that check
			// on every page load. Without these, a browser could hold a
			// buggy service worker for up to ~24h after a deploy shipped
			// the fix (the exact failure mode behind "clicking a card jumps
			// back to the top of the page": the old SW's navigation
			// intercept threw and served the cached shell). skipWaiting()
			// + clients.claim() in sw.js then swap the new worker in
			// immediately once fetched.
			navigator.serviceWorker
				.register('/sw.js', { updateViaCache: 'none' })
				.then((reg) => reg.update().catch(() => {}))
				.catch(() => {
					// SW registration failed — offline downloads will not work
				});
		}
	});
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{SiteMeta.title}</title>
	<meta name="title" content={SiteMeta.title} />
	<meta name="description" content={SiteMeta.description} />
	<meta name="keywords" content={SiteMeta.keywords.join(', ')} />
	<link rel="canonical" href={canonical()} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SiteMeta.name} />
	<meta property="og:url" content={canonical()} />
	<meta property="og:title" content={SiteMeta.title} />
	<meta property="og:description" content={SiteMeta.description} />
	<meta property="og:image" content={`${SiteMeta.link}${SiteMeta.ogimage}`} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={SiteMeta.twitterHandle} />
	<meta name="twitter:url" content={canonical()} />
	<meta name="twitter:title" content={SiteMeta.title} />
	<meta name="twitter:description" content={SiteMeta.description} />
	<meta name="twitter:image" content={`${SiteMeta.link}${SiteMeta.ogimage}`} />
</svelte:head>

<!-- Toasts tinted with the portal palette. `theme="dark"` matches the
     portals' deep surfaces; `toastOptions.style` writes the
     `--portal-*` CSS variables onto each toast wrapper so the brand
     teal/cyan accents read consistently with the rest of the chrome. -->
<Toaster
	richColors
	position="top-right"
	theme="dark"
	closeButton
	expand={false}
	visibleToasts={4}
	toastOptions={{
		duration: 4500,
		classes: {
			toast: 'portal-toast',
			title: 'portal-toast-title',
			description: 'portal-toast-desc',
			closeButton: 'portal-toast-close'
		}
	}}
/>
<ModeWatcher defaultMode="dark" disableTransitions={true} />
<PWAInstallPrompt />
<LiveRegion />

{@render children?.()}

{#if !isPortalRoute}
	<!-- AI Copilot — visible to everyone; shows login prompt for unauthenticated users -->
	<AICopilot {isLoggedIn} />
{/if}
