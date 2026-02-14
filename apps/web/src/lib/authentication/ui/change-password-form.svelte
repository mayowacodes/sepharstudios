<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { changePassword } from '$lib/auth-client';
	import LoadingSpinner from '$lib/authentication/ui/loading-spinner.svelte';
	import { Eye, EyeOff, Lock } from '@lucide/svelte';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '$lib/components/ui/card';

	let isPending = $state(false);
	let showPassword = $state(false);
    
	const onsubmit = async (evt: SubmitEvent) => {
		evt.preventDefault();
		const formData = new FormData(evt.target as HTMLFormElement);
		const password = String(formData.get('password'));
		const newPassword = String(formData.get('newPassword'));
		if (!password) return toast.error('Please enter your current password');
		if (!newPassword) return toast.error('Please enter your new password');
		try {
			await changePassword({ currentPassword: password, newPassword, revokeOtherSessions: true, fetchOptions: {
				onRequest: () => { isPending = true; }, onResponse: () => { isPending = false; },
				onError: (ctx) => { toast.error('Error Alert', { description: ctx.error.message }); },
				onSuccess: () => { toast.success('Password changed successfully.'); location.href = '/auth/login'; }
			}});
		} catch (error) { toast.error('Failed to change password.'); }
	};
</script>

<form {onsubmit} class="w-full">
    <Card class="shadow-sm">
        <CardHeader>
            <CardTitle class="flex items-center gap-2"><Lock class="size-4" /> Security</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="space-y-2">
                <Label for="password">Current Password</Label>
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required />
            </div>
            <div class="space-y-2">
                <Label for="newPassword">New Password</Label>
                <div class="relative">
                    <Input id="newPassword" name="newPassword" type={showPassword ? 'text' : 'password'} required class="pr-10" />
                    <Button onclick={() => (showPassword = !showPassword)} class="absolute right-0 top-0 h-full px-3" variant="ghost" size="icon">
                        {#if showPassword}<Eye class="size-4" />{:else}<EyeOff class="size-4" />{/if}
                    </Button>
                </div>
            </div>
            <Button type="submit" disabled={isPending}>
                {#if isPending}<LoadingSpinner class="mr-2" />{/if} Change Password
            </Button>
        </CardContent>
    </Card>
</form>
