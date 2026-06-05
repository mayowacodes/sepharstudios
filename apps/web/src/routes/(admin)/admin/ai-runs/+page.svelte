<script lang="ts">
  import { onMount } from 'svelte';
  import { Bot, RefreshCw, CheckCircle2, AlertTriangle, Clock, X } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import { toast } from 'svelte-sonner';

  interface AgentRun {
    id: string;
    agent: string;
    status: 'running' | 'completed' | 'failed' | 'killed';
    startedAt: string;
    finishedAt: string | null;
    steps: number;
    costCents: number;
    itemsProcessed: number;
    itemsActioned: number;
    summary: string | null;
    error: string | null;
  }

  const AGENTS = [
    { name: 'abuse-triage', schedule: 'daily', description: 'Triages open abuse reports, auto-dismisses obvious spam.' },
    { name: 'anomaly-watch', schedule: 'hourly', description: 'Watches platform metrics for spikes + failures.' },
    { name: 'content-quality-auditor', schedule: 'quarterly', description: 'Drafts coaching notes for underperforming creators.' },
    { name: 'theology-monitor', schedule: 'daily', description: 'Re-evaluates recent content against the belief statement.' }
  ];

  let runs = $state<AgentRun[]>([]);
  let loading = $state(true);
  let filter = $state<string>('all');
  let manualFiring = $state<Record<string, boolean>>({});

  async function load() {
    loading = true;
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('agent', filter);
      const res = await fetch(`/api/admin/agent-runs?${params}`);
      // Guard JSON parse — a 500 returning HTML would otherwise throw an
      // unhandled rejection inside res.json() and blank the page.
      if (!res.ok) {
        console.error('[ai-runs] load HTTP', res.status);
        runs = [];
        return;
      }
      const body = await res.json().catch(() => ({}));
      runs = body.runs ?? [];
    } catch (err) {
      console.error('[ai-runs] load failed:', err);
      runs = [];
    } finally {
      loading = false;
    }
  }

  $effect(() => { filter; void load(); });
  
  onMount(async () => {
    // Initial load is handled by the $effect above, which fires immediately
    // since filter is accessed in its dependency list. We don't need to call
    // load() again here — doing so causes a double-fetch and race condition.
  });

  async function manualFire(agent: string) {
    if (!confirm(`Fire ${agent} now? Requires AI_AGENTS_ENABLED=true on the server.`)) return;
    manualFiring[agent] = true;
    manualFiring = { ...manualFiring };
    try {
      const res = await fetch(`/api/admin/agents/${agent}/fire`, { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(`${agent}: ${body.upstream?.summary ?? 'started'}`);
        // The runs list reflects the new agent_runs row on next poll/refresh.
        // Force one reload so the admin sees the new entry immediately.
        await load();
      } else {
        toast.error(`${agent} failed: ${body.error ?? body.upstream?.error ?? res.statusText}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `${agent}: network error`);
    } finally {
      manualFiring[agent] = false;
      manualFiring = { ...manualFiring };
    }
  }

  function statusBadge(s: string) {
    if (s === 'completed') return 'bg-green-600/30 text-green-200';
    if (s === 'failed') return 'bg-red-600/30 text-red-200';
    if (s === 'killed') return 'bg-yellow-600/30 text-yellow-200';
    return 'bg-blue-600/30 text-blue-200';
  }

  function duration(start: string, end: string | null): string {
    if (!end) return 'running…';
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60_000)}m`;
  }

  const stats = $derived.by(() => {
    const last24h = runs.filter((r) => Date.now() - new Date(r.startedAt).getTime() < 86_400_000);
    return {
      runs24h: last24h.length,
      itemsActioned24h: last24h.reduce((s, r) => s + r.itemsActioned, 0),
      failed24h: last24h.filter((r) => r.status === 'failed' || r.status === 'killed').length,
      costCents24h: last24h.reduce((s, r) => s + r.costCents, 0)
    };
  });
</script>

<div class="container mx-auto py-8 px-4 max-w-6xl space-y-6">
  <PageHeader
    icon={Bot}
    title="AI runs"
    subtitle="Autonomous agent history. Toggle AI_AGENTS_ENABLED=true on the server to allow agents to fire."
  >
    {#snippet actions()}
      <button
        type="button"
        onclick={load}
        class="px-3 py-1.5 rounded surface-2 text-foreground text-xs inline-flex items-center gap-1"
      >
        <RefreshCw class="w-3.5 h-3.5" />
        Refresh
      </button>
    {/snippet}
  </PageHeader>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <KpiCard label="Runs (24h)" value={stats.runs24h} icon={Clock} accent="blue" variant="compact" index={0} />
    <KpiCard label="Items actioned" value={stats.itemsActioned24h} icon={CheckCircle2} accent="green" variant="compact" index={1} />
    <KpiCard label="Failed/killed" value={stats.failed24h} icon={AlertTriangle} accent="red" variant="compact" index={2} />
    <KpiCard label="AI spend (24h)" value={`$${(stats.costCents24h / 100).toFixed(2)}`} icon={Bot} accent="purple" variant="compact" index={3} />
  </div>

  <div>
    <h2 class="text-lg font-semibold text-foreground mb-3">Registered agents</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      {#each AGENTS as a (a.name)}
        <div class="surface-1 rounded-xl p-4 space-y-2">
          <div class="flex items-center justify-between gap-2">
            <div>
              <div class="text-foreground font-medium">{a.name}</div>
              <div class="text-xs text-muted-foreground uppercase tracking-wide">{a.schedule}</div>
            </div>
            <button
              type="button"
              onclick={() => manualFire(a.name)}
              disabled={manualFiring[a.name]}
              class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40"
            >{manualFiring[a.name] ? 'Firing…' : 'Fire now'}</button>
          </div>
          <p class="text-xs text-foreground/80">{a.description}</p>
        </div>
      {/each}
    </div>
  </div>

  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold text-foreground">Run history</h2>
      <select bind:value={filter} class="surface-2 rounded-lg px-3 py-1.5 text-sm text-foreground">
        <option value="all">All agents</option>
        {#each AGENTS as a (a.name)}
          <option value={a.name}>{a.name}</option>
        {/each}
      </select>
    </div>

    {#if loading}
      <div class="space-y-2">
        {#each Array(5) as _ (_)}<Skeleton class="h-14 rounded-lg" />{/each}
      </div>
    {:else if runs.length === 0}
      <div class="surface-1 rounded-xl p-12 text-center text-muted-foreground">
        No runs yet. Set <code>AI_AGENTS_ENABLED=true</code> + add cron entries to start.
      </div>
    {:else}
      <div class="surface-1 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="surface-1">
            <tr class="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th class="px-4 py-3">Agent</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Started</th>
              <th class="px-4 py-3">Duration</th>
              <th class="px-4 py-3 text-right">Processed</th>
              <th class="px-4 py-3 text-right">Actioned</th>
              <th class="px-4 py-3 text-right">Cost</th>
              <th class="px-4 py-3">Summary</th>
            </tr>
          </thead>
          <tbody>
            {#each runs as r (r.id)}
              <tr class="border-t border-white/5">
                <td class="px-4 py-3 text-foreground">{r.agent}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded text-xs {statusBadge(r.status)}">{r.status}</span>
                </td>
                <td class="px-4 py-3 text-xs text-muted-foreground">{new Date(r.startedAt).toLocaleString()}</td>
                <td class="px-4 py-3 text-xs text-muted-foreground">{duration(r.startedAt, r.finishedAt)}</td>
                <td class="px-4 py-3 text-right text-foreground/80">{r.itemsProcessed}</td>
                <td class="px-4 py-3 text-right text-foreground font-medium">{r.itemsActioned}</td>
                <td class="px-4 py-3 text-right text-foreground/80">${(r.costCents / 100).toFixed(2)}</td>
                <td class="px-4 py-3 max-w-xs text-xs text-foreground/80">
                  {#if r.error}
                    <span class="text-red-300 inline-flex items-center gap-1">
                      <X class="w-3 h-3" /> {r.error.slice(0, 100)}
                    </span>
                  {:else}
                    <span class="line-clamp-2">{r.summary ?? '—'}</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
