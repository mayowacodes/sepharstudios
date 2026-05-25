<script lang="ts">
  import { page } from '$app/state';
  import { isConnected, walletAddress } from '$lib/web3/wallet';
  import { stcToken } from '$lib/web3/contracts';
  import ProfileSwitcher from '$lib/components/sections/dashboard/ProfileSwitcher.svelte';
  import Downloads from '$lib/components/sections/dashboard/Downloads.svelte';
  import MyList from '$lib/components/sections/dashboard/MyList.svelte';
  import RecentlyWatched from '$lib/components/sections/dashboard/RecentlyWatched.svelte';
  import Recommendations from '$lib/components/sections/dashboard/Recommendations.svelte';
  import Settings from '$lib/components/sections/dashboard/Settings.svelte';
  import AccountSettings from '$lib/components/sections/dashboard/AccountSettings.svelte';
  import WalletConnect from '$lib/components/web3/WalletConnect.svelte';
  import {
    Crown, Coins, Gift, User, ListVideo, Download,
    Clock, Settings as SettingsIcon, Clapperboard, ChevronRight
  } from '@lucide/svelte';

  const user = page.data?.user;

  let userTokenBalance = $state('0');
  let userStakingDiscount = $state(0);
  let activeTab = $state('overview');

  $effect(() => {
    if ($isConnected && $walletAddress) {
      (async () => {
        try {
          const [balance, discount] = await Promise.all([
            stcToken.balanceOf($walletAddress),
            stcToken.getUserDiscount($walletAddress)
          ]);
          userTokenBalance = balance;
          userStakingDiscount = discount;
        } catch (error) {
          console.error('Error loading user Web3 data:', error);
        }
      })();
    }
  });

  function getUserInitial(u: any) {
    if (!u) return '?';
    if (u.name) return u.name[0].toUpperCase();
    if (u.email) return u.email[0].toUpperCase();
    return '?';
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'mylist', label: 'My List', icon: ListVideo },
    { key: 'recent', label: 'Recently Watched', icon: Clock },
    { key: 'downloads', label: 'Downloads', icon: Download },
    { key: 'recommendations', label: 'For You', icon: Clapperboard },
    { key: 'settings', label: 'Settings', icon: SettingsIcon },
  ];
</script>

<svelte:head>
  <title>My Studios · Sephar Studios</title>
  <meta name="description" content="Your personal Sephar Studios dashboard — manage profiles, watchlist, downloads and settings." />
</svelte:head>

<main class="mystudios-page">
  <!-- Hero banner -->
  <section class="mystudios-hero">
    <div class="mystudios-hero-glow"></div>
    <div class="mystudios-hero-inner">
      <!-- Avatar -->
      <div class="mystudios-hero-avatar">
        {#if user?.image}
          <img src={user.image} alt={user.name} class="w-full h-full object-cover rounded-full" />
        {:else}
          <span class="mystudios-hero-initial">{getUserInitial(user)}</span>
        {/if}
        <div class="mystudios-hero-ring"></div>
      </div>

      <!-- Info -->
      <div class="mystudios-hero-info">
        <h1 class="mystudios-hero-name">
          {user?.name ?? 'My Studios'}
        </h1>
        {#if user?.email}
          <p class="mystudios-hero-email">{user.email}</p>
        {/if}
        <div class="mystudios-hero-badges">
          <span class="badge badge--gold">
            <Crown size={11} /> Premium
          </span>
          {#if $isConnected}
            <span class="badge badge--purple">
              <Coins size={11} />
              {parseFloat(userTokenBalance).toLocaleString()} STC
            </span>
          {/if}
        </div>
      </div>

      <!-- Quick stats -->
      {#if $isConnected}
        <div class="mystudios-hero-stats">
          <div class="stat-pill">
            <Coins size={14} class="stat-icon" />
            <div>
              <p class="stat-val">{parseFloat(userTokenBalance).toLocaleString()}</p>
              <p class="stat-label">STC Tokens</p>
            </div>
          </div>
          <div class="stat-pill">
            <Gift size={14} class="stat-icon" />
            <div>
              <p class="stat-val">{userStakingDiscount}%</p>
              <p class="stat-label">Discount</p>
            </div>
          </div>
        </div>
      {/if}
    </div>
    <div class="mystudios-hero-shimmer"></div>
  </section>

  <!-- Tab navigation -->
  <nav class="mystudios-tabs" aria-label="Studio sections">
    {#each tabs as tab}
      <button
        class="mystudios-tab"
        class:active={activeTab === tab.key}
        onclick={() => activeTab = tab.key}
      >
        <tab.icon size={15} />
        {tab.label}
      </button>
    {/each}
  </nav>

  <!-- Tab content -->
  <div class="mystudios-content">

    {#if activeTab === 'overview'}
      <div class="overview-grid">
        <!-- Profiles -->
        <div class="overview-card">
          <div class="overview-card-header">
            <User size={16} class="overview-card-icon" />
            <h2>Switch Profile</h2>
            <button class="overview-card-action" onclick={() => activeTab = 'settings'}>
              Manage <ChevronRight size={13} />
            </button>
          </div>
          <div class="overview-card-body">
            <ProfileSwitcher />
          </div>
        </div>

        <!-- My List preview -->
        <div class="overview-card">
          <div class="overview-card-header">
            <ListVideo size={16} class="overview-card-icon" />
            <h2>My List</h2>
            <a href="/my-list" class="overview-card-action">
              View all <ChevronRight size={13} />
            </a>
          </div>
          <div class="overview-card-body">
            <MyList />
          </div>
        </div>

        <!-- Recently Watched preview -->
        <div class="overview-card">
          <div class="overview-card-header">
            <Clock size={16} class="overview-card-icon" />
            <h2>Recently Watched</h2>
          </div>
          <div class="overview-card-body">
            <RecentlyWatched />
          </div>
        </div>

        <!-- Web3 card -->
        <div class="overview-card overview-card--web3">
          <div class="overview-card-header">
            <Crown size={16} class="overview-card-icon overview-card-icon--gold" />
            <h2>NFT Subscription & Tokens</h2>
          </div>
          <div class="overview-card-body">
            {#if $isConnected}
              <div class="web3-grid">
                <div class="web3-stat">
                  <Coins size={20} class="web3-stat-icon" />
                  <p class="web3-stat-val">{parseFloat(userTokenBalance).toLocaleString()}</p>
                  <p class="web3-stat-label">STC Tokens</p>
                </div>
                <div class="web3-stat">
                  <Gift size={20} class="web3-stat-icon" />
                  <p class="web3-stat-val">{userStakingDiscount}%</p>
                  <p class="web3-stat-label">Staking Discount</p>
                </div>
              </div>
              <div class="web3-actions">
                <a href="/subscription" class="web3-btn web3-btn--primary">
                  <Crown size={14} /> NFT Subscription
                </a>
                <a href="/token" class="web3-btn web3-btn--outline">
                  <Coins size={14} /> Token Hub
                </a>
              </div>
            {:else}
              <WalletConnect />
            {/if}
          </div>
        </div>
      </div>

    {:else if activeTab === 'mylist'}
      <div class="content-section">
        <MyList />
      </div>

    {:else if activeTab === 'recent'}
      <div class="content-section">
        <RecentlyWatched />
      </div>

    {:else if activeTab === 'downloads'}
      <div class="content-section">
        <Downloads />
      </div>

    {:else if activeTab === 'recommendations'}
      <div class="content-section">
        <Recommendations />
      </div>

    {:else if activeTab === 'settings'}
      <div class="settings-grid">
        <div class="overview-card">
          <div class="overview-card-header">
            <SettingsIcon size={16} class="overview-card-icon" />
            <h2>Preferences</h2>
          </div>
          <div class="overview-card-body"><Settings /></div>
        </div>
        <div class="overview-card">
          <div class="overview-card-header">
            <User size={16} class="overview-card-icon" />
            <h2>Account</h2>
          </div>
          <div class="overview-card-body"><AccountSettings /></div>
        </div>
      </div>
    {/if}

  </div>
</main>

<style>
  /* ── Page shell ─────────────────────────────────────────────────────── */
  .mystudios-page {
    min-height: 100vh;
    background: #09090f;
    color: white;
  }

  /* ── Hero ───────────────────────────────────────────────────────────── */
  .mystudios-hero {
    position: relative;
    padding: 3rem 1.5rem 2rem;
    overflow: hidden;
  }

  .mystudios-hero-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 100% at 50% -30%, rgba(255,94,14,0.2), transparent 65%),
      radial-gradient(ellipse 60% 60% at 80% 50%, rgba(255,191,0,0.06), transparent 60%);
    pointer-events: none;
  }

  .mystudios-hero-inner {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .mystudios-hero-avatar {
    position: relative;
    width: 5rem;
    height: 5rem;
    border-radius: 9999px;
    background: linear-gradient(135deg, #FF5E0E, #FFBF00);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .mystudios-hero-initial {
    font-size: 2rem;
    font-weight: 800;
    color: white;
  }

  .mystudios-hero-ring {
    position: absolute;
    inset: -4px;
    border-radius: 9999px;
    border: 2px solid rgba(255,94,14,0.35);
    pointer-events: none;
  }

  .mystudios-hero-info {
    flex: 1;
    min-width: 180px;
  }

  .mystudios-hero-name {
    font-size: clamp(1.4rem, 4vw, 2rem);
    font-weight: 800;
    color: white;
    margin: 0 0 0.25rem;
    line-height: 1.15;
  }

  .mystudios-hero-email {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
    margin: 0 0 0.75rem;
  }

  .mystudios-hero-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.2rem 0.55rem;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .badge--gold {
    color: #FFBF00;
    background: rgba(255,191,0,0.1);
    border: 1px solid rgba(255,191,0,0.25);
  }

  .badge--purple {
    color: #a78bfa;
    background: rgba(167,139,250,0.1);
    border: 1px solid rgba(167,139,250,0.25);
  }

  .mystudios-hero-stats {
    display: flex;
    gap: 0.75rem;
    margin-left: auto;
    flex-wrap: wrap;
  }

  .stat-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 0.75rem;
    padding: 0.6rem 0.875rem;
  }

  :global(.stat-icon) { color: #FF5E0E; }

  .stat-val {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
    margin: 0;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.4);
    margin: 0.15rem 0 0;
  }

  .mystudios-hero-shimmer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,94,14,0.5), rgba(255,191,0,0.3), transparent);
  }

  /* ── Tabs ───────────────────────────────────────────────────────────── */
  .mystudios-tabs {
    display: flex;
    overflow-x: auto;
    gap: 0.25rem;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .mystudios-tabs::-webkit-scrollbar { display: none; }

  .mystudios-tab {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.875rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
  }

  .mystudios-tab:hover {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.04);
  }

  .mystudios-tab.active {
    color: white;
    background: rgba(255, 94, 14, 0.1);
    border-color: rgba(255, 94, 14, 0.3);
  }

  /* ── Content area ───────────────────────────────────────────────────── */
  .mystudios-content {
    max-width: 960px;
    margin: 0 auto;
    padding: 1.5rem;
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
    gap: 1rem;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
    gap: 1rem;
  }

  .content-section {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 1rem;
    padding: 1.25rem;
  }

  /* ── Overview cards ─────────────────────────────────────────────────── */
  .overview-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 1rem;
    overflow: hidden;
    transition: border-color 0.2s;
  }

  .overview-card:hover {
    border-color: rgba(255,255,255,0.1);
  }

  .overview-card--web3 {
    background: rgba(255,191,0,0.02);
    border-color: rgba(255,191,0,0.1);
  }

  .overview-card--web3:hover {
    border-color: rgba(255,191,0,0.2);
  }

  .overview-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .overview-card-header h2 {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255,255,255,0.7);
    margin: 0;
    flex: 1;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  :global(.overview-card-icon) {
    color: rgba(255,255,255,0.3);
    flex-shrink: 0;
  }

  :global(.overview-card-icon--gold) {
    color: #FFBF00 !important;
  }

  .overview-card-action {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.7rem;
    color: rgba(255,94,14,0.8);
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.15s;
    padding: 0;
  }

  .overview-card-action:hover { color: #FF5E0E; }

  .overview-card-body {
    padding: 1rem;
  }

  /* ── Web3 ───────────────────────────────────────────────────────────── */
  .web3-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .web3-stat {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 0.75rem;
    padding: 0.875rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  :global(.web3-stat-icon) { color: #FFBF00; }

  .web3-stat-val {
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    margin: 0;
    line-height: 1;
  }

  .web3-stat-label {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.4);
    margin: 0;
  }

  .web3-actions {
    display: flex;
    gap: 0.5rem;
  }

  .web3-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.5rem 0.75rem;
    border-radius: 0.625rem;
    text-decoration: none;
    transition: opacity 0.15s, transform 0.15s;
  }

  .web3-btn--primary {
    background: linear-gradient(135deg, #FFBF00, #FF8C00);
    color: #0a0a0a;
  }

  .web3-btn--outline {
    background: transparent;
    color: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.15);
  }

  .web3-btn:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
</style>
