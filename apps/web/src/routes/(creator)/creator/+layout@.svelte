<!-- Creator Portal Layout Reset - Completely replaces the root layout -->
<script lang="ts">
  import '../../../app.css';
  import { page } from '$app/state';
  import type { User } from '$lib/auth';
  import CreatorNav from '$lib/components/creator/CreatorNav.svelte';
  import CreatorFooter from '$lib/components/creator/CreatorFooter.svelte';
  import { Button } from '$lib/components/ui/button';

  let { children } = $props();
  const user = page.data.user as User | undefined;
</script>

<svelte:head>
  <title>Creator Studio - Sephar Studios</title>
</svelte:head>

<!-- This completely replaces the main app layout -->
<div class="creator-portal">
  {#if user}
    <div class="min-h-screen bg-linear-to-br from-primary/20 via-secondary/10 to-accent/20 flex flex-col">
      <CreatorNav />
      <main class="container mx-auto px-4 py-8 flex-grow">
        {@render children()}
      </main>
      <CreatorFooter />
    </div>
  {:else}
    <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted">
      <div class="text-center max-w-md px-6">
        <div class="mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold mb-4">Creator Access Required</h1>
          <p class="text-muted-foreground mb-8">
            Sign in to access the creator portal and start sharing your faith-based content with the world.
          </p>
        </div>

        <div class="space-y-4">
          <Button href="/auth/login?redirectTo=/creator" class="w-full bg-primary hover:bg-primary/90" size="lg">
            Sign In to Creator Portal
          </Button>

          <div class="text-sm text-muted-foreground">
            <p>Don't have an account?</p>
            <Button href="/auth/register?redirectTo=/creator" variant="link" class="text-primary hover:text-primary/80">
              Sign up here
            </Button>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-border">
          <p class="text-xs text-muted-foreground">
            Need help getting started?
            <Button href="/help" variant="link" class="text-primary p-0 h-auto">
              Visit our help center
            </Button>
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
