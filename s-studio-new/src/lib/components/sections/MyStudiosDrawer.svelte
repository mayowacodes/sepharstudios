<script lang="ts">
  import type { Component } from 'svelte';
  import { Sheet, SheetTrigger, SheetContent } from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';
  import Hero from '$lib/components/sections/dashboard/Hero.svelte';
  import SectionBlock from '$lib/components/sections/dashboard/SectionBlock.svelte';

  import { page } from '$app/state';
  import { tick } from 'svelte';

  let ProfileSwitcher: Component | undefined;
  let Downloads: Component | undefined;
  let MyList: Component | undefined;
  let RecentlyWatched: Component | undefined;
  let Recommendations: Component | undefined;
  let Settings: Component | undefined;
  let AccountSettings: Component | undefined;

  let isOpen = false;
  let isLoading = true;

  const user = page?.data?.user;
  let lastUrl = page?.url;

  $: if (isOpen && page.url !== lastUrl) {
    lastUrl = page.url;
    tick().then(() => {
      isOpen = false;
    });
  }

  $: if (isOpen && isLoading) {
    loadSections();
  }

  async function loadSections() {
    isLoading = true;

    const modules = await Promise.all([
      import('$lib/components/sections/dashboard/ProfileSwitcher.svelte'),
      import('$lib/components/sections/dashboard/Downloads.svelte'),
      import('$lib/components/sections/dashboard/MyList.svelte'),
      import('$lib/components/sections/dashboard/RecentlyWatched.svelte'),
      import('$lib/components/sections/dashboard/Recommendations.svelte'),
      import('$lib/components/sections/dashboard/Settings.svelte'),
      import('$lib/components/sections/dashboard/AccountSettings.svelte')
    ]);

    [
      ProfileSwitcher,
      Downloads,
      MyList,
      RecentlyWatched,
      Recommendations,
      Settings,
      AccountSettings
    ] = modules.map((m) => m.default);

    isLoading = false;
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
        <svelte:component this={ProfileSwitcher} />
      {/if}
    </SectionBlock>

    <SectionBlock title="Recommended for You" {isLoading}>
      {#if Recommendations}
        <svelte:component this={Recommendations} />
      {/if}
    </SectionBlock>

    <SectionBlock title="My List" {isLoading}>
      {#if MyList}
        <svelte:component this={MyList} />
      {/if}
    </SectionBlock>

    <SectionBlock title="Recently Watched" {isLoading}>
      {#if RecentlyWatched}
        <svelte:component this={RecentlyWatched} />
      {/if}
    </SectionBlock>

    <SectionBlock title="Downloads" {isLoading}>
      {#if Downloads}
        <svelte:component this={Downloads} />
      {/if}
    </SectionBlock>

    <SectionBlock title="Settings" {isLoading}>
      {#if Settings}
        <svelte:component this={Settings} />
      {/if}
    </SectionBlock>

    <SectionBlock title="Account" {isLoading}>
      {#if AccountSettings}
        <svelte:component this={AccountSettings} />
      {/if}
    </SectionBlock>
  </SheetContent>
</Sheet>
