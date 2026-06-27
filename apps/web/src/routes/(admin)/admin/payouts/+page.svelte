<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Wallet, CheckCircle2, PauseOctagon, RotateCcw } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalDataTable from '$lib/components/portal/PortalDataTable.svelte';
  import PortalEmptyState from '$lib/components/portal/PortalEmptyState.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';
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

<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">
  <PortalHero
    compact
    eyebrow="Finance"
    title="Payouts"
    subtitle="Review and approve creator payouts. Stripe transfers fire immediately on approve; Paystack payouts are queued for the existing settlement worker."
    icon={Wallet}
  />

  {#if loading}
    <div class="space-y-2">
      {#each Array(5) as _, i (i)}<Skeleton class="h-12 rounded-lg" />{/each}
    </div>
  {:else}
    <PortalDataTable items={rows} searchPlaceholder="Search creator…" searchKey="creatorDisplayName">
      {#snippet filters()}
        <select
          bind:value={status}
          class="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
        >
          {#each (['pending', 'approved', 'in_transit', 'paid', 'failed', 'on_hold', 'all'] as StatusFilter[]) as s (s)}
            <option value={s}>{s.replace('_', ' ')}</option>
          {/each}
        </select>
        <select
          bind:value={processor}
          class="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
        >
          {#each (['all', 'paystack', 'stripe'] as ProcessorFilter[]) as p (p)}
            <option value={p}>{p}</option>
          {/each}
        </select>
      {/snippet}

      {#snippet row(r)}
        <div class="flex items-center gap-3 text-sm">
          <div class="min-w-0 flex-1">
            <div class="font-medium text-[hsl(var(--portal-text))] truncate">{r.creatorDisplayName ?? r.creatorName ?? '—'}</div>
            <div class="text-xs text-[hsl(var(--portal-text-muted))] truncate">{r.creatorEmail ?? ''}</div>
          </div>
          <span class="text-xs px-2 py-0.5 rounded uppercase tracking-wide font-semibold {processorBadge(r.processor)}">{r.processor}</span>
          <span class="hidden lg:inline text-xs text-[hsl(var(--portal-text-muted))]">
            {new Date(r.periodStart).toLocaleDateString()} → {new Date(r.periodEnd).toLocaleDateString()}
          </span>
          <span class="text-sm font-semibold tabular-nums text-[hsl(var(--portal-text))] min-w-20 text-right">{money(r.netCents, r.currency)}</span>
          <span class="text-xs px-2 py-0.5 rounded capitalize font-medium {statusBadge(r.status)}">{r.status.replace('_', ' ')}</span>
        </div>
      {/snippet}

      {#snippet detail(r)}
        <div class="space-y-5">
          <div>
            <div class="text-lg font-semibold text-[hsl(var(--portal-text))]">{r.creatorDisplayName ?? r.creatorName ?? '—'}</div>
            {#if r.creatorEmail}<div class="text-sm text-[hsl(var(--portal-text-muted))]">{r.creatorEmail}</div>{/if}
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="text-xs px-2 py-0.5 rounded uppercase tracking-wide font-semibold {processorBadge(r.processor)}">{r.processor}</span>
            <span class="text-xs px-2 py-0.5 rounded capitalize font-medium {statusBadge(r.status)}">{r.status.replace('_', ' ')}</span>
          </div>

          {#if r.processor === 'stripe' && !r.stripePayoutsEnabled}
            <div
              class="rounded-lg p-3 border"
              style="background: hsl(var(--portal-danger)/0.1); border-color: hsl(var(--portal-danger)/0.35); color: hsl(var(--portal-danger));"
            >
              <div class="text-[10px] uppercase tracking-widest font-semibold mb-1 opacity-80">Stripe not verified</div>
              <p class="text-xs">Account status: {r.stripeAccountStatus ?? 'unknown'}. Cannot disburse until creator finishes onboarding.</p>
            </div>
          {/if}

          {#if r.failureReason}
            <div
              class="rounded-lg p-3 border"
              style="background: hsl(var(--portal-danger)/0.1); border-color: hsl(var(--portal-danger)/0.35); color: hsl(var(--portal-danger));"
            >
              <div class="text-[10px] uppercase tracking-widest font-semibold mb-1 opacity-80">Failure reason</div>
              <p class="text-xs whitespace-pre-wrap">{r.failureReason}</p>
            </div>
          {/if}

          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Period</div>
              <div class="text-sm text-[hsl(var(--portal-text))]">{new Date(r.periodStart).toLocaleDateString()} → {new Date(r.periodEnd).toLocaleDateString()}</div>
            </div>
            <div>
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Created</div>
              <div class="text-sm text-[hsl(var(--portal-text))]">{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Gross</div>
              <div class="text-sm tabular-nums text-[hsl(var(--portal-text))]">{money(r.grossCents, r.currency)}</div>
            </div>
            <div>
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Platform fee</div>
              <div class="text-sm tabular-nums text-[hsl(var(--portal-text))]">{money(r.platformFeeCents, r.currency)}</div>
            </div>
            <div class="col-span-2 pt-2 border-t" style="border-color: hsl(var(--portal-border));">
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Net payable</div>
              <div class="text-2xl font-bold tabular-nums text-[hsl(var(--portal-text))]">{money(r.netCents, r.currency)}</div>
            </div>
          </div>

          {#if r.status === 'pending'}
            <div class="flex gap-2 pt-2">
              <PortalButton variant="primary" size="md" onclick={() => approve(r)} disabled={busy[r.id]}>
                <CheckCircle2 class="w-4 h-4" /> Approve
              </PortalButton>
              <PortalButton variant="secondary" size="md" onclick={() => hold(r)} disabled={busy[r.id]}>
                <PauseOctagon class="w-4 h-4" /> Hold
              </PortalButton>
            </div>
          {:else if r.status === 'failed'}
            <PortalButton variant="primary" size="md" onclick={() => retry(r)} disabled={busy[r.id]}>
              <RotateCcw class="w-4 h-4" /> {busy[r.id] ? 'Retrying…' : 'Retry'}
            </PortalButton>
          {/if}
        </div>
      {/snippet}

      {#snippet empty()}
        <PortalEmptyState
          icon={Wallet}
          title="No payouts match these filters"
          description="Try widening status or processor — the queue refreshes after each settlement run."
        />
      {/snippet}
    </PortalDataTable>
  {/if}
</div>
