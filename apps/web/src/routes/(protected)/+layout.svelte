<script lang="ts">
  import { onMount } from 'svelte';
  import type { LayoutProps } from "./$types";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import ModeToggle from "$lib/components/widgets/ModeToggle.svelte";
  import CrumbPath from "$lib/components/ui/crumb-path/crumb-path.svelte";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { infiniteScroll } from "$lib/hooks/use-infinite-scroll.svelte";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import AuthDialog from "$lib/authentication/ui/user/auth-dialog.svelte";
  import TrialBanner from '$lib/components/billing/TrialBanner.svelte';
  import AchievementToast from '$lib/components/widgets/AchievementToast.svelte';

  let { children }: LayoutProps = $props();

  interface Achievement {
    code: string;
    name: string;
    icon?: string;
    stcReward: number;
    earnedAt?: string;
  }

  let achievementQueue = $state<Achievement[]>([]);
  const currentAchievement = $derived(achievementQueue[0] ?? null);

  function dismissAchievement() {
    achievementQueue = achievementQueue.slice(1);
  }

  onMount(async () => {
    try {
      const res = await fetch('/api/achievements');
      if (!res.ok) return;
      const data = await res.json();
      const fiveMinAgo = Date.now() - 5 * 60 * 1000;
      const fresh = (data.achievements ?? []).filter(
        (a: Achievement & { earned: boolean }) =>
          a.earned && a.earnedAt && new Date(a.earnedAt).getTime() > fiveMinAgo
      );
      if (fresh.length > 0) achievementQueue = fresh;
    } catch { /* non-critical */ }
  });
</script>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary"
>
  Skip to main content
</a>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header
      class="sticky top-0 left-0 z-1 flex h-16 shrink-0 items-center justify-between gap-2 backdrop-blur-xs transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <CrumbPath />
      </div>
      <div class="flex items-center gap-2 pr-4">
        <ModeToggle />
        <AuthDialog />
      </div>
    </header>
    <TrialBanner />
    <main id="main-content" tabindex="-1" class="flex flex-1 flex-col gap-4 p-4 py-0 animate-in">
      <QueryClientProvider client={infiniteScroll.queryClient}>
        {@render children()}
        <SvelteQueryDevtools />
      </QueryClientProvider>
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>

{#if currentAchievement}
  <AchievementToast achievement={currentAchievement} onDismiss={dismissAchievement} />
{/if}
