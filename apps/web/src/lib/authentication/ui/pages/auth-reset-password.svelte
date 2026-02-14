<script lang="ts">
	import ResetPasswordForm from "$lib/authentication/ui/reset-password-form.svelte";
	import * as Card from '$lib/components/ui/card/index.js';
</script>
<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>Reset Password</Card.Title>
			<Card.Description>Enter your new password</Card.Description>
		</Card.Header>
		<Card.Content>
			<ResetPasswordForm />
		</Card.Content>
	</Card.Root>
</div>