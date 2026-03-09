<script lang="ts">
  import { onMount } from 'svelte';
  import { Flame, Trophy, Star } from '@lucide/svelte';

  interface Achievement {
    code: string;
    name: string;
    description: string;
    icon: string;
    stcReward: number;
    category: string;
    earned: boolean;
    earnedAt: string | null;
  }

  interface AchievementsResponse {
    streak: number;
    longestStreak: number;
    achievements: Achievement[];
  }

  let data = $state<AchievementsResponse | null>(null);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch('/api/achievements');
      if (res.ok) data = await res.json();
    } finally {
      loading = false;
    }
  });

  const earned = $derived(data?.achievements.filter(a => a.earned) ?? []);
  const notEarned = $derived(data?.achievements.filter(a => !a.earned) ?? []);
</script>

<svelte:head>
  <title>Achievements - Sephar Studios</title>
</svelte:head>

<div class="min-h-screen bg-background px-4 py-10">
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center gap-3 mb-8">
      <Trophy class="w-6 h-6 text-yellow-400" />
      <h1 class="text-2xl font-bold">Achievements</h1>
    </div>

    {#if loading}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {#each [1,2,3,4,5,6] as _}
          <div class="h-24 bg-white/5 rounded-xl animate-pulse"></div>
        {/each}
      </div>

    {:else if data}
      <!-- Streak banner -->
      <div class="flex gap-4 mb-8">
        <div class="flex-1 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-4">
          <Flame class="w-8 h-8 text-orange-400" />
          <div>
            <p class="text-2xl font-bold text-orange-400">{data.streak}</p>
            <p class="text-sm text-muted-foreground">day streak</p>
          </div>
        </div>
        <div class="flex-1 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-4">
          <Star class="w-8 h-8 text-yellow-400" />
          <div>
            <p class="text-2xl font-bold text-yellow-400">{data.longestStreak}</p>
            <p class="text-sm text-muted-foreground">longest streak</p>
          </div>
        </div>
        <div class="flex-1 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center gap-4">
          <Trophy class="w-8 h-8 text-purple-400" />
          <div>
            <p class="text-2xl font-bold text-purple-400">{earned.length}</p>
            <p class="text-sm text-muted-foreground">earned</p>
          </div>
        </div>
      </div>

      <!-- Earned -->
      {#if earned.length > 0}
        <h2 class="text-lg font-semibold mb-4">Earned</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {#each earned as a}
            <div class="bg-card border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
              <div class="text-2xl">{a.icon}</div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm">{a.name}</p>
                <p class="text-xs text-muted-foreground mt-0.5">{a.description}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-xs text-yellow-400 font-medium">+{a.stcReward} STC</span>
                  {#if a.earnedAt}
                    <span class="text-xs text-muted-foreground">{new Date(a.earnedAt).toLocaleDateString()}</span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Not yet earned -->
      {#if notEarned.length > 0}
        <h2 class="text-lg font-semibold mb-4 text-muted-foreground">Not Yet Earned</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {#each notEarned as a}
            <div class="bg-card border border-border rounded-xl p-4 flex items-start gap-3 opacity-50">
              <div class="text-2xl grayscale">{a.icon}</div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm">{a.name}</p>
                <p class="text-xs text-muted-foreground mt-0.5">{a.description}</p>
                <span class="text-xs text-muted-foreground mt-2 block">+{a.stcReward} STC on unlock</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
