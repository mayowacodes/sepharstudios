<script lang="ts">
	import { UserIcon } from '@lucide/svelte';
	import LoggedIn from '$lib/authentication/ui/user/logged-in.svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import type { User } from '$lib/auth';
  import { Constants } from '$lib/constants';
	const user = (page.data.user as User)
</script>
{#if user}
	<LoggedIn {user} />
{:else}
	<Button href={`/auth/login?redirectTo=${Constants.AFTERAUTH}`} variant="outline" class="relative cursor-pointer rounded-lg p-0" size="icon">
		<UserIcon class="size-4" />
	</Button>
{/if}