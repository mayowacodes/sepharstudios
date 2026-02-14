<!-- Creator Portal Layout Reset - Completely replaces the root layout -->
<script lang="ts">
  import '../../../app.css';
  import { ClerkProvider } from 'svelte-clerk';
  import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
  import CreatorNav from '$lib/components/creator/CreatorNav.svelte';
  import CreatorFooter from '$lib/components/creator/CreatorFooter.svelte';
  import { SignedIn, SignedOut, ClerkLoaded, ClerkLoading } from 'svelte-clerk';
  
  let { children } = $props();
</script>

<svelte:head>
  <title>Creator Studio - Sephar Studios</title>
</svelte:head>

<!-- This completely replaces the main app layout -->
<div class="creator-portal">
  <ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
    <ClerkLoading>
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
          <p class="text-white">Loading Creator Studio...</p>
        </div>
      </div>
    </ClerkLoading>

    <ClerkLoaded>
      <SignedIn>
        <div class="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col">
          <CreatorNav />
          <main class="container mx-auto px-4 py-8 flex-grow">
            {@render children()}
          </main>
          <CreatorFooter />
        </div>
      </SignedIn>

      <SignedOut>
        <div class="min-h-screen flex items-center justify-center bg-gray-900">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-white mb-4">Creator Access Required</h1>
            <p class="text-gray-300 mb-8">Please sign in to access the creator portal.</p>
            <div class="space-y-4">
              <a href="/sign-in" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-block transition-colors">
                Sign In
              </a>
              <div>
                <p class="text-gray-400 text-sm">Don't have an account?</p>
                <a href="/sign-up" class="text-purple-400 hover:text-purple-300 underline">
                  Sign up here
                </a>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </ClerkLoaded>
  </ClerkProvider>
</div>