<script lang="ts">
	import type { User } from '$lib/auth';
	import { signOut } from '$lib/auth-client';
	import { getRoleBadgeVariant } from '$lib/authentication/fxn';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';
	import { LogOutIcon, UserIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	interface Props { user: User; class?: string; }
	let { user, class: className }: Props = $props();
	const logout = async () => {
		await signOut({ fetchOptions: {
			onError: (ctx) => { toast.error('Error Alert', { description: ctx.error.message }); },
			onSuccess: () => { toast.success('Success Alert', { description: 'Successfully signed out' }); location.href = '/auth/login'; }
		}});
	};
	const profile = () => { location.href = '/profile'; };
</script>
<DropdownMenu.Root>
	<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'cursor-pointer rounded-lg border-none outline-none', className)}>
		<Avatar.Root class="size-9 rounded-lg">
			<Avatar.Image class="rounded-lg" src={user.image} alt={user.name} />
			<Avatar.Fallback class="rounded-lg uppercase">{user.name.slice(0, 2)}</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg" align="end" sideOffset={4}>
		<DropdownMenu.Label class="p-0 font-normal">
			<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
				<Avatar.Root class="size-8 rounded-lg">
					<Avatar.Image src={user.image} alt={user.name} />
					<Avatar.Fallback class="rounded-lg uppercase">{user.name.slice(0, 2)}</Avatar.Fallback>
				</Avatar.Root>
				<div class="grid flex-1 text-left text-sm leading-tight">
					<span class="truncate font-medium">{user.name}</span>
					<span class="truncate text-xs">{user.email}</span>
				</div>
			</div>
		</DropdownMenu.Label>
		<div class="px-2 py-1.5 text-sm">
			<div class="flex items-center gap-2 mb-1">
				<span class="text-muted-foreground">Role:</span>
				<Badge class="text-xs capitalize" variant={getRoleBadgeVariant(user.role as string)}>{user.role}</Badge>
			</div>
		</div>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="cursor-pointer" onclick={profile}><UserIcon />Profile</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="cursor-pointer" onclick={logout}><LogOutIcon />Log out</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>