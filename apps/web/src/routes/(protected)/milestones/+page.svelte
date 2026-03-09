<script lang="ts">
  import { onMount } from 'svelte';
  import { Coins } from '@lucide/svelte';

  interface Milestone {
    code: string;
    name: string;
    description: string;
    icon: string;
    stcReward: number;
    progress: number;
    target: number;
    earned: boolean;
    earnedAt: string | null;
  }

  let milestones = $state<Milestone[]>([]);
  let loading = $state(true);
  let totalWatchHours = $state(0);

  onMount(async () => {
    try {
      const res = await fetch('/api/milestones');
      if (res.ok) {
        const data = await res.json();
        milestones = data.milestones;
        totalWatchHours = data.totalWatchHours;
      }
    } finally {
      loading = false;
    }
  });

  function progressPct(m: Milestone) {
    if (m.target === 0) return m.earned ? 100 : 0;
    return Math.min(100, Math.round((m.progress / m.target) * 100));
  }
</script>

<svelte:head>
  <title>Milestones - Sephar Studios</title>
</svelte:head>

<div class="min-h-screen bg-background px-4 py-10">
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center gap-3 mb-2">
      <Coins class="w-6 h-6 text-yellow-400" />
      <h1 class="text-2xl font-bold">Milestones</h1>
    </div>
    <p class="text-muted-foreground text-sm mb-8">Earn STC tokens by reaching watch and community milestones.</p>

    {#if !loading}
      <div class="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-4">
        <div class="text-3xl">⏱️</div>
        <div>
          <p class="text-xl font-bold text-yellow-400">{totalWatchHours.toFixed(1)}h</p>
          <p class="text-sm text-muted-foreground">total watch time</p>
        </div>
      </div>
    {/if}

    {#if loading}
      <div class="space-y-4">
        {#each [1,2,3,4,5] as _}
          <div class="h-20 bg-white/5 rounded-xl animate-pulse"></div>
        {/each}
      </div>
    {:else}
      <div class="space-y-4">
        {#each milestones as m}
          <div class="bg-card border {m.earned ? 'border-yellow-500/30' : 'border-border'} rounded-xl p-4">
            <div class="flex items-start gap-4">
              <div class="text-2xl {m.earned ? '' : 'grayscale opacity-50'}">{m.icon}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <p class="font-semibold text-sm {m.earned ? '' : 'text-muted-foreground'}">{m.name}</p>
                  <span class="text-xs {m.earned ? 'text-yellow-400' : 'text-muted-foreground'} whitespace-nowrap">
                    {m.earned ? 'Earned' : `+${m.stcReward} STC`}
                  </span>
                </div>
                <p class="text-xs text-muted-foreground mb-2">{m.description}</p>
                {#if m.target > 0}
                  <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all {m.earned ? 'bg-yellow-400' : 'bg-primary'}"
                      style="width: {progressPct(m)}%"
                    ></div>
                  </div>
                  <p class="text-[10px] text-muted-foreground mt-1">{m.progress} / {m.target}</p>
                {/if}
                {#if m.earned && m.earnedAt}
                  <p class="text-[10px] text-yellow-500 mt-1">Earned {new Date(m.earnedAt).toLocaleDateString()}</p>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
