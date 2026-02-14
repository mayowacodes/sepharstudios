<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import type { User } from '$lib/auth';
	import { cn } from '$lib/utils';
	interface Props { user: User; direction?: 'left' | 'right'; class?: string; }
	let { user, class: className, direction = 'left' }: Props = $props();
</script>
{#if user}
	{#if direction === 'left'}
		<div class={cn('flex items-center gap-2 px-1 py-1.5 text-left text-sm', className)}>
			<Avatar.Root class="size-8 rounded-lg">
				<Avatar.Image src={user?.image} alt={user?.name} />
				<Avatar.Fallback class="rounded-lg uppercase">{user?.name?.slice(0, 2)}</Avatar.Fallback>
			</Avatar.Root>
			<div class="grid flex-1 text-left text-sm leading-tight">
				<span class="truncate font-medium">{user?.name}</span>
				<span class="truncate text-xs text-muted-foreground">{user?.email}</span>
			</div>
		</div>
	{/if}
	{#if direction === 'right'}
		<div class={cn('flex items-center justify-end gap-2 px-1 py-1.5 text-sm', className)}>
			<div class="grid flex-1 text-right text-sm leading-tight">
				<span class="truncate font-medium">{user?.name}</span>
				<span class="truncate text-xs text-muted-foreground">{user?.email}</span>
			</div>
			<Avatar.Root class="size-8 rounded-lg">
				<Avatar.Image src={user?.image} alt={user?.name} />
				<Avatar.Fallback class="rounded-lg uppercase">{user?.name?.slice(0, 2)}</Avatar.Fallback>
			</Avatar.Root>
		</div>
	{/if}
{/if}