<script lang="ts">
  import UpdateUserForm from '$lib/authentication/ui/update-user-form.svelte';
  import ChangePasswordForm from '$lib/authentication/ui/change-password-form.svelte';
  import { Separator } from '$lib/components/ui/separator';
  import { page } from '$app/state';
  import { Constants } from '$lib/constants';

  const isCredential = $derived(page.data.session?.user?.id.includes(Constants.CREDENTIAL)); // heuristic or check provider
  // Actually better-auth user object doesn't strictly expose provider usually, relying on account linking.
  // We'll show change password always or if we can detect. For now always show.
</script>

<div class="container max-w-4xl py-6 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight">Profile Settings</h1>
    <p class="text-muted-foreground">Manage your account information and preferences.</p>
  </div>
  <Separator />
  
  <div class="grid gap-8 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">
    <div class="space-y-6">
       <UpdateUserForm />
       <ChangePasswordForm />
    </div>
    
    <div class="space-y-6">
      <!-- Account Info / Side Stats could go here -->
    </div>
  </div>
</div>
