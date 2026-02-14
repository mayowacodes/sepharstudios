<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import * as Card from '$lib/components/ui/card/index.js';
	import AuthCardHeader from '$lib/authentication/ui/auth-card-header.svelte';
	import SocialAuthForm from '$lib/authentication/ui/social-auth-form.svelte';
	import EmailPasswordFormRegister from './email-password-form-register.svelte';
	interface Props extends HTMLAttributes<HTMLDivElement> { class?: string; }
	let { class: className, ...restProps }: Props = $props();
</script>
{#snippet Divider()}
	<div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
		<span class="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
	</div>
{/snippet}
<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root class="max-w-lg">
		<Card.Header>
			<AuthCardHeader title="Create account on" description="Welcome! Create an account to get started" />
		</Card.Header>
		<Card.Content>
			<div class="grid gap-6">
				<SocialAuthForm text="Sign up with Google" />
				{@render Divider()}
				<EmailPasswordFormRegister />
			</div>
		</Card.Content>
	</Card.Root>
</div>