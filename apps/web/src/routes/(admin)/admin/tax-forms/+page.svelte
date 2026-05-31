<script lang="ts">
  import { onMount } from 'svelte';
  import { FileText, CheckCircle2, XCircle } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import { toast } from 'svelte-sonner';

  interface FormRow {
    id: string;
    formKind: string;
    taxYear: number;
    status: string;
    submittedAt: string;
    verifiedAt: string | null;
    rejectionReason: string | null;
    pdfUrl: string | null;
    formData: Record<string, unknown>;
    creatorDisplayName: string | null;
    creatorEmail: string | null;
    userName: string | null;
  }

  let forms = $state<FormRow[]>([]);
  let loading = $state(true);
  let filter = $state('submitted');
  let expanded = $state<Record<string, boolean>>({});
  let busy = $state<Record<string, boolean>>({});

  async function load() {
    loading = true;
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/admin/tax-forms?${params}`);
      const body = await res.json();
      forms = body.forms ?? [];
    } finally {
      loading = false;
    }
  }
  $effect(() => { filter; void load(); });
  onMount(load);

  async function verify(f: FormRow) {
    busy[f.id] = true;
    busy = { ...busy };
    try {
      const res = await fetch(`/api/admin/tax-forms/${f.id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })
      });
      if (!res.ok) throw new Error('Verify failed');
      toast.success('Verified');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Verify failed');
    } finally {
      busy[f.id] = false;
      busy = { ...busy };
    }
  }

  async function reject(f: FormRow) {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    busy[f.id] = true;
    busy = { ...busy };
    try {
      const res = await fetch(`/api/admin/tax-forms/${f.id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
      });
      if (!res.ok) throw new Error('Reject failed');
      toast.success('Rejected');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reject failed');
    } finally {
      busy[f.id] = false;
      busy = { ...busy };
    }
  }

  function statusBadge(s: string) {
    if (s === 'verified') return 'bg-green-600/30 text-green-200';
    if (s === 'rejected') return 'bg-red-600/30 text-red-200';
    if (s === 'expired') return 'bg-gray-600/30 text-gray-300';
    return 'bg-yellow-600/30 text-yellow-200';
  }

  function mask(value: unknown): string {
    const s = String(value ?? '');
    if (s.length <= 4) return s;
    return s.slice(0, 2) + '•'.repeat(Math.max(2, s.length - 4)) + s.slice(-2);
  }
</script>

<div class="container mx-auto py-8 px-4 max-w-6xl space-y-6">
  <PageHeader
    icon={FileText}
    title="Tax forms"
    subtitle="Review submitted W-9 / W-8BEN / W-8BEN-E forms before annual 1099 generation."
  />

  <div class="flex gap-2">
    {#each ['submitted', 'verified', 'rejected', 'expired', 'all'] as f (f)}
      <button
        type="button"
        onclick={() => (filter = f)}
        class="px-3 py-1.5 rounded text-xs capitalize {filter === f ? 'bg-purple-600 text-white' : 'surface-2 text-gray-300 hover:text-white'}"
      >{f}</button>
    {/each}
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(4) as _ (_)}<Skeleton class="h-16 rounded-xl" />{/each}
    </div>
  {:else if forms.length === 0}
    <div class="surface-1 rounded-xl p-12 text-center text-gray-400">No forms match this filter.</div>
  {:else}
    <ul class="space-y-2">
      {#each forms as f (f.id)}
        <li class="surface-1 rounded-xl">
          <button
            type="button"
            onclick={() => { expanded[f.id] = !expanded[f.id]; expanded = { ...expanded }; }}
            class="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-white">{f.formKind}</span>
                <span class="text-xs text-gray-400">· tax year {f.taxYear}</span>
                <span class="text-xs px-2 py-0.5 rounded capitalize {statusBadge(f.status)}">{f.status}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1">
                {f.creatorDisplayName ?? f.userName ?? '—'} · {f.creatorEmail ?? ''}
              </div>
            </div>
            <span class="text-xs text-gray-500">{new Date(f.submittedAt).toLocaleDateString()}</span>
          </button>
          {#if expanded[f.id]}
            <div class="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {#each Object.entries(f.formData ?? {}) as [k, v] (k)}
                  <div class="flex justify-between gap-3 surface-2 rounded px-2 py-1.5">
                    <dt class="text-gray-400 capitalize">{k}</dt>
                    <dd class="text-white text-right truncate">
                      {k === 'tin' || k === 'foreignTaxId' ? mask(v) : String(v)}
                    </dd>
                  </div>
                {/each}
              </dl>
              {#if f.rejectionReason}
                <div class="text-xs text-red-300">Rejection: {f.rejectionReason}</div>
              {/if}
              {#if f.status === 'submitted'}
                <div class="flex gap-2 justify-end">
                  <button type="button" onclick={() => reject(f)} disabled={busy[f.id]} class="px-3 py-1.5 rounded text-xs bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white inline-flex items-center gap-1">
                    <XCircle class="w-3 h-3" /> Reject
                  </button>
                  <button type="button" onclick={() => verify(f)} disabled={busy[f.id]} class="px-3 py-1.5 rounded text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white inline-flex items-center gap-1">
                    <CheckCircle2 class="w-3 h-3" /> Verify
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
