<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { ShieldAlert, Flag, Check, X, AlertTriangle } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  type Filter = 'all' | 'review' | 'forum_thread' | 'forum_reply' | 'content' | 'user';
  type Status = 'open' | 'resolved' | 'all';

  interface Report {
    id: string;
    reporterId: string | null;
    targetType: string;
    targetId: string;
    category: string;
    description: string | null;
    status: string;
    resolution: string | null;
    createdAt: string;
    resolvedAt: string | null;
    reporterName: string | null;
    reporterEmail: string | null;
    preview: string | null;
  }

  let filter = $state<Filter>('all');
  let statusFilter = $state<Status>('open');
  let reports = $state<Report[]>([]);
  let loading = $state(true);
  let expanded = $state<Record<string, boolean>>({});

  async function load() {
    loading = true;
    try {
      const params = new URLSearchParams();
      params.set('status', statusFilter);
      if (filter !== 'all') params.set('targetType', filter);
      const res = await fetch(`/api/admin/abuse?${params}`);
      const body = await res.json();
      reports = body.reports ?? [];
    } finally {
      loading = false;
    }
  }

  $effect(() => { filter; statusFilter; void load(); });
  onMount(load);

  async function resolve(r: Report, resolution: string, applyAction = false) {
    const res = await fetch(`/api/admin/abuse/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved', resolution, applyAction })
    });
    if (res.ok) {
      reports = reports.filter((x) => x.id !== r.id);
      toast.success(`Resolved: ${resolution}`);
    } else {
      toast.error('Failed to resolve');
    }
  }

  async function dismiss(r: Report) {
    const res = await fetch(`/api/admin/abuse/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'dismissed', resolution: 'no_action' })
    });
    if (res.ok) {
      reports = reports.filter((x) => x.id !== r.id);
      toast.success('Dismissed');
    }
  }

  // AI severity classification (R+2).
  let classifying = $state<Record<string, boolean>>({});
  let severities = $state<Record<string, { severity: string; rationale: string }>>({});

  async function classify(r: Report) {
    classifying[r.id] = true;
    classifying = { ...classifying };
    try {
      const res = await fetch('/api/ai/admin/classify-abuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: r.category,
          description: r.description ?? '',
          preview: r.preview ?? ''
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'AI failed');
      severities[r.id] = { severity: body.severity, rationale: body.rationale ?? '' };
      severities = { ...severities };
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI failed');
    } finally {
      classifying[r.id] = false;
      classifying = { ...classifying };
    }
  }

  function severityBadge(s: string): string {
    if (s === 'critical') return 'bg-red-700 text-white';
    if (s === 'high') return 'bg-red-600/40 text-red-100';
    if (s === 'med') return 'bg-orange-600/40 text-orange-100';
    return 'bg-yellow-600/40 text-yellow-100';
  }

  async function warnReportedUser(r: Report) {
    if (r.targetType !== 'user') {
      toast.error('Warn applies to user-targeted reports only');
      return;
    }
    const message = prompt('Warning message to the user:');
    if (!message) return;
    const res = await fetch(`/api/admin/users/${r.targetId}/warn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (res.ok) {
      await resolve(r, 'warned');
    } else toast.error('Failed to warn');
  }

  async function banReportedUser(r: Report) {
    if (r.targetType !== 'user') {
      toast.error('Ban applies to user-targeted reports only');
      return;
    }
    const reason = prompt('Reason for ban:');
    if (!reason) return;
    const res = await fetch(`/api/admin/users/${r.targetId}/ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (res.ok) {
      await resolve(r, 'banned');
    } else toast.error('Failed to ban');
  }

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return new Date(iso).toLocaleDateString();
  }

  function categoryBadgeClass(c: string): string {
    if (c === 'harassment' || c === 'self_harm' || c === 'illegal') return 'bg-red-600/30 text-red-200';
    if (c === 'sexual' || c === 'violence') return 'bg-orange-600/30 text-orange-200';
    return 'surface-2 text-foreground/80';
  }
</script>

<div class="container mx-auto py-8 px-4 max-w-5xl space-y-6">
  <PageHeader
    icon={ShieldAlert}
    title="Abuse queue"
    subtitle="Triage user-submitted reports. Resolve to action the target, dismiss for false reports, or escalate when senior review is needed."
  />

  <div class="space-y-3">
    <div class="flex flex-wrap gap-2 items-center">
      <span class="text-xs text-muted-foreground mr-2">Type:</span>
      {#each (['all', 'review', 'forum_thread', 'forum_reply', 'content', 'user'] as Filter[]) as f (f)}
        <button
          type="button"
          onclick={() => filter = f}
          class="px-3 py-1.5 rounded text-xs {filter === f ? 'bg-purple-600 text-foreground' : 'surface-1 text-white/80 hover:surface-2'}"
        >{f.replace('_', ' ')}</button>
      {/each}
    </div>
    <div class="flex flex-wrap gap-2 items-center">
      <span class="text-xs text-muted-foreground mr-2">Status:</span>
      {#each (['open', 'resolved', 'all'] as Status[]) as s (s)}
        <button
          type="button"
          onclick={() => statusFilter = s}
          class="px-3 py-1.5 rounded text-xs capitalize {statusFilter === s ? 'bg-purple-700 text-foreground' : 'surface-1 text-white/80 hover:surface-2'}"
        >{s}</button>
      {/each}
    </div>
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(4) as _ (_)}<Skeleton class="h-20 rounded-xl" />{/each}
    </div>
  {:else if reports.length === 0}
    <div class="surface-1 border border-border/40 rounded-xl p-12 text-center text-muted-foreground">
      Queue is empty.
    </div>
  {:else}
    <ul class="space-y-2">
      {#each reports as r (r.id)}
        <li class="surface-1 border border-border/40 rounded-xl">
          <button
            type="button"
            onclick={() => { expanded[r.id] = !expanded[r.id]; expanded = { ...expanded }; }}
            class="w-full text-left px-4 py-3 hover:surface-2"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs uppercase tracking-wide px-2 py-0.5 rounded {categoryBadgeClass(r.category)}">{r.category.replace('_', ' ')}</span>
                  <span class="text-xs text-muted-foreground capitalize">{r.targetType.replace('_', ' ')}</span>
                  <span class="text-xs text-muted-foreground">· {relativeTime(r.createdAt)}</span>
                  {#if r.status !== 'open'}
                    <span class="text-xs text-green-300">· {r.status}{r.resolution ? ` (${r.resolution})` : ''}</span>
                  {/if}
                </div>
                <p class="text-sm text-foreground/90 mt-1 line-clamp-2">{r.preview ?? '(target deleted)'}</p>
                <div class="text-xs text-muted-foreground mt-1">
                  Reported by {r.reporterName ?? 'anonymous'}
                </div>
              </div>
              <Flag class="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
            </div>
          </button>
          {#if expanded[r.id]}
            <div class="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
              {#if r.description}
                <div>
                  <div class="text-xs text-muted-foreground uppercase tracking-wide mb-1">Reporter note</div>
                  <p class="text-sm text-foreground/90">{r.description}</p>
                </div>
              {/if}
              <div>
                <div class="text-xs text-muted-foreground uppercase tracking-wide mb-1">Target preview</div>
                <p class="text-sm text-foreground/90 whitespace-pre-line">{r.preview ?? '(not available — target may be deleted)'}</p>
              </div>

              {#if severities[r.id]}
                <div class="surface-1 rounded p-2 flex items-center gap-2 text-xs">
                  <span class="px-2 py-0.5 rounded text-xs uppercase tracking-wide font-semibold {severityBadge(severities[r.id].severity)}">{severities[r.id].severity}</span>
                  <span class="text-foreground/80 flex-1">{severities[r.id].rationale}</span>
                  <span class="text-purple-300">✨ AI</span>
                </div>
              {/if}

              {#if r.status === 'open'}
                <div class="flex flex-wrap gap-2 pt-1">
                  {#if !severities[r.id]}
                    <button
                      type="button"
                      onclick={() => classify(r)}
                      disabled={classifying[r.id]}
                      class="px-3 py-1.5 rounded text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40 surface-1 inline-flex items-center gap-1"
                    >✨ {classifying[r.id] ? 'Classifying…' : 'Classify severity'}</button>
                  {/if}
                  <button
                    type="button"
                    onclick={() => resolve(r, 'hidden', true)}
                    class="px-3 py-1.5 rounded text-xs bg-yellow-600 hover:bg-yellow-700 text-white inline-flex items-center gap-1"
                  ><AlertTriangle class="w-3.5 h-3.5" />Hide target</button>
                  <button
                    type="button"
                    onclick={() => resolve(r, 'removed', true)}
                    class="px-3 py-1.5 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                  >Remove target</button>
                  {#if r.targetType === 'user'}
                    <button
                      type="button"
                      onclick={() => warnReportedUser(r)}
                      class="px-3 py-1.5 rounded text-xs bg-orange-600 hover:bg-orange-700 text-white"
                    >Warn user</button>
                    <button
                      type="button"
                      onclick={() => banReportedUser(r)}
                      class="px-3 py-1.5 rounded text-xs bg-red-700 hover:bg-red-800 text-white"
                    >Ban user</button>
                  {/if}
                  <button
                    type="button"
                    onclick={() => dismiss(r)}
                    class="px-3 py-1.5 rounded text-xs surface-2 hover:surface-3 text-foreground inline-flex items-center gap-1"
                  ><X class="w-3.5 h-3.5" />Dismiss</button>
                  <button
                    type="button"
                    onclick={() => resolve(r, 'no_action')}
                    class="px-3 py-1.5 rounded text-xs bg-green-700 hover:bg-green-800 text-white inline-flex items-center gap-1"
                  ><Check class="w-3.5 h-3.5" />No action</button>
                </div>
              {/if}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
