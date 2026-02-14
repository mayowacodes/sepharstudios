<!-- Admin Policies & Guidelines Management -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  interface ContentPolicy {
    id: string;
    title: string;
    category: 'theological' | 'content' | 'family_safety' | 'technical';
    description: string;
    requirements: string[];
    violations: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  let policies = $state<ContentPolicy[]>([]);
  let selectedCategory = $state<string>('all');
  let editingPolicy = $state<ContentPolicy | null>(null);
  let showCreateModal = $state(false);
  
  // Mock data
  onMount(() => {
    policies = [
      {
        id: '1',
        title: 'Biblical Accuracy Standards',
        category: 'theological',
        description: 'Ensures content aligns with core Christian biblical principles',
        requirements: [
          'Scripture references must be accurate and contextual',
          'Theological statements must align with evangelical Christian doctrine',
          'No promotion of non-Christian religious practices',
          'Clear presentation of the Gospel message when applicable'
        ],
        violations: [
          'Misquoted or taken out of context Bible verses',
          'Promotion of heretical doctrines',
          'Syncretism with other religions',
          'Denial of core Christian beliefs'
        ],
        severity: 'critical',
        isActive: true,
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date('2024-09-01')
      },
      {
        id: '2',
        title: 'Age-Appropriate Content Standards',
        category: 'family_safety',
        description: 'Guidelines for content suitable for different age groups',
        requirements: [
          'Content must match declared age rating',
          'Language appropriate for target audience',
          'Violence levels within acceptable limits',
          'Educational value for children\'s content'
        ],
        violations: [
          'Inappropriate language for age group',
          'Excessive violence or disturbing imagery',
          'Adult themes in children\'s content',
          'Misleading age rating declarations'
        ],
        severity: 'high',
        isActive: true,
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date('2024-08-15')
      },
      {
        id: '3',
        title: 'Technical Quality Standards',
        category: 'technical',
        description: 'Minimum technical requirements for uploaded content',
        requirements: [
          'Video resolution minimum 720p HD',
          'Clear audio without distortion',
          'Proper aspect ratio (16:9 preferred)',
          'File formats: MP4, MOV, or AVI',
          'Subtitle files in SRT format if provided'
        ],
        violations: [
          'Poor video quality below 720p',
          'Distorted or unclear audio',
          'Incorrect aspect ratios',
          'Unsupported file formats',
          'Corrupted or incomplete files'
        ],
        severity: 'medium',
        isActive: true,
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date('2024-08-10')
      },
      {
        id: '4',
        title: 'Content Moderation Guidelines',
        category: 'content',
        description: 'General content review standards for platform suitability',
        requirements: [
          'Family-friendly presentation and messaging',
          'Professional production quality',
          'Respectful treatment of all people',
          'Constructive and uplifting content',
          'Clear and understandable messaging'
        ],
        violations: [
          'Discriminatory or hateful language',
          'Inappropriate imagery or symbolism',
          'Poor production quality',
          'Offensive or inflammatory content',
          'Misleading or false information'
        ],
        severity: 'high',
        isActive: true,
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date('2024-08-20')
      }
    ];
  });
  
  const filteredPolicies = $derived(
    policies.filter(policy =>
      selectedCategory === 'all' || policy.category === selectedCategory
    )
  );
  
  function getCategoryColor(category: string) {
    switch (category) {
      case 'theological': return 'bg-purple-600 text-white';
      case 'family_safety': return 'bg-pink-600 text-white';
      case 'content': return 'bg-green-600 text-white';
      case 'technical': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  }
  
  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  }
  
  function editPolicy(policy: ContentPolicy) {
    editingPolicy = { ...policy };
  }
  
  function togglePolicyStatus(policyId: string) {
    policies = policies.map(policy => 
      policy.id === policyId ? { ...policy, isActive: !policy.isActive } : policy
    );
  }
  
  function createNewPolicy() {
    showCreateModal = true;
    editingPolicy = {
      id: Date.now().toString(),
      title: '',
      category: 'content',
      description: '',
      requirements: [],
      violations: [],
      severity: 'medium',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  function savePolicy() {
    if (editingPolicy) {
      const existingIndex = policies.findIndex(p => p.id === editingPolicy!.id);
      if (existingIndex >= 0) {
        policies[existingIndex] = { ...editingPolicy!, updatedAt: new Date() };
      } else {
        policies = [...policies, editingPolicy!];
      }
      policies = policies;
      editingPolicy = null;
      showCreateModal = false;
    }
  }
  
  function cancelEdit() {
    editingPolicy = null;
    showCreateModal = false;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-4xl font-bold text-white mb-2">Content Policies</h1>
      <p class="text-xl text-gray-300">Manage guidelines and standards for content review</p>
    </div>
    
    <button 
      onclick={createNewPolicy}
      class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
    >
      Create New Policy
    </button>
  </div>
  
  <!-- Policy Stats -->
  <div class="grid grid-cols-4 gap-4">
    <div class="bg-purple-600/20 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-purple-400">{policies.filter(p => p.category === 'theological').length}</div>
      <div class="text-xs text-purple-200">Theological</div>
    </div>
    <div class="bg-pink-600/20 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-pink-400">{policies.filter(p => p.category === 'family_safety').length}</div>
      <div class="text-xs text-pink-200">Family Safety</div>
    </div>
    <div class="bg-green-600/20 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-green-400">{policies.filter(p => p.category === 'content').length}</div>
      <div class="text-xs text-green-200">Content</div>
    </div>
    <div class="bg-blue-600/20 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-blue-400">{policies.filter(p => p.category === 'technical').length}</div>
      <div class="text-xs text-blue-200">Technical</div>
    </div>
  </div>
  
  <!-- Filter -->
  <div class="bg-white/10 rounded-xl p-6">
    <div class="flex items-center space-x-4">
      <label for="filterByCategory" class="text-sm font-medium text-white">Filter by Category:</label>
      <select 
        id="filterByCategory"
        bind:value={selectedCategory}
        class="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
      >
        <option value="all">All Categories</option>
        <option value="theological">Theological</option>
        <option value="family_safety">Family Safety</option>
        <option value="content">Content Moderation</option>
        <option value="technical">Technical</option>
      </select>
    </div>
  </div>
  
  <!-- Policies Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#each filteredPolicies as policy}
      <div class="bg-white/10 rounded-xl p-6 space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-xl font-bold text-white">{policy.title}</h3>
              <span class="px-3 py-1 text-xs rounded-full {getCategoryColor(policy.category)}">
                {policy.category.replace('_', ' ')}
              </span>
            </div>
            <p class="text-gray-300 text-sm">{policy.description}</p>
          </div>
          
          <div class="flex items-center space-x-2">
            <span class="px-2 py-1 text-xs rounded-full {getSeverityColor(policy.severity)}">
              {policy.severity.toUpperCase()}
            </span>
            <button 
              onclick={() => togglePolicyStatus(policy.id)}
              class="px-3 py-1 text-xs rounded-full transition-colors {policy.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}"
            >
              {policy.isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>
        
        <!-- Requirements -->
        <div>
          <h4 class="font-medium text-white mb-2">Requirements</h4>
          <ul class="text-sm text-green-300 space-y-1">
            {#each policy.requirements.slice(0, 3) as requirement}
              <li>• {requirement}</li>
            {/each}
            {#if policy.requirements.length > 3}
              <li class="text-gray-400">... and {policy.requirements.length - 3} more</li>
            {/if}
          </ul>
        </div>
        
        <!-- Common Violations -->
        <div>
          <h4 class="font-medium text-white mb-2">Common Violations</h4>
          <ul class="text-sm text-red-300 space-y-1">
            {#each policy.violations.slice(0, 2) as violation}
              <li>• {violation}</li>
            {/each}
            {#if policy.violations.length > 2}
              <li class="text-gray-400">... and {policy.violations.length - 2} more</li>
            {/if}
          </ul>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-600">
          <div class="text-xs text-gray-400">
            Updated {policy.updatedAt.toLocaleDateString()}
          </div>
          <div class="flex space-x-2">
            <button 
              onclick={() => editPolicy(policy)}
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Edit
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
              Archive
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Edit/Create Modal -->
{#if editingPolicy}
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">
            {showCreateModal ? 'Create New Policy' : 'Edit Policy'}
          </h2>
          <button onclick={cancelEdit} class="text-gray-400 hover:text-white" aria-label="Close policy modal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Title -->
          <div>
            <label for="policyTitle" class="block text-sm font-medium text-white mb-2">Policy Title</label>
            <input 
              id="policyTitle"
              type="text" 
              bind:value={editingPolicy.title}
              class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
              placeholder="Enter policy title..."
            />
          </div>
          
          <!-- Category and Severity -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="policyCategory" class="block text-sm font-medium text-white mb-2">Category</label>
              <select 
                id="policyCategory"
                bind:value={editingPolicy.category}
                class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
              >
                <option value="theological">Theological</option>
                <option value="family_safety">Family Safety</option>
                <option value="content">Content Moderation</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            
            <div>
              <label for="policySeverity" class="block text-sm font-medium text-white mb-2">Severity</label>
              <select 
                id="policySeverity"
                bind:value={editingPolicy.severity}
                class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <!-- Description -->
          <div>
            <label for="policyDescription" class="block text-sm font-medium text-white mb-2">Description</label>
            <textarea 
              id="policyDescription"
              bind:value={editingPolicy.description}
              rows="3"
              class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white resize-none"
              placeholder="Describe the policy purpose and scope..."
            ></textarea>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-600">
          <button 
            onclick={cancelEdit}
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onclick={savePolicy}
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Save Policy
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}