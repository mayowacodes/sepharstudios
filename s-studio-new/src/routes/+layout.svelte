<script lang="ts">
	import Footer from '$lib/components/sections/Footer.svelte';
	import Header from '$lib/components/sections/Header.svelte';
	import '../app.css';
	import { ClerkProvider } from 'svelte-clerk';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
	import LazyMovieModal from '$lib/components/widgets/LazyMovieModal.svelte';
	import MovieModal from '$lib/components/MovieModal.svelte';
	import { afterNavigate } from '$app/navigation';
import { mediaModalStore } from '$lib/stores/mediaModalStore';

	let { children } = $props(); // Valid only in +layout.svelte or block component

	afterNavigate(() => {
  // If the route is not a detail route, close modal
  const isDetailRoute = window.location.pathname.includes('/movies/');
  if (!isDetailRoute) {
    mediaModalStore.close();
  }
});
</script>

<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
	<div class="min-h-screen bg-gradient-to-b from-background to-accent/10">
		<Header />
		{@render children()}
		<Footer />
	</div>
</ClerkProvider>

<LazyMovieModal />


<MovieModal />




