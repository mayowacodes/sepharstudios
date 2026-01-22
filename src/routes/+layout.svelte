<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { SiteMeta } from '$lib/constants';
	
	let { children } = $props();
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{SiteMeta.title}</title>
	<meta name="title" content={SiteMeta.title} />
	<meta name="description" content={SiteMeta.description} />
	<meta name="keywords" content={SiteMeta.keywords.join(', ')} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={SiteMeta.link} />
	<meta property="og:title" content={SiteMeta.title} />
	<meta property="og:description" content={SiteMeta.description} />
	<meta property="og:image" content={SiteMeta.ogimage} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={SiteMeta.link} />
	<meta property="twitter:title" content={SiteMeta.title} />
	<meta property="twitter:description" content={SiteMeta.description} />
	<meta property="twitter:image" content={SiteMeta.ogimage} />
</svelte:head>

<Toaster richColors position="top-center" />
<ModeWatcher disableTransitions={true} />
{@render children?.()}
