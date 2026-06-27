<script lang="ts">
  import { untrack } from 'svelte';
  import { ShieldAlert, ExternalLink, ChevronLeft, ChevronRight } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalEmptyState from '$lib/components/portal/PortalEmptyState.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  interface DisputeRow {
    id: string;
    processor: string;
    processorDisputeId: string;
    amountCents: number;
    currency: string;
    reason: string | null;
    status: string;
    evidenceDueAt: string | null;
    createdAt: string;
    closedAt: string | null;
    creatorDisplayName: string | null;
    creatorEmail: string | null;
  }

  interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }

  const PAGE_SIZE = 25;

  let disputes = $state<DisputeRow[]>([]);
  let loading = $state(true);
  let filter = $state<string>('open');
  let page = $state(1);
  let pagination = $state<PaginationMeta>({ page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 1 });

  async function load() {
    loading = true;
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      params.set('page', String(page));
      params.set('pageSize', String(PAGE_SIZE));
      const res = await fetch(`/api/admin/disputes?${params}`);
      if (!res.ok) {
        console.error('[disputes] load HTTP', res.status);
        disputes = [];
        return;
      }
      const body = await res.json().catch(() => ({}));
      disputes = body.disputes ?? [];
      if (body.pagination) pagination = body.pagination;
    } catch (err) {
      console.error('[disputes] load failed:', err);
      disputes = [];
    } finally {
      loading = false;
    }
  }
  // Reset to page 1 whenever filter changes — otherwise switching from
  // "all" (10 pages) to "won" (1 page) leaves you on page 7 staring at an
  // empty table. untrack() seeds prevFilter without subscribing to it.
  let prevFilter = untrack(() => filter);
  $effect(() => {
    if (filter !== prevFilter) {
      prevFilter = filter;
      page = 1;
    }
    // Track both filter and page; load() reads both via closure.
    filter; page;
    void load();
  });

  function statusBadge(s: string) {
    if (s === 'won') return 'bg-green-600/30 text-green-200';
    if (s === 'lost') return 'bg-red-600/30 text-red-200';
    if (s === 'withdrawn') return 'bg-gray-600/30 text-foreground/80';
    if (s === 'warning_closed') return 'bg-yellow-600/30 text-yellow-200';
    return 'bg-orange-600/30 text-orange-200';
  }

  function stripeDashboardUrl(disputeId: string): string {
    return `https://dashboard.stripe.com/disputes/${disputeId}`;
  }

  function money(cents: number, currency: string) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(cents / 100);
  }
</script>

<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">
  <PortalHero
    compact
    eyebrow="Finance"
    title="Disputes"
    subtitle="Stripe + Paystack disputes / chargebacks. Respond to open disputes through the processor's dashboard; this page tracks state + audit."
    icon={ShieldAlert}
  />

  <div class="flex gap-2 flex-wrap">
    {#each ['open', 'won', 'lost', 'withdrawn', 'all'] as f (f)}
      <button
        type="button"
        onclick={() => (filter = f)}
        class="px-3 py-1.5 rounded-full text-xs capitalize transition-colors"
        style={filter === f
          ? `background: hsl(var(--portal-accent)); color: hsl(var(--portal-bg-base)); font-weight: 600;`
          : `background: hsl(var(--portal-bg-elevated)/0.6); color: hsl(var(--portal-text-muted)); border: 1px solid hsl(var(--portal-border));`}
      >{f}</button>
    {/each}
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(4) as _, i (i)}<Skeleton class="h-16 rounded-lg" />{/each}
    </div>
  {:else if disputes.length === 0}
    <PortalEmptyState
      icon={ShieldAlert}
      title="No disputes here"
      description="No payment disputes match this filter. Open disputes will arrive via processor webhooks."
    />
  {:else}
    <div class="surface-1 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="surface-1">
          <tr class="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th class="px-4 py-3">Processor</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Reason</th>
            <th class="px-4 py-3">Creator</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Created</th>
            <th class="px-4 py-3">Evidence due</th>
            <th class="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {#each disputes as d (d.id)}
            <tr class="border-t border-white/5">
              <td class="px-4 py-3 text-foreground capitalize">{d.processor}</td>
              <td class="px-4 py-3 tabular-nums">{money(d.amountCents, d.currency)}</td>
              <td class="px-4 py-3 text-foreground/80">{d.reason ?? '—'}</td>
              <td class="px-4 py-3 text-foreground/80">
                {d.creatorDisplayName ?? '—'}
                {#if d.creatorEmail}<div class="text-xs text-muted-foreground">{d.creatorEmail}</div>{/if}
              </td>
              <td class="px-4 py-3">
                <span class="text-xs px-2 py-0.5 rounded capitalize {statusBadge(d.status)}">{d.status.replace('_', ' ')}</span>
              </td>
              <td class="px-4 py-3 text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
              <td class="px-4 py-3 text-xs">
                {#if d.evidenceDueAt}
                  <span class={d.status === 'open' && new Date(d.evidenceDueAt) < new Date() ? 'text-red-300' : 'text-yellow-300'}>
                    {new Date(d.evidenceDueAt).toLocaleDateString()}
                  </span>
                {:else}
                  <span class="text-muted-foreground">—</span>
                {/if}
              </td>
              <td class="px-4 py-3 text-right">
                {#if d.processor === 'stripe'}
                  <a href={stripeDashboardUrl(d.processorDisputeId)} target="_blank" rel="noopener" class="text-xs text-purple-300 hover:text-purple-200 inline-flex items-center gap-1">
                    Stripe <ExternalLink class="w-3 h-3" />
                  </a>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if pagination.totalPages > 1}
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onclick={() => (page = Math.max(1, page - 1))}
            class="px-2 py-1 rounded surface-2 disabled:opacity-40 inline-flex items-center gap-1"
          >
            <ChevronLeft class="w-4 h-4" /> Prev
          </button>
          <span>Page {pagination.page} / {pagination.totalPages}</span>
          <button
            type="button"
            disabled={page >= pagination.totalPages || loading}
            onclick={() => (page = Math.min(pagination.totalPages, page + 1))}
            class="px-2 py-1 rounded surface-2 disabled:opacity-40 inline-flex items-center gap-1"
          >
            Next <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>
