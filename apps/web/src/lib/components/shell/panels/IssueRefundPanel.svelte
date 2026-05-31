<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, Loader2, Check, X } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { closeSlideOver } from '../slide-over-store';

  /**
   * Quick-refund slide-over — admin types a transaction reference,
   * the panel resolves the transaction + viewer, and lets them approve
   * or deny without leaving the current page. Calls /api/admin/refunds
   * (which the existing refunds page also uses), so the audit trail is
   * uniform regardless of where the action was taken.
   */

  interface TxnLookup {
    id: string;
    contentId: string | null;
    contentTitle: string | null;
    userName: string | null;
    userEmail: string | null;
    amountCents: number;
    currency: string;
    createdAt: string;
    refundedAt: string | null;
  }

  let reference = $state('');
  let result = $state<TxnLookup | null>(null);
  let lookupError = $state<string | null>(null);
  let reason = $state('');
  let looking = $state(false);
  let submitting = $state(false);

  async function lookup() {
    const ref = reference.trim();
    if (!ref) return;
    looking = true;
    result = null;
    lookupError = null;
    try {
      const res = await fetch(`/api/admin/refunds/lookup?reference=${encodeURIComponent(ref)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        lookupError = body.error ?? 'Transaction not found.';
        return;
      }
      result = body.transaction ?? body;
    } catch (err) {
      lookupError = err instanceof Error ? err.message : 'Lookup failed';
    } finally {
      looking = false;
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !submitting && !looking) {
      e.preventDefault();
      void lookup();
    }
  }

  async function issue() {
    if (!result || submitting) return;
    submitting = true;
    try {
      const res = await fetch('/api/admin/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: result.id,
          reason: reason.trim() || 'Issued from quick-refund panel'
        })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Refund failed');
      }
      toast.success('Refund issued');
      closeSlideOver('issue-refund');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Refund failed');
    } finally {
      submitting = false;
    }
  }

  function money(cents: number, currency: string): string {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
</script>

<div class="p-4 space-y-4">
  <div>
    <label for="refund-ref" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
      Transaction reference
    </label>
    <div class="relative">
      <input
        id="refund-ref"
        type="text"
        bind:value={reference}
        onkeydown={onKeydown}
        placeholder="tx_… or paystack reference"
        class="w-full surface-1 rounded-md pl-3 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground"
      />
      <button
        type="button"
        onclick={lookup}
        disabled={!reference.trim() || looking}
        class="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-40"
        aria-label="Look up"
      >
        {#if looking}<Loader2 class="w-4 h-4 animate-spin" />{:else}<Search class="w-4 h-4" />{/if}
      </button>
    </div>
    {#if lookupError}
      <p class="text-xs text-red-500 mt-1">{lookupError}</p>
    {/if}
  </div>

  {#if result}
    <div class="surface-1 rounded-md p-3 space-y-2 text-sm">
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div class="text-muted-foreground">Amount</div>
          <div class="text-foreground font-medium tabular-nums">{money(result.amountCents, result.currency)}</div>
        </div>
        <div>
          <div class="text-muted-foreground">When</div>
          <div class="text-foreground">{new Date(result.createdAt).toLocaleDateString()}</div>
        </div>
        <div class="col-span-2">
          <div class="text-muted-foreground">User</div>
          <div class="text-foreground truncate">{result.userName ?? '—'} <span class="text-muted-foreground">{result.userEmail ?? ''}</span></div>
        </div>
        {#if result.contentTitle}
          <div class="col-span-2">
            <div class="text-muted-foreground">Content</div>
            <div class="text-foreground truncate">{result.contentTitle}</div>
          </div>
        {/if}
      </div>
      {#if result.refundedAt}
        <div class="text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1.5">
          Already refunded {new Date(result.refundedAt).toLocaleDateString()}.
        </div>
      {/if}
    </div>

    <div>
      <label for="refund-reason" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
        Reason
      </label>
      <textarea
        id="refund-reason"
        bind:value={reason}
        rows="3"
        placeholder="Optional but recorded on the audit log…"
        class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground resize-none"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <button
        type="button"
        onclick={() => closeSlideOver('issue-refund')}
        class="px-3 py-2 rounded surface-1 hover:surface-2 text-foreground text-sm inline-flex items-center justify-center gap-1.5"
      >
        <X class="w-3.5 h-3.5" /> Cancel
      </button>
      <button
        type="button"
        onclick={issue}
        disabled={submitting || !!result.refundedAt}
        class="px-3 py-2 rounded bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        {#if submitting}<Loader2 class="w-3.5 h-3.5 animate-spin" />{:else}<Check class="w-3.5 h-3.5" />{/if}
        Issue refund
      </button>
    </div>
  {/if}
</div>
