<script lang="ts">
  import { onMount } from 'svelte';
  import { FileText, ArrowLeft, CheckCircle2, XCircle, Clock } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import { toast } from 'svelte-sonner';

  interface TaxForm {
    id: string;
    formKind: 'W-9' | 'W-8BEN' | 'W-8BEN-E';
    taxYear: number;
    status: string;
    submittedAt: string;
    verifiedAt: string | null;
    rejectionReason: string | null;
    pdfUrl: string | null;
  }

  interface Tax1099Form {
    id: string;
    taxYear: number;
    totalPaidCents: number;
    pdfUrl: string | null;
    emailedAt: string | null;
    createdAt: string;
  }

  let forms = $state<TaxForm[]>([]);
  let forms1099 = $state<Tax1099Form[]>([]);
  let loading = $state(true);
  let saving = $state(false);

  // Compose form state.
  let formKind = $state<'W-9' | 'W-8BEN' | 'W-8BEN-E'>('W-9');
  let taxYear = $state(new Date().getFullYear() - 1);
  // W-9 fields (US persons)
  let name = $state('');
  let businessName = $state('');
  let address = $state('');
  let citySZ = $state('');
  let tin = $state(''); // SSN or EIN
  let signedAs = $state('');
  // W-8BEN extra fields
  let country = $state('');
  let foreignTaxId = $state('');

  async function load() {
    loading = true;
    try {
      const [submittedRes, generatedRes] = await Promise.all([
        fetch('/api/creator/tax-forms'),
        fetch('/api/creator/tax-1099-forms')
      ]);
      forms = (await submittedRes.json()).forms ?? [];
      forms1099 = generatedRes.ok ? ((await generatedRes.json()).forms ?? []) : [];
    } finally {
      loading = false;
    }
  }

  function money(cents: number): string {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  onMount(load);

  async function submit() {
    if (!name.trim() || !address.trim() || !tin.trim() || !signedAs.trim()) {
      toast.error('Fill in all required fields');
      return;
    }
    if ((formKind === 'W-8BEN' || formKind === 'W-8BEN-E') && (!country.trim() || !foreignTaxId.trim())) {
      toast.error('Country and foreign tax ID are required for W-8BEN forms');
      return;
    }
    saving = true;
    try {
      const formData = {
        name,
        businessName: businessName || null,
        address,
        cityStateZip: citySZ,
        tin,
        signedAs,
        ...(formKind === 'W-8BEN' || formKind === 'W-8BEN-E' ? { country, foreignTaxId } : {})
      };
      const res = await fetch('/api/creator/tax-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKind, taxYear, formData })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Submit failed');
      toast.success('Tax form submitted');
      // Reset sensitive fields after a successful submission.
      tin = '';
      foreignTaxId = '';
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      saving = false;
    }
  }

  function statusBadge(s: string) {
    if (s === 'verified') return 'bg-green-600/30 text-green-200';
    if (s === 'rejected') return 'bg-red-600/30 text-red-200';
    if (s === 'expired') return 'bg-gray-600/30 text-foreground/80';
    return 'bg-yellow-600/30 text-yellow-200';
  }
</script>

<div class="container mx-auto py-8 px-4 max-w-3xl space-y-6">
  <a href="/creator/earnings" class="text-xs text-purple-300 hover:text-purple-200 inline-flex items-center gap-1">
    <ArrowLeft class="w-3 h-3" /> Back to earnings
  </a>

  <PageHeader
    icon={FileText}
    title="Tax forms"
    subtitle="Submit a W-9 (US persons), W-8BEN (foreign individuals), or W-8BEN-E (foreign entities). Admin reviews and confirms before annual 1099 generation."
  />

  <!-- Submit form -->
  <section class="surface-1 rounded-xl p-5 space-y-4">
    <h2 class="text-sm font-semibold text-foreground">Submit a new form</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label for="form-kind" class="block text-xs text-foreground/80 mb-1">Form</label>
        <select id="form-kind" bind:value={formKind} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground">
          <option value="W-9">W-9 (US person)</option>
          <option value="W-8BEN">W-8BEN (foreign individual)</option>
          <option value="W-8BEN-E">W-8BEN-E (foreign entity)</option>
        </select>
      </div>
      <div>
        <label for="tax-year" class="block text-xs text-foreground/80 mb-1">Tax year</label>
        <input id="tax-year" type="number" bind:value={taxYear} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
      </div>
      <div class="md:col-span-2">
        <label for="t-name" class="block text-xs text-foreground/80 mb-1">Legal name *</label>
        <input id="t-name" type="text" bind:value={name} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
      </div>
      <div class="md:col-span-2">
        <label for="t-business" class="block text-xs text-foreground/80 mb-1">Business/entity name (if applicable)</label>
        <input id="t-business" type="text" bind:value={businessName} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
      </div>
      <div class="md:col-span-2">
        <label for="t-address" class="block text-xs text-foreground/80 mb-1">Address *</label>
        <input id="t-address" type="text" bind:value={address} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
      </div>
      <div class="md:col-span-2">
        <label for="t-city" class="block text-xs text-foreground/80 mb-1">City / state / ZIP</label>
        <input id="t-city" type="text" bind:value={citySZ} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
      </div>
      <div>
        <label for="t-tin" class="block text-xs text-foreground/80 mb-1">TIN / SSN / EIN *</label>
        <input id="t-tin" type="password" autocomplete="off" bind:value={tin} placeholder="XX-XXXXXXX or XXX-XX-XXXX" class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
      </div>
      <div>
        <label for="t-signed" class="block text-xs text-foreground/80 mb-1">Signed as *</label>
        <input id="t-signed" type="text" bind:value={signedAs} placeholder="Type your full name" class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
      </div>
      {#if formKind === 'W-8BEN' || formKind === 'W-8BEN-E'}
        <div>
          <label for="t-country" class="block text-xs text-foreground/80 mb-1">Country of residence *</label>
          <input id="t-country" type="text" bind:value={country} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
        </div>
        <div>
          <label for="t-ftin" class="block text-xs text-foreground/80 mb-1">Foreign tax ID *</label>
          <input id="t-ftin" type="password" autocomplete="off" bind:value={foreignTaxId} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
        </div>
      {/if}
    </div>
    <div class="flex items-center justify-between">
      <p class="text-xs text-muted-foreground">TIN is masked at rest. Only verified admins can view your form.</p>
      <button type="button" onclick={submit} disabled={saving} class="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm">
        {saving ? 'Submitting…' : 'Submit form'}
      </button>
    </div>
  </section>

  <!-- Generated 1099s -->
  <section>
    <h2 class="text-sm font-semibold text-foreground mb-2">Annual 1099s</h2>
    {#if loading}
      <Skeleton class="h-16 rounded-xl" />
    {:else if forms1099.length === 0}
      <div class="surface-1 rounded-xl p-6 text-center text-muted-foreground text-xs">
        No 1099s generated yet. We auto-generate one each year you receive ≥ $600 in payouts with a verified W-9 on file.
      </div>
    {:else}
      <ul class="space-y-2">
        {#each forms1099 as f (f.id)}
          <li class="surface-1 rounded-xl p-3 flex items-center gap-3">
            <FileText class="w-4 h-4 text-purple-300" />
            <div class="flex-1">
              <div class="text-sm text-foreground">1099-NEC · tax year {f.taxYear}</div>
              <div class="text-xs text-muted-foreground">
                Total reported: <span class="text-foreground">{money(f.totalPaidCents)}</span>
                · generated {new Date(f.createdAt).toLocaleDateString()}
              </div>
            </div>
            {#if f.pdfUrl}
              <a href={f.pdfUrl} target="_blank" rel="noopener" class="text-xs px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white">Download PDF</a>
            {:else}
              <span class="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-200">Rendering…</span>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <!-- History -->
  <section>
    <h2 class="text-sm font-semibold text-foreground mb-2">Submitted forms</h2>
    {#if loading}
      <Skeleton class="h-16 rounded-xl" />
    {:else if forms.length === 0}
      <div class="surface-1 rounded-xl p-8 text-center text-muted-foreground text-sm">No forms on file yet.</div>
    {:else}
      <ul class="space-y-2">
        {#each forms as f (f.id)}
          <li class="surface-1 rounded-xl p-3 flex items-center gap-3">
            <div class="text-purple-300">
              {#if f.status === 'verified'}<CheckCircle2 class="w-4 h-4" />
              {:else if f.status === 'rejected'}<XCircle class="w-4 h-4 text-red-300" />
              {:else}<Clock class="w-4 h-4 text-yellow-300" />{/if}
            </div>
            <div class="flex-1">
              <div class="text-sm text-foreground">{f.formKind} · tax year {f.taxYear}</div>
              <div class="text-xs text-muted-foreground">Submitted {new Date(f.submittedAt).toLocaleDateString()}</div>
              {#if f.rejectionReason}
                <div class="text-xs text-red-200 mt-1">{f.rejectionReason}</div>
              {/if}
            </div>
            <span class="text-xs px-2 py-0.5 rounded capitalize {statusBadge(f.status)}">{f.status}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>
