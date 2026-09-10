<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Megaphone, Plus, RefreshCw, Search } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';

  interface Advertiser { id: string; name: string; slug: string; kind: string; isActive: boolean; }
  interface Campaign {
    id: string; name: string; status: string; priority: number;
    startsAt: string; endsAt: string | null;
    goalImpressions: number | null; deliveredImpressions: number;
  }
  interface Rejection { campaignId: string; campaignName: string; reason: string; }

  let advertisers = $state<Advertiser[]>([]);
  let campaigns = $state<Array<{ campaign: Campaign; advertiserName: string | null }>>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // New-advertiser form
  let newAdvertiserName = $state('');
  let creating = $state(false);

  // Auction dry-run
  let previewContentId = $state('');
  let previewing = $state(false);
  let previewResult = $state<{ wouldServe: boolean; rejections: Rejection[] } | null>(null);

  async function load() {
    loading = true;
    error = null;
    try {
      const [aRes, cRes] = await Promise.all([
        fetch('/api/admin/promo/advertisers'),
        fetch('/api/admin/promo/campaigns')
      ]);
      if (!aRes.ok || !cRes.ok) throw new Error('Failed to load promotions data');
      advertisers = (await aRes.json()).advertisers ?? [];
      campaigns = (await cRes.json()).campaigns ?? [];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load';
    } finally {
      loading = false;
    }
  }

  async function createAdvertiser() {
    if (!newAdvertiserName.trim()) return;
    creating = true;
    error = null;
    try {
      const res = await fetch('/api/admin/promo/advertisers', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: newAdvertiserName.trim() })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? 'Failed to create advertiser');
      newAdvertiserName = '';
      await load();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to create';
    } finally {
      creating = false;
    }
  }

  /**
   * Dry-runs the auction. This is the answer to "why isn't my campaign
   * serving?" — it lists every campaign that lost and why, instead of leaving
   * an operator to reconstruct flight windows and targeting arrays by hand.
   */
  async function runPreview() {
    if (!previewContentId.trim()) return;
    previewing = true;
    previewResult = null;
    error = null;
    try {
      const res = await fetch('/api/admin/promo/preview', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contentId: previewContentId.trim() })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? 'Preview failed');
      previewResult = body;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Preview failed';
    } finally {
      previewing = false;
    }
  }

  function statusVariant(status: string) {
    if (status === 'active') return 'default';
    if (status === 'completed') return 'secondary';
    return 'outline';
  }

  onMount(load);
</script>

<svelte:head><title>Promotions · Admin</title></svelte:head>

<PortalHero
  title="Promotions"
  subtitle="Advertisers, campaigns and the squeeze-back ad auction"
  icon={Megaphone}
/>

<div class="space-y-6 p-4 md:p-6">
  {#if error}
    <div class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {error}
    </div>
  {/if}

  <div class="flex justify-end">
    <Button variant="outline" size="sm" onclick={load} disabled={loading}>
      <RefreshCw class="size-4 mr-2" />
      Refresh
    </Button>
  </div>

  <!-- Advertisers -->
  <Card>
    <CardHeader><CardTitle>Advertisers</CardTitle></CardHeader>
    <CardContent class="space-y-4">
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex-1 min-w-[220px]">
          <Label for="adv-name">New advertiser</Label>
          <Input id="adv-name" bind:value={newAdvertiserName} placeholder="Acme Films" />
        </div>
        <Button onclick={createAdvertiser} disabled={creating || !newAdvertiserName.trim()}>
          <Plus class="size-4 mr-2" />
          Add
        </Button>
      </div>

      {#if loading}
        <p class="text-sm text-muted-foreground">Loading…</p>
      {:else if advertisers.length === 0}
        <p class="text-sm text-muted-foreground">No advertisers yet.</p>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="text-left text-muted-foreground">
              <tr><th class="py-2">Name</th><th>Slug</th><th>Kind</th><th>Active</th></tr>
            </thead>
            <tbody>
              {#each advertisers as a (a.id)}
                <tr class="border-t">
                  <td class="py-2">{a.name}</td>
                  <td class="font-mono text-xs">{a.slug}</td>
                  <td><Badge variant={a.kind === 'house' ? 'secondary' : 'outline'}>{a.kind}</Badge></td>
                  <td>{a.isActive ? 'Yes' : 'No'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </CardContent>
  </Card>

  <!-- Campaigns -->
  <Card>
    <CardHeader><CardTitle>Campaigns</CardTitle></CardHeader>
    <CardContent>
      {#if loading}
        <p class="text-sm text-muted-foreground">Loading…</p>
      {:else if campaigns.length === 0}
        <p class="text-sm text-muted-foreground">No campaigns yet.</p>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="text-left text-muted-foreground">
              <tr>
                <th class="py-2">Campaign</th><th>Advertiser</th><th>Status</th>
                <th>Priority</th><th>Delivered</th>
              </tr>
            </thead>
            <tbody>
              {#each campaigns as row (row.campaign.id)}
                <tr class="border-t">
                  <td class="py-2">{row.campaign.name}</td>
                  <td class="text-muted-foreground">{row.advertiserName ?? '—'}</td>
                  <td><Badge variant={statusVariant(row.campaign.status)}>{row.campaign.status}</Badge></td>
                  <td>{row.campaign.priority}</td>
                  <td>
                    {row.campaign.deliveredImpressions}{row.campaign.goalImpressions
                      ? ` / ${row.campaign.goalImpressions}`
                      : ''}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </CardContent>
  </Card>

  <!-- Auction dry-run -->
  <Card>
    <CardHeader><CardTitle>Why isn't my campaign serving?</CardTitle></CardHeader>
    <CardContent class="space-y-4">
      <p class="text-sm text-muted-foreground">
        Runs the real auction against a title without recording an impression or
        touching frequency caps, and lists every campaign that lost with its reason.
      </p>
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex-1 min-w-[260px]">
          <Label for="preview-content">Content ID</Label>
          <Input id="preview-content" bind:value={previewContentId} placeholder="media_library.id" />
        </div>
        <Button onclick={runPreview} disabled={previewing || !previewContentId.trim()}>
          <Search class="size-4 mr-2" />
          Dry run
        </Button>
      </div>

      {#if previewResult}
        <div class="rounded-md border p-3 space-y-2">
          <p class="text-sm font-medium">
            {previewResult.wouldServe ? 'An ad would serve.' : 'No ad would serve.'}
          </p>
          {#if previewResult.rejections.length > 0}
            <ul class="text-sm space-y-1">
              {#each previewResult.rejections as r (r.campaignId)}
                <li class="flex justify-between gap-4 border-t pt-1">
                  <span>{r.campaignName}</span>
                  <span class="text-muted-foreground">{r.reason}</span>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="text-sm text-muted-foreground">No campaigns were rejected.</p>
          {/if}
        </div>
      {/if}
    </CardContent>
  </Card>
</div>
