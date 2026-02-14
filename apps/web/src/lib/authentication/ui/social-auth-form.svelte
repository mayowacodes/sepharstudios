<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import GoogleIcon from '$lib/authentication/ui/google-icon.svelte';
	import LoadingSpinner from '$lib/authentication/ui/loading-spinner.svelte';
	import { getRedirectUrl, handleSocialSignin } from '$lib/authentication/client';
  interface Props { text: string; }
  let { text }: Props = $props()
	let isLoading = $state(false);
	let isSocialLoading = $state(false);
	const callbackURL = getRedirectUrl();
	const handleSocial = async () => {
		isSocialLoading = true;
		await handleSocialSignin('google', callbackURL);
		isSocialLoading = false;
	};
</script>
<div class="flex flex-col gap-4">
	<Button variant="outline" class="w-full" type="button" disabled={isLoading || isSocialLoading} onclick={handleSocial}>
		{#if isSocialLoading}<LoadingSpinner />Loading...{:else}<GoogleIcon />{text}{/if}
	</Button>
</div>