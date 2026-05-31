<script lang="ts">
  import { onMount } from 'svelte';
  import UpdateUserForm from '$lib/authentication/ui/update-user-form.svelte';
  import ChangePasswordForm from '$lib/authentication/ui/change-password-form.svelte';
  import { Separator } from '$lib/components/ui/separator';

  // We can't tell from the better-auth session whether the user signed in
  // via credentials or OAuth — the User object doesn't carry provider
  // info. /api/users/me/auth-providers reads the `account` table and
  // returns the linked providers plus `hasPassword`. The change-password
  // form only renders when a credential row with a password exists; OAuth-
  // only users see an "add a password" hint instead.
  let providers = $state<string[]>([]);
  let hasPassword = $state<boolean | null>(null);

  onMount(async () => {
    try {
      const res = await fetch('/api/users/me/auth-providers');
      if (res.ok) {
        const body = await res.json();
        providers = Array.isArray(body.providers) ? body.providers : [];
        hasPassword = !!body.hasPassword;
      } else {
        hasPassword = false;
      }
    } catch {
      hasPassword = false;
    }
  });

  function providerLabel(id: string): string {
    if (id === 'credential') return 'Email + password';
    return id.charAt(0).toUpperCase() + id.slice(1);
  }
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
       {#if hasPassword === null}
         <!-- still loading — render nothing to avoid flicker -->
       {:else if hasPassword}
         <ChangePasswordForm />
       {:else}
         <div class="border border-border rounded-lg p-5 space-y-2">
           <h3 class="text-base font-semibold">Password</h3>
           <p class="text-sm text-muted-foreground">
             You signed in with {providers.filter((p) => p !== 'credential').map(providerLabel).join(' / ') || 'a third-party provider'}.
             There's no password on this account. Set one to enable email + password sign-in as a fallback.
           </p>
           <a href="/forgot-password" class="text-sm text-purple-400 hover:text-purple-300 underline">
             Set a password →
           </a>
         </div>
       {/if}
    </div>

    <div class="space-y-6">
      {#if providers.length > 0}
        <div class="border border-border rounded-lg p-5">
          <h3 class="text-base font-semibold mb-3">Linked sign-in methods</h3>
          <ul class="space-y-1.5 text-sm">
            {#each providers as p (p)}
              <li class="flex items-center justify-between">
                <span class="text-foreground">{providerLabel(p)}</span>
                <span class="text-xs text-muted-foreground">linked</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
</div>
