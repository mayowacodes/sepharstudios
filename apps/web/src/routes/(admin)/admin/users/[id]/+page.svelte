<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { Users, ShieldAlert, Banknote, Video, ArrowLeft } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import { toast } from 'svelte-sonner';

  interface UserDetail {
    user: {
      id: string; name: string; email: string; role: string | null;
      image: string | null; banned: boolean | null; banReason: string | null;
      banExpires: string | null; createdAt: string;
      dateOfBirth: string | null; gender: string | null;
    };
    recentSessions: Array<{ ip: string | null; deviceType: string | null; expiresAt: string }>;
    ppvPurchases: Array<{ id: string; contentId: string; amountPaidCents: number; currency: string | null; createdAt: string; contentTitle: string | null }>;
    ppvLifetimeCents: number;
    subscription: { tier: string; startDate: string; endDate: string; isActive: boolean | null; autoRenew: boolean | null } | null;
    abuseReportsAgainst: Array<{ id: string; category: string; status: string; createdAt: string }>;
    abuseReportsBy: Array<{ id: string; targetType: string; category: string; status: string; createdAt: string }>;
    ownedContent: Array<{ id: string; title: string; status: string; viewCount: number | null }>;
  }

  const userId = $derived(page.params.id);
  let data = $state<UserDetail | null>(null);
  let loading = $state(true);
  let banning = $state(false);

  async function load() {
    loading = true;
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) {
        toast.error('Failed to load user');
        return;
      }
      data = await res.json();
    } finally {
      loading = false;
    }
  }

  onMount(load);

  async function warn() {
    const message = prompt('Warning message to send:');
    if (!message) return;
    const res = await fetch(`/api/admin/users/${userId}/warn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (res.ok) toast.success('Warning sent');
    else toast.error('Failed to warn');
  }

  async function ban() {
    if (!data) return;
    const reason = prompt('Reason for ban:');
    if (!reason) return;
    const expiresAt = prompt('Ban expires at (YYYY-MM-DD, blank for permanent):') || null;
    banning = true;
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, expiresAt })
      });
      if (res.ok) {
        toast.success('User banned');
        await load();
      } else toast.error('Failed to ban');
    } finally {
      banning = false;
    }
  }
</script>

<div class="mx-auto py-8 px-4 max-w-6xl space-y-6">
  <a
    href="/admin/users"
    class="text-xs inline-flex items-center gap-1 transition-colors"
    style="color: hsl(var(--portal-accent));"
  >
    <ArrowLeft class="w-3 h-3" /> All users
  </a>

  {#if loading}
    <Skeleton class="h-24 rounded-xl" />
    <div class="grid grid-cols-3 gap-3">
      <Skeleton class="h-32 rounded-xl" />
      <Skeleton class="h-32 rounded-xl" />
      <Skeleton class="h-32 rounded-xl" />
    </div>
  {:else if data}
    <PortalHero
      compact
      eyebrow="Audience · individual"
      title={data.user.name}
      subtitle={`${data.user.email} · joined ${new Date(data.user.createdAt).toLocaleDateString()} · role: ${data.user.role ?? 'user'}${data.user.banned ? ' · ⚠ BANNED' : ''}`}
      icon={Users}
      statusDot={!!data.user.banned}
      statusText={data.user.banned ? `Banned: ${data?.user.banReason ?? '(no reason)'}` : undefined}
      statusTone={data.user.banned ? 'danger' : 'neutral'}
    >
      {#snippet actions()}
        {#if !data?.user.banned}
          <PortalButton variant="secondary" size="sm" onclick={warn}>Warn</PortalButton>
          <PortalButton variant="destructive" size="sm" onclick={ban} disabled={banning}>Ban</PortalButton>
        {/if}
      {/snippet}
    </PortalHero>

    <!-- Ban banner -->
    {#if data.user.banned}
      <div class="surface-1 border border-red-500/40 bg-red-500/10 rounded-xl p-4">
        <div class="flex items-center gap-2 text-red-100">
          <ShieldAlert class="w-4 h-4" />
          <span class="text-sm font-semibold">User is banned</span>
        </div>
        <p class="text-sm text-red-50 mt-2">{data.user.banReason ?? 'No reason provided.'}</p>
        {#if data.user.banExpires}
          <p class="text-xs text-red-200 mt-1">Expires: {new Date(data.user.banExpires).toLocaleString()}</p>
        {/if}
      </div>
    {/if}

    <!-- Quick aggregates -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="surface-1 rounded-xl p-4">
        <div class="text-xs uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1">
          <Banknote class="w-3 h-3" /> Lifetime PPV
        </div>
        <div class="text-2xl font-bold text-foreground mt-1">${(data.ppvLifetimeCents / 100).toFixed(2)}</div>
        <div class="text-xs text-muted-foreground mt-1">{data.ppvPurchases.length} purchases</div>
      </div>
      <div class="surface-1 rounded-xl p-4">
        <div class="text-xs uppercase tracking-wide text-muted-foreground">Subscription</div>
        {#if data.subscription}
          <div class="text-2xl font-bold text-foreground mt-1 capitalize">{data.subscription.tier}</div>
          <div class="text-xs text-muted-foreground mt-1">
            until {new Date(data.subscription.endDate).toLocaleDateString()}{data.subscription.autoRenew ? ' · auto-renew' : ''}
          </div>
        {:else}
          <div class="text-2xl font-bold text-muted-foreground mt-1">—</div>
          <div class="text-xs text-muted-foreground mt-1">No active subscription</div>
        {/if}
      </div>
      <div class="surface-1 rounded-xl p-4">
        <div class="text-xs uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1">
          <ShieldAlert class="w-3 h-3" /> Reports against
        </div>
        <div class="text-2xl font-bold text-foreground mt-1">{data.abuseReportsAgainst.length}</div>
        <div class="text-xs text-muted-foreground mt-1">{data.abuseReportsBy.length} filed by them</div>
      </div>
    </div>

    {#if data.ownedContent.length > 0}
      <section>
        <h2 class="text-sm font-semibold text-foreground mb-2 inline-flex items-center gap-1.5">
          <Video class="w-4 h-4" /> Content they own
        </h2>
        <div class="surface-1 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="surface-1"><tr class="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th class="px-4 py-2">Title</th>
              <th class="px-4 py-2">Status</th>
              <th class="px-4 py-2 text-right">Views</th>
            </tr></thead>
            <tbody>
              {#each data.ownedContent as c (c.id)}
                <tr class="border-t border-white/5">
                  <td class="px-4 py-2 text-foreground">{c.title}</td>
                  <td class="px-4 py-2 text-xs text-foreground/80">{c.status}</td>
                  <td class="px-4 py-2 text-right text-foreground/80 tabular-nums">{(c.viewCount ?? 0).toLocaleString()}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}

    {#if data.ppvPurchases.length > 0}
      <section>
        <h2 class="text-sm font-semibold text-foreground mb-2">PPV purchases</h2>
        <div class="surface-1 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="surface-1"><tr class="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th class="px-4 py-2">Content</th>
              <th class="px-4 py-2">Date</th>
              <th class="px-4 py-2 text-right">Amount</th>
            </tr></thead>
            <tbody>
              {#each data.ppvPurchases as p (p.id)}
                <tr class="border-t border-white/5">
                  <td class="px-4 py-2 text-foreground">{p.contentTitle ?? p.contentId.slice(0, 12)}</td>
                  <td class="px-4 py-2 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td class="px-4 py-2 text-right tabular-nums">${(p.amountPaidCents / 100).toFixed(2)} {p.currency ?? 'USD'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}

    {#if data.abuseReportsAgainst.length > 0}
      <section>
        <h2 class="text-sm font-semibold text-foreground mb-2 inline-flex items-center gap-1.5">
          <ShieldAlert class="w-4 h-4 text-yellow-300" /> Reports against this user
        </h2>
        <ul class="space-y-1">
          {#each data.abuseReportsAgainst as r (r.id)}
            <li class="surface-1 rounded p-2 text-xs flex items-center gap-2">
              <span class="text-yellow-200 capitalize">{r.category.replace('_', ' ')}</span>
              <span class="text-muted-foreground">· {new Date(r.createdAt).toLocaleDateString()}</span>
              <span class="ml-auto text-muted-foreground">{r.status}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if data.recentSessions.length > 0}
      <section>
        <h2 class="text-sm font-semibold text-foreground mb-2">Recent sessions</h2>
        <ul class="space-y-1 text-xs">
          {#each data.recentSessions as s, i (i)}
            <li class="surface-1 rounded p-2 flex justify-between text-foreground/80">
              <span>{s.deviceType ?? 'unknown'} · {s.ip ?? '?'}</span>
              <span class="text-muted-foreground">{new Date(s.expiresAt).toLocaleString()}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/if}
</div>
