<!-- Content Approval Workflow Management -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  interface WorkflowRule {
    id: string;
    name: string;
    description: string;
    conditions: WorkflowCondition[];
    actions: WorkflowAction[];
    isActive: boolean;
    priority: number;
    createdAt: Date;
  }
  
  interface WorkflowCondition {
    field: string;
    operator: string;
    value: string;
  }
  
  interface WorkflowAction {
    type: 'status_change' | 'assign_reviewer' | 'send_notification' | 'escalate';
    target: string;
    value: string;
  }
  
  interface WorkflowStats {
    totalProcessed: number;
    avgProcessingTime: number;
    approvalRate: number;
    pendingReviews: number;
  }
  
  let workflowRules: WorkflowRule[] = [];
  let workflowStats: WorkflowStats = {
    totalProcessed: 0,
    avgProcessingTime: 0,
    approvalRate: 0,
    pendingReviews: 0
  };
  let showCreateModal = false;
  let editingRule: WorkflowRule | null = null;
  
  // Mock data
  onMount(() => {
    workflowRules = [
      {
        id: '1',
        name: 'Auto-assign Theological Reviews',
        description: 'Automatically assigns theological reviewers to documentary and sermon content',
        conditions: [
          { field: 'contentType', operator: 'in', value: 'documentary,sermon' },
          { field: 'status', operator: 'equals', value: 'submitted' }
        ],
        actions: [
          { type: 'assign_reviewer', target: 'theological_reviewer', value: 'auto' },
          { type: 'status_change', target: 'status', value: 'theological_review' },
          { type: 'send_notification', target: 'creator', value: 'review_started' }
        ],
        isActive: true,
        priority: 1,
        createdAt: new Date('2024-08-01')
      },
      {
        id: '2',
        name: 'Family Safety for Kids Content',
        description: 'Routes all kids content through family safety review first',
        conditions: [
          { field: 'ageRating', operator: 'in', value: 'G,PG,7+' },
          { field: 'contentType', operator: 'equals', value: 'kids_content' }
        ],
        actions: [
          { type: 'assign_reviewer', target: 'family_safety_reviewer', value: 'priority' },
          { type: 'status_change', target: 'status', value: 'family_safety_review' }
        ],
        isActive: true,
        priority: 2,
        createdAt: new Date('2024-08-05')
      },
      {
        id: '3',
        name: 'Technical QA for HD Content',
        description: 'Automatic technical review for high-definition uploads',
        conditions: [
          { field: 'videoQuality', operator: 'greater_than', value: '720p' },
          { field: 'fileSize', operator: 'greater_than', value: '1GB' }
        ],
        actions: [
          { type: 'assign_reviewer', target: 'technical_reviewer', value: 'auto' },
          { type: 'status_change', target: 'status', value: 'technical_qa' }
        ],
        isActive: true,
        priority: 3,
        createdAt: new Date('2024-08-10')
      },
      {
        id: '4',
        name: 'Escalation for Rejected Content',
        description: 'Escalates content that has been rejected twice to senior reviewers',
        conditions: [
          { field: 'rejectionCount', operator: 'greater_than', value: '1' },
          { field: 'status', operator: 'equals', value: 'rejected' }
        ],
        actions: [
          { type: 'escalate', target: 'senior_reviewer', value: 'urgent' },
          { type: 'send_notification', target: 'admin', value: 'escalation_notice' }
        ],
        isActive: true,
        priority: 0,
        createdAt: new Date('2024-08-15')
      }
    ];
    
    // Mock workflow stats
    workflowStats = {
      totalProcessed: 234,
      avgProcessingTime: 4.2,
      approvalRate: 87,
      pendingReviews: 12
    };
  });
  
  function createNewRule() {
    showCreateModal = true;
    editingRule = {
      id: Date.now().toString(),
      name: '',
      description: '',
      conditions: [{ field: '', operator: '', value: '' }],
      actions: [{ type: 'status_change', target: '', value: '' }],
      isActive: true,
      priority: 5,
      createdAt: new Date()
    };
  }
  
  function editRule(rule: WorkflowRule) {
    editingRule = JSON.parse(JSON.stringify(rule));
    showCreateModal = true;
  }
  
  function saveRule() {
    if (editingRule) {
      const existingIndex = workflowRules.findIndex(r => r.id === editingRule!.id);
      if (existingIndex >= 0) {
        workflowRules[existingIndex] = editingRule!;
      } else {
        workflowRules = [...workflowRules, editingRule!];
      }
      workflowRules = workflowRules.sort((a, b) => a.priority - b.priority);
      editingRule = null;
      showCreateModal = false;
    }
  }
  
  function cancelEdit() {
    editingRule = null;
    showCreateModal = false;
  }
  
  function toggleRuleStatus(ruleId: string) {
    workflowRules = workflowRules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    );
  }
  
  function addCondition() {
    if (editingRule) {
      editingRule.conditions = [...editingRule.conditions, { field: '', operator: '', value: '' }];
    }
  }
  
  function removeCondition(index: number) {
    if (editingRule) {
      editingRule.conditions = editingRule.conditions.filter((_, i) => i !== index);
    }
  }
  
  function addAction() {
    if (editingRule) {
      editingRule.actions = [...editingRule.actions, { type: 'status_change', target: '', value: '' }];
    }
  }
  
  function removeAction(index: number) {
    if (editingRule) {
      editingRule.actions = editingRule.actions.filter((_, i) => i !== index);
    }
  }
  
  const fieldOptions = [
    'contentType', 'ageRating', 'status', 'duration', 'videoQuality', 
    'fileSize', 'rejectionCount', 'creatorType', 'ministryVerified'
  ];
  
  const operatorOptions = [
    'equals', 'not_equals', 'in', 'not_in', 'greater_than', 'less_than', 'contains'
  ];
  
  const actionTypes = [
    'status_change', 'assign_reviewer', 'send_notification', 'escalate'
  ];
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-4xl font-bold text-white mb-2">Workflow Management</h1>
      <p class="text-xl text-gray-300">Automate content review and approval processes</p>
    </div>
    
    <button 
      onclick={createNewRule}
      class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
    >
      Create Workflow Rule
    </button>
  </div>
  
  <!-- Workflow Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="bg-blue-600/20 rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-blue-400 mb-2">{workflowStats.totalProcessed}</div>
      <div class="text-sm text-blue-200">Total Processed</div>
    </div>
    <div class="bg-green-600/20 rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-green-400 mb-2">{workflowStats.avgProcessingTime}d</div>
      <div class="text-sm text-green-200">Avg. Processing Time</div>
    </div>
    <div class="bg-purple-600/20 rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-purple-400 mb-2">{workflowStats.approvalRate}%</div>
      <div class="text-sm text-purple-200">Approval Rate</div>
    </div>
    <div class="bg-yellow-600/20 rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-yellow-400 mb-2">{workflowStats.pendingReviews}</div>
      <div class="text-sm text-yellow-200">Pending Reviews</div>
    </div>
  </div>
  
  <!-- Workflow Rules -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-white">Active Workflow Rules</h2>
    
    {#each workflowRules as rule}
      <div class="bg-white/10 rounded-xl p-6 border-l-4 {rule.isActive ? 'border-green-600' : 'border-gray-600'}">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-xl font-bold text-white">{rule.name}</h3>
              <span class="bg-gray-600 text-white px-2 py-1 text-xs rounded-full">
                Priority {rule.priority}
              </span>
              <button 
                onclick={() => toggleRuleStatus(rule.id)}
                class="px-3 py-1 text-xs rounded-full transition-colors {rule.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}"
              >
                {rule.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
            <p class="text-gray-300 text-sm mb-4">{rule.description}</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              onclick={() => editRule(rule)}
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Edit
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
              Delete
            </button>
          </div>
        </div>
        
        <!-- Conditions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-white mb-3 flex items-center">
              <span class="mr-2">🔍</span> Conditions
            </h4>
            <div class="space-y-2">
              {#each rule.conditions as condition}
                <div class="bg-white/5 p-3 rounded text-sm">
                  <span class="text-blue-300">{condition.field}</span>
                  <span class="text-gray-400 mx-2">{condition.operator}</span>
                  <span class="text-green-300">"{condition.value}"</span>
                </div>
              {/each}
            </div>
          </div>
          
          <!-- Actions -->
          <div>
            <h4 class="font-medium text-white mb-3 flex items-center">
              <span class="mr-2">⚡</span> Actions
            </h4>
            <div class="space-y-2">
              {#each rule.actions as action}
                <div class="bg-white/5 p-3 rounded text-sm">
                  <span class="text-purple-300">{action.type.replace('_', ' ')}</span>
                  <span class="text-gray-400 mx-2">→</span>
                  <span class="text-yellow-300">{action.target}: {action.value}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>
        
        <div class="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-700">
          Created {rule.createdAt.toLocaleDateString()}
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Create/Edit Rule Modal -->
{#if editingRule}
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">
            {editingRule.id.length > 10 ? 'Edit Workflow Rule' : 'Create Workflow Rule'}
          </h2>
          <button onclick={cancelEdit} class="text-gray-400 hover:text-white" aria-label="Close workflow rule modal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="ruleName" class="block text-sm font-medium text-white mb-2">Rule Name</label>
              <input 
                id="ruleName"
                type="text" 
                bind:value={editingRule.name}
                class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
                placeholder="Enter rule name..."
              />
            </div>
            
            <div>
              <label for="rulePriority" class="block text-sm font-medium text-white mb-2">Priority (0 = Highest)</label>
              <input 
                id="rulePriority"
                type="number" 
                bind:value={editingRule.priority}
                min="0"
                max="10"
                class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
          
          <div>
            <label for="ruleDescription" class="block text-sm font-medium text-white mb-2">Description</label>
            <textarea 
              id="ruleDescription"
              bind:value={editingRule.description}
              rows="2"
              class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white resize-none"
              placeholder="Describe what this rule does..."
            ></textarea>
          </div>
          
          <!-- Conditions -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-white">Conditions</h3>
              <button 
                onclick={addCondition}
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Add Condition
              </button>
            </div>
            
            <div class="space-y-3">
              {#each editingRule.conditions as condition, i}
                <div class="bg-white/5 p-4 rounded-lg flex items-center space-x-3">
                  <select 
                    bind:value={condition.field}
                    class="px-3 py-2 bg-white/10 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="">Select Field</option>
                    {#each fieldOptions as field}
                      <option value={field}>{field}</option>
                    {/each}
                  </select>
                  
                  <select 
                    bind:value={condition.operator}
                    class="px-3 py-2 bg-white/10 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="">Operator</option>
                    {#each operatorOptions as operator}
                      <option value={operator}>{operator.replace('_', ' ')}</option>
                    {/each}
                  </select>
                  
                  <input 
                    type="text" 
                    bind:value={condition.value}
                    placeholder="Value"
                    class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded text-white text-sm"
                  />
                  
                  <button 
                    onclick={() => removeCondition(i)}
                    class="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              {/each}
            </div>
          </div>
          
          <!-- Actions -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-white">Actions</h3>
              <button 
                onclick={addAction}
                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                Add Action
              </button>
            </div>
            
            <div class="space-y-3">
              {#each editingRule.actions as action, i}
                <div class="bg-white/5 p-4 rounded-lg flex items-center space-x-3">
                  <select 
                    bind:value={action.type}
                    class="px-3 py-2 bg-white/10 border border-gray-600 rounded text-white text-sm"
                  >
                    {#each actionTypes as actionType}
                      <option value={actionType}>{actionType.replace('_', ' ')}</option>
                    {/each}
                  </select>
                  
                  <input 
                    type="text" 
                    bind:value={action.target}
                    placeholder="Target"
                    class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded text-white text-sm"
                  />
                  
                  <input 
                    type="text" 
                    bind:value={action.value}
                    placeholder="Value"
                    class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded text-white text-sm"
                  />
                  
                  <button 
                    onclick={() => removeAction(i)}
                    class="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              {/each}
            </div>
          </div>
        </div>
        
        <!-- Modal Actions -->
        <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-600">
          <button 
            onclick={cancelEdit}
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onclick={saveRule}
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Save Rule
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}