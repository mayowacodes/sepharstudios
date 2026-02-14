<script lang="ts">
  import type { Component } from 'svelte';
  import { Sheet, SheetTrigger, SheetContent } from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';
  import Hero from '$lib/components/sections/dashboard/Hero.svelte';
  import SectionBlock from '$lib/components/sections/dashboard/SectionBlock.svelte';

  import { page } from '$app/state';
  import { tick } from 'svelte';

  let ProfileSwitcher = $state<Component | undefined>();
  let Downloads = $state<Component | undefined>();
  let MyList = $state<Component | undefined>();
  let RecentlyWatched = $state<Component | undefined>();
  let Recommendations = $state<Component | undefined>();
  let Settings = $state<Component | undefined>();
  let AccountSettings = $state<Component | undefined>();

  let isOpen = $state(false);
  let isLoading = $state(true);

  const user = $derived(page?.data?.user);
  let lastUrl = $state(page?.url.pathname);

  $effect(() => {
    if (isOpen && page.url.pathname !== lastUrl) {
      lastUrl = page.url.pathname;
      tick().then(() => {
        isOpen = false;
      });
    }
  });

  $effect(() => {
    if (isOpen && isLoading) {
      loadSections();
    }
  });

  async function loadSections() {
    isLoading = true;

    try {
      const [
        profileSwitcherMod,
        downloadsMod,
        myListMod,
        recentlyWatchedMod,
        recommendationsMod,
        settingsMod,
        accountSettingsMod
      ] = await Promise.all([
        import('$lib/components/sections/dashboard/ProfileSwitcher.svelte'),
        import('$lib/components/sections/dashboard/Downloads.svelte'),
        import('$lib/components/sections/dashboard/MyList.svelte'),
        import('$lib/components/sections/dashboard/RecentlyWatched.svelte'),
        import('$lib/components/sections/dashboard/Recommendations.svelte'),
        import('$lib/components/sections/dashboard/Settings.svelte'),
        import('$lib/components/sections/dashboard/AccountSettings.svelte')
      ]);

      ProfileSwitcher = profileSwitcherMod.default;
      Downloads = downloadsMod.default;
      MyList = myListMod.default;
      RecentlyWatched = recentlyWatchedMod.default;
      Recommendations = recommendationsMod.default;
      Settings = settingsMod.default;
      AccountSettings = accountSettingsMod.default;
    } catch (error) {
      console.error('Failed to load dashboard sections:', error);
    } finally {
      isLoading = false;
    }
  }

  let startX: number | null = null;

  function handleTouchStart(e: TouchEvent) {
    startX = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent) {
    if (startX === null) return;
    const deltaX = e.changedTouches[0].clientX - startX;
    if (deltaX < -50) isOpen = false;
    startX = null;
  }
</script>

<Sheet bind:open={isOpen}>
  <SheetTrigger class="text-xl font-bold text-orange-500 hover:text-orange-600 transition">
    <Button variant="ghost">My Studios</Button>
  </SheetTrigger>

  <SheetContent
    side="left"
    class="w-[90vw] max-w-2xl h-full p-6 space-y-10 overflow-y-auto bg-background border-r"
    on:touchstart={handleTouchStart}
    on:touchend={handleTouchEnd}
  >
    {#if user}
      <Hero {user} />
    {:else}
      <p class="text-sm text-muted-foreground italic">Loading user info...</p>
    {/if}

    <div class="space-y-1">
      <h2 class="text-2xl font-semibold text-orange-500">Welcome to My Studios</h2>
      <p class="text-muted-foreground text-sm">Manage everything in one place</p>
    </div>

    <SectionBlock title="Switch Profile" {isLoading}>
      {#if ProfileSwitcher}
        <ProfileSwitcher />
      {/if}
    </SectionBlock>

    <SectionBlock title="Recommended for You" {isLoading}>
      {#if Recommendations}
        <Recommendations />
      {/if}
    </SectionBlock>

    <SectionBlock title="My List" {isLoading}>
      {#if MyList}
        <MyList />
      {/if}
    </SectionBlock>

    <SectionBlock title="Recently Watched" {isLoading}>
      {#if RecentlyWatched}
        <RecentlyWatched />
      {/if}
    </SectionBlock>

    <SectionBlock title="Downloads" {isLoading}>
      {#if Downloads}
        <Downloads />
      {/if}
    </SectionBlock>

    <SectionBlock title="Settings" {isLoading}>
      {#if Settings}
        <Settings />
      {/if}
    </SectionBlock>

    <SectionBlock title="Account" {isLoading}>
      {#if AccountSettings}
        <AccountSettings />
      {/if}
    </SectionBlock>
  </SheetContent>
</Sheet>
