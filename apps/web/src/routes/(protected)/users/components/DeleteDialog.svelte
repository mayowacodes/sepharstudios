<script lang="ts">
  import type { User } from '$lib/auth';
  import LoadingSpinner from '$lib/authentication/ui/loading-spinner.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { AlertTriangle } from '@lucide/svelte';
  import type { iResult } from '$lib/interface';
  import { page } from '$app/state';
  import { toast } from 'svelte-sonner';

  interface Props {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

  let { user, open, onOpenChange }: Props = $props();
  const me = page.data.user as User;
  let isLoading = $state(false);

  const handleDelete = async () => {
    isLoading = true;
    try {
      const url = `/api/users/${user.id}`;
      const options: RequestInit = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ me, data: null })
      };
      const response = await fetch(url, options);
      const { status, message } = (await response.json()) as iResult;
      if (status === 'error') throw new Error(message);
      toast.success('Success Alert', { description: `Successfully deleted ${user.name}` });
      location.reload();
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      toast.error('Error Alert', { description: err.message || 'Failed to delete user' });
    } finally {
      isLoading = false;
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) onOpenChange(newOpen);
  };
</script>

<Dialog {open} onOpenChange={handleOpenChange}>
  <DialogContent class="sm:max-w-md">
    <DialogHeader>
      <DialogTitle class="flex items-center gap-2 text-red-600"><AlertTriangle class="h-5 w-5" />Delete User</DialogTitle>
      <DialogDescription>This action cannot be undone. This will permanently delete the user.</DialogDescription>
    </DialogHeader>
    <div class="space-y-2 rounded-lg border bg-gray-50 p-4 dark:bg-secondary">
      <div class="flex items-center justify-between"><span class="text-sm font-medium">Name:</span><span class="text-sm">{user.name}</span></div>
      <div class="flex items-center justify-between"><span class="text-sm font-medium">Role:</span><span class="text-sm capitalize">{user.role}</span></div>
    </div>
    <DialogFooter>
      <Button type="button" variant="outline" class="cursor-pointer" onclick={() => handleOpenChange(false)} disabled={isLoading}>Cancel</Button>
      {#if isLoading}
        <Button disabled={isLoading}><LoadingSpinner class="text-white" /><span>Deleting...</span></Button>
      {:else}
        <Button type="button" variant="destructive" onclick={handleDelete} disabled={isLoading} class="cursor-pointer">Delete User</Button>
      {/if}
    </DialogFooter>
  </DialogContent>
</Dialog>
