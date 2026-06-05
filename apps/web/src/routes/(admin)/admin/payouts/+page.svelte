<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Wallet, CheckCircle2, PauseOctagon, RotateCcw } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  type StatusFilter = 'all' | 'pending' | 'approved' | 'in_transit' | 'paid' | 'failed' | 'on_hold';
  type ProcessorFilter = 'all' | 'paystack' | 'stripe';

  interface PayoutRow {
    id: string;
    creatorId: string;
    processor: string;
    processorPayoutId: string | null;
    periodStart: string;
    periodEnd: string;
    grossCents: number;
    platformFeeCents: number;
    netCents: number;
    currency: string;
    status: string;
    failureReason: string | null;
    createdAt: string;
    paidAt: string | null;
    creatorDisplayName: string | null;
    creatorName: string | null;
    creatorEmail: string | null;
    stripeAccountStatus: string | null;
    stripePayoutsEnabled: boolean | null;
  }

  let rows = $state<PayoutRow[]>([]);
  let status = $state<StatusFilter>('pending');
  let processor = $state<ProcessorFilter>('all');
  let loading = $state(true);
  let busy = $state<Record<string, boolean>>({});

  async function load() {
    loading = true;
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.set('status', status);
      if (processor !== 'all') params.set('processor', processor);
      const res = await fetch(`/api/admin/payouts?${params}`);
      if (!res.ok) {
        console.error('[payouts] load HTTP', res.status);
        rows = [];
        return;
      }
      const body = await res.json().catch(() => ({}));
      rows = body.payouts ?? [];
    } catch (err) {
      console.error('[payouts] load failed:', err);
      rows = [];
    } finally {
      loading = false;
    }
  }

  $effect(() => { status; processor; void load(); });
  
  onMount(() => {
    // Initial load is handled by the $effect above, which fires immediately
    // since status and processor are accessed in its dependency list. We don't
    // need to call load() again here — doing so causes a double-fetch and
    // race condition that causes page blinking.
  });

  async function approve(r: PayoutRow) {
    busy[r.id] = true;
    busy = { ...busy };
    try {
      const res = await fetch(`/api/admin/payouts/${r.id}/approve`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Approval failed');
      toast.success(r.processor === 'stripe' ? 'Transfer sent' : 'Approved');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      busy[r.id] = false;
      busy = { ...busy };
    }
  }

  async function retry(r: PayoutRow) {
    if (!confirm(`Retry failed payout to ${r.creatorDisplayName ?? r.creatorName ?? r.creatorEmail ?? 'creator'}?`)) return;
    busy[r.id] = true;
    busy = { ...busy };
    try {
      const res = await fetch(`/api/admin/payouts/${r.id}/retry`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? body.detail ?? 'Retry failed');
      toast.success(r.processor === 'stripe' ? 'Transfer resent' : 'Queued for retry');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Retry failed');
    } finally {
      busy[r.id] = false;
      busy = { ...busy };
    }
  }

  async function hold(r: PayoutRow) {
    const reason = prompt('Reason for hold:');
    if (!reason) return;
    busy[r.id] = true;
    busy = { ...busy };
    try {
      const res = await fetch(`/api/admin/payouts/${r.id}/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        toast.success('On hold');
        await load();
      } else toast.error('Failed');
    } finally {
      busy[r.id] = false;
      busy = { ...busy };
    }
  }

  function money(cents: number, currency: string) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(cents / 100);
  }

  function statusBadge(s: string): string {
    if (s === 'paid') return 'bg-green-600/30 text-green-200';
    if (s === 'failed' || s === 'on_hold') return 'bg-red-600/30 text-red-200';
    if (s === 'in_transit' || s === 'approved') return 'bg-blue-600/30 text-blue-200';
    return 'bg-yellow-600/30 text-yellow-200';
  }

  function processorBadge(p: string): string {
    return p === 'stripe' ? 'bg-purple-600/30 text-purple-200' : 'bg-orange-600/30 text-orange-200';
  }
</script>

<div class="container mx-auto py-8 px-4 max-w-7xl space-y-6">
  <PageHeader
    icon={Wallet}
    title="Payouts"
    subtitle="Review and approve creator payouts. Stripe transfers fire immediately on approve; Paystack payouts are queued for the existing settlement worker."
  />

  <div class="space-y-3">
    <div class="flex flex-wrap gap-2 items-center">
      <span class="text-xs text-muted-foreground mr-2">Status:</span>
      {#each (['pending', 'approved', 'in_transit', 'paid', 'failed', 'on_hold', 'all'] as StatusFilter[]) as s (s)}
        <button
          type="button"
          onclick={() => (status = s)}
          class="px-3 py-1 rounded text-xs capitalize {status === s ? 'bg-purple-600 text-foreground' : 'surface-1 text-white/80 hover:surface-2'}"
        >{s.replace('_', ' ')}</button>
      {/each}
    </div>
    <div class="flex flex-wrap gap-2 items-center">
      <span class="text-xs text-muted-foreground mr-2">Processor:</span>
      {#each (['all', 'paystack', 'stripe'] as ProcessorFilter[]) as p (p)}
        <button
          type="button"
          onclick={() => (processor = p)}
          class="px-3 py-1 rounded text-xs capitalize {processor === p ? 'bg-purple-700 text-foreground' : 'surface-1 text-white/80 hover:surface-2'}"
        >{p}</button>
      {/each}
    </div>
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(5) as _ (_)}<Skeleton class="h-12 rounded-lg" />{/each}
    </div>
  {:else if rows.length === 0}
    <div class="surface-1 border border-border/40 rounded-xl p-12 text-center text-muted-foreground">
      No payouts match these filters.
    </div>
  {:else}
    <div class="surface-1 border border-border/40 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="surface-1">
          <tr class="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th class="px-4 py-3">Creator</th>
            <th class="px-4 py-3">Processor</th>
            <th class="px-4 py-3">Period</th>
            <th class="px-4 py-3">Net</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each rows as r (r.id)}
            <tr class="border-t border-white/5 hover:surface-1">
              <td class="px-4 py-3 text-foreground/90">
                {r.creatorDisplayName ?? r.creatorName ?? '—'}
                {#if r.creatorEmail}<div class="text-xs text-muted-foreground">{r.creatorEmail}</div>{/if}
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-xs uppercase tracking-wide {processorBadge(r.processor)}">{r.processor}</span>
                {#if r.processor === 'stripe' && !r.stripePayoutsEnabled}
                  <div class="text-xs text-red-300 mt-0.5">Stripe not verified</div>
                {/if}
              </td>
              <td class="px-4 py-3 text-xs text-muted-foreground">
                {new Date(r.periodStart).toLocaleDateString()} → {new Date(r.periodEnd).toLocaleDateString()}
              </td>
              <td class="px-4 py-3 text-foreground font-medium">
                {money(r.netCents, r.currency)}
                <div class="text-xs text-muted-foreground">gross {money(r.grossCents, r.currency)}</div>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-xs capitalize {statusBadge(r.status)}">{r.status.replace('_', ' ')}</span>
                {#if r.failureReason}<div class="text-xs text-red-300 mt-0.5 max-w-xs truncate">{r.failureReason}</div>{/if}
              </td>
              <td class="px-4 py-3 text-right">
                {#if r.status === 'pending'}
                  <div class="inline-flex gap-2">
                    <button
                      type="button"
                      onclick={() => approve(r)}
                      disabled={busy[r.id]}
                      class="px-2.5 py-1 rounded text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white inline-flex items-center gap-1"
                    ><CheckCircle2 class="w-3 h-3" />Approve</button>
                    <button
                      type="button"
                      onclick={() => hold(r)}
                      disabled={busy[r.id]}
                      class="px-2.5 py-1 rounded text-xs bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white inline-flex items-center gap-1"
                    ><PauseOctagon class="w-3 h-3" />Hold</button>
                  </div>
                {:else if r.status === 'failed'}
                  <button
                    type="button"
                    onclick={() => retry(r)}
                    disabled={busy[r.id]}
                    class="px-2.5 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white inline-flex items-center gap-1"
                  ><RotateCcw class="w-3 h-3" />{busy[r.id] ? 'Retrying…' : 'Retry'}</button>
                {:else}
                  <span class="text-xs text-muted-foreground">—</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
