<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Banknote, Search, X } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';
  import PortalEmptyState from '$lib/components/portal/PortalEmptyState.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  type StatusFilter = 'all' | 'pending' | 'success' | 'failed';

  interface RefundRow {
    id: string;
    userId: string;
    reference: string;
    amountCents: number;
    currency: string | null;
    reason: string | null;
    status: string;
    createdAt: string;
    issuedBy: string | null;
    userEmail: string | null;
    userName: string | null;
  }

  let rows = $state<RefundRow[]>([]);
  let status = $state<StatusFilter>('all');
  let q = $state('');
  let loading = $state(true);
  let issuing = $state(false);
  let issueOpen = $state(false);
  let issueRef = $state('');
  let issueAmount = $state('');
  let issueReason = $state('');

  async function load() {
    loading = true;
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.set('status', status);
      if (q.trim()) params.set('q', q.trim());
      const res = await fetch(`/api/admin/refunds?${params}`);
      if (!res.ok) {
        console.error('[refunds] load HTTP', res.status);
        rows = [];
        return;
      }
      const body = await res.json().catch(() => ({}));
      rows = body.refunds ?? [];
    } catch (err) {
      console.error('[refunds] load failed:', err);
      rows = [];
    } finally {
      loading = false;
    }
  }

  let qTimer: ReturnType<typeof setTimeout> | null = null;
  function onSearchInput() {
    if (qTimer) clearTimeout(qTimer);
    qTimer = setTimeout(load, 250);
  }

  $effect(() => { status; void load(); });
  
  onMount(() => {
    // Initial load is handled by the $effect above, which fires immediately
    // since status is accessed in its dependency list. We don't need to call
    // load() again here — doing so causes a double-fetch and race condition.
  });

  async function issueRefund() {
    if (!issueRef.trim()) {
      toast.error('Reference is required');
      return;
    }
    // Client-side amount validation — saves a server round-trip for
    // obvious mistakes and gives the admin instant feedback.
    let amountCents: number | undefined;
    if (issueAmount.trim()) {
      const parsed = parseFloat(issueAmount.trim());
      if (!Number.isFinite(parsed) || parsed <= 0) {
        toast.error('Amount must be a positive number');
        return;
      }
      amountCents = Math.round(parsed * 100);
      if (amountCents < 99) {
        toast.error('Refund amount must be at least 0.99');
        return;
      }
      if (amountCents > 1_000_000_00) {
        toast.error('Refund amount looks unreasonably large');
        return;
      }
    }
    issuing = true;
    try {
      const res = await fetch('/api/admin/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: issueRef.trim(),
          amountCents,
          reason: issueReason.trim() || undefined
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Refund failed');
      toast.success('Refund initiated');
      issueOpen = false;
      issueRef = '';
      issueAmount = '';
      issueReason = '';
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Refund failed');
    } finally {
      issuing = false;
    }
  }

  function money(cents: number, currency: string | null) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency ?? 'USD'
    }).format(cents / 100);
  }

  function statusBadge(s: string) {
    if (s === 'success') return 'bg-green-600/30 text-green-200';
    if (s === 'failed') return 'bg-red-600/30 text-red-200';
    return 'bg-yellow-600/30 text-yellow-200';
  }
</script>

<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">
  <PortalHero
    compact
    eyebrow="Finance"
    title="Refunds"
    subtitle="Issue and audit refunds against Paystack transactions."
    icon={Banknote}
  >
    {#snippet actions()}
      <PortalButton variant="primary" size="sm" onclick={() => (issueOpen = true)}>
        Issue refund
      </PortalButton>
    {/snippet}
  </PortalHero>

  <div class="flex flex-wrap gap-3 items-center">
    <div class="flex gap-2 flex-wrap">
      {#each (['all', 'pending', 'success', 'failed'] as StatusFilter[]) as s (s)}
        <button
          type="button"
          onclick={() => (status = s)}
          class="px-3 py-1.5 rounded-full text-xs capitalize transition-colors"
          style={status === s
            ? `background: hsl(var(--portal-accent)); color: hsl(var(--portal-bg-base)); font-weight: 600;`
            : `background: hsl(var(--portal-bg-elevated)/0.6); color: hsl(var(--portal-text-muted)); border: 1px solid hsl(var(--portal-border));`}
        >{s}</button>
      {/each}
    </div>
    <div class="relative ml-auto w-72">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: hsl(var(--portal-text-muted));" />
      <input
        type="text"
        bind:value={q}
        oninput={onSearchInput}
        placeholder="Search reference, email, name…"
        class="w-full rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2"
        style="background: hsl(var(--portal-bg-elevated)/0.6); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
      />
    </div>
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(5) as _, i (i)}<Skeleton class="h-12 rounded-lg" />{/each}
    </div>
  {:else if rows.length === 0}
    <PortalEmptyState
      icon={Banknote}
      title="No refunds here"
      description="No refunds match these filters. Search by reference, email, or name to find a specific transaction."
    />
  {:else}
    <div class="surface-1 border border-border/40 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="surface-1">
          <tr class="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th class="px-4 py-3">Reference</th>
            <th class="px-4 py-3">User</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Reason</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {#each rows as r (r.id)}
            <tr class="border-t border-white/5 hover:surface-1">
              <td class="px-4 py-3 font-mono text-xs text-foreground/80">{r.reference.slice(0, 16)}…</td>
              <td class="px-4 py-3 text-foreground/90">
                {r.userName ?? '—'}
                {#if r.userEmail}<div class="text-xs text-muted-foreground">{r.userEmail}</div>{/if}
              </td>
              <td class="px-4 py-3 text-foreground font-medium">{money(r.amountCents, r.currency)}</td>
              <td class="px-4 py-3 text-foreground/80 max-w-xs truncate">{r.reason ?? '—'}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-xs uppercase tracking-wide {statusBadge(r.status)}">{r.status}</span>
              </td>
              <td class="px-4 py-3 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if issueOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) issueOpen = false; }}
    onkeydown={(e) => { if (e.key === 'Escape') issueOpen = false; }}
  >
    <div class="bg-gray-900 border border-border/40 rounded-xl max-w-md w-full p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-foreground">Issue refund</h2>
        <button type="button" onclick={() => (issueOpen = false)} class="text-muted-foreground hover:text-foreground">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3">
        <div>
          <label for="ref" class="block text-sm text-foreground/80 mb-1">Paystack reference</label>
          <input
            id="ref"
            type="text"
            bind:value={issueRef}
            class="w-full surface-1 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground font-mono"
            placeholder="paystack-txn-ref"
          />
        </div>
        <div>
          <label for="amt" class="block text-sm text-foreground/80 mb-1">Amount (USD, optional)</label>
          <input
            id="amt"
            type="number"
            min="0"
            step="0.01"
            bind:value={issueAmount}
            class="w-full surface-1 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground"
            placeholder="Leave blank for full refund"
          />
        </div>
        <div>
          <label for="rsn" class="block text-sm text-foreground/80 mb-1">Reason (optional)</label>
          <textarea
            id="rsn"
            rows="3"
            bind:value={issueReason}
            class="w-full surface-1 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground resize-none"
            placeholder="Why is this being refunded?"
          ></textarea>
        </div>
      </div>

      <div class="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onclick={() => (issueOpen = false)}
          class="px-4 py-2 rounded-lg text-sm text-foreground/80 hover:surface-2"
        >Cancel</button>
        <button
          type="button"
          onclick={issueRefund}
          disabled={issuing || !issueRef}
          class="px-4 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >{issuing ? 'Processing…' : 'Issue refund'}</button>
      </div>
    </div>
  </div>
{/if}
