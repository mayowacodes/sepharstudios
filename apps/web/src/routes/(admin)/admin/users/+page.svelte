<script lang="ts">
  import { onMount } from 'svelte';
  import { Users, Search, ShieldAlert } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';

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
  let q = $state('');
  let roleFilter = $state<string>('all');
  let bannedFilter = $state<string>('all');
  let qTimer: ReturnType<typeof setTimeout> | null = null;

  async function load() {
    loading = true;
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (bannedFilter !== 'all') params.set('banned', bannedFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      const body = await res.json();
      users = body.users ?? [];
    } finally {
      loading = false;
    }
  }

  function onSearchInput() {
    if (qTimer) clearTimeout(qTimer);
    qTimer = setTimeout(load, 250);
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

<div class="container mx-auto py-8 px-4 max-w-7xl space-y-6">
  <PageHeader
    icon={Users}
    title="Audience"
    subtitle="View and manage end-users. Ban, warn, or open per-user detail for purchases + abuse history."
  />

  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <KpiCard label="In view" value={stats.total} icon={Users} accent="blue" variant="compact" index={0} />
    <KpiCard label="Creators" value={stats.creators} icon={Users} accent="purple" variant="compact" index={1} />
    <KpiCard label="Banned" value={stats.banned} icon={ShieldAlert} accent="red" variant="compact" index={2} />
    <KpiCard label="Flagged" value={stats.flagged} icon={ShieldAlert} accent="yellow" variant="compact" index={3} />
  </div>

  <div class="flex flex-wrap gap-3 items-center">
    <div class="relative w-80">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        bind:value={q}
        oninput={onSearchInput}
        placeholder="Search name or email…"
        class="w-full surface-2 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder-gray-500"
      />
    </div>
    <select bind:value={roleFilter} class="surface-2 rounded-lg px-3 py-2 text-sm text-foreground">
      <option value="all">All roles</option>
      <option value="user">User</option>
      <option value="creator">Creator</option>
      <option value="admin">Admin</option>
    </select>
    <select bind:value={bannedFilter} class="surface-2 rounded-lg px-3 py-2 text-sm text-foreground">
      <option value="all">All status</option>
      <option value="false">Active</option>
      <option value="true">Banned</option>
    </select>
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(8) as _ (_)}<Skeleton class="h-14 rounded-lg" />{/each}
    </div>
  {:else if users.length === 0}
    <div class="surface-1 rounded-xl p-12 text-center text-muted-foreground">No users match these filters.</div>
  {:else}
    <div class="surface-1 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="surface-1">
          <tr class="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th class="px-4 py-3">User</th>
            <th class="px-4 py-3">Role</th>
            <th class="px-4 py-3">Joined</th>
            <th class="px-4 py-3">Last seen</th>
            <th class="px-4 py-3 text-right">PPV $</th>
            <th class="px-4 py-3 text-right">Flags</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {#each users as u (u.id)}
            <tr class="border-t border-white/5 hover:surface-1">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  {#if u.image}
                    <img src={u.image} alt="" class="w-7 h-7 rounded-full object-cover" />
                  {:else}
                    <div class="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                      {(u.name ?? '?').charAt(0).toUpperCase()}
                    </div>
                  {/if}
                  <div>
                    <div class="text-foreground">{u.name}</div>
                    <div class="text-xs text-muted-foreground">{u.email}</div>
                  </div>
                  {#if u.banned}
                    <span class="ml-1 text-xs px-2 py-0.5 rounded bg-red-600/30 text-red-200">Banned</span>
                  {/if}
                </div>
              </td>
              <td class="px-4 py-3 text-xs text-foreground/80 capitalize">{u.role ?? 'user'}</td>
              <td class="px-4 py-3 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td class="px-4 py-3 text-xs text-muted-foreground">{relativeTime(u.lastSeenAt)}</td>
              <td class="px-4 py-3 text-right text-foreground tabular-nums">${(u.ppvLifetimeCents / 100).toFixed(2)}</td>
              <td class="px-4 py-3 text-right text-yellow-300">{u.abuseReportsAgainst || ''}</td>
              <td class="px-4 py-3 text-right">
                <a href={`/admin/users/${u.id}`} class="text-xs text-purple-300 hover:text-purple-200">Open →</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
