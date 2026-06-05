<script lang="ts">
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import { ShieldX, UserPlus, ArrowLeft } from '@lucide/svelte';

  const reason = $derived(page.url.searchParams.get('reason') ?? 'unknown');
  const portal = $derived(reason === 'admin' ? 'Admin portal' : reason === 'creator' ? 'Creator portal' : 'this area');
</script>

<svelte:head>
  <title>Access denied · Sephar Studios</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center px-4">
  <div class="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center space-y-5">
    <div class="inline-flex w-14 h-14 items-center justify-center rounded-full bg-destructive/10 mx-auto">
      <ShieldX class="w-7 h-7 text-destructive" aria-hidden="true" />
    </div>

    {#if reason === 'admin'}
      <h1 class="text-2xl font-bold">You're not an admin</h1>
      <p class="text-sm text-muted-foreground">
        The Admin portal is reserved for Sephar Studios staff. If you should have access, contact your team lead and ask them to grant you the admin role.
      </p>
      <div class="flex flex-col gap-2">
        <Button href="/browse" variant="default">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to browse
        </Button>
      </div>
    {:else if reason === 'creator'}
      <h1 class="text-2xl font-bold">You're not a creator yet</h1>
      <p class="text-sm text-muted-foreground">
        The Creator portal is for approved Sephar Studios creators. To start publishing content, apply to become a creator — applications usually get reviewed within 3 business days.
      </p>
      <div class="flex flex-col gap-2">
        <Button href="/apply/creator" variant="default">
          <UserPlus class="w-4 h-4 mr-2" />
          Apply to become a creator
        </Button>
        <Button href="/browse" variant="outline">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to browse
        </Button>
      </div>
    {:else}
      <h1 class="text-2xl font-bold">Access denied</h1>
      <p class="text-sm text-muted-foreground">
        You don't have permission to view {portal}. If you believe this is a mistake, sign out and back in, or contact support.
      </p>
      <div class="flex flex-col gap-2">
        <Button href="/browse" variant="default">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to browse
        </Button>
      </div>
    {/if}

    <p class="text-xs text-muted-foreground pt-2 border-t border-border">
      Need help? <a href="/contact" class="underline hover:text-foreground">Contact support</a>
    </p>
  </div>
</div>
