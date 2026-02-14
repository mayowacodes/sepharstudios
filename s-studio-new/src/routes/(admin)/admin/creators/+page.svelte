<!-- Admin Creator Management Dashboard -->
<script lang="ts">
  import { onMount } from 'svelte';
  
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
    // Mock data - TODO: Replace with actual API
    setTimeout(() => {
      creators = [
        {
          id: '1',
          name: 'Pastor John Smith',
          email: 'john.smith@faithchurch.org',
          ministryName: 'Faith Community Church',
          joinDate: '2024-01-15',
          status: 'active',
          contentCount: 45,
          totalViews: 125000,
          monthlyEarnings: 2450.75,
          lastActivity: '2024-09-06T10:30:00Z',
          verificationStatus: 'verified',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@gospelmusic.com',
          ministryName: 'Gospel Harmony Ministry',
          joinDate: '2024-02-20',
          status: 'active',
          contentCount: 32,
          totalViews: 89000,
          monthlyEarnings: 1650.25,
          lastActivity: '2024-09-05T14:20:00Z',
          verificationStatus: 'verified',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '3',
          name: 'Michael Rodriguez',
          email: 'mike.rodriguez@youthministry.org',
          ministryName: 'Youth for Christ',
          joinDate: '2024-03-10',
          status: 'pending',
          contentCount: 8,
          totalViews: 12500,
          monthlyEarnings: 85.50,
          lastActivity: '2024-09-04T09:15:00Z',
          verificationStatus: 'pending',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '4',
          name: 'Dr. Elizabeth Davis',
          email: 'elizabeth@biblicalstudies.edu',
          ministryName: 'Biblical Studies Institute',
          joinDate: '2023-11-05',
          status: 'active',
          contentCount: 78,
          totalViews: 245000,
          monthlyEarnings: 4200.00,
          lastActivity: '2024-09-07T08:45:00Z',
          verificationStatus: 'verified',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '5',
          name: 'Pastor David Kim',
          email: 'david.kim@koreanfaith.org',
          ministryName: 'Korean Faith Community',
          joinDate: '2024-01-28',
          status: 'suspended',
          contentCount: 15,
          totalViews: 28000,
          monthlyEarnings: 0,
          lastActivity: '2024-08-15T16:30:00Z',
          verificationStatus: 'verified',
          avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face'
        }
      ];
      filteredCreators = [...creators];
      loading = false;
      applyFilters();
    }, 800);
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
  
  function updateCreatorStatus(creatorId: string, newStatus: Creator['status']) {
    creators = creators.map(creator => 
      creator.id === creatorId ? { ...creator, status: newStatus } : creator
    );
    applyFilters();
  }
  
  function bulkUpdateStatus(newStatus: Creator['status']) {
    creators = creators.map(creator => 
      selectedCreators.includes(creator.id) ? { ...creator, status: newStatus } : creator
    );
    selectedCreators = [];
    applyFilters();
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
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-white">Creator Management</h1>
      <p class="text-gray-300">Manage creators and their content on the platform</p>
    </div>
    
    <div class="flex items-center space-x-4">
      <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
        📧 Send Broadcast
      </button>
      <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
        ➕ Invite Creator
      </button>
    </div>
  </div>

  <!-- Summary Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
      <div class="text-2xl font-bold text-white">{creators.filter(c => c.status === 'active').length}</div>
      <div class="text-gray-300 text-sm">Active Creators</div>
    </div>
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
      <div class="text-2xl font-bold text-yellow-400">{creators.filter(c => c.status === 'pending').length}</div>
      <div class="text-gray-300 text-sm">Pending Approval</div>
    </div>
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
      <div class="text-2xl font-bold text-blue-400">{creators.reduce((sum, c) => sum + c.contentCount, 0)}</div>
      <div class="text-gray-300 text-sm">Total Content</div>
    </div>
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
      <div class="text-2xl font-bold text-green-400">${creators.reduce((sum, c) => sum + c.monthlyEarnings, 0).toFixed(0)}</div>
      <div class="text-gray-300 text-sm">Monthly Payouts</div>
    </div>
  </div>

  <!-- Search and Filters -->
  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <input
          type="text"
          placeholder="Search creators, email, or ministry..."
          bind:value={searchQuery}
          oninput={applyFilters}
          class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
        >
      </div>
      
      <!-- Filters -->
      <div class="flex gap-4">
        <select 
          bind:value={statusFilter}
          onchange={applyFilters}
          class="bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        
        <select 
          bind:value={verificationFilter}
          onchange={applyFilters}
          class="bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
        >
          <option value="all">All Verification</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <select 
          bind:value={sortBy}
          onchange={applyFilters}
          class="bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
        >
          <option value="joinDate">Join Date</option>
          <option value="name">Name</option>
          <option value="contentCount">Content Count</option>
          <option value="totalViews">Total Views</option>
          <option value="monthlyEarnings">Monthly Earnings</option>
        </select>
        
        <button
          onclick={() => { sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; applyFilters(); }}
          class="bg-white/10 hover:bg-white/20 border border-gray-600 rounded-lg px-3 py-2 text-white transition-colors"
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
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Creators Table -->
  <div class="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
    {#if loading}
      <div class="p-12 text-center">
        <div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-300">Loading creators...</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5">
            <tr>
              <th class="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectedCreators.length === getPaginatedCreators().length && getPaginatedCreators().length > 0}
                  onchange={selectAllCreators}
                  class="rounded bg-white/10 border-gray-600"
                >
              </th>
              <th class="text-left p-4 text-gray-300 font-medium">Creator</th>
              <th class="text-left p-4 text-gray-300 font-medium">Ministry</th>
              <th class="text-left p-4 text-gray-300 font-medium">Status</th>
              <th class="text-left p-4 text-gray-300 font-medium">Content</th>
              <th class="text-left p-4 text-gray-300 font-medium">Views</th>
              <th class="text-left p-4 text-gray-300 font-medium">Earnings</th>
              <th class="text-left p-4 text-gray-300 font-medium">Last Active</th>
              <th class="text-left p-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each getPaginatedCreators() as creator (creator.id)}
              <tr class="border-t border-white/10 hover:bg-white/5 transition-colors">
                <td class="p-4">
                  <input
                    type="checkbox"
                    checked={selectedCreators.includes(creator.id)}
                    onchange={() => toggleCreatorSelection(creator.id)}
                    class="rounded bg-white/10 border-gray-600"
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
                      <div class="text-white font-medium flex items-center gap-2">
                        {creator.name}
                        {#if creator.verificationStatus === 'verified'}
                          <span class="text-blue-400">✓</span>
                        {/if}
                      </div>
                      <div class="text-gray-400 text-sm">{creator.email}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="text-white">{creator.ministryName}</div>
                  <div class="text-gray-400 text-sm">Joined {formatDate(creator.joinDate)}</div>
                </td>
                <td class="p-4">
                  <div class="flex flex-col gap-1">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs text-white {getStatusColor(creator.status)}">
                      {creator.status.charAt(0).toUpperCase() + creator.status.slice(1)}
                    </span>
                    <span class="text-xs {getVerificationColor(creator.verificationStatus)}">
                      {creator.verificationStatus}
                    </span>
                  </div>
                </td>
                <td class="p-4 text-white">{creator.contentCount}</td>
                <td class="p-4 text-white">{creator.totalViews.toLocaleString()}</td>
                <td class="p-4 text-white">${creator.monthlyEarnings.toFixed(2)}</td>
                <td class="p-4 text-gray-300 text-sm">{formatRelativeTime(creator.lastActivity)}</td>
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
        <div class="p-4 border-t border-white/10 flex items-center justify-between">
          <div class="text-gray-300 text-sm">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCreators.length)} of {filteredCreators.length} creators
          </div>
          <div class="flex gap-2">
            <button
              disabled={currentPage === 1}
              onclick={() => currentPage--}
              class="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            >
              Previous
            </button>
            
            {#each Array(getTotalPages()) as _, i}
              <button
                onclick={() => currentPage = i + 1}
                class="px-3 py-1 rounded transition-colors {currentPage === i + 1 ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}"
              >
                {i + 1}
              </button>
            {/each}
            
            <button
              disabled={currentPage === getTotalPages()}
              onclick={() => currentPage++}
              class="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
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
          <h2 class="text-2xl font-bold text-white">Creator Details</h2>
          <button 
            onclick={() => showCreatorModal = false}
            class="text-gray-400 hover:text-white transition-colors"
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
              <h3 class="text-xl font-bold text-white flex items-center gap-2">
                {selectedCreator.name}
                {#if selectedCreator.verificationStatus === 'verified'}
                  <span class="text-blue-400">✓</span>
                {/if}
              </h3>
              <p class="text-gray-300">{selectedCreator.email}</p>
              <p class="text-gray-400">{selectedCreator.ministryName}</p>
            </div>
          </div>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/5 rounded-lg p-4">
              <div class="text-2xl font-bold text-blue-400">{selectedCreator.contentCount}</div>
              <div class="text-gray-300 text-sm">Content Items</div>
            </div>
            <div class="bg-white/5 rounded-lg p-4">
              <div class="text-2xl font-bold text-purple-400">{selectedCreator.totalViews.toLocaleString()}</div>
              <div class="text-gray-300 text-sm">Total Views</div>
            </div>
            <div class="bg-white/5 rounded-lg p-4">
              <div class="text-2xl font-bold text-green-400">${selectedCreator.monthlyEarnings.toFixed(2)}</div>
              <div class="text-gray-300 text-sm">Monthly Earnings</div>
            </div>
            <div class="bg-white/5 rounded-lg p-4">
              <div class="text-lg font-bold text-gray-300">{formatDate(selectedCreator.joinDate)}</div>
              <div class="text-gray-300 text-sm">Join Date</div>
            </div>
          </div>
          
          <!-- Status Information -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Account Status:</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm text-white {getStatusColor(selectedCreator.status)}">
                {selectedCreator.status.charAt(0).toUpperCase() + selectedCreator.status.slice(1)}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Verification Status:</span>
              <span class="text-sm {getVerificationColor(selectedCreator.verificationStatus)}">
                {selectedCreator.verificationStatus.charAt(0).toUpperCase() + selectedCreator.verificationStatus.slice(1)}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Last Activity:</span>
              <span class="text-gray-300 text-sm">{formatRelativeTime(selectedCreator.lastActivity)}</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-3 pt-4 border-t border-gray-700">
            <button
              onclick={() => selectedCreator && updateCreatorStatus(selectedCreator.id, selectedCreator.status === 'active' ? 'suspended' : 'active')}
              class="flex-1 py-2 px-4 rounded-lg transition-colors {selectedCreator.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white"
            >
              {selectedCreator.status === 'active' ? 'Suspend Account' : 'Activate Account'}
            </button>
            <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}