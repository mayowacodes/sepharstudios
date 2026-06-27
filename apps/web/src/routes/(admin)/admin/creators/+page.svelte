<!-- Admin Creator Management Dashboard -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Coins, DollarSign, Wallet, Settings, CreditCard, TrendingUp, Users, Clock, FileText, X, Send, Mail, Megaphone, UserPlus } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';

  interface Creator {
    id: string;
    name: string;
    email: string;
    ministryName: string;
    joinDate: string;
    status: 'active' | 'pending' | 'suspended';
    contentCount: number;
    totalViews: number;
    monthlyEarnings: number;
    lastActivity: string;
    verificationStatus: 'verified' | 'pending' | 'rejected';
    avatar: string;
    // Tokenomics additions
    walletAddress?: string;
    paymentPreference: 'fiat' | 'usdc' | 'stc' | 'mixed';
    stcBalance?: string;
    stakingDiscount?: number;
    revenueShare: number; // 30%, 35-45%, 50-60%
    tier: 'standard' | 'exclusive' | 'top_performer';
  }
  
  let creators = $state<Creator[]>([]);
  let filteredCreators = $state<Creator[]>([]);
  let loading = $state(true);
  let selectedCreators = $state<string[]>([]);
  let searchQuery = $state('');
  let statusFilter = $state('all');
  let verificationFilter = $state('all');
  let sortBy = $state('joinDate');
  let sortOrder = $state<'asc' | 'desc'>('desc');
  let currentPage = $state(1);
  let itemsPerPage = $state(20);
  let showCreatorModal = $state(false);
  let selectedCreator = $state<Creator | null>(null);
  
  onMount(() => {
    loadCreators();
  });
  
  function loadCreators() {
    fetch('/api/admin/creators')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        creators = data;
        filteredCreators = [...creators];
        loading = false;
        applyFilters();
      })
      .catch(() => {
        loading = false;
      });
  }
  
  function applyFilters() {
    filteredCreators = creators.filter(creator => {
      const matchesSearch = searchQuery === '' || 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.ministryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || creator.status === statusFilter;
      const matchesVerification = verificationFilter === 'all' || creator.verificationStatus === verificationFilter;
      
      return matchesSearch && matchesStatus && matchesVerification;
    });
    
    // Sort results
    filteredCreators.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        case 'contentCount':
          aValue = a.contentCount;
          bValue = b.contentCount;
          break;
        case 'totalViews':
          aValue = a.totalViews;
          bValue = b.totalViews;
          break;
        case 'monthlyEarnings':
          aValue = a.monthlyEarnings;
          bValue = b.monthlyEarnings;
          break;
        default:
          aValue = a.joinDate;
          bValue = b.joinDate;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    currentPage = 1;
  }
  
  function toggleCreatorSelection(creatorId: string) {
    if (selectedCreators.includes(creatorId)) {
      selectedCreators = selectedCreators.filter(id => id !== creatorId);
    } else {
      selectedCreators = [...selectedCreators, creatorId];
    }
  }
  
  function selectAllCreators() {
    const pageCreators = getPaginatedCreators();
    if (selectedCreators.length === pageCreators.length) {
      selectedCreators = [];
    } else {
      selectedCreators = pageCreators.map(c => c.id);
    }
  }
  
  function getPaginatedCreators() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCreators.slice(startIndex, endIndex);
  }
  
  function getTotalPages() {
    return Math.ceil(filteredCreators.length / itemsPerPage);
  }
  
  function viewCreator(creator: Creator) {
    selectedCreator = creator;
    showCreatorModal = true;
  }
  
  async function updateCreatorStatus(creatorId: string, newStatus: Creator['status']) {
    await fetch('/api/admin/creators', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: creatorId, status: newStatus })
    });
    creators = creators.map(creator => 
      creator.id === creatorId ? { ...creator, status: newStatus } : creator
    );
    applyFilters();
  }
  
  async function bulkUpdateStatus(newStatus: Creator['status']) {
    // Promise.allSettled + per-row HTTP-status check so a partial failure
    // doesn't end up showing every selected creator as "updated" when
    // only some of the PATCHes actually succeeded. Failed ids are kept in
    // the selection so the admin can retry.
    const targets = [...selectedCreators];
    const settled = await Promise.allSettled(targets.map(async (id) => {
      const res = await fetch('/api/admin/creators', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      return id;
    }));
    const succeeded = new Set<string>();
    const failures: string[] = [];
    settled.forEach((r, i) => {
      if (r.status === 'fulfilled') succeeded.add(targets[i]);
      else failures.push(`${targets[i]}: ${r.reason instanceof Error ? r.reason.message : 'unknown'}`);
    });
    creators = creators.map((creator) =>
      succeeded.has(creator.id) ? { ...creator, status: newStatus } : creator
    );
    selectedCreators = targets.filter((id) => !succeeded.has(id));
    applyFilters();
    if (failures.length > 0) {
      toast.error(`Updated ${succeeded.size} of ${targets.length}; ${failures.length} failed.`);
      console.error('[bulkUpdateStatus] failures:', failures);
    } else if (succeeded.size > 0) {
      toast.success(`Updated ${succeeded.size} creator${succeeded.size === 1 ? '' : 's'}.`);
    }
  }
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }
  
  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
  
  function getStatusColor(status: Creator['status']) {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
    }
  }
  
  function getVerificationColor(status: Creator['verificationStatus']) {
    switch (status) {
      case 'verified': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'rejected': return 'text-red-400';
    }
  }

  // ─── Broadcast / Invite / Send-message modal state ────────────────
  let broadcastOpen = $state(false);
  let broadcastSubject = $state('');
  let broadcastBody = $state('');
  let broadcastTarget = $state<'all' | 'active' | 'pending'>('active');
  let broadcastSending = $state(false);

  let inviteOpen = $state(false);
  let inviteEmail = $state('');
  let inviteName = $state('');
  let inviteSending = $state(false);

  let messageOpen = $state(false);
  let messageSubject = $state('');
  let messageBody = $state('');
  let messageSending = $state(false);

  async function sendBroadcast() {
    if (!broadcastSubject.trim() || !broadcastBody.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    broadcastSending = true;
    try {
      const targets = creators.filter((c) =>
        broadcastTarget === 'all' ? true : c.status === broadcastTarget
      );
      const results = await Promise.allSettled(
        targets.map((c) =>
          fetch('/api/admin/communications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              creatorId: c.id,
              subject: broadcastSubject.trim(),
              message: broadcastBody.trim(),
              type: 'broadcast'
            })
          })
        )
      );
      const ok = results.filter((r) => r.status === 'fulfilled' && (r.value as Response).ok).length;
      toast.success(`Sent to ${ok} of ${targets.length} creator${targets.length === 1 ? '' : 's'}`);
      broadcastOpen = false;
      broadcastSubject = '';
      broadcastBody = '';
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Broadcast failed');
    } finally {
      broadcastSending = false;
    }
  }

  async function sendInvite() {
    if (!inviteEmail.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(inviteEmail.trim())) {
      toast.error('Invalid email address');
      return;
    }
    inviteSending = true;
    try {
      const res = await fetch('/api/admin/creators/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim(), displayName: inviteName.trim() || null })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? 'Invite failed');
      toast.success(`Invitation sent to ${inviteEmail}`);
      inviteOpen = false;
      inviteEmail = '';
      inviteName = '';
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invite failed');
    } finally {
      inviteSending = false;
    }
  }

  function openSendMessage() {
    if (!selectedCreator) return;
    messageSubject = '';
    messageBody = '';
    messageOpen = true;
  }

  async function sendCreatorMessage() {
    if (!selectedCreator) return;
    if (!messageSubject.trim() || !messageBody.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    messageSending = true;
    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: selectedCreator.id,
          subject: messageSubject.trim(),
          message: messageBody.trim(),
          type: 'general'
        })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? 'Send failed');
      toast.success(`Message sent to ${selectedCreator.name ?? 'creator'}`);
      messageOpen = false;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Send failed');
    } finally {
      messageSending = false;
    }
  }
</script>

<div class="mx-auto px-4 py-4 space-y-6 max-w-7xl">
  <PortalHero
    compact
    eyebrow="Community"
    title="Creator management"
    subtitle="Manage creators and their content on the platform."
    icon={Users}
  >
    {#snippet actions()}
      <PortalButton variant="secondary" size="sm" onclick={() => (broadcastOpen = true)}>
        <Megaphone class="w-3.5 h-3.5" /> Broadcast
      </PortalButton>
      <PortalButton variant="primary" size="sm" onclick={() => (inviteOpen = true)}>
        <UserPlus class="w-3.5 h-3.5" /> Invite creator
      </PortalButton>
    {/snippet}
  </PortalHero>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <KpiCard label="Active Creators" value={creators.filter(c => c.status === 'active').length} icon={Users} accent="green" variant="compact" index={0} />
    <KpiCard label="Pending Approval" value={creators.filter(c => c.status === 'pending').length} icon={Clock} accent="yellow" variant="compact" index={1} />
    <KpiCard label="Total Content" value={creators.reduce((sum, c) => sum + c.contentCount, 0)} icon={FileText} accent="blue" variant="compact" index={2} />
    <KpiCard label="Monthly Payouts" value={`$${creators.reduce((sum, c) => sum + c.monthlyEarnings, 0).toFixed(0)}`} icon={DollarSign} accent="orange" variant="compact" index={3} />
  </div>

  <!-- Search and Filters -->
  <div class="surface-1 backdrop-blur-sm rounded-xl p-6">
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <input
          type="text"
          placeholder="Search creators, email, or ministry..."
          bind:value={searchQuery}
          oninput={applyFilters}
          class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"
        >
      </div>
      
      <!-- Filters -->
      <div class="flex gap-4">
        <select 
          bind:value={statusFilter}
          onchange={applyFilters}
          class="surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        
        <select 
          bind:value={verificationFilter}
          onchange={applyFilters}
          class="surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
        >
          <option value="all">All Verification</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <select 
          bind:value={sortBy}
          onchange={applyFilters}
          class="surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
        >
          <option value="joinDate">Join Date</option>
          <option value="name">Name</option>
          <option value="contentCount">Content Count</option>
          <option value="totalViews">Total Views</option>
          <option value="monthlyEarnings">Monthly Earnings</option>
        </select>
        
        <button
          onclick={() => { sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; applyFilters(); }}
          class="surface-2 hover:surface-3 border border-gray-600 rounded-lg px-3 py-2 text-foreground transition-colors"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  </div>

  <!-- Bulk Actions -->
  {#if selectedCreators.length > 0}
    <div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
      <div class="flex items-center justify-between">
        <span class="text-blue-400">{selectedCreators.length} creator(s) selected</span>
        <div class="flex gap-3">
          <button
            onclick={() => bulkUpdateStatus('active')}
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Approve
          </button>
          <button
            onclick={() => bulkUpdateStatus('suspended')}
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Suspend
          </button>
          <button
            onclick={() => selectedCreators = []}
            class="bg-gray-600 hover:bg-gray-700 text-foreground px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Creators Table -->
  <div class="surface-1 backdrop-blur-sm rounded-xl overflow-hidden">
    {#if loading}
      <div class="p-12 text-center">
        <div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-foreground/80">Loading creators...</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="surface-1">
            <tr>
              <th class="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectedCreators.length === getPaginatedCreators().length && getPaginatedCreators().length > 0}
                  onchange={(e) => { selectAllCreators(); return (e.target as HTMLInputElement).checked; }}
                  class="rounded surface-2 border-gray-600"
                >
              </th>
              <th class="text-left p-4 text-foreground/80 font-medium">Creator</th>
              <th class="text-left p-4 text-foreground/80 font-medium">Ministry</th>
              <th class="text-left p-4 text-foreground/80 font-medium">Status</th>
              <th class="text-left p-4 text-foreground/80 font-medium">Content</th>
              <th class="text-left p-4 text-foreground/80 font-medium">Views</th>
              <th class="text-left p-4 text-foreground/80 font-medium">Earnings</th>
              <th class="text-left p-4 text-foreground/80 font-medium">Payment</th>
              <th class="text-left p-4 text-foreground/80 font-medium">Tier</th>
              <th class="text-left p-4 text-foreground/80 font-medium">Last Active</th>
              <th class="text-left p-4 text-foreground/80 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each getPaginatedCreators() as creator (creator.id)}
              <tr class="border-t border-border/40 hover:surface-1 transition-colors">
                <td class="p-4">
                  <input
                    type="checkbox"
checked={selectedCreators.includes(creator.id)}
                    onchange={(e) => { toggleCreatorSelection(creator.id); return (e.target as HTMLInputElement).checked; }}
                    class="rounded surface-2 border-gray-600"
                  >
                </td>
                <td class="p-4">
                  <div class="flex items-center space-x-3">
                    <img 
                      src={creator.avatar} 
                      alt={creator.name}
                      class="w-10 h-10 rounded-full object-cover"
                    >
                    <div>
                      <div class="text-foreground font-medium flex items-center gap-2">
                        {creator.name}
                        {#if creator.verificationStatus === 'verified'}
                          <span class="text-blue-400">✓</span>
                        {/if}
                      </div>
                      <div class="text-muted-foreground text-sm">{creator.email}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="text-foreground">{creator.ministryName}</div>
                  <div class="text-muted-foreground text-sm">Joined {formatDate(creator.joinDate)}</div>
                </td>
                <td class="p-4">
                  <div class="flex flex-col gap-1">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs text-foreground {getStatusColor(creator.status)}">
                      {creator.status.charAt(0).toUpperCase() + creator.status.slice(1)}
                    </span>
                    <span class="text-xs {getVerificationColor(creator.verificationStatus)}">
                      {creator.verificationStatus}
                    </span>
                  </div>
                </td>
                <td class="p-4 text-foreground">{creator.contentCount}</td>
                <td class="p-4 text-foreground">{creator.totalViews.toLocaleString()}</td>
                <td class="p-4 text-foreground">${creator.monthlyEarnings.toFixed(2)}</td>
                <td class="p-4">
                  <div class="flex items-center space-x-1">
                    {#if creator.paymentPreference === 'fiat'}
                      <CreditCard class="h-3 w-3 text-green-400" />
                      <span class="text-xs text-green-400">Fiat</span>
                    {:else if creator.paymentPreference === 'usdc'}
                      <DollarSign class="h-3 w-3 text-blue-400" />
                      <span class="text-xs text-blue-400">USDC</span>
                    {:else if creator.paymentPreference === 'stc'}
                      <Coins class="h-3 w-3 text-orange-400" />
                      <span class="text-xs text-orange-400">STC</span>
                    {:else}
                      <Wallet class="h-3 w-3 text-purple-400" />
                      <span class="text-xs text-purple-400">Mixed</span>
                    {/if}
                  </div>
                  {#if creator.stakingDiscount}
                    <div class="text-xs text-muted-foreground">{creator.stakingDiscount}% discount</div>
                  {/if}
                </td>
                <td class="p-4">
                  <Badge
                    class="text-xs"
                    variant={creator.tier === 'top_performer' ? 'default' : creator.tier === 'exclusive' ? 'secondary' : 'outline'}
                  >
                    {creator.revenueShare}%
                    {#if creator.tier === 'top_performer'}
                      Top
                    {:else if creator.tier === 'exclusive'}
                      Exclusive
                    {:else}
                      Standard
                    {/if}
                  </Badge>
                </td>
                <td class="p-4 text-foreground/80 text-sm">{formatRelativeTime(creator.lastActivity)}</td>
                <td class="p-4">
                  <div class="flex gap-2">
                    <button
                      onclick={() => viewCreator(creator)}
                      class="text-blue-400 hover:text-blue-300 transition-colors"
                      title="View Details"
                    >
                      👁️
                    </button>
                    {#if creator.status !== 'active'}
                      <button
                        onclick={() => updateCreatorStatus(creator.id, 'active')}
                        class="text-green-400 hover:text-green-300 transition-colors"
                        title="Approve"
                      >
                        ✅
                      </button>
                    {/if}
                    {#if creator.status !== 'suspended'}
                      <button
                        onclick={() => updateCreatorStatus(creator.id, 'suspended')}
                        class="text-red-400 hover:text-red-300 transition-colors"
                        title="Suspend"
                      >
                        🚫
                      </button>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      {#if getTotalPages() > 1}
        <div class="p-4 border-t border-border/40 flex items-center justify-between">
          <div class="text-foreground/80 text-sm">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCreators.length)} of {filteredCreators.length} creators
          </div>
          <div class="flex gap-2">
            <button
              disabled={currentPage === 1}
              onclick={() => currentPage--}
              class="px-3 py-1 rounded surface-2 text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:surface-3 transition-colors"
            >
              Previous
            </button>
            
            {#each Array(getTotalPages()) as _, i}
              <button
                onclick={() => currentPage = i + 1}
                class="px-3 py-1 rounded transition-colors {currentPage === i + 1 ? 'bg-red-600 text-foreground' : 'surface-2 text-white/80 hover:surface-3'}"
              >
                {i + 1}
              </button>
            {/each}
            
            <button
              disabled={currentPage === getTotalPages()}
              onclick={() => currentPage++}
              class="px-3 py-1 rounded surface-2 text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:surface-3 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<!-- Creator Detail Modal -->
{#if showCreatorModal && selectedCreator}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-foreground">Creator Details</h2>
          <button 
            onclick={() => showCreatorModal = false}
            class="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div class="space-y-6">
          <!-- Creator Profile -->
          <div class="flex items-center space-x-4">
            <img 
              src={selectedCreator.avatar} 
              alt={selectedCreator.name}
              class="w-16 h-16 rounded-full object-cover"
            >
            <div class="flex-1">
              <h3 class="text-xl font-bold text-foreground flex items-center gap-2">
                {selectedCreator.name}
                {#if selectedCreator.verificationStatus === 'verified'}
                  <span class="text-blue-400">✓</span>
                {/if}
              </h3>
              <p class="text-foreground/80">{selectedCreator.email}</p>
              <p class="text-muted-foreground">{selectedCreator.ministryName}</p>
            </div>
          </div>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="surface-1 rounded-lg p-4">
              <div class="text-2xl font-bold text-blue-400">{selectedCreator.contentCount}</div>
              <div class="text-foreground/80 text-sm">Content Items</div>
            </div>
            <div class="surface-1 rounded-lg p-4">
              <div class="text-2xl font-bold text-purple-400">{selectedCreator.totalViews.toLocaleString()}</div>
              <div class="text-foreground/80 text-sm">Total Views</div>
            </div>
            <div class="surface-1 rounded-lg p-4">
              <div class="text-2xl font-bold text-green-400">${selectedCreator.monthlyEarnings.toFixed(2)}</div>
              <div class="text-foreground/80 text-sm">Monthly Earnings</div>
            </div>
            <div class="surface-1 rounded-lg p-4">
              <div class="text-lg font-bold text-foreground/80">{formatDate(selectedCreator.joinDate)}</div>
              <div class="text-foreground/80 text-sm">Join Date</div>
            </div>
          </div>
          
          <!-- Status Information -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-foreground/80">Account Status:</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground {getStatusColor(selectedCreator.status)}">
                {selectedCreator.status.charAt(0).toUpperCase() + selectedCreator.status.slice(1)}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-foreground/80">Verification Status:</span>
              <span class="text-sm {getVerificationColor(selectedCreator.verificationStatus)}">
                {selectedCreator.verificationStatus.charAt(0).toUpperCase() + selectedCreator.verificationStatus.slice(1)}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-foreground/80">Last Activity:</span>
              <span class="text-foreground/80 text-sm">{formatRelativeTime(selectedCreator.lastActivity)}</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-3 pt-4 border-t border-border">
            <button
              onclick={() => selectedCreator && updateCreatorStatus(selectedCreator.id, selectedCreator.status === 'active' ? 'suspended' : 'active')}
              class="flex-1 py-2 px-4 rounded-lg transition-colors {selectedCreator.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white"
            >
              {selectedCreator.status === 'active' ? 'Suspend Account' : 'Activate Account'}
            </button>
            <button onclick={openSendMessage} class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5">
              <Send class="w-3.5 h-3.5" /> Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Broadcast modal -->
{#if broadcastOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="surface-glass border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-foreground inline-flex items-center gap-2">
          <Megaphone class="w-4 h-4 text-primary" /> Broadcast to creators
        </h3>
        <button onclick={() => (broadcastOpen = false)} class="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X class="w-4 h-4" />
        </button>
      </div>
      <div>
        <label for="b-target" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Audience</label>
        <select id="b-target" bind:value={broadcastTarget} class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground">
          <option value="active">Active creators only</option>
          <option value="pending">Pending creators only</option>
          <option value="all">All creators</option>
        </select>
      </div>
      <div>
        <label for="b-subject" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Subject</label>
        <input id="b-subject" type="text" bind:value={broadcastSubject} maxlength="120" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground" />
      </div>
      <div>
        <label for="b-body" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Message</label>
        <textarea id="b-body" bind:value={broadcastBody} rows="5" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground resize-none"></textarea>
      </div>
      <p class="text-xs text-muted-foreground">
        Will send to {creators.filter((c) => broadcastTarget === 'all' || c.status === broadcastTarget).length} creator{creators.filter((c) => broadcastTarget === 'all' || c.status === broadcastTarget).length === 1 ? '' : 's'}.
      </p>
      <div class="flex gap-2 justify-end">
        <button onclick={() => (broadcastOpen = false)} class="px-3 py-1.5 rounded-md surface-1 hover:surface-2 text-foreground text-sm">Cancel</button>
        <button onclick={sendBroadcast} disabled={broadcastSending} class="px-3 py-1.5 rounded-md bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5">
          <Send class="w-3 h-3" /> {broadcastSending ? 'Sending…' : 'Send broadcast'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Invite creator modal -->
{#if inviteOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="surface-glass border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-foreground inline-flex items-center gap-2">
          <UserPlus class="w-4 h-4 text-primary" /> Invite a creator
        </h3>
        <button onclick={() => (inviteOpen = false)} class="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X class="w-4 h-4" />
        </button>
      </div>
      <div>
        <label for="i-email" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Email *</label>
        <input id="i-email" type="email" bind:value={inviteEmail} placeholder="creator@example.com" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground" />
      </div>
      <div>
        <label for="i-name" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Display name (optional)</label>
        <input id="i-name" type="text" bind:value={inviteName} placeholder="Their channel name" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground" />
      </div>
      <p class="text-xs text-muted-foreground">An invitation email with a sign-up link will be sent.</p>
      <div class="flex gap-2 justify-end">
        <button onclick={() => (inviteOpen = false)} class="px-3 py-1.5 rounded-md surface-1 hover:surface-2 text-foreground text-sm">Cancel</button>
        <button onclick={sendInvite} disabled={inviteSending} class="px-3 py-1.5 rounded-md bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5">
          <Mail class="w-3 h-3" /> {inviteSending ? 'Sending…' : 'Send invite'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Single-creator message modal -->
{#if messageOpen && selectedCreator}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="surface-glass border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-foreground inline-flex items-center gap-2">
          <Send class="w-4 h-4 text-primary" /> Message {selectedCreator.name ?? 'creator'}
        </h3>
        <button onclick={() => (messageOpen = false)} class="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X class="w-4 h-4" />
        </button>
      </div>
      <div>
        <label for="m-subject" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Subject</label>
        <input id="m-subject" type="text" bind:value={messageSubject} maxlength="120" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground" />
      </div>
      <div>
        <label for="m-body" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Message</label>
        <textarea id="m-body" bind:value={messageBody} rows="5" class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground resize-none"></textarea>
      </div>
      <div class="flex gap-2 justify-end">
        <button onclick={() => (messageOpen = false)} class="px-3 py-1.5 rounded-md surface-1 hover:surface-2 text-foreground text-sm">Cancel</button>
        <button onclick={sendCreatorMessage} disabled={messageSending} class="px-3 py-1.5 rounded-md bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5">
          <Send class="w-3 h-3" /> {messageSending ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  </div>
{/if}
