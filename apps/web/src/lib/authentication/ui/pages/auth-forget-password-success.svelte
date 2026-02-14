<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
	import { MailCheck } from '@lucide/svelte';
</script>
<div class="flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
	<Card.Root class="w-full max-w-md text-center">
		<Card.Header>
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
				<MailCheck class="h-8 w-8 text-green-600" />
			</div>
			<Card.Title>Check Your Email</Card.Title>
			<Card.Description>We've sent a password reset link to your email address. Please check your inbox.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Button href="/auth/login" variant="outline" class="w-full">Back to Login</Button>
		</Card.Content>
	</Card.Root>
</div>