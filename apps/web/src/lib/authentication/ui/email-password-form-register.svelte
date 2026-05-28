<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import LoadingSpinner from './loading-spinner.svelte';
	import { EyeIcon, EyeOffIcon } from '@lucide/svelte';
	import { signUp } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import { getRedirectUrl } from '$lib/authentication/client';
	import { Constants } from '$lib/constants';
	interface Props extends HTMLAttributes<HTMLDivElement> { class?: string; }
	let { class: className, ...restProps }: Props = $props();
	let isLoading = $state(false);
	let isSocialLoading = $state(false);
	let errors = $state<Record<string, string>>({});
	let showPassword = $state(false);
	const id = crypto.randomUUID();
	const callbackURL = getRedirectUrl();
	const validate = (field: string, type: 'email' | 'password' | 'name'): string | null => {
		switch (type) {
			case 'email': const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!field.trim()) return 'Email is required'; if (!emailRegex.test(field)) return 'Please enter a valid email'; return null;
			case 'password': if (!field) return 'Password is required'; if (field.length < 6) return 'Password must be at least 6 characters'; return null;
			case 'name': if (!field) return 'Name is required'; if (field.length < 2) return 'Name must be at least 2 characters'; return null;
		}
	};
	const onsubmit = async (evt: SubmitEvent) => {
		evt.preventDefault();
		errors = {};
		const form = evt.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const nameError = validate(name, 'name');
		const emailError = validate(email, 'email');
		const passwordError = validate(password, 'password');
		if (nameError) errors.name = nameError;
		if (emailError) errors.email = emailError;
		if (passwordError) errors.password = passwordError;
		if (Object.keys(errors).length > 0) { isLoading = false; return; }
		await signUp.email({ name, email, password, callbackURL }, {
			onRequest: () => { isLoading = true; },
			onResponse: () => { isLoading = false; },
			onError: (ctx) => { toast.error('Error Alert', { description: ctx.error.message }); },
			onSuccess: () => { toast.success('Successfully signed up'); location.href = Constants.AFTERAUTH; }
		});
	};
</script>
<form {onsubmit} class="grid gap-3" aria-label="Create account form" novalidate>
	{#if errors.general}<div role="alert" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errors.general}</div>{/if}
	<div class="grid gap-2">
		<Label for="name-{id}">Name</Label>
		<Input
			id="name-{id}"
			type="text"
			name="name"
			placeholder="John Doe"
			required
			disabled={isLoading}
			class={cn(errors.name && 'border-red-500')}
			autocomplete="name"
			aria-invalid={!!errors.name}
			aria-describedby={errors.name ? `name-error-${id}` : undefined}
		/>
		{#if errors.name}<p id="name-error-{id}" class="text-sm text-red-500" role="alert">{errors.name}</p>{/if}
	</div>
	<div class="grid gap-2">
		<Label for="email-{id}">Email</Label>
		<Input
			id="email-{id}"
			type="email"
			name="email"
			placeholder="m@example.com"
			required
			disabled={isLoading}
			class={cn(errors.email && 'border-red-500')}
			autocomplete="email"
			aria-invalid={!!errors.email}
			aria-describedby={errors.email ? `email-error-${id}` : undefined}
		/>
		{#if errors.email}<p id="email-error-{id}" class="text-sm text-red-500" role="alert">{errors.email}</p>{/if}
	</div>
	<div class="grid gap-2">
		<Label for="password-{id}">Password</Label>
		<div class="relative w-full">
			<Input
				id="password-{id}"
				name="password"
				type={showPassword ? 'text' : 'password'}
				placeholder="Your password..."
				required
				disabled={isLoading}
				class={cn(errors.password && 'border-red-500 pr-10')}
				autocomplete="new-password"
				aria-invalid={!!errors.password}
				aria-describedby={errors.password ? `password-error-${id}` : undefined}
			/>
			<Button onclick={() => (showPassword = !showPassword)} class="absolute right-0 bottom-0" variant="ghost" size="icon" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
				{#if showPassword}<EyeIcon />{:else}<EyeOffIcon />{/if}
			</Button>
		</div>
		{#if errors.password}<p id="password-error-{id}" class="text-sm text-red-500" role="alert">{errors.password}</p>{/if}
	</div>
	<Button type="submit" class="w-full" disabled={isLoading || isSocialLoading}>
		{#if isLoading}<LoadingSpinner class="text-white dark:text-background" />Signing up...{:else}Signup{/if}
	</Button>
</form>
<div class="flex items-center justify-end gap-4">
	<div class="text-right text-sm">
		Already have an account?
		<a href="/auth/login?redirectTo={encodeURIComponent(getRedirectUrl())}" class="underline underline-offset-4 hover:no-underline">Log in</a>
	</div>
</div>