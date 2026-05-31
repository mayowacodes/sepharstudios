<!-- Creator Portal Layout Reset - Completely replaces the root layout -->
<script lang="ts">
  import '../../../app.css';
  import { page } from '$app/state';
  import type { User } from '$lib/auth';
  import CreatorNav from '$lib/components/creator/CreatorNav.svelte';
  import CreatorMobileNav from '$lib/components/creator/CreatorMobileNav.svelte';
  import CreatorFooter from '$lib/components/creator/CreatorFooter.svelte';
  import CommandPalette from '$lib/components/dashboard/CommandPalette.svelte';
  import CopilotPanel from '$lib/components/dashboard/CopilotPanel.svelte';
  import { Sparkles } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  let { children } = $props();
  const user = page.data.user as User | undefined;

  // ⌘K / Ctrl+K opens the command palette; ⌘J / Ctrl+J opens the Copilot.
  let paletteOpen = $state(false);
  let copilotOpen = $state(false);
  function onKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      paletteOpen = !paletteOpen;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
      e.preventDefault();
      copilotOpen = !copilotOpen;
    }
  }
</script>

<svelte:head>
  <title>Creator Studio - Sephar Studios</title>
</svelte:head>

<svelte:window on:keydown={onKeydown} />
<CommandPalette bind:open={paletteOpen} variant="creator" />
<CopilotPanel bind:open={copilotOpen} variant="creator" />

<!-- Floating Copilot bubble -->
{#if user}
  <button
    type="button"
    onclick={() => (copilotOpen = !copilotOpen)}
    class="fixed bottom-20 right-4 md:bottom-4 z-40 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 {copilotOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}"
    aria-label="Open Copilot (⌘J)"
    title="Open Copilot (⌘J)"
  >
    <Sparkles class="w-5 h-5" aria-hidden="true" />
  </button>
{/if}

<!-- This completely replaces the main app layout -->
<div class="creator-portal">
  {#if user}
    <div class="min-h-screen bg-linear-to-br from-primary/20 via-secondary/10 to-accent/20 flex flex-col">
      <!-- Skip-to-content for keyboard + screen-reader users. -->
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded"
      >Skip to content</a>
      <CreatorNav />
      <main id="main-content" class="container mx-auto px-4 py-8 grow">
        {@render children()}
      </main>
      <CreatorFooter />
      <CreatorMobileNav />
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
