<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import * as Card from '$lib/components/ui/card/index.js';
	import EmailPasswordForm from '$lib/authentication/ui/email-password-form.svelte';
	import AuthCardHeader from '$lib/authentication/ui/auth-card-header.svelte';
	import SocialAuthForm from './social-auth-form.svelte';
	interface Props extends HTMLAttributes<HTMLDivElement> { class?: string; }
	let { class: className, ...restProps }: Props = $props();
</script>
<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root>
		<Card.Header>
			<AuthCardHeader title="Sign in to" description="Welcome back! Sign in to continue" />
		</Card.Header>
		<Card.Content>
			<div class="grid gap-6">
				<SocialAuthForm text="Sign in with Google" />
				{@render Divider()}
				<EmailPasswordForm />
			</div>
		</Card.Content>
	</Card.Root>
</div>
{#snippet Divider()}
	<div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
		<span class="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
	</div>
{/snippet}