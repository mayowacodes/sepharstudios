<script lang="ts">
  import { onMount } from 'svelte';
  import { Users, ShieldAlert } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import PortalKpi from '$lib/components/portal/PortalKpi.svelte';
  import PortalDataTable from '$lib/components/portal/PortalDataTable.svelte';
  import PortalEmptyState from '$lib/components/portal/PortalEmptyState.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';

  interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string | null;
    banned: boolean | null;
    banReason: string | null;
    image: string | null;
    createdAt: string;
    lastSeenAt: string | null;
    abuseReportsAgainst: number;
    ppvLifetimeCents: number;
  }

  let users = $state<UserRow[]>([]);
  let loading = $state(true);
  // Server-side filters: role + banned status. The free-text search is
  // now handled client-side by PortalDataTable's built-in command bar so
  // the admin gets instant filtering without round-tripping. For very
  // large user bases we can flip the search back to server-side later;
  // until then, instant feel wins.
  let roleFilter = $state<string>('all');
  let bannedFilter = $state<string>('all');

  async function load() {
    loading = true;
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (bannedFilter !== 'all') params.set('banned', bannedFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) {
        console.error('[admin/users] load HTTP', res.status);
        users = [];
        return;
      }
      const body = await res.json().catch(() => ({}));
      users = body.users ?? [];
    } catch (err) {
      console.error('[admin/users] load failed:', err);
      users = [];
    } finally {
      loading = false;
    }
  }

  $effect(() => { roleFilter; bannedFilter; void load(); });
  onMount(load);

  const stats = $derived.by(() => ({
    total: users.length,
    creators: users.filter((u) => u.role === 'creator').length,
    banned: users.filter((u) => u.banned).length,
    flagged: users.filter((u) => u.abuseReportsAgainst > 0).length
  }));

  function relativeTime(iso: string | null): string {
    if (!iso) return 'never';
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return new Date(iso).toLocaleDateString();
  }
</script>

<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">
  <PortalHero
    compact
    eyebrow="People"
    title="Audience"
    subtitle="View and manage end-users. Ban, warn, or open per-user detail for purchases + abuse history."
    icon={Users}
  />

  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <PortalKpi label="In view" value={stats.total} icon={Users} />
    <PortalKpi label="Creators" value={stats.creators} icon={Users} />
    <PortalKpi label="Banned" value={stats.banned} icon={ShieldAlert} />
    <PortalKpi label="Flagged" value={stats.flagged} icon={ShieldAlert} />
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(8) as _, i (i)}<Skeleton class="h-14 rounded-lg" />{/each}
    </div>
  {:else}
    <PortalDataTable items={users} searchPlaceholder="Search name or email…" searchKey="name">
      {#snippet filters()}
        <select
          bind:value={roleFilter}
          class="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
        >
          <option value="all">All roles</option>
          <option value="user">User</option>
          <option value="creator">Creator</option>
          <option value="admin">Admin</option>
        </select>
        <select
          bind:value={bannedFilter}
          class="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style="background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
        >
          <option value="all">All status</option>
          <option value="false">Active</option>
          <option value="true">Banned</option>
        </select>
      {/snippet}

      {#snippet row(u)}
        <div class="flex items-center gap-3 text-sm">
          {#if u.image}
            <img src={u.image} alt="" class="w-8 h-8 rounded-full object-cover shrink-0" />
          {:else}
            <div
              class="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
              style="background: hsl(var(--portal-accent)/0.2); color: hsl(var(--portal-accent));"
            >
              {(u.name ?? '?').charAt(0).toUpperCase()}
            </div>
          {/if}
          <div class="min-w-0 flex-1">
            <div class="font-medium text-[hsl(var(--portal-text))] truncate">{u.name}</div>
            <div class="text-xs text-[hsl(var(--portal-text-muted))] truncate">{u.email}</div>
          </div>
          <span class="hidden md:inline text-xs text-[hsl(var(--portal-text-muted))] capitalize">{u.role ?? 'user'}</span>
          <span class="hidden lg:inline text-xs text-[hsl(var(--portal-text-muted))]">{relativeTime(u.lastSeenAt)}</span>
          <span class="text-sm tabular-nums text-[hsl(var(--portal-text))]">${(u.ppvLifetimeCents / 100).toFixed(2)}</span>
          {#if u.banned}
            <span
              class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style="background: hsl(var(--portal-danger)/0.2); color: hsl(var(--portal-danger));"
            >BANNED</span>
          {/if}
          {#if u.abuseReportsAgainst > 0}
            <span
              class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style="background: hsl(45 95% 55% / 0.2); color: hsl(45 95% 70%);"
            >{u.abuseReportsAgainst} flag{u.abuseReportsAgainst === 1 ? '' : 's'}</span>
          {/if}
        </div>
      {/snippet}

      {#snippet detail(u)}
        <div class="space-y-5">
          <div class="flex items-center gap-3">
            {#if u.image}
              <img src={u.image} alt="" class="w-14 h-14 rounded-full object-cover" />
            {:else}
              <div
                class="w-14 h-14 rounded-full text-lg font-bold flex items-center justify-center"
                style="background: hsl(var(--portal-accent)/0.2); color: hsl(var(--portal-accent));"
              >
                {(u.name ?? '?').charAt(0).toUpperCase()}
              </div>
            {/if}
            <div class="min-w-0">
              <div class="text-lg font-semibold text-[hsl(var(--portal-text))] truncate">{u.name}</div>
              <div class="text-sm text-[hsl(var(--portal-text-muted))] truncate">{u.email}</div>
            </div>
          </div>

          {#if u.banned}
            <div
              class="rounded-lg p-3 border"
              style="background: hsl(var(--portal-danger)/0.1); border-color: hsl(var(--portal-danger)/0.35); color: hsl(var(--portal-danger));"
            >
              <div class="text-[10px] uppercase tracking-widest font-semibold mb-1 opacity-80">Banned</div>
              <p class="text-xs">{u.banReason ?? 'No reason provided.'}</p>
            </div>
          {/if}

          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Role</div>
              <div class="text-sm capitalize text-[hsl(var(--portal-text))]">{u.role ?? 'user'}</div>
            </div>
            <div>
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Joined</div>
              <div class="text-sm text-[hsl(var(--portal-text))]">{new Date(u.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Last seen</div>
              <div class="text-sm text-[hsl(var(--portal-text))]">{relativeTime(u.lastSeenAt)}</div>
            </div>
            <div>
              <div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">PPV lifetime</div>
              <div class="text-sm font-semibold tabular-nums text-[hsl(var(--portal-text))]">${(u.ppvLifetimeCents / 100).toFixed(2)}</div>
            </div>
          </div>

          {#if u.abuseReportsAgainst > 0}
            <div
              class="rounded-lg p-3 border"
              style="background: hsl(45 95% 55% / 0.1); border-color: hsl(45 95% 55% / 0.3); color: hsl(45 95% 80%);"
            >
              <div class="text-[10px] uppercase tracking-widest font-semibold mb-1 opacity-80">Abuse reports</div>
              <p class="text-xs">{u.abuseReportsAgainst} open report{u.abuseReportsAgainst === 1 ? '' : 's'} against this user.</p>
            </div>
          {/if}

          <PortalButton href={`/admin/users/${u.id}`} variant="primary" size="md">
            Open full profile →
          </PortalButton>
        </div>
      {/snippet}

      {#snippet empty()}
        <PortalEmptyState
          icon={Users}
          title="No users match these filters"
          description="Adjust the role or status filter, or clear the search box."
        />
      {/snippet}
    </PortalDataTable>
  {/if}
</div>
