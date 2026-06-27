<script lang="ts">
  import { onMount } from 'svelte';
  import { Bot, RefreshCw, CheckCircle2, AlertTriangle, Clock, X } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalKpi from '$lib/components/portal/PortalKpi.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';
  import PortalDataTable from '$lib/components/portal/PortalDataTable.svelte';
  import PortalEmptyState from '$lib/components/portal/PortalEmptyState.svelte';
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

  // Diagnostic state — fetched from /api/admin/agents/status. Surfaces
  // the most common reason this page looks empty: AI_AGENTS_ENABLED is
  // off, OR the env var is on but no cron is firing the agents.
  let agentsEnabled = $state<boolean | null>(null);
  let lastRunAt = $state<string | null>(null);
  const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24h
  const isStale = $derived(
    agentsEnabled === true && (!lastRunAt || (Date.now() - new Date(lastRunAt).getTime() > STALE_THRESHOLD_MS))
  );

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

  async function loadStatus(): Promise<void> {
    try {
      const res = await fetch('/api/admin/agents/status');
      if (!res.ok) return;
      const body = await res.json();
      agentsEnabled = body.enabled === true;
      lastRunAt = typeof body.lastRunAt === 'string' ? body.lastRunAt : null;
    } catch {
      // Leave as null — the banner will simply not render.
    }
  }

  onMount(async () => {
    // Initial load is handled by the $effect above, which fires immediately
    // since filter is accessed in its dependency list. We don't need to call
    // load() again here — doing so causes a double-fetch and race condition.
    void loadStatus();
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

<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">
  <PortalHero
    compact
    eyebrow="Automation"
    title="AI runs"
    subtitle="Autonomous agent history. Toggle AI_AGENTS_ENABLED=true on the server to allow agents to fire."
    icon={Bot}
  >
    {#snippet actions()}
      <PortalButton variant="secondary" size="sm" onclick={load}>
        <RefreshCw class="w-3.5 h-3.5" />
        Refresh
      </PortalButton>
    {/snippet}
  </PortalHero>

  <!-- Diagnostic banners. Most common reason the runs table looks empty:
       AI_AGENTS_ENABLED is off, OR it's on but no cron is firing the
       agents. Surface both states with actionable copy instead of
       leaving the admin staring at an empty list. -->
  {#if agentsEnabled === false}
    <div class="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 flex items-start gap-3">
      <AlertTriangle class="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
      <div class="text-sm text-yellow-50 flex-1">
        <strong class="text-yellow-100">AI agents are disabled.</strong>
        Set <code class="font-mono text-xs bg-black/30 px-1 py-0.5 rounded">AI_AGENTS_ENABLED=true</code>
        on the sepharstudios app + redeploy, then schedule
        <code class="font-mono text-xs bg-black/30 px-1 py-0.5 rounded">/api/cron/agents/&lt;name&gt;</code>
        to start populating this page.
      </div>
    </div>
  {:else if isStale}
    <div class="rounded-xl border border-orange-500/40 bg-orange-500/10 p-4 flex items-start gap-3">
      <Clock class="w-5 h-5 text-orange-300 shrink-0 mt-0.5" />
      <div class="text-sm text-orange-50 flex-1">
        <strong class="text-orange-100">No agent runs in the last 24h.</strong>
        Env var is on but no cron has fired. Check the schedule for
        <code class="font-mono text-xs bg-black/30 px-1 py-0.5 rounded">/api/cron/agents/&lt;name&gt;</code>
        or use the Fire-now buttons below to test.
      </div>
    </div>
  {/if}

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <PortalKpi label="Runs (24h)" value={stats.runs24h} icon={Clock} />
    <PortalKpi label="Items actioned" value={stats.itemsActioned24h} icon={CheckCircle2} />
    <PortalKpi label="Failed/killed" value={stats.failed24h} icon={AlertTriangle} />
    <PortalKpi label="AI spend (24h)" value={`$${(stats.costCents24h / 100).toFixed(2)}`} icon={Bot} />
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
    <h2 class="text-lg font-semibold text-foreground mb-3">Run history</h2>

    {#if loading}
      <div class="space-y-2">
        {#each Array(5) as _, i (i)}<Skeleton class="h-14 rounded-lg" />{/each}
      </div>
    {:else}
      <PortalDataTable items={runs} searchPlaceholder="Search by agent name…" searchKey="agent">
        {#snippet filters()}
          <select
            bind:value={filter}
            class="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style="background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
          >
            <option value="all">All agents</option>
            {#each AGENTS as a (a.name)}
              <option value={a.name}>{a.name}</option>
            {/each}
          </select>
        {/snippet}

        {#snippet row(r)}
          <div class="flex items-center gap-3 text-sm">
            <span class="font-mono text-[hsl(var(--portal-text))] min-w-0 flex-1 truncate">{r.agent}</span>
            <span
              class="px-2 py-0.5 rounded text-xs font-medium {statusBadge(r.status)}"
            >{r.status}</span>
            <span class="text-xs text-[hsl(var(--portal-text-muted))] hidden md:inline">{duration(r.startedAt, r.finishedAt)}</span>
            <span class="text-xs text-[hsl(var(--portal-text-muted))] hidden lg:inline">{r.itemsProcessed} processed · {r.itemsActioned} actioned</span>
            <span class="text-xs text-[hsl(var(--portal-text-muted))] tabular-nums">${(r.costCents / 100).toFixed(2)}</span>
            {#if r.error}
              <X class="w-4 h-4 shrink-0" style="color: hsl(var(--portal-danger));" />
            {/if}
          </div>
        {/snippet}

        {#snippet detail(r)}
          <div class="space-y-4">
            <div>
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Agent</div>
              <div class="font-mono text-[hsl(var(--portal-text))]">{r.agent}</div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Status</div>
                <span class="px-2 py-0.5 rounded text-xs font-medium {statusBadge(r.status)}">{r.status}</span>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Duration</div>
                <div class="text-sm text-[hsl(var(--portal-text))]">{duration(r.startedAt, r.finishedAt)}</div>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Started</div>
                <div class="text-sm text-[hsl(var(--portal-text))]">{new Date(r.startedAt).toLocaleString()}</div>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Steps</div>
                <div class="text-sm text-[hsl(var(--portal-text))]">{r.steps}</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3 pt-2 border-t" style="border-color: hsl(var(--portal-border));">
              <div>
                <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Processed</div>
                <div class="text-lg font-semibold tabular-nums text-[hsl(var(--portal-text))]">{r.itemsProcessed}</div>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Actioned</div>
                <div class="text-lg font-semibold tabular-nums text-[hsl(var(--portal-text))]">{r.itemsActioned}</div>
              </div>
              <div>
                <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Cost</div>
                <div class="text-lg font-semibold tabular-nums text-[hsl(var(--portal-text))]">${(r.costCents / 100).toFixed(2)}</div>
              </div>
            </div>
            {#if r.summary}
              <div>
                <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Summary</div>
                <p class="text-sm text-[hsl(var(--portal-text))] whitespace-pre-wrap">{r.summary}</p>
              </div>
            {/if}
            {#if r.error}
              <div
                class="rounded-lg p-3 border"
                style="background: hsl(var(--portal-danger)/0.1); border-color: hsl(var(--portal-danger)/0.35); color: hsl(var(--portal-danger));"
              >
                <div class="text-[10px] uppercase tracking-widest font-semibold mb-1 opacity-80">Error</div>
                <p class="text-xs font-mono whitespace-pre-wrap">{r.error}</p>
              </div>
            {/if}
          </div>
        {/snippet}

        {#snippet empty()}
          <PortalEmptyState
            icon={Bot}
            title="No runs yet"
            description="Set AI_AGENTS_ENABLED=true + add cron entries to start populating this table."
          />
        {/snippet}
      </PortalDataTable>
    {/if}
  </div>
</div>
