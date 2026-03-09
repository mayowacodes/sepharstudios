<script lang="ts">
  import { page } from '$app/state';
  import { beforeNavigate } from '$app/navigation';
  import { onMount } from 'svelte';

  interface Props {
    /** Profile type — 'kids' enforces strict allow-list, 'teens' is slightly relaxed */
    profileType?: 'kids' | 'teens';
    children?: import('svelte').Snippet;
  }

  let { profileType = 'kids', children }: Props = $props();

  // Paths that kids/teens profiles may access
  const KIDS_ALLOWED_PREFIXES = [
    '/kids/',
    '/watch/',
    '/auth/',
    '/api/'
  ];
  const TEENS_ALLOWED_PREFIXES = [
    '/kids/',
    '/watch/',
    '/auth/',
    '/api/',
    '/plans',
    '/checkout'
  ];

  let blocked = $state(false);
  let blockedUrl = $state('');

  function isAllowed(url: string): boolean {
    const prefixes = profileType === 'teens' ? TEENS_ALLOWED_PREFIXES : KIDS_ALLOWED_PREFIXES;
    return prefixes.some((p) => url.startsWith(p));
  }

  // Block navigations to adult routes
  beforeNavigate(({ to, cancel }) => {
    if (!to) return;
    const path = to.url.pathname;
    if (!isAllowed(path)) {
      cancel();
      blocked = true;
      blockedUrl = path;
    }
  });

  // Check current URL on mount — redirect if landed on non-allowed page
  onMount(() => {
    const current = page.url.pathname;
    if (!isAllowed(current)) {
      blocked = true;
      blockedUrl = current;
    }
  });

  function dismiss() {
    blocked = false;
    blockedUrl = '';
  }
</script>

{#if blocked}
  <!-- Blocker overlay -->
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-pink-100 to-indigo-200">
    <div class="text-center px-8 py-10 bg-white rounded-3xl shadow-2xl max-w-sm mx-4">
      <div class="text-6xl mb-4">🔒</div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        {profileType === 'teens' ? 'That area is for grown-ups' : 'Oops! Wrong way!'}
      </h2>
      <p class="text-gray-500 text-sm mb-6">
        {profileType === 'teens'
          ? 'That section is not available on this profile.'
          : 'This part of the app is only for adults. Let\'s go back to the fun stuff!'}
      </p>
      <div class="flex flex-col gap-3">
        <a
          href={profileType === 'teens' ? '/kids/teens' : '/kids/kiddies'}
          onclick={dismiss}
          class="block w-full py-3 px-6 rounded-2xl font-bold text-white {profileType === 'teens' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-pink-500 hover:bg-pink-600'} transition-colors shadow-md"
        >
          {profileType === 'teens' ? 'Back to Teens' : 'Back to Kids Zone'}
        </a>
        <a
          href="/profiles"
          class="block w-full py-3 px-6 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
        >
          Switch Profile
        </a>
      </div>
    </div>
  </div>
{:else}
  {@render children?.()}
{/if}
