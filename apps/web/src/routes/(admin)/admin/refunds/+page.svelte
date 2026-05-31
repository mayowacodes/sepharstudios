<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Banknote, Search, X } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
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
      const body = await res.json();
      rows = body.refunds ?? [];
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
  onMount(load);

  async function issueRefund() {
    if (!issueRef.trim()) {
      toast.error('Reference is required');
      return;
    }
    issuing = true;
    try {
      const amountCents = issueAmount ? Math.round(parseFloat(issueAmount) * 100) : undefined;
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

<div class="container mx-auto py-8 px-4 max-w-6xl space-y-6">
  <PageHeader
    icon={Banknote}
    title="Refunds"
    subtitle="Issue and audit refunds against Paystack transactions."
  >
    {#snippet actions()}
      <button
        type="button"
        onclick={() => (issueOpen = true)}
        class="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
      >Issue refund</button>
    {/snippet}
  </PageHeader>

  <div class="flex flex-wrap gap-3 items-center">
    <div class="flex gap-2">
      {#each (['all', 'pending', 'success', 'failed'] as StatusFilter[]) as s (s)}
        <button
          type="button"
          onclick={() => (status = s)}
          class="px-3 py-1.5 rounded text-xs capitalize {status === s ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
        >{s}</button>
      {/each}
    </div>
    <div class="relative ml-auto w-72">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        bind:value={q}
        oninput={onSearchInput}
        placeholder="Search reference, email, name…"
        class="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500"
      />
    </div>
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(5) as _ (_)}<Skeleton class="h-12 rounded-lg" />{/each}
    </div>
  {:else if rows.length === 0}
    <div class="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-gray-400">
      No refunds match these filters.
    </div>
  {:else}
    <div class="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-white/5">
          <tr class="text-left text-xs uppercase tracking-wide text-gray-400">
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
            <tr class="border-t border-white/5 hover:bg-white/5">
              <td class="px-4 py-3 font-mono text-xs text-gray-300">{r.reference.slice(0, 16)}…</td>
              <td class="px-4 py-3 text-gray-200">
                {r.userName ?? '—'}
                {#if r.userEmail}<div class="text-xs text-gray-500">{r.userEmail}</div>{/if}
              </td>
              <td class="px-4 py-3 text-white font-medium">{money(r.amountCents, r.currency)}</td>
              <td class="px-4 py-3 text-gray-300 max-w-xs truncate">{r.reason ?? '—'}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-xs uppercase tracking-wide {statusBadge(r.status)}">{r.status}</span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</td>
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
    <div class="bg-gray-900 border border-white/10 rounded-xl max-w-md w-full p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-white">Issue refund</h2>
        <button type="button" onclick={() => (issueOpen = false)} class="text-gray-400 hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3">
        <div>
          <label for="ref" class="block text-sm text-gray-300 mb-1">Paystack reference</label>
          <input
            id="ref"
            type="text"
            bind:value={issueRef}
            class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono"
            placeholder="paystack-txn-ref"
          />
        </div>
        <div>
          <label for="amt" class="block text-sm text-gray-300 mb-1">Amount (USD, optional)</label>
          <input
            id="amt"
            type="number"
            min="0"
            step="0.01"
            bind:value={issueAmount}
            class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            placeholder="Leave blank for full refund"
          />
        </div>
        <div>
          <label for="rsn" class="block text-sm text-gray-300 mb-1">Reason (optional)</label>
          <textarea
            id="rsn"
            rows="3"
            bind:value={issueReason}
            class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none"
            placeholder="Why is this being refunded?"
          ></textarea>
        </div>
      </div>

      <div class="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onclick={() => (issueOpen = false)}
          class="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10"
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
