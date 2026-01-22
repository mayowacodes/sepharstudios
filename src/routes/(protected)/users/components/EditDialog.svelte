<script lang="ts">
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import SelectComponent from './select-component.svelte';
  import type { User } from '$lib/auth';
  import { Calendar, User as UserIcon } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button';
  import { page } from '$app/state';
  import type { iResult } from '$lib/interface';
  import { adminRoles, Role } from '$lib/constants';
  import { roles } from '$lib/authentication/fxn';
  import LoadingSpinner from '$lib/authentication/ui/loading-spinner.svelte';

  interface Props {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

  let { user = $bindable(), open = $bindable(false), onOpenChange }: Props = $props();
  const me = page.data.user as User;
  const isAdmin = $derived(adminRoles.includes(me.role as Role));
  let isLoading = $state(false);
  let formData = $state(user);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const entries = Object.fromEntries(fd.entries());
    isLoading = true;
    try {
      const url = `/api/users/${user.id}`;
      const options: RequestInit = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ me, data: { ...entries } })
      };
      const response = await fetch(url, options);
      const { status, message, data } = (await response.json()) as iResult;
      if (status === 'error') throw new Error(message);
      user = data;
      toast.success('Success Alert', { description: 'Successfully updated user' });
      location.reload();
    } catch (err: any) {
      console.error('Failed to update user:', err);
      toast.error('Error Alert', { description: err.message || 'Failed to update user' });
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
      <DialogTitle class="flex items-center gap-2"><Calendar class="h-5 w-5" />Edit User</DialogTitle>
      <DialogDescription>Update the user details.</DialogDescription>
    </DialogHeader>
    <form onsubmit={handleSubmit} class="space-y-4">
      <div class="space-y-2">
        <Label for="name" class="text-sm font-medium">Name *</Label>
        <div class="relative">
          <UserIcon class="absolute top-3 left-3 h-4 w-4" />
          <Input name="name" id="name" type="text" placeholder="Enter name" bind:value={formData.name} class="pl-10" required />
        </div>
      </div>
      {#if isAdmin && me.id !== user?.id}
        <SelectComponent disabled={isLoading} bind:value={user.role as string} options={roles} class="w-32" name="role" placeholder="Select role" />
      {:else}
        <span class="text-sm text-muted-foreground">{me.id === user?.id ? 'You' : 'No access'}</span>
      {/if}
      <DialogFooter>
        <Button type="button" variant="outline" class="cursor-pointer" onclick={() => handleOpenChange(false)} disabled={isLoading}>Cancel</Button>
        {#if isLoading}
          <Button disabled={isLoading}><LoadingSpinner class="text-white dark:text-background" /><span>Saving...</span></Button>
        {:else}
          <Button type="submit">Save User</Button>
        {/if}
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
