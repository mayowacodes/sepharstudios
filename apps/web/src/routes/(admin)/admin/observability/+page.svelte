<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Activity, RefreshCw } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';

  interface GeoRow {
    country: string | null;
    deviceType: string | null;
    sessions: number;
    avgBitrateKbps: number;
    erroredSessions: number;
  }

  interface Payload {
    days: number;
    playback: {
      sessions: number;
      errorRate: number;
      fatalRate: number;
      stallRate: number;
      avgStartupMs: number;
      avgBitrateKbps: number;
      audioOnlyRate: number;
    };
    byGeo: GeoRow[];
    encode: {
      byStatus: Array<{ status: string | null; count: number }>;
      topFailures: Array<{ reason: string; count: number }>;
    };
    ai: { calls: number; usd: number; refusedCalls: number; failedCalls: number };
    ads: { served: number; started: number; completed: number; renderRate: number };
  }

  let data = $state<Payload | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let days = $state(7);

  async function load() {
    loading = true;
    error = null;
    try {
      const res = await fetch(`/api/admin/observability?days=${days}`);
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? 'Failed to load');
      data = await res.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load';
    } finally {
      loading = false;
    }
  }

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const usd = (v: number) => `$${v.toFixed(2)}`;

  /**
   * Rates are shown with a severity colour rather than raw numbers alone —
   * "3.1%" means nothing without knowing whether that is normal. These
   * thresholds are starting points to be tuned once there is baseline data.
   */
  function severity(rate: number, warn: number, bad: number) {
    if (rate >= bad) return 'text-destructive';
    if (rate >= warn) return 'text-amber-500';
    return 'text-emerald-500';
  }

  onMount(load);
</script>

<svelte:head><title>Observability · Admin</title></svelte:head>

<PortalHero
  title="Observability"
  subtitle="Playback health, encode outcomes, AI spend and ad delivery"
  icon={Activity}
/>

<div class="space-y-6 p-4 md:p-6">
  {#if error}
    <div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {error}
    </div>
  {/if}

  <div class="flex items-center justify-between gap-3">
    <div class="flex gap-2">
      {#each [1, 7, 30] as d (d)}
        <Button
          variant={days === d ? 'default' : 'outline'}
          size="sm"
          onclick={() => { days = d; load(); }}
        >
          {d}d
        </Button>
      {/each}
    </div>
    <Button variant="outline" size="sm" onclick={load} disabled={loading}>
      <RefreshCw class="size-4 mr-2" />
      Refresh
    </Button>
  </div>

  {#if loading && !data}
    <p class="text-sm text-muted-foreground">Loading…</p>
  {:else if data}
    <!-- Playback -->
    <Card>
      <CardHeader><CardTitle>Playback health</CardTitle></CardHeader>
      <CardContent>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="text-xs text-muted-foreground">Sessions</p>
            <p class="text-2xl font-semibold">{data.playback.sessions.toLocaleString()}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Error rate</p>
            <p class="text-2xl font-semibold {severity(data.playback.errorRate, 0.05, 0.15)}">
              {pct(data.playback.errorRate)}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Stall rate</p>
            <p class="text-2xl font-semibold {severity(data.playback.stallRate, 0.1, 0.25)}">
              {pct(data.playback.stallRate)}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Fatal rate</p>
            <p class="text-2xl font-semibold {severity(data.playback.fatalRate, 0.01, 0.05)}">
              {pct(data.playback.fatalRate)}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Avg startup</p>
            <p class="text-2xl font-semibold">{data.playback.avgStartupMs} ms</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Avg bitrate</p>
            <p class="text-2xl font-semibold">{data.playback.avgBitrateKbps} kbps</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Audio-only sessions</p>
            <p class="text-2xl font-semibold">{pct(data.playback.audioOnlyRate)}</p>
            <p class="text-[11px] text-muted-foreground">low-bandwidth lever in use</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Geography / device -->
    <Card>
      <CardHeader><CardTitle>By geography and device</CardTitle></CardHeader>
      <CardContent>
        {#if data.byGeo.length === 0}
          <p class="text-sm text-muted-foreground">No playback recorded in this window.</p>
        {:else}
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="text-left text-muted-foreground">
                <tr><th class="py-2">Country</th><th>Device</th><th>Sessions</th><th>Avg bitrate</th><th>Error rate</th></tr>
              </thead>
              <tbody>
                {#each data.byGeo as row (`${row.country}-${row.deviceType}`)}
                  <tr class="border-t">
                    <td class="py-2">{row.country ?? '—'}</td>
                    <td>{row.deviceType ?? '—'}</td>
                    <td>{row.sessions.toLocaleString()}</td>
                    <td>{row.avgBitrateKbps} kbps</td>
                    <td class={severity(row.sessions ? row.erroredSessions / row.sessions : 0, 0.05, 0.15)}>
                      {pct(row.sessions ? row.erroredSessions / row.sessions : 0)}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </CardContent>
    </Card>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Encode -->
      <Card>
        <CardHeader><CardTitle>Encode</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap gap-2">
            {#each data.encode.byStatus as s (s.status)}
              <Badge variant={s.status === 'failed' ? 'destructive' : 'secondary'}>
                {s.status ?? 'unknown'}: {s.count}
              </Badge>
            {/each}
          </div>
          {#if data.encode.topFailures.length > 0}
            <div>
              <p class="text-xs text-muted-foreground mb-1">Top failure reasons</p>
              <ul class="text-sm space-y-1">
                {#each data.encode.topFailures as f (f.reason)}
                  <li class="flex justify-between gap-3 border-t pt-1">
                    <span class="truncate">{f.reason}</span>
                    <span class="text-muted-foreground shrink-0">{f.count}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </CardContent>
      </Card>

      <!-- AI + ads -->
      <Card>
        <CardHeader><CardTitle>AI spend &amp; ad delivery</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-muted-foreground">AI spend</p>
              <p class="text-2xl font-semibold">{usd(data.ai.usd)}</p>
              <p class="text-[11px] text-muted-foreground">{data.ai.calls.toLocaleString()} calls</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Refused (over budget)</p>
              <p class="text-2xl font-semibold {data.ai.refusedCalls > 0 ? 'text-amber-500' : ''}">
                {data.ai.refusedCalls}
              </p>
              <p class="text-[11px] text-muted-foreground">rising = ceiling too low</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Ads served → started</p>
              <p class="text-2xl font-semibold">{pct(data.ads.renderRate)}</p>
              <p class="text-[11px] text-muted-foreground">gap is mostly ad-blocking</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Ads completed</p>
              <p class="text-2xl font-semibold">{data.ads.completed.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  {/if}
</div>
