<script lang="ts">
  import { onMount } from 'svelte';
  import { ShieldAlert, ExternalLink } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
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

  let disputes = $state<DisputeRow[]>([]);
  let loading = $state(true);
  let filter = $state<string>('open');

  async function load() {
    loading = true;
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/admin/disputes?${params}`);
      const body = await res.json();
      disputes = body.disputes ?? [];
    } finally {
      loading = false;
    }
  }
  $effect(() => { filter; void load(); });
  onMount(load);

  function statusBadge(s: string) {
    if (s === 'won') return 'bg-green-600/30 text-green-200';
    if (s === 'lost') return 'bg-red-600/30 text-red-200';
    if (s === 'withdrawn') return 'bg-gray-600/30 text-gray-300';
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

<div class="container mx-auto py-8 px-4 max-w-6xl space-y-6">
  <PageHeader
    icon={ShieldAlert}
    title="Disputes"
    subtitle="Stripe + Paystack disputes / chargebacks. Respond to open disputes through the processor's dashboard; this page tracks state + audit."
  />

  <div class="flex gap-2">
    {#each ['open', 'won', 'lost', 'withdrawn', 'all'] as f (f)}
      <button
        type="button"
        onclick={() => (filter = f)}
        class="px-3 py-1.5 rounded text-xs capitalize {filter === f ? 'bg-purple-600 text-white' : 'surface-2 text-gray-300 hover:text-white'}"
      >{f}</button>
    {/each}
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(4) as _ (_)}<Skeleton class="h-16 rounded-lg" />{/each}
    </div>
  {:else if disputes.length === 0}
    <div class="surface-1 rounded-xl p-12 text-center text-gray-400">No disputes match this filter.</div>
  {:else}
    <div class="surface-1 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-white/5">
          <tr class="text-left text-xs uppercase tracking-wide text-gray-400">
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
              <td class="px-4 py-3 text-white capitalize">{d.processor}</td>
              <td class="px-4 py-3 tabular-nums">{money(d.amountCents, d.currency)}</td>
              <td class="px-4 py-3 text-gray-300">{d.reason ?? '—'}</td>
              <td class="px-4 py-3 text-gray-300">
                {d.creatorDisplayName ?? '—'}
                {#if d.creatorEmail}<div class="text-xs text-gray-500">{d.creatorEmail}</div>{/if}
              </td>
              <td class="px-4 py-3">
                <span class="text-xs px-2 py-0.5 rounded capitalize {statusBadge(d.status)}">{d.status.replace('_', ' ')}</span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</td>
              <td class="px-4 py-3 text-xs">
                {#if d.evidenceDueAt}
                  <span class={d.status === 'open' && new Date(d.evidenceDueAt) < new Date() ? 'text-red-300' : 'text-yellow-300'}>
                    {new Date(d.evidenceDueAt).toLocaleDateString()}
                  </span>
                {:else}
                  <span class="text-gray-500">—</span>
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
  {/if}
</div>
