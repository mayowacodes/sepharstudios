<!-- Admin Communications Center -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Message {
    id: string;
    contentId?: string;
    contentTitle?: string;
    creatorId: string;
    creatorName: string;
    adminId?: string;
    adminName?: string;
    subject: string;
    message: string;
    type: 'feedback' | 'approval' | 'rejection' | 'clarification' | 'general';
    status: 'sent' | 'read' | 'replied' | 'archived';
    isFromAdmin: boolean;
    createdAt: Date;
    attachments?: string[];
  }
  
  interface Template {
    id: string;
    name: string;
    subject: string;
    content: string;
    type: 'approval' | 'rejection' | 'feedback' | 'clarification';
  }
  
  let messages: Message[] = $state([]);
  let templates: Template[] = $state([]);
  let creatorOptions: { id: string; name: string }[] = $state([]);
  let selectedFilter = $state('all');
  let selectedType = $state('all');
  let showComposeModal = $state(false);
  let showTemplateModal = $state(false);
  let newMessage: Partial<Message> = $state({});
  let selectedTemplate: Template | null = null;
  let searchTerm = $state('');
  
  onMount(async () => {
    const [messagesRes, templatesRes, creatorsRes] = await Promise.all([
      fetch('/api/admin/communications'),
      fetch('/api/admin/communications/templates'),
      fetch('/api/admin/creators')
    ]);

    if (messagesRes.ok) {
      const data = await messagesRes.json();
      messages = data.map((row: any) => ({
        ...row,
        creatorName: row.creatorName || row.creatorEmail || 'Creator',
        createdAt: new Date(row.createdAt)
      }));
    }
    if (templatesRes.ok) templates = await templatesRes.json();
    if (creatorsRes.ok) {
      const creators = await creatorsRes.json();
      creatorOptions = creators.map((c: any) => ({ id: c.id, name: c.name }));
    }
  });
  
  const filteredMessages = $derived(
    messages.filter(message => {
      const statusMatch = selectedFilter === 'all' || message.status === selectedFilter;
      const typeMatch = selectedType === 'all' || message.type === selectedType;
      const searchMatch = searchTerm === '' ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.contentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      return statusMatch && typeMatch && searchMatch;
    })
  );
  
  function getTypeColor(type: string) {
    switch (type) {
      case 'approval': return 'bg-green-600 text-white';
      case 'rejection': return 'bg-red-600 text-white';
      case 'feedback': return 'bg-blue-600 text-white';
      case 'clarification': return 'bg-yellow-600 text-black';
      case 'general': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case 'sent': return 'text-blue-400';
      case 'read': return 'text-yellow-400';
      case 'replied': return 'text-green-400';
      case 'archived': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  }
  
  function composeMessage() {
    showComposeModal = true;
    newMessage = {
      subject: '',
      message: '',
      type: 'general',
      creatorId: '',
      creatorName: '',
      isFromAdmin: true
    };
  }
  
  function useTemplate(template: Template) {
    selectedTemplate = template;
    newMessage.subject = template.subject;
    newMessage.message = template.content;
    newMessage.type = template.type;
    showTemplateModal = false;
  }
  
  async function sendMessage() {
    if (!newMessage.subject || !newMessage.message) return;
    const creatorId = newMessage.creatorId || creatorOptions.find(c => c.name === newMessage.creatorName)?.id;
    if (!creatorId) {
      alert('Please select a valid creator.');
      return;
    }

    const res = await fetch('/api/admin/communications', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        creatorId,
        contentId: newMessage.contentId,
        subject: newMessage.subject,
        message: newMessage.message,
        type: newMessage.type
      })
    });

    if (res.ok) {
      const created = await res.json();
      messages = [
        {
          ...(newMessage as Message),
          id: created.id,
          status: 'sent',
          createdAt: new Date(),
          creatorId,
          creatorName: newMessage.creatorName || creatorOptions.find(c => c.id === creatorId)?.name || 'Creator',
          isFromAdmin: true
        },
        ...messages
      ];
      showComposeModal = false;
      newMessage = {};
    }
  }
  }
  
  function replyToMessage(messageId: string) {
    const originalMessage = messages.find(m => m.id === messageId);
    if (originalMessage) {
      newMessage = {
        subject: `Re: ${originalMessage.subject}`,
        message: '',
        type: originalMessage.type,
        creatorId: originalMessage.creatorId,
        creatorName: originalMessage.creatorName,
        contentId: originalMessage.contentId,
        contentTitle: originalMessage.contentTitle,
        isFromAdmin: true
      };
      showComposeModal = true;
    }
  }
  
  async function markAsRead(messageId: string) {
    await fetch('/api/admin/communications', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: messageId, status: 'read' })
    });
    messages = messages.map(message => 
      message.id === messageId ? { ...message, status: 'read' } : message
    );
  }
  
  async function archiveMessage(messageId: string) {
    await fetch('/api/admin/communications', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: messageId, status: 'archived' })
    });
    messages = messages.map(message => 
      message.id === messageId ? { ...message, status: 'archived' } : message
    );
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-4xl font-bold text-white mb-2">Communications Center</h1>
      <p class="text-xl text-gray-300">Manage creator communications and feedback</p>
    </div>
    
    <div class="flex space-x-3">
      <button 
        onclick={() => showTemplateModal = true}
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Message Templates
      </button>
      <button 
        onclick={composeMessage}
        class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Compose Message
      </button>
    </div>
  </div>
  
  <!-- Communication Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="bg-blue-600/20 rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-blue-400 mb-2">{messages.filter(m => m.status === 'sent').length}</div>
      <div class="text-sm text-blue-200">Sent Messages</div>
    </div>
    <div class="bg-yellow-600/20 rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-yellow-400 mb-2">{messages.filter(m => !m.isFromAdmin && m.status === 'sent').length}</div>
      <div class="text-sm text-yellow-200">Pending Responses</div>
    </div>
    <div class="bg-green-600/20 rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-green-400 mb-2">{messages.filter(m => m.type === 'approval').length}</div>
      <div class="text-sm text-green-200">Approvals Sent</div>
    </div>
    <div class="bg-red-600/20 rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-red-400 mb-2">{messages.filter(m => m.type === 'rejection').length}</div>
      <div class="text-sm text-red-200">Rejections Sent</div>
    </div>
  </div>
  
  <!-- Filters and Search -->
  <div class="bg-white/10 rounded-xl p-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label for="search" class="block text-sm font-medium text-white mb-2">Search</label>
        <input 
          id="search"
          type="text" 
          bind:value={searchTerm}
          placeholder="Search messages..."
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400"
        />
      </div>
      
      <div>
        <label for="status" class="block text-sm font-medium text-white mb-2">Status</label>
        <select 
          id="status"
          bind:value={selectedFilter}
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
        >
          <option value="all">All Status</option>
          <option value="sent">Sent</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      
      <div>
        <label for="type" class="block text-sm font-medium text-white mb-2">Type</label>
        <select 
          id="type"
          bind:value={selectedType}
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
        >
          <option value="all">All Types</option>
          <option value="approval">Approvals</option>
          <option value="rejection">Rejections</option>
          <option value="feedback">Feedback</option>
          <option value="clarification">Clarification</option>
          <option value="general">General</option>
        </select>
      </div>
    </div>
  </div>
  
  <!-- Messages List -->
  <div class="space-y-4">
    {#each filteredMessages as message}
      <div class="bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-colors">
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {message.isFromAdmin ? 'A' : message.creatorName.charAt(0)}
            </div>
            <div>
              <div class="font-medium text-white">{message.creatorName}</div>
              <div class="text-sm text-gray-400">
                {message.isFromAdmin ? 'Admin' : 'Creator'} • {message.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span class="px-3 py-1 text-xs rounded-full {getTypeColor(message.type)}">
              {message.type}
            </span>
            <span class="text-sm {getStatusColor(message.status)}">
              {message.status}
            </span>
          </div>
        </div>
        
        <div class="mb-3">
          <h3 class="text-lg font-medium text-white mb-1">{message.subject}</h3>
          {#if message.contentTitle}
            <div class="text-sm text-purple-300 mb-2">
              Re: {message.contentTitle}
            </div>
          {/if}
          <p class="text-gray-300 text-sm line-clamp-3">{message.message}</p>
        </div>
        
        {#if message.attachments && message.attachments.length > 0}
          <div class="mb-3">
            <div class="text-sm text-gray-400 mb-1">Attachments:</div>
            <div class="flex flex-wrap gap-2">
              {#each message.attachments as attachment}
                <span class="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                  📎 {attachment}
                </span>
              {/each}
            </div>
          </div>
        {/if}
        
        <div class="flex justify-between items-center pt-3 border-t border-gray-600">
          <div class="text-xs text-gray-400">
            {message.isFromAdmin ? `Sent by ${message.adminName || 'Admin'}` : 'From Creator'}
          </div>
          
          <div class="flex space-x-2">
            {#if !message.isFromAdmin && message.status === 'sent'}
              <button 
                onclick={() => markAsRead(message.id)}
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Mark Read
              </button>
            {/if}
            <button 
              onclick={() => replyToMessage(message.id)}
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Reply
            </button>
            <button 
              onclick={() => archiveMessage(message.id)}
              class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              Archive
            </button>
          </div>
        </div>
      </div>
    {/each}
    
    {#if filteredMessages.length === 0}
      <div class="text-center py-12">
        <div class="text-4xl mb-4">💬</div>
        <div class="text-xl text-white mb-2">No messages found</div>
        <div class="text-gray-400">Try adjusting your filters or search terms</div>
      </div>
    {/if}
  </div>
</div>

<!-- Compose Message Modal -->
{#if showComposeModal}
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">Compose Message</h2>
          <button onclick={() => showComposeModal = false} class="text-gray-400 hover:text-white" aria-label="Close compose message modal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="creator" class="block text-sm font-medium text-white mb-2">Creator</label>
              <input 
                id="creator"
                type="text" 
                list="creatorOptions"
                bind:value={newMessage.creatorName}
                placeholder="Enter creator name..."
                class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
              />
              <datalist id="creatorOptions">
                {#each creatorOptions as creator}
                  <option value={creator.name}></option>
                {/each}
              </datalist>
            </div>
            
            <div>
              <label for="messageType" class="block text-sm font-medium text-white mb-2">Message Type</label>
              <select 
                id="messageType"
                bind:value={newMessage.type}
                class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
              >
                <option value="general">General</option>
                <option value="approval">Approval</option>
                <option value="rejection">Rejection</option>
                <option value="feedback">Feedback</option>
                <option value="clarification">Clarification</option>
              </select>
            </div>
          </div>
          
          <div>
            <label for="subject" class="block text-sm font-medium text-white mb-2">Subject</label>
            <input 
              id="subject"
              type="text" 
              bind:value={newMessage.subject}
              placeholder="Enter subject..."
              class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white"
            />
          </div>
          
          <div>
            <label for="message" class="block text-sm font-medium text-white mb-2">Message</label>
            <textarea 
              id="message"
              bind:value={newMessage.message}
              rows="8"
              placeholder="Type your message..."
              class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white resize-none"
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-between items-center mt-6 pt-6 border-t border-gray-600">
          <button 
            onclick={() => showTemplateModal = true}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Use Template
          </button>
          
          <div class="flex space-x-3">
            <button 
              onclick={() => showComposeModal = false}
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button 
              onclick={sendMessage}
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Templates Modal -->
{#if showTemplateModal}
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">Message Templates</h2>
          <button onclick={() => showTemplateModal = false} class="text-gray-400 hover:text-white" aria-label="Close templates modal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each templates as template}
            <div class="bg-white/10 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-medium text-white">{template.name}</h3>
                <span class="px-2 py-1 text-xs rounded-full {getTypeColor(template.type)}">
                  {template.type}
                </span>
              </div>
              
              <div class="text-sm text-gray-300 mb-3">
                <strong>Subject:</strong> {template.subject}
              </div>
              
              <div class="text-sm text-gray-400 mb-4 line-clamp-4">
                {template.content}
              </div>
              
              <button 
                onclick={() => useTemplate(template)}
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
              >
                Use Template
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}