<!-- Admin Section Layout -->
<script lang="ts">
	import '../../../app.css';
	import AdminNav from '$lib/components/admin/AdminNav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Admin - Sephar Studios</title>
</svelte:head>

<div class="admin-section min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
	<AdminNav />
	<main class="pt-20">
		{@render children()}
	</main>
</div>