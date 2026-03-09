<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { PlayCircle, Film, Crown, Users, Sparkles, MonitorSmartphone, Coins, Zap, Lock, Gem, TrendingUp } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { page } from "$app/state";
  import MediaGrid from "$lib/components/MediaGrid.svelte";
  import RecentlyWatched from "$lib/components/sections/dashboard/RecentlyWatched.svelte";
  import Recommendations from "$lib/components/sections/dashboard/Recommendations.svelte";
  import type { MediaSection } from "$lib/types/media";

  const { data } = $props();
  const user = $derived(page.data.user);

  let isMounted = $state(false);

  const contentSections = $derived<MediaSection[]>([
    { title: "Trending Movies", items: (data.movies || []) as any[] },
    { title: "Popular Shows", items: (data.shows || []) as any[] },
    { title: "Inspiring Documentaries", items: (data.documentaries || []) as any[] }
  ]);

  onMount(() => {
    isMounted = true;
  });
</script>

<div class="relative overflow-hidden min-h-screen bg-(--surface-charcoal) text-white">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div>


  <main class="container relative z-10 pt-32 pb-16 mx-auto px-4">
    <!-- Hero Section -->
    {#if isMounted}
      <section in:fly={{ y: 50, duration: 1000, delay: 100 }} class="text-center space-y-6 pb-24 max-w-4xl mx-auto">
        <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight drop-shadow-lg">
          Faith-Based Entertainment
          <br />
          <span class="text-transparent bg-clip-text bg-linear-to-r from-[#FF5E0E] to-[#FFBF00]">
            For The Whole Family
          </span>
        </h1>
        <p class="text-xl text-white/70 max-w-2xl mx-auto font-light">
          Stream thousands of faith-inspiring movies, shows, and documentaries. Start your free trial today.
        </p>
        <div class="flex flex-wrap justify-center gap-4 pt-4">
          {#if user}
            <Button size="lg" href="/dashboard" class="bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white border-0 shadow-[0_0_20px_rgba(255,94,14,0.4)] hover:shadow-[0_0_30px_rgba(255,94,14,0.6)] transition-all hover:scale-105">
              <PlayCircle class="mr-2 h-5 w-5" />
              Continue Watching
            </Button>
          {:else}
            <Button size="lg" href="/auth/login" class="bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white border-0 shadow-[0_0_20px_rgba(255,94,14,0.4)] hover:shadow-[0_0_30px_rgba(255,94,14,0.6)] transition-all hover:scale-105">
              <PlayCircle class="mr-2 h-5 w-5" />
              Start Watching
            </Button>
          {/if}
            <Button size="lg" variant="outline" href="/about" class="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105">
              Learn More
            </Button>
        </div>
      </section>

      <!-- Glass UI Bento Grid & Device Frames (Options A & B Combined) -->
      <section in:fly={{ y: 50, duration: 1000, delay: 300 }} class="grid lg:grid-cols-2 gap-12 items-center pb-32">
        <div class="space-y-6 lg:pr-12">
          <div class="inline-flex items-center rounded-full border border-[#FF5E0E]/30 bg-[#FF5E0E]/10 px-3 py-1 text-sm font-medium text-[#FF5E0E] backdrop-blur-md mb-4">
            <Sparkles class="mr-2 h-4 w-4" /> Watch Anywhere, Anytime
          </div>
          <h2 class="text-4xl font-bold leading-tight">Immersive Streaming Experience</h2>
          <p class="text-lg text-white/70 font-light leading-relaxed mb-6">
            Stream on your phone, tablet, laptop, or TV. Download shows to watch offline. 
            Enjoy seamless switching between family profiles and pick up right where you left off.
          </p>
          <Button size="lg" variant="outline" href="/plans" class="border-[#FF5E0E]/50 text-[#FF5E0E] hover:bg-[#FF5E0E]/10 backdrop-blur-sm group transition-all hover:scale-105">
            View Premium Plans
            <MonitorSmartphone class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <!-- Bento Grid Montage -->
        <div class="relative grid grid-cols-2 gap-4 h-125 w-full perspective-1000">
          <!-- Glassmorphic TV Frame -->
          <div class="col-span-2 row-span-2 relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl group hover:border-[#FF5E0E]/50 transition-colors duration-500">
            <div class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
            <img src="https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&q=80" alt="Family movie night" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            <div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
            <div class="absolute bottom-6 left-6 flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-[#FF5E0E] flex items-center justify-center shadow-lg">
                <PlayCircle class="h-6 w-6 text-white" />
              </div>
              <div>
                <p class="font-bold text-lg">Now Streaming</p>
                <p class="text-sm text-white/70">Available in 4K HDR</p>
              </div>
            </div>
          </div>
          
          <!-- Smaller Bento Tiles -->
          <div class="relative rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md p-6 flex flex-col justify-end overflow-hidden group hover:bg-white/10 transition-colors">
            <div class="absolute -right-6 -top-6 w-24 h-24 bg-[#FF5E0E]/20 blur-2xl rounded-full"></div>
            <MonitorSmartphone class="h-8 w-8 text-white mb-4 opacity-80" />
            <p class="font-semibold text-lg">Mobile Ready</p>
            <p class="text-xs text-white/60">Watch on the go</p>
          </div>
          
          <div class="relative rounded-2xl border border-white/10 bg-[#FF5E0E]/10 backdrop-blur-md p-6 flex flex-col justify-end overflow-hidden group hover:bg-[#FF5E0E]/20 transition-colors">
            <div class="absolute -left-6 -bottom-6 w-24 h-24 bg-[#FFBF00]/20 blur-2xl rounded-full"></div>
            <Users class="h-8 w-8 text-[#FF5E0E] mb-4 opacity-90" />
            <p class="font-semibold text-lg">8 Profiles</p>
            <p class="text-xs text-white/60">For the whole family</p>
          </div>
        </div>
      </section>

      <!-- Personalised rows (only for signed-in users) -->
      {#if user}
        <section in:fly={{ y: 50, duration: 800, delay: 350 }} class="pb-12 max-w-7xl mx-auto w-full space-y-10">
          <RecentlyWatched />
          <Recommendations />
        </section>
      {/if}

      <!-- Content Preview Rows -->
      <section in:fly={{ y: 50, duration: 1000, delay: 400 }} class="pb-24 max-w-7xl mx-auto w-full">
        <h2 class="text-3xl font-bold mb-8 px-4 border-l-4 border-[#FF5E0E]">Explore Content</h2>
        <MediaGrid sections={contentSections} />
      </section>

      <!-- Features Bento Grid -->
      <section in:fly={{ y: 50, duration: 1000, delay: 500 }} class="grid md:grid-cols-3 gap-6 pb-24">
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 text-center hover:bg-white/10 transition-colors hover:-translate-y-2 duration-300">
          <div class="mx-auto w-16 h-16 rounded-full bg-[#FF5E0E]/10 flex items-center justify-center mb-6">
            <Film class="h-8 w-8 text-[#FF5E0E]" />
          </div>
          <h3 class="text-xl font-bold mb-3">Extensive Library</h3>
          <p class="text-white/60 font-light leading-relaxed">Access thousands of faith-based movies, shows, and documentaries carefully curated for your family.</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 text-center hover:bg-white/10 transition-colors hover:-translate-y-2 duration-300">
          <div class="mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
            <Users class="h-8 w-8 text-blue-400" />
          </div>
          <h3 class="text-xl font-bold mb-3">Family Profiles</h3>
          <p class="text-white/60 font-light leading-relaxed">Create individualized profiles with personalized recommendations, watchlists, and secure kids modes.</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 text-center hover:bg-white/10 transition-colors hover:-translate-y-2 duration-300">
          <div class="mx-auto w-16 h-16 rounded-full bg-[#FFBF00]/10 flex items-center justify-center mb-6">
            <Crown class="h-8 w-8 text-[#FFBF00]" />
          </div>
          <h3 class="text-xl font-bold mb-3">Premium Quality</h3>
          <p class="text-white/60 font-light leading-relaxed">Enjoy crystal clear content in up to 4K HDR quality with immersive surround sound across all devices.</p>
        </div>
      </section>
      <!-- Web3 Token & NFT Utility Section -->
      <section in:fly={{ y: 50, duration: 1000, delay: 600 }} class="pb-24">
        <div class="text-center mb-12">
          <div class="inline-flex items-center rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-sm font-medium text-[#FFBF00] backdrop-blur-md mb-4">
            <Coins class="mr-2 h-4 w-4" /> Powered by Web3 on Polygon
          </div>
          <h2 class="text-3xl font-bold mb-4">Earn, Stake & Own Your Experience</h2>
          <p class="text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Sephar Studios is built on the Polygon blockchain. Watch content to earn STC tokens, stake them for subscription discounts, and hold your subscription as a true on-chain digital asset.
          </p>
        </div>

        <!-- Four utility cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-7 hover:bg-white/10 transition-colors hover:-translate-y-2 duration-300">
            <div class="w-14 h-14 rounded-2xl bg-[#FF5E0E]/15 flex items-center justify-center mb-5">
              <Zap class="h-7 w-7 text-[#FF5E0E]" />
            </div>
            <h3 class="text-lg font-bold mb-2">Earn While You Watch</h3>
            <p class="text-white/55 text-sm font-light leading-relaxed">
              Earn <span class="text-white/80 font-medium">1 STC per hour</span> of content watched, up to <span class="text-white/80 font-medium">5 STC per day</span>. Refer a friend and get a <span class="text-white/80 font-medium">10 STC bonus</span> when they subscribe.
            </p>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-7 hover:bg-white/10 transition-colors hover:-translate-y-2 duration-300">
            <div class="w-14 h-14 rounded-2xl bg-[#FFBF00]/15 flex items-center justify-center mb-5">
              <Lock class="h-7 w-7 text-[#FFBF00]" />
            </div>
            <h3 class="text-lg font-bold mb-2">Stake or Subscribe with STC</h3>
            <p class="text-white/55 text-sm font-light leading-relaxed">
              Redeem <span class="text-white/80 font-medium">200 STC for 1 free month</span>. Or stake 1,000+ STC for up to <span class="text-white/80 font-medium">50% off</span> your USDC subscription. Spent STC returns to the platform pool.
            </p>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-7 hover:bg-white/10 transition-colors hover:-translate-y-2 duration-300">
            <div class="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center mb-5">
              <Gem class="h-7 w-7 text-purple-400" />
            </div>
            <h3 class="text-lg font-bold mb-2">Subscription NFT</h3>
            <p class="text-white/55 text-sm font-light leading-relaxed">
              Every subscription is minted as an <span class="text-white/80 font-medium">ERC-721 NFT</span> on Polygon. You truly own your access — Basic $10, Premium $15, Creator $25/mo.
            </p>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-7 hover:bg-white/10 transition-colors hover:-translate-y-2 duration-300">
            <div class="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center mb-5">
              <TrendingUp class="h-7 w-7 text-green-400" />
            </div>
            <h3 class="text-lg font-bold mb-2">Creators Earn Up to 55%</h3>
            <p class="text-white/55 text-sm font-light leading-relaxed">
              Creators receive <span class="text-white/80 font-medium">30–55% of content revenue</span> distributed on-chain in USDC or STC — automatically, transparently, every cycle.
            </p>
          </div>
        </div>

        <!-- Token stats bar -->
        <div class="rounded-2xl border border-[#FFBF00]/20 bg-[#FFBF00]/5 backdrop-blur-md p-6 flex flex-wrap gap-8 items-center justify-between">
          <div>
            <p class="text-xs text-white/40 uppercase tracking-widest mb-1">Total Supply</p>
            <p class="text-2xl font-bold text-[#FFBF00]">2B STC</p>
          </div>
          <div>
            <p class="text-xs text-white/40 uppercase tracking-widest mb-1">User Rewards Pool</p>
            <p class="text-2xl font-bold text-white">1B STC <span class="text-sm font-normal text-white/50">50%</span></p>
          </div>
          <div>
            <p class="text-xs text-white/40 uppercase tracking-widest mb-1">Creator Incentives</p>
            <p class="text-2xl font-bold text-white">500M STC <span class="text-sm font-normal text-white/50">25%</span></p>
          </div>
          <div>
            <p class="text-xs text-white/40 uppercase tracking-widest mb-1">Blockchain</p>
            <p class="text-2xl font-bold text-white">Polygon</p>
          </div>
          <Button href="/plans" variant="outline" class="border-[#FFBF00]/40 text-[#FFBF00] hover:bg-[#FFBF00]/10 transition-all hover:scale-105">
            <Coins class="mr-2 h-4 w-4" />
            Explore Plans & Staking
          </Button>
        </div>
      </section>
    {/if}
  </main>
</div>
