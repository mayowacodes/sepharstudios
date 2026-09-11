<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { Coins, RefreshCw, Save } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';

  interface Bucket { calls: number; usd: number }
  interface CategoryRow extends Bucket { category: string }
  interface OperationRow extends Bucket { operation: string }
  interface BudgetRow {
    scope: string;
    scopeId: string;
    periodStart: string;
    spentUsd: number;
    limitUsd: number | null;
  }

  let byCategory = $state<CategoryRow[]>([]);
  let byOperation = $state<OperationRow[]>([]);
  let budgets = $state<BudgetRow[]>([]);
  let refusedCalls = $state(0);
  let days = $state(30);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let saving = $state(false);

  // Platform cap editor
  let platformLimit = $state<string>('');

  async function load() {
    loading = true;
    error = null;
    try {
      const res = await fetch(`/api/admin/ai-costs?days=${days}`);
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? 'Failed to load');
      const body = await res.json();
      byCategory = body.byCategory ?? [];
      byOperation = body.byOperation ?? [];
      budgets = body.budgets ?? [];
      refusedCalls = body.refusedCalls ?? 0;
      const platform = budgets.find((b) => b.scope === 'platform');
      platformLimit = platform?.limitUsd != null ? String(platform.limitUsd) : '';
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load';
    } finally {
      loading = false;
    }
  }

  async function savePlatformCap() {
    saving = true;
    error = null;
    try {
      // An empty field means "no ceiling", which is NOT the same as 0 — zero
      // would refuse every AI call. Send null explicitly.
      const trimmed = platformLimit.trim();
      const limitUsd = trimmed === '' ? null : Number(trimmed);
      if (limitUsd !== null && (!Number.isFinite(limitUsd) || limitUsd < 0)) {
        throw new Error('Enter a non-negative number, or leave blank for no cap');
      }
      const res = await fetch('/api/admin/ai-costs', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ scope: 'platform', scopeId: 'platform', limitUsd })
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? 'Failed to save');
      await load();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to save';
    } finally {
      saving = false;
    }
  }

  const usd = (v: number) => `$${v.toFixed(2)}`;
  const totalUsd = $derived(byCategory.reduce((s, r) => s + r.usd, 0));
  const platformBudget = $derived(budgets.find((b) => b.scope === 'platform') ?? null);

  onMount(load);
</script>

<svelte:head><title>AI costs · Admin</title></svelte:head>

<PortalHero title="AI costs" subtitle="Spend by feature, and the ceilings that bound it" icon={Coins} />

<div class="space-y-6 p-4 md:p-6">
  {#if error}
    <div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {error}
    </div>
  {/if}

  <div class="flex items-center justify-between gap-3">
    <div class="flex gap-2">
      {#each [7, 30, 90] as d (d)}
        <Button variant={days === d ? 'default' : 'outline'} size="sm" onclick={() => { days = d; load(); }}>
          {d}d
        </Button>
      {/each}
    </div>
    <Button variant="outline" size="sm" onclick={load} disabled={loading}>
      <RefreshCw class="size-4 mr-2" />
      Refresh
    </Button>
  </div>

  <div class="grid gap-6 lg:grid-cols-3">
    <Card>
      <CardHeader><CardTitle>Total spend</CardTitle></CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold">{usd(totalUsd)}</p>
        <p class="text-xs text-muted-foreground">last {days} days</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>This month</CardTitle></CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold">{usd(platformBudget?.spentUsd ?? 0)}</p>
        <p class="text-xs text-muted-foreground">
          {platformBudget?.limitUsd != null ? `of ${usd(platformBudget.limitUsd)} cap` : 'no cap set'}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Refused calls</CardTitle></CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold {refusedCalls > 0 ? 'text-amber-500' : ''}">{refusedCalls}</p>
        <!-- Charted apart from spend on purpose: on a spend chart alone, a
             ceiling that is too low looks identical to usage simply falling. -->
        <p class="text-xs text-muted-foreground">rising means a ceiling is too low</p>
      </CardContent>
    </Card>
  </div>

  <Card>
    <CardHeader><CardTitle>Platform monthly cap</CardTitle></CardHeader>
    <CardContent>
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex-1 min-w-[200px]">
          <Label for="cap">Limit (USD) — leave blank for no cap</Label>
          <Input id="cap" bind:value={platformLimit} placeholder="250.00" inputmode="decimal" />
        </div>
        <Button onclick={savePlatformCap} disabled={saving}>
          <Save class="size-4 mr-2" />
          Save
        </Button>
      </div>
    </CardContent>
  </Card>

  <div class="grid gap-6 lg:grid-cols-2">
    <Card>
      <CardHeader><CardTitle>By category</CardTitle></CardHeader>
      <CardContent>
        {#if byCategory.length === 0}
          <p class="text-sm text-muted-foreground">No spend recorded.</p>
        {:else}
          <table class="w-full text-sm">
            <thead class="text-left text-muted-foreground">
              <tr><th class="py-2">Category</th><th>Calls</th><th class="text-right">Spend</th></tr>
            </thead>
            <tbody>
              {#each byCategory as r (r.category)}
                <tr class="border-t">
                  <td class="py-2"><Badge variant="outline">{r.category}</Badge></td>
                  <td>{r.calls.toLocaleString()}</td>
                  <td class="text-right">{usd(r.usd)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>By feature</CardTitle></CardHeader>
      <CardContent>
        {#if byOperation.length === 0}
          <p class="text-sm text-muted-foreground">No spend recorded.</p>
        {:else}
          <div class="max-h-[420px] overflow-y-auto">
            <table class="w-full text-sm">
              <thead class="text-left text-muted-foreground sticky top-0 bg-background">
                <tr><th class="py-2">Operation</th><th>Calls</th><th class="text-right">Spend</th></tr>
              </thead>
              <tbody>
                {#each byOperation as r (r.operation)}
                  <tr class="border-t">
                    <td class="py-2 truncate">{r.operation}</td>
                    <td>{r.calls.toLocaleString()}</td>
                    <td class="text-right">{usd(r.usd)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </CardContent>
    </Card>
  </div>
</div>
