<script lang="ts">
  import type { Component } from 'svelte';
  import { Sheet, SheetTrigger, SheetContent } from '$lib/components/ui/sheet';
  import { page } from '$app/state';
  import { tick } from 'svelte';
  import {
    User, ListVideo, Download, Clock, Settings, LogOut,
    ChevronRight, Clapperboard, Crown, Coins, X
  } from '@lucide/svelte';

  // Lazy-loaded section components
  let ProfileSwitcher = $state<Component | undefined>();
  let Downloads = $state<Component | undefined>();
  let MyList = $state<Component | undefined>();
  let RecentlyWatched = $state<Component | undefined>();
  let Recommendations = $state<Component | undefined>();
  let SettingsComp = $state<Component | undefined>();
  let AccountSettings = $state<Component | undefined>();

  let isOpen = $state(false);
  let isLoading = $state(true);
  let activeSection = $state<string | null>(null);

  const userData = $derived(page?.data?.user);
  let lastUrl = $state(page?.url.pathname);

  // Close drawer on navigation
  $effect(() => {
    if (isOpen && page.url.pathname !== lastUrl) {
      lastUrl = page.url.pathname;
      tick().then(() => { isOpen = false; });
    }
  });

  // Lazy-load sections when drawer first opens
  $effect(() => {
    if (isOpen && isLoading) {
      loadSections();
    }
  });

  async function loadSections() {
    isLoading = true;
    try {
      const [
        profileSwitcherMod, downloadsMod, myListMod,
        recentlyWatchedMod, recommendationsMod, settingsMod, accountSettingsMod
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
      SettingsComp = settingsMod.default;
      AccountSettings = accountSettingsMod.default;
    } catch (error) {
      console.error('Failed to load dashboard sections:', error);
    } finally {
      isLoading = false;
    }
  }

  // Swipe-to-close on mobile
  let startX = $state<number | null>(null);
  function handleTouchStart(e: TouchEvent) { startX = e.touches[0].clientX; }
  function handleTouchEnd(e: TouchEvent) {
    if (startX === null) return;
    if (e.changedTouches[0].clientX - startX < -50) isOpen = false;
    startX = null;
  }

  function getUserInitial(user: any) {
    if (!user) return '?';
    if (user.name) return user.name[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return '?';
  }

  const navSections = [
    { key: 'profiles', label: 'Profiles', icon: User, desc: 'Switch or manage profiles' },
    { key: 'mylist', label: 'My List', icon: ListVideo, desc: 'Saved content' },
    { key: 'recommendations', label: 'Recommended', icon: Clapperboard, desc: 'Picked for you' },
    { key: 'recent', label: 'Recently Watched', icon: Clock, desc: 'Continue watching' },
    { key: 'downloads', label: 'Downloads', icon: Download, desc: 'Offline content' },
    { key: 'settings', label: 'Settings', icon: Settings, desc: 'Preferences' },
    { key: 'account', label: 'Account', icon: User, desc: 'Manage account' },
  ];
</script>

<Sheet bind:open={isOpen}>
  <!-- Trigger: Brand-style button replacing the logo slot when logged in -->
  <SheetTrigger>
    <button class="studios-trigger" aria-label="Open My Studios">
      <span class="studios-trigger-dot"></span>
      <span class="studios-trigger-label">My Studios</span>
    </button>
  </SheetTrigger>

  <SheetContent
    side="left"
    class="w-[min(380px,95vw)] h-full p-0 overflow-hidden border-r border-white/5 bg-transparent"
  >
    <div
      class="studios-panel"
      role="region"
      aria-label="My Studios"
      ontouchstart={handleTouchStart}
      ontouchend={handleTouchEnd}
    >
      <!-- Explicit close — the drawer takes ~95% of mobile viewport so
           the overlay-tap area is too thin to be reliable. This X is
           always available regardless of which section is expanded. -->
      <button
        type="button"
        class="studios-close"
        aria-label="Close My Studios"
        onclick={() => (isOpen = false)}
      >
        <X size={18} />
      </button>

      <!-- Hero / Profile Banner -->
      <div class="studios-hero">
        <div class="studios-hero-bg"></div>
        <div class="studios-hero-content">
          <div class="studios-avatar">
            {#if userData?.image}
              <img src={userData.image} alt={userData.name ?? 'User'} class="w-full h-full object-cover rounded-full" />
            {:else}
              <span class="studios-avatar-initial">{getUserInitial(userData)}</span>
            {/if}
            <div class="studios-avatar-ring"></div>
          </div>
          <div class="studios-hero-info">
            <h2 class="studios-name">{userData?.name ?? 'My Studios'}</h2>
            <p class="studios-email">{userData?.email ?? ''}</p>
            <div class="studios-badge">
              <Crown size={10} />
              <span>Premium Member</span>
            </div>
          </div>
        </div>
        <!-- Decorative shimmer line -->
        <div class="studios-shimmer"></div>
      </div>

      <!-- Navigation Sections -->
      <div class="studios-nav">
        {#each navSections as section}
          <button
            class="studios-nav-item"
            class:active={activeSection === section.key}
            onclick={() => activeSection = activeSection === section.key ? null : section.key}
          >
            <div class="studios-nav-icon">
              <section.icon size={16} />
            </div>
            <div class="studios-nav-text">
              <span class="studios-nav-label">{section.label}</span>
              <span class="studios-nav-desc">{section.desc}</span>
            </div>
            <ChevronRight size={14} class="studios-nav-chevron" />
          </button>

          <!-- Expandable section content -->
          {#if activeSection === section.key}
            <div class="studios-section-content">
              {#if isLoading}
                <div class="studios-skeleton"></div>
              {:else if section.key === 'profiles' && ProfileSwitcher}
                <ProfileSwitcher />
              {:else if section.key === 'mylist' && MyList}
                <MyList />
              {:else if section.key === 'recommendations' && Recommendations}
                <Recommendations />
              {:else if section.key === 'recent' && RecentlyWatched}
                <RecentlyWatched />
              {:else if section.key === 'downloads' && Downloads}
                <Downloads />
              {:else if section.key === 'settings' && SettingsComp}
                <SettingsComp />
              {:else if section.key === 'account' && AccountSettings}
                <AccountSettings />
              {/if}
            </div>
          {/if}
        {/each}
      </div>

      <!-- Footer quick-links -->
      <div class="studios-footer">
        <a href="/watchlist" onclick={() => isOpen = false} class="studios-footer-link">
          <ListVideo size={14} />
          Full My List
        </a>
        <a href="/token" onclick={() => isOpen = false} class="studios-footer-link studios-footer-link--gold">
          <Coins size={14} />
          STC Token
        </a>
        <a href="/settings" onclick={() => isOpen = false} class="studios-footer-link">
          <Settings size={14} />
          Settings
        </a>
      </div>
    </div>
  </SheetContent>
</Sheet>

<style>
  /* ── Close (X) inside drawer ────────────────────────────────────────── */
  .studios-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 30;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(6px);
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
  }
  .studios-close:hover {
    background: rgba(0, 0, 0, 0.65);
    transform: scale(1.04);
  }

  /* ── Trigger Button ─────────────────────────────────────────────────── */
  .studios-trigger {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.7rem 0.3rem 0.4rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 94, 14, 0.25);
    background: rgba(255, 94, 14, 0.06);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
  }

  .studios-trigger:hover {
    background: rgba(255, 94, 14, 0.12);
    border-color: rgba(255, 94, 14, 0.45);
    transform: scale(1.02);
  }

  .studios-trigger-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: #FF5E0E;
    box-shadow: 0 0 6px rgba(255, 94, 14, 0.7);
    animation: pulse-dot 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.85); }
  }

  .studios-trigger-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: white;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  /* On the narrowest phones (< 380px), drop the text label so the pill
     stays inside the header bar next to the hamburger + right cluster.
     The orange dot + aria-label keep it accessible. */
  @media (max-width: 380px) {
    .studios-trigger-label {
      display: none;
    }
    .studios-trigger {
      padding: 0.35rem;
      width: 1.85rem;
      height: 1.85rem;
      justify-content: center;
    }
  }

  /* ── Panel ──────────────────────────────────────────────────────────── */
  .studios-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #09090f;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,94,14,0.2) transparent;
  }

  .studios-panel::-webkit-scrollbar { width: 3px; }
  .studios-panel::-webkit-scrollbar-thumb { background: rgba(255,94,14,0.2); border-radius: 2px; }

  /* ── Hero ───────────────────────────────────────────────────────────── */
  .studios-hero {
    position: relative;
    padding: 2rem 1.25rem 1.5rem;
    overflow: hidden;
    flex-shrink: 0;
  }

  .studios-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 120% 80% at 50% -20%, rgba(255, 94, 14, 0.18), transparent 65%),
      linear-gradient(180deg, rgba(255,94,14,0.06) 0%, transparent 100%);
    pointer-events: none;
  }

  .studios-hero-content {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .studios-avatar {
    position: relative;
    width: 4rem;
    height: 4rem;
    border-radius: 9999px;
    background: linear-gradient(135deg, #FF5E0E, #FFBF00);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .studios-avatar-initial {
    font-size: 1.5rem;
    font-weight: 800;
    color: white;
    line-height: 1;
  }

  .studios-avatar-ring {
    position: absolute;
    inset: -3px;
    border-radius: 9999px;
    border: 2px solid rgba(255, 94, 14, 0.4);
    pointer-events: none;
  }

  .studios-hero-info {
    flex: 1;
    min-width: 0;
  }

  .studios-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    margin: 0 0 0.15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .studios-email {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.4);
    margin: 0 0 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .studios-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.65rem;
    font-weight: 600;
    color: #FFBF00;
    background: rgba(255, 191, 0, 0.1);
    border: 1px solid rgba(255, 191, 0, 0.2);
    padding: 0.15rem 0.5rem;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .studios-shimmer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,94,14,0.4), rgba(255,191,0,0.3), transparent);
  }

  /* ── Navigation ─────────────────────────────────────────────────────── */
  .studios-nav {
    flex: 1;
    padding: 0.5rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .studios-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.875rem;
    border-radius: 0.75rem;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    text-align: left;
    width: 100%;
  }

  .studios-nav-item:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.06);
  }

  .studios-nav-item.active {
    background: rgba(255, 94, 14, 0.08);
    border-color: rgba(255, 94, 14, 0.2);
  }

  .studios-nav-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.6);
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
  }

  .studios-nav-item:hover .studios-nav-icon,
  .studios-nav-item.active .studios-nav-icon {
    background: rgba(255, 94, 14, 0.12);
    color: #FF5E0E;
    border-color: rgba(255, 94, 14, 0.25);
  }

  .studios-nav-text {
    flex: 1;
    min-width: 0;
  }

  .studios-nav-label {
    display: block;
    font-size: 0.8125rem;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    line-height: 1.3;
  }

  .studios-nav-desc {
    display: block;
    font-size: 0.7rem;
    color: rgba(255,255,255,0.35);
    margin-top: 0.1rem;
  }

  :global(.studios-nav-chevron) {
    color: rgba(255,255,255,0.25);
    flex-shrink: 0;
    transition: transform 0.2s, color 0.15s;
  }

  .studios-nav-item.active :global(.studios-nav-chevron) {
    transform: rotate(90deg);
    color: #FF5E0E;
  }

  /* ── Expanded section content ─────────────────────────────────────── */
  .studios-section-content {
    margin: 0.25rem 0 0.5rem 3.5rem;
    padding: 0.875rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0.75rem;
    animation: expand-in 0.2s ease;
  }

  @keyframes expand-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .studios-skeleton {
    height: 80px;
    border-radius: 0.5rem;
    background: rgba(255,255,255,0.04);
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }

  /* ── Footer ─────────────────────────────────────────────────────────── */
  .studios-footer {
    flex-shrink: 0;
    padding: 0.75rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 0.5rem;
    background: rgba(255,255,255,0.015);
  }

  .studios-footer-link {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    text-decoration: none;
    padding: 0.4rem 0.6rem;
    border-radius: 0.5rem;
    transition: color 0.15s, background 0.15s;
    white-space: nowrap;
  }

  .studios-footer-link:hover {
    color: white;
    background: rgba(255,255,255,0.06);
  }

  .studios-footer-link--gold {
    color: rgba(255, 191, 0, 0.7);
  }

  .studios-footer-link--gold:hover {
    color: #FFBF00;
    background: rgba(255, 191, 0, 0.06);
  }
</style>
