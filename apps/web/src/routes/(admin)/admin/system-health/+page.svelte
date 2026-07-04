<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Activity, RefreshCw, X, CheckCircle2, AlertTriangle, Database, Box, Cloud, Search, Server } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  interface CheckResult {
    ok: boolean;
    latencyMs: number;
    error?: string;
  }
  interface HealthBody {
    status: 'ok' | 'degraded';
    uptimeSec: number;
    db: CheckResult;
    redis: CheckResult;
    minio: CheckResult;
    meili: CheckResult;
    orchestrator: CheckResult;
  }

  interface EncoderJob {
    id: string;
    title: string;
    encoderJobId: string | null;
    processingStatus: string | null;
    processingError: string | null;
    processingProgress: number | null;
    processingStage: string | null;
    updatedAt: string;
    createdAt: string;
    creatorName: string | null;
    creatorDisplayName: string | null;
  }

  let health = $state<HealthBody | null>(null);
  let jobs = $state<EncoderJob[]>([]);
  let jobStatus = $state<string>('failed');
  let loadingHealth = $state(true);
  let loadingJobs = $state(true);
  let lastRefresh = $state<Date | null>(null);

  let refreshTimer: ReturnType<typeof setInterval> | null = null;
  let encoderSse: EventSource | null = null;

  async function loadHealth() {
    loadingHealth = true;
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        console.error('[system-health] /api/health HTTP', res.status);
        return;
      }
      // Guard json parse so a transient HTML error response doesn't throw
      // an unhandled rejection that blanks the page after first paint.
      const body = await res.json().catch(() => null);
      if (body) health = body;
      lastRefresh = new Date();
    } catch (err) {
      console.error('[system-health] loadHealth failed:', err);
    } finally {
      loadingHealth = false;
    }
  }

  async function loadJobs() {
    loadingJobs = true;
    try {
      const params = new URLSearchParams();
      if (jobStatus !== 'all') params.set('status', jobStatus);
      const res = await fetch(`/api/admin/encoder/jobs?${params}`);
      if (!res.ok) {
        console.error('[system-health] /api/admin/encoder/jobs HTTP', res.status);
        jobs = [];
        return;
      }
      const body = await res.json().catch(() => ({}));
      jobs = body.jobs ?? [];
    } catch (err) {
      console.error('[system-health] loadJobs failed:', err);
      jobs = [];
    } finally {
      loadingJobs = false;
    }
  }

  $effect(() => { jobStatus; void loadJobs(); });

  onMount(() => {
    void loadHealth();
    void loadJobs();
    // Health is rare-changing; keep the 30s heartbeat on it. Encoder jobs
    // come from SSE so progress updates appear immediately. Visibility
    // guard matches the analytics pages — an idle admin tab left open
    // was hitting /api/health 2,880 times a day for nothing.
    refreshTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        void loadHealth();
      }
    }, 30_000);

    try {
      encoderSse = new EventSource('/api/admin/encoder-stream');
      encoderSse.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data) as {
            mediaId?: string;
            status?: string;
            progress?: number;
            stage?: string;
            error?: string | null;
          };
          if (!event.mediaId) return;
          // Update the matching row in place. If the job's status changes
          // such that it falls outside the current filter, refetch the list.
          const existing = jobs.find((j) => j.id === event.mediaId);
          if (existing) {
            jobs = jobs.map((j) => j.id === event.mediaId ? {
              ...j,
              processingStatus: event.status ?? j.processingStatus,
              processingProgress: event.progress ?? j.processingProgress,
              processingStage: event.stage ?? j.processingStage,
              processingError: event.error ?? j.processingError
            } : j);
            if (jobStatus !== 'all' && event.status && event.status !== jobStatus) {
              void loadJobs();
            }
          } else if (jobStatus === 'all' || jobStatus === event.status) {
            // New job entered the filtered view — refetch.
            void loadJobs();
          }
        } catch { /* malformed event */ }
      };
    } catch { /* EventSource not available */ }
  });

  onDestroy(() => {
    if (refreshTimer) clearInterval(refreshTimer);
    if (encoderSse) encoderSse.close();
  });

  async function retryJob(j: EncoderJob) {
    const res = await fetch(`/api/admin/encoder/jobs/${j.id}/retry`, { method: 'POST' });
    if (res.ok) {
      toast.success('Retry queued');
      jobs = jobs.map((x) => x.id === j.id ? { ...x, processingStatus: 'created', processingError: null } : x);
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? 'Retry failed');
    }
  }

  async function cancelJob(j: EncoderJob) {
    if (!confirm(`Cancel encoder job for "${j.title}"?`)) return;
    const res = await fetch(`/api/admin/encoder/jobs/${j.id}/cancel`, { method: 'POST' });
    if (res.ok) {
      jobs = jobs.map((x) => x.id === j.id ? { ...x, processingStatus: 'cancelled' } : x);
      toast.success('Job cancelled');
    } else toast.error('Cancel failed');
  }

  function checkCardClass(result: CheckResult): string {
    if (result.error === 'not_configured') return 'surface-1 border-border/40';
    if (result.ok) return 'bg-green-600/15 border-green-600/30';
    return 'bg-red-600/20 border-red-600/40';
  }

  function statusBadge(s: string | null): string {
    if (s === 'ready') return 'bg-green-600/30 text-green-200';
    if (s === 'failed') return 'bg-red-600/30 text-red-200';
    if (s === 'cancelled') return 'bg-gray-600/30 text-foreground/80';
    return 'bg-yellow-600/30 text-yellow-200';
  }

  function formatUptime(sec: number): string {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }
</script>

<div class="mx-auto py-8 px-4 max-w-7xl space-y-8">
  <PortalHero
    compact
    eyebrow="Infrastructure"
    title="System health"
    subtitle={lastRefresh ? `Last refresh ${lastRefresh.toLocaleTimeString()}` : 'Live monitor of infrastructure + encoder jobs.'}
    icon={Activity}
  >
    {#snippet actions()}
      <PortalButton variant="secondary" size="sm" onclick={() => { void loadHealth(); void loadJobs(); }}>
        <RefreshCw class="w-3.5 h-3.5" />
        Refresh now
      </PortalButton>
    {/snippet}
  </PortalHero>

  {#if loadingHealth && !health}
    <div class="text-center text-muted-foreground py-12">Checking…</div>
  {:else if health}
    <div>
      <div class="flex items-center gap-3 mb-3">
        <h2 class="text-lg font-semibold text-foreground">Infrastructure</h2>
        <span class="px-2 py-0.5 rounded text-xs uppercase tracking-wide {health.status === 'ok' ? 'bg-green-600/30 text-green-200' : 'bg-red-600/30 text-red-200'}">
          {health.status}
        </span>
        <span class="text-xs text-muted-foreground">uptime {formatUptime(health.uptimeSec)}</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {#each [
          { key: 'db', label: 'PostgreSQL', result: health.db },
          { key: 'redis', label: 'Redis', result: health.redis },
          { key: 'minio', label: 'MinIO', result: health.minio },
          { key: 'meili', label: 'Meilisearch', result: health.meili },
          { key: 'orchestrator', label: 'Orchestrator', result: health.orchestrator }
        ] as card (card.key)}
          <div class="border rounded-xl p-4 {checkCardClass(card.result)}">
            <div class="flex items-start justify-between">
              <span class="text-sm font-medium text-foreground">{card.label}</span>
              {#if card.result.error === 'not_configured'}
                <span class="text-xs text-muted-foreground">—</span>
              {:else if card.result.ok}
                <CheckCircle2 class="w-4 h-4 text-green-400" />
              {:else}
                <AlertTriangle class="w-4 h-4 text-red-400" />
              {/if}
            </div>
            <div class="mt-2 text-xs text-foreground/80">
              {#if card.result.error === 'not_configured'}
                not configured
              {:else if card.result.ok}
                {card.result.latencyMs}ms
              {:else}
                <span class="text-red-300">{card.result.error ?? 'failed'}</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div>
    <div class="flex items-center justify-between gap-4 flex-wrap mb-3">
      <h2 class="text-lg font-semibold text-foreground">Encoder jobs</h2>
      <div class="flex gap-1.5">
        {#each ['all', 'failed', 'created', 'ready', 'cancelled'] as s (s)}
          <button
            type="button"
            onclick={() => (jobStatus = s)}
            class="px-3 py-1 rounded text-xs capitalize {jobStatus === s ? 'bg-purple-600 text-foreground' : 'surface-1 text-white/80 hover:surface-2'}"
          >{s}</button>
        {/each}
      </div>
    </div>

    {#if loadingJobs && jobs.length === 0}
      <div class="surface-1 border border-border/40 rounded-xl p-8 text-center text-muted-foreground">
        Loading…
      </div>
    {:else if jobs.length === 0}
      <div class="surface-1 border border-border/40 rounded-xl p-8 text-center text-muted-foreground">
        No jobs match this filter.
      </div>
    {:else}
      <div class="surface-1 border border-border/40 rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="surface-1">
            <tr class="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th class="px-4 py-3">Content</th>
              <th class="px-4 py-3">Creator</th>
              <th class="px-4 py-3">Job ID</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Progress</th>
              <th class="px-4 py-3">Updated</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each jobs as j (j.id)}
              <tr class="border-t border-white/5 hover:surface-1">
                <td class="px-4 py-3 text-foreground">
                  <a href={`/admin/content`} class="hover:text-purple-300">{j.title}</a>
                  {#if j.processingError}<div class="text-xs text-red-300 mt-0.5 max-w-md truncate">{j.processingError}</div>{/if}
                </td>
                <td class="px-4 py-3 text-foreground/80">{j.creatorDisplayName ?? j.creatorName ?? '—'}</td>
                <td class="px-4 py-3 font-mono text-xs text-muted-foreground">{j.encoderJobId?.slice(0, 12) ?? '—'}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded text-xs {statusBadge(j.processingStatus)}">{j.processingStatus ?? 'unknown'}</span>
                  {#if j.processingStage}
                    <div class="text-[10px] text-muted-foreground mt-0.5">{j.processingStage}</div>
                  {/if}
                </td>
                <td class="px-4 py-3 min-w-32">
                  {#if j.processingProgress !== null && j.processingProgress !== undefined}
                    <div class="h-1.5 surface-2 rounded overflow-hidden">
                      <div class="h-full bg-purple-500 transition-all duration-500" style="width: {Math.max(0, Math.min(100, j.processingProgress))}%"></div>
                    </div>
                    <div class="text-[10px] text-muted-foreground mt-0.5">{j.processingProgress}%</div>
                  {:else}
                    <span class="text-xs text-muted-foreground">—</span>
                  {/if}
                </td>
                <td class="px-4 py-3 text-xs text-muted-foreground">{new Date(j.updatedAt).toLocaleString()}</td>
                <td class="px-4 py-3 text-right">
                  <div class="inline-flex gap-2">
                    {#if j.processingStatus === 'failed' || j.processingStatus === 'cancelled'}
                      <button
                        type="button"
                        onclick={() => retryJob(j)}
                        class="px-2.5 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-1"
                      ><RefreshCw class="w-3 h-3" />Retry</button>
                    {/if}
                    {#if j.processingStatus !== 'ready' && j.processingStatus !== 'cancelled'}
                      <button
                        type="button"
                        onclick={() => cancelJob(j)}
                        class="px-2.5 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-1"
                      ><X class="w-3 h-3" />Cancel</button>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
