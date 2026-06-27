<!-- Admin Settings Panel -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Settings as SettingsIcon, RotateCcw, Save } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';

  // ── Types ──────────────────────────────────────────────────────────────────
  interface OpenRouterModel {
    id: string;
    name: string;
    description: string;
    contextLength: number;
    promptPrice: string;
    completionPrice: string;
    isFree: boolean;
    category: 'chat' | 'agent' | 'both';
    tags: string[];
  }

  interface AIConfig {
    chatModel: string;
    agentModel: string;
    ollamaChatModel: string;
    ollamaAgentModel: string;
    providerPreference: 'auto' | 'ollama' | 'openrouter';
  }

  interface PlatformSettings {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    registrationOpen: boolean;
    creatorApplicationsOpen: boolean;
    maxUploadSize: number;
    supportedFormats: string[];
    moderationMode: 'auto' | 'manual' | 'hybrid';
    minContentDuration: number;
    maxContentDuration: number;
    minVideoHeight: number;
  }
  
  interface PaymentSettings {
    stripePublishableKey: string;
    stripeWebhookSecret: string;
    paypalClientId: string;
    minimumPayout: number;
    payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
    platformFee: number;
    processingFee: number;
  }
  
  interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    adminAlerts: boolean;
    creatorAlerts: boolean;
    userAlerts: boolean;
    moderationAlerts: boolean;
  }
  
  interface SecuritySettings {
    twoFactorRequired: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    contentEncryption: boolean;
    ipWhitelist: string[];
    apiRateLimit: number;
  }
  
  let platformSettings = $state<PlatformSettings>({
    siteName: 'Sephar Studios',
    siteDescription: 'Faith-based content streaming platform',
    maintenanceMode: false,
    registrationOpen: true,
    creatorApplicationsOpen: true,
    maxUploadSize: 5000,
    supportedFormats: ['mp4', 'mov', 'avi', 'mkv'],
    moderationMode: 'hybrid',
    minContentDuration: 60,
    maxContentDuration: 7200,
    minVideoHeight: 1080
  });

  let paymentSettings = $state<PaymentSettings>({
    stripePublishableKey: '',
    stripeWebhookSecret: '',
    paypalClientId: '',
    minimumPayout: 25.00,
    payoutSchedule: 'monthly',
    platformFee: 15,
    processingFee: 2.9
  });

  let notificationSettings = $state<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    adminAlerts: true,
    creatorAlerts: true,
    userAlerts: true,
    moderationAlerts: true
  });

  let securitySettings = $state<SecuritySettings>({
    twoFactorRequired: false,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    contentEncryption: true,
    ipWhitelist: [],
    apiRateLimit: 1000
  });

  let loading = $state(false);
  let saveSuccess = $state(false);
  let activeTab = $state('platform');
  let newIp = $state('');
  let newFormat = $state('');

  // ── AI Models state ────────────────────────────────────────────────────────
  let aiConfig = $state<AIConfig>({
    chatModel: 'google/gemini-2.0-flash-001',
    agentModel: 'deepseek/deepseek-r1',
    ollamaChatModel: 'gemma4',
    ollamaAgentModel: 'hermes3',
    providerPreference: 'auto'
  });
  let allModels = $state<OpenRouterModel[]>([]);
  let modelsLoading = $state(false);
  let modelsWarning = $state('');
  let hasApiKey = $state(false);
  let aiSaving = $state(false);
  let aiSaveSuccess = $state(false);

  // Model search filters
  let chatSearch = $state('');
  let agentSearch = $state('');
  let showChatDropdown = $state(false);
  let showAgentDropdown = $state(false);

  // Test state
  let testingChat = $state(false);
  let testingAgent = $state(false);
  let chatTestResult = $state<{ response?: string; latencyMs?: number; error?: string } | null>(null);
  let agentTestResult = $state<{ response?: string; latencyMs?: number; error?: string } | null>(null);

  const tabs = [
    { id: 'platform', label: 'Platform', icon: '⚙️' },
    { id: 'payment', label: 'Payments', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'ai', label: 'AI Models', icon: '🤖' }
  ];
  
  onMount(() => {
    loadSettings();
  });

  // ── AI helpers ─────────────────────────────────────────────────────────────
  async function loadAIModels() {
    if (allModels.length > 0) return; // already loaded
    modelsLoading = true;
    modelsWarning = '';
    try {
      const res = await fetch('/api/admin/ai/models');
      if (res.ok) {
        const data = await res.json();
        allModels = data.models ?? [];
        hasApiKey = data.hasApiKey ?? false;
        modelsWarning = data.warning ?? '';
      }
    } finally {
      modelsLoading = false;
    }
  }

  async function loadAIConfig() {
    const res = await fetch('/api/admin/ai/config');
    if (res.ok) {
      const data = await res.json();
      aiConfig = data.config;
    }
  }

  async function saveAIConfig() {
    // Guard against deploying a half-configured AI surface — an empty
    // model id would break every Copilot + agent on the platform.
    if (!aiConfig.chatModel?.trim()) {
      alert('Chat model is required before saving AI config.');
      return;
    }
    if (!aiConfig.agentModel?.trim()) {
      alert('Agent model is required before saving AI config.');
      return;
    }
    aiSaving = true;
    try {
      const res = await fetch('/api/admin/ai/config', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(aiConfig)
      });
      if (res.ok) {
        aiSaveSuccess = true;
        setTimeout(() => (aiSaveSuccess = false), 3000);
      } else {
        const body = await res.json().catch(() => ({}));
        alert(`Failed to save AI config: ${body.error ?? `HTTP ${res.status}`}`);
      }
    } catch (err) {
      alert(`Failed to save AI config: ${err instanceof Error ? err.message : 'unknown'}`);
    } finally {
      aiSaving = false;
    }
  }

  async function testModel(type: 'chat' | 'agent') {
    const model = type === 'chat' ? aiConfig.chatModel : aiConfig.agentModel;
    if (!model) return;

    if (type === 'chat') { testingChat = true; chatTestResult = null; }
    else { testingAgent = true; agentTestResult = null; }

    try {
      const res = await fetch('/api/admin/ai/test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model, type })
      });
      const data = await res.json();
      if (type === 'chat') chatTestResult = data;
      else agentTestResult = data;
    } finally {
      if (type === 'chat') testingChat = false;
      else testingAgent = false;
    }
  }

  function filteredModels(search: string, category: 'chat' | 'agent') {
    const q = search.toLowerCase();
    return allModels.filter(m =>
      (m.category === category || m.category === 'both') &&
      (m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.tags.some(t => t.includes(q)))
    );
  }

  function selectModel(type: 'chat' | 'agent', id: string) {
    if (type === 'chat') {
      aiConfig.chatModel = id;
      showChatDropdown = false;
      chatSearch = '';
      chatTestResult = null;
    } else {
      aiConfig.agentModel = id;
      showAgentDropdown = false;
      agentSearch = '';
      agentTestResult = null;
    }
  }

  function modelName(id: string) {
    return allModels.find(m => m.id === id)?.name ?? id;
  }

  function tagColor(tag: string) {
    if (tag === 'free') return 'bg-green-600/30 text-green-300 border-green-600/40';
    if (tag === 'cheap') return 'bg-blue-600/30 text-blue-300 border-blue-600/40';
    if (tag === 'top-tier') return 'bg-purple-600/30 text-purple-300 border-purple-600/40';
    if (tag === 'fast') return 'bg-yellow-600/30 text-yellow-300 border-yellow-600/40';
    if (tag === 'reasoning') return 'bg-orange-600/30 text-orange-300 border-orange-600/40';
    if (tag === 'premium') return 'bg-red-600/30 text-red-300 border-red-600/40';
    return 'bg-gray-600/30 text-foreground/80 border-gray-600/40';
  }

  // Load AI config + models when tab is activated
  $effect(() => {
    if (activeTab === 'ai') {
      loadAIConfig();
      loadAIModels();
    }
  });
  
  async function loadSettings() {
    loading = true;
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        platformSettings = data.platform;
        paymentSettings = data.payment;
        notificationSettings = data.notifications;
        securitySettings = data.security;
      }
    } finally {
      loading = false;
    }
  }
  
  async function saveSettings() {
    loading = true;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          platform: platformSettings,
          payment: paymentSettings,
          notifications: notificationSettings,
          security: securitySettings
        })
      });
      if (res.ok) {
        saveSuccess = true;
        setTimeout(() => saveSuccess = false, 3000);
      }
    } finally {
      loading = false;
    }
  }
  
  function addSupportedFormat() {
    if (newFormat && !platformSettings.supportedFormats.includes(newFormat)) {
      platformSettings.supportedFormats = [...platformSettings.supportedFormats, newFormat];
      newFormat = '';
    }
  }
  
  function removeSupportedFormat(format: string) {
    platformSettings.supportedFormats = platformSettings.supportedFormats.filter(f => f !== format);
  }
  
  function addIpToWhitelist() {
    if (newIp && !securitySettings.ipWhitelist.includes(newIp)) {
      securitySettings.ipWhitelist = [...securitySettings.ipWhitelist, newIp];
      newIp = '';
    }
  }
  
  function removeIpFromWhitelist(ip: string) {
    securitySettings.ipWhitelist = securitySettings.ipWhitelist.filter(i => i !== ip);
  }
  
  async function testEmailSettings() {
    const res = await fetch('/api/admin/settings/test-email', { method: 'POST' });
    if (res.ok) alert('Test email queued successfully!');
  }
  
  function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      loadSettings();
    }
  }
</script>

<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">
  <PortalHero
    compact
    eyebrow="Configuration"
    title="Platform settings"
    subtitle="Configure platform behavior and integrations."
    icon={SettingsIcon}
  >
    {#snippet actions()}
      <PortalButton variant="secondary" size="sm" onclick={resetSettings}>
        <RotateCcw class="w-3.5 h-3.5" /> Reset
      </PortalButton>
      <PortalButton variant="primary" size="sm" onclick={saveSettings} disabled={loading}>
        <Save class="w-3.5 h-3.5" /> {loading ? 'Saving…' : 'Save'}
      </PortalButton>
    {/snippet}
  </PortalHero>

  <!-- Success Message -->
  {#if saveSuccess}
    <div class="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
      <div class="flex items-center space-x-2">
        <span class="text-green-400">✅</span>
        <span class="text-green-400">Settings saved successfully!</span>
      </div>
    </div>
  {/if}

  <!-- Tab Navigation -->
  <div class="surface-1 backdrop-blur-sm rounded-xl p-2">
    <nav class="flex space-x-2">
      {#each tabs as tab}
        <button
          onclick={() => activeTab = tab.id}
          class="flex items-center space-x-2 px-4 py-3 rounded-lg transition-all {activeTab === tab.id ? 'bg-red-600 text-foreground' : 'text-foreground/80 hover:text-white hover:surface-2'}"
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      {/each}
    </nav>
  </div>

  <!-- Platform Settings -->
  {#if activeTab === 'platform'}
    <div class="surface-1 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <h2 class="text-xl font-bold text-foreground">Platform Configuration</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Settings -->
        <div class="space-y-4">
          <div>
            <label for="siteName" class="block text-foreground/80 text-sm font-medium mb-2">Site Name</label>
            <input
              id="siteName"
              type="text"
              bind:value={platformSettings.siteName}
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
          
          <div>
            <label for="siteDescription" class="block text-foreground/80 text-sm font-medium mb-2">Site Description</label>
            <textarea
              id="siteDescription"
              bind:value={platformSettings.siteDescription}
              rows="3"
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"
            ></textarea>
          </div>
          
          <div>
            <label for="maxUploadSize" class="block text-foreground/80 text-sm font-medium mb-2">Max Upload Size (MB)</label>
            <input
              id="maxUploadSize"
              type="number"
              bind:value={platformSettings.maxUploadSize}
              min="100"
              max="10000"
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
        </div>

        <!-- Toggle Settings -->
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">Maintenance Mode</div>
              <div class="text-muted-foreground text-sm">Disable public access to the platform</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={platformSettings.maintenanceMode} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">User Registration</div>
              <div class="text-muted-foreground text-sm">Allow new users to register</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={platformSettings.registrationOpen} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">Creator Applications</div>
              <div class="text-muted-foreground text-sm">Allow new creator applications</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={platformSettings.creatorApplicationsOpen} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Content Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-foreground">Content Settings</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label for="moderationMode" class="block text-foreground/80 text-sm font-medium mb-2">Moderation Mode</label>
              <select
                id="moderationMode"
                bind:value={platformSettings.moderationMode}
                class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
              >
                <option value="auto">Automatic</option>
                <option value="manual">Manual Review</option>
                <option value="hybrid">Hybrid (Auto + Manual)</option>
              </select>
            </div>

            <div>
              <label for="minResolution" class="block text-foreground/80 text-sm font-medium mb-2">Minimum upload resolution</label>
              <select
                id="minResolution"
                bind:value={platformSettings.minVideoHeight}
                class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
              >
                <option value={360}>360p — SD (need-based override only)</option>
                <option value={720}>720p — HD (legacy, not recommended)</option>
                <option value={1080}>1080p — Full HD (recommended)</option>
                <option value={1440}>1440p — 2K</option>
                <option value={2160}>2160p — 4K (premium)</option>
              </select>
              <p class="text-xs text-muted-foreground mt-1">
                Creators are blocked from uploading below this threshold. Choose
                360p only for short-term need-based overrides — remember to
                raise it back to 1080p afterwards. Admins always bypass this gate.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="minDuration" class="block text-foreground/80 text-sm font-medium mb-2">Min Duration (seconds)</label>
              <input
                id="minDuration"
                type="number"
                bind:value={platformSettings.minContentDuration}
                min="30"
                class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
              >
            </div>
            <div>
              <label for="maxDuration" class="block text-foreground/80 text-sm font-medium mb-2">Max Duration (seconds)</label>
              <input
                id="maxDuration"
                type="number"
                bind:value={platformSettings.maxContentDuration}
                min="300"
                class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
              >
            </div>
          </div>
        </div>

        <!-- Supported Formats -->
        <div>
          <label for="newFormat" class="block text-foreground/80 text-sm font-medium mb-2">Supported Video Formats</label>
          <div class="flex flex-wrap gap-2 mb-3">
            {#each platformSettings.supportedFormats as format}
              <span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <span>.{format}</span>
                <button onclick={() => removeSupportedFormat(format)} class="text-red-200 hover:text-foreground">×</button>
              </span>
            {/each}
          </div>
          <div class="flex space-x-2">
            <input
              id="newFormat"
              type="text"
              bind:value={newFormat}
              placeholder="Add format (e.g., webm)"
              class="flex-1 surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
            <button
              onclick={addSupportedFormat}
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Payment Settings -->
  {#if activeTab === 'payment'}
    <div class="surface-1 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <h2 class="text-xl font-bold text-foreground">Payment Configuration</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Stripe Settings -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">Stripe Integration</h3>
          <div>
            <label for="stripePublishableKey" class="block text-foreground/80 text-sm font-medium mb-2">Publishable Key</label>
            <input
              id="stripePublishableKey"
              type="text"
              bind:value={paymentSettings.stripePublishableKey}
              placeholder="pk_live_..."
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
          <div>
            <label for="stripeWebhookSecret" class="block text-foreground/80 text-sm font-medium mb-2">Webhook Secret</label>
            <input
              id="stripeWebhookSecret"
              type="password"
              bind:value={paymentSettings.stripeWebhookSecret}
              placeholder="whsec_..."
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
        </div>

        <!-- PayPal Settings -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">PayPal Integration</h3>
          <div>
            <label for="paypalClientId" class="block text-foreground/80 text-sm font-medium mb-2">Client ID</label>
            <input
              id="paypalClientId"
              type="text"
              bind:value={paymentSettings.paypalClientId}
              placeholder="PayPal Client ID"
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
        </div>
      </div>

      <!-- Payout Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-foreground">Payout Configuration</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label for="minimumPayout" class="block text-foreground/80 text-sm font-medium mb-2">Minimum Payout ($)</label>
            <input
              id="minimumPayout"
              type="number"
              bind:value={paymentSettings.minimumPayout}
              min="10"
              step="5"
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
            >
          </div>
          
          <div>
            <label for="payoutSchedule" class="block text-foreground/80 text-sm font-medium mb-2">Payout Schedule</label>
            <select
              id="payoutSchedule"
              bind:value={paymentSettings.payoutSchedule}
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label for="platformFee" class="block text-foreground/80 text-sm font-medium mb-2">Platform Fee (%)</label>
            <input
              id="platformFee"
              type="number"
              bind:value={paymentSettings.platformFee}
              min="5"
              max="30"
              step="0.5"
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
            >
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Notification Settings -->
  {#if activeTab === 'notifications'}
    <div class="surface-1 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-foreground">Notification Settings</h2>
        <button 
          onclick={testEmailSettings}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          📧 Test Email
        </button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- General Notifications -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">General Notifications</h3>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">Email Notifications</div>
              <div class="text-muted-foreground text-sm">Send notifications via email</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.emailNotifications} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">Push Notifications</div>
              <div class="text-muted-foreground text-sm">Send browser push notifications</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.pushNotifications} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">SMS Notifications</div>
              <div class="text-muted-foreground text-sm">Send notifications via SMS</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.smsNotifications} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        <!-- Alert Types -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">Alert Types</h3>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">Admin Alerts</div>
              <div class="text-muted-foreground text-sm">System and security alerts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.adminAlerts} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">Creator Alerts</div>
              <div class="text-muted-foreground text-sm">Creator activity and content alerts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.creatorAlerts} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">User Alerts</div>
              <div class="text-muted-foreground text-sm">User activity and engagement alerts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.userAlerts} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">Moderation Alerts</div>
              <div class="text-muted-foreground text-sm">Content moderation alerts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.moderationAlerts} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- AI Models Settings -->
  {#if activeTab === 'ai'}
    <div class="surface-1 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-foreground">AI Model Configuration</h2>
          <p class="text-muted-foreground text-sm mt-1">
            Select which models power each AI feature. API key stays in Dokploy — only model selection is stored here.
          </p>
        </div>
        <button
          onclick={saveAIConfig}
          disabled={aiSaving}
          class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {aiSaving ? '⏳ Saving...' : '💾 Save AI Config'}
        </button>
      </div>

      {#if aiSaveSuccess}
        <div class="bg-green-900/20 border border-green-500/30 rounded-xl p-3 flex items-center gap-2">
          <span class="text-green-400">✅</span>
          <span class="text-green-400 text-sm">AI model config saved! Changes take effect within 60 seconds.</span>
        </div>
      {/if}

      {#if !hasApiKey}
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
          <span class="text-yellow-400 text-lg">⚠️</span>
          <div>
            <p class="text-yellow-300 font-medium text-sm">OpenRouter API key not configured</p>
            <p class="text-yellow-400/70 text-xs mt-1">Add <code class="surface-2 px-1 rounded">OPENROUTER_API_KEY</code> to your Dokploy environment variables to enable cloud AI models. The list below shows a curated selection.</p>
          </div>
        </div>
      {/if}

      {#if modelsWarning}
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 flex items-center gap-2">
          <span class="text-yellow-400">ℹ️</span>
          <span class="text-yellow-400 text-sm">{modelsWarning}</span>
        </div>
      {/if}

      <!-- Provider Preference -->
      <div class="surface-1 rounded-xl p-5 space-y-3">
        <h3 class="text-foreground font-semibold">Provider Preference</h3>
        <p class="text-muted-foreground text-sm">Controls whether to use Ollama (local) or OpenRouter (cloud) first.</p>
        <div class="flex gap-3 flex-wrap">
          {#each [
            { value: 'auto', label: '🔄 Auto (Ollama → OpenRouter fallback)', desc: 'Try local first, cloud fallback' },
            { value: 'openrouter', label: '☁️ OpenRouter only', desc: 'Always use cloud models' },
            { value: 'ollama', label: '💻 Ollama only', desc: 'Local inference only' }
          ] as opt}
            <button
              onclick={() => aiConfig.providerPreference = opt.value as AIConfig['providerPreference']}
              class="flex-1 min-w-45 text-left p-4 rounded-lg border transition-all {aiConfig.providerPreference === opt.value ? 'bg-purple-600/20 border-purple-500/60 text-foreground' : 'surface-1 border-border/40 text-white/80 hover:border-border'}"
            >
              <div class="font-medium text-sm">{opt.label}</div>
              <div class="text-xs mt-1 opacity-60">{opt.desc}</div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Chat Model (Copilot) -->
      <div class="surface-1 rounded-xl p-5 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-foreground font-semibold flex items-center gap-2">💬 Chat Model <span class="text-xs bg-purple-600/30 text-purple-300 border border-purple-600/40 px-2 py-0.5 rounded-full">Copilot · Scene Insights</span></h3>
            <p class="text-muted-foreground text-sm mt-1">Used for: AI Watch Companion, scene faith insights, portfolio narration.</p>
          </div>
          <button
            onclick={() => testModel('chat')}
            disabled={testingChat || !aiConfig.chatModel}
            class="text-sm bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg transition-all disabled:opacity-40 whitespace-nowrap"
          >
            {testingChat ? '⏳ Testing...' : '▶ Test Model'}
          </button>
        </div>

        <!-- Current selection display -->
        <div class="flex items-center gap-3 p-3 surface-1 rounded-lg border border-border/40">
          <div class="w-2 h-2 rounded-full bg-purple-400 shrink-0"></div>
          <div class="flex-1 min-w-0">
            <p class="text-foreground text-sm font-medium truncate">{modelName(aiConfig.chatModel)}</p>
            <p class="text-muted-foreground text-xs truncate">{aiConfig.chatModel}</p>
          </div>
          <button
            onclick={() => { showChatDropdown = !showChatDropdown; if (showChatDropdown) showAgentDropdown = false; }}
            class="text-xs surface-2 hover:surface-3 text-foreground/80 px-3 py-1.5 rounded-lg transition-all"
          >
            {showChatDropdown ? 'Close' : 'Change'}
          </button>
        </div>

        <!-- Chat Model Dropdown -->
        {#if showChatDropdown}
          <div class="border border-border/40 rounded-xl overflow-hidden">
            <div class="p-3 border-b border-border/40 surface-1">
              <input
                type="text"
                bind:value={chatSearch}
                placeholder="Search models (e.g. gemini, free, fast)…"
                class="w-full surface-2 border border-border/40 rounded-lg px-3 py-2 text-foreground text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div class="max-h-72 overflow-y-auto">
              {#if modelsLoading}
                <div class="p-4 text-center text-muted-foreground text-sm">Loading models…</div>
              {:else}
                {#each filteredModels(chatSearch, 'chat') as m (m.id)}
                  <button
                    onclick={() => selectModel('chat', m.id)}
                    class="w-full text-left px-4 py-3 hover:surface-1 transition-colors border-b border-white/5 last:border-0 {aiConfig.chatModel === m.id ? 'bg-purple-600/10' : ''}"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-foreground text-sm font-medium">{m.name}</span>
                          {#if aiConfig.chatModel === m.id}
                            <span class="text-xs text-purple-400">✓ Active</span>
                          {/if}
                        </div>
                        <p class="text-muted-foreground text-xs mt-0.5 truncate">{m.id}</p>
                        {#if m.description}
                          <p class="text-muted-foreground text-xs mt-1 line-clamp-2">{m.description}</p>
                        {/if}
                        <div class="flex gap-1 flex-wrap mt-1.5">
                          {#each m.tags as tag}
                            <span class="text-xs px-1.5 py-0.5 rounded border {tagColor(tag)}">{tag}</span>
                          {/each}
                        </div>
                      </div>
                      <div class="text-right shrink-0">
                        <div class="text-xs text-foreground/80">{m.promptPrice}</div>
                        <div class="text-muted-foreground text-xs">per 1M in</div>
                        <div class="text-xs text-foreground/80 mt-1">{(m.contextLength / 1000).toFixed(0)}k ctx</div>
                      </div>
                    </div>
                  </button>
                {:else}
                  <div class="p-4 text-center text-muted-foreground text-sm">No chat models match your search</div>
                {/each}
              {/if}
            </div>
          </div>
        {/if}

        <!-- Chat test result -->
        {#if chatTestResult}
          <div class="rounded-xl border p-4 {chatTestResult.error ? 'bg-red-900/20 border-red-500/30' : 'bg-green-900/10 border-green-500/20'}">
            <div class="flex items-center gap-2 mb-2">
              {#if chatTestResult.error}
                <span class="text-red-400">❌</span>
                <span class="text-red-400 text-sm font-medium">Test failed</span>
              {:else}
                <span class="text-green-400">✅</span>
                <span class="text-green-400 text-sm font-medium">Test passed — {chatTestResult.latencyMs}ms</span>
              {/if}
            </div>
            {#if chatTestResult.error}
              <p class="text-red-300 text-xs">{chatTestResult.error}</p>
            {:else}
              <p class="text-foreground/80 text-xs italic">"{chatTestResult.response}"</p>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Agent Model (Structured) -->
      <div class="surface-1 rounded-xl p-5 space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-foreground font-semibold flex items-center gap-2">🤖 Agent Model <span class="text-xs bg-orange-600/30 text-orange-300 border border-orange-600/40 px-2 py-0.5 rounded-full">Tagging · Moderation · Scoring</span></h3>
            <p class="text-muted-foreground text-sm mt-1">Used for: Content tagging, moderation, token scoring, NFT metadata, creator insights.</p>
          </div>
          <button
            onclick={() => testModel('agent')}
            disabled={testingAgent || !aiConfig.agentModel}
            class="text-sm bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-lg transition-all disabled:opacity-40 whitespace-nowrap"
          >
            {testingAgent ? '⏳ Testing...' : '▶ Test Model'}
          </button>
        </div>

        <!-- Current selection display -->
        <div class="flex items-center gap-3 p-3 surface-1 rounded-lg border border-border/40">
          <div class="w-2 h-2 rounded-full bg-orange-400 shrink-0"></div>
          <div class="flex-1 min-w-0">
            <p class="text-foreground text-sm font-medium truncate">{modelName(aiConfig.agentModel)}</p>
            <p class="text-muted-foreground text-xs truncate">{aiConfig.agentModel}</p>
          </div>
          <button
            onclick={() => { showAgentDropdown = !showAgentDropdown; if (showAgentDropdown) showChatDropdown = false; }}
            class="text-xs surface-2 hover:surface-3 text-foreground/80 px-3 py-1.5 rounded-lg transition-all"
          >
            {showAgentDropdown ? 'Close' : 'Change'}
          </button>
        </div>

        <!-- Agent Model Dropdown -->
        {#if showAgentDropdown}
          <div class="border border-border/40 rounded-xl overflow-hidden">
            <div class="p-3 border-b border-border/40 surface-1">
              <input
                type="text"
                bind:value={agentSearch}
                placeholder="Search models (e.g. deepseek, reasoning, free)…"
                class="w-full surface-2 border border-border/40 rounded-lg px-3 py-2 text-foreground text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div class="max-h-72 overflow-y-auto">
              {#if modelsLoading}
                <div class="p-4 text-center text-muted-foreground text-sm">Loading models…</div>
              {:else}
                {#each filteredModels(agentSearch, 'agent') as m (m.id)}
                  <button
                    onclick={() => selectModel('agent', m.id)}
                    class="w-full text-left px-4 py-3 hover:surface-1 transition-colors border-b border-white/5 last:border-0 {aiConfig.agentModel === m.id ? 'bg-orange-600/10' : ''}"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-foreground text-sm font-medium">{m.name}</span>
                          {#if aiConfig.agentModel === m.id}
                            <span class="text-xs text-orange-400">✓ Active</span>
                          {/if}
                        </div>
                        <p class="text-muted-foreground text-xs mt-0.5 truncate">{m.id}</p>
                        {#if m.description}
                          <p class="text-muted-foreground text-xs mt-1 line-clamp-2">{m.description}</p>
                        {/if}
                        <div class="flex gap-1 flex-wrap mt-1.5">
                          {#each m.tags as tag}
                            <span class="text-xs px-1.5 py-0.5 rounded border {tagColor(tag)}">{tag}</span>
                          {/each}
                        </div>
                      </div>
                      <div class="text-right shrink-0">
                        <div class="text-xs text-foreground/80">{m.promptPrice}</div>
                        <div class="text-muted-foreground text-xs">per 1M in</div>
                        <div class="text-xs text-foreground/80 mt-1">{(m.contextLength / 1000).toFixed(0)}k ctx</div>
                      </div>
                    </div>
                  </button>
                {:else}
                  <div class="p-4 text-center text-muted-foreground text-sm">No agent models match your search</div>
                {/each}
              {/if}
            </div>
          </div>
        {/if}

        <!-- Agent test result -->
        {#if agentTestResult}
          <div class="rounded-xl border p-4 {agentTestResult.error ? 'bg-red-900/20 border-red-500/30' : 'bg-green-900/10 border-green-500/20'}">
            <div class="flex items-center gap-2 mb-2">
              {#if agentTestResult.error}
                <span class="text-red-400">❌</span>
                <span class="text-red-400 text-sm font-medium">Test failed</span>
              {:else}
                <span class="text-green-400">✅</span>
                <span class="text-green-400 text-sm font-medium">Test passed — {agentTestResult.latencyMs}ms</span>
              {/if}
            </div>
            {#if agentTestResult.error}
              <p class="text-red-300 text-xs">{agentTestResult.error}</p>
            {:else}
              <p class="text-foreground/80 text-xs font-mono">{agentTestResult.response}</p>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Ollama Local Model Names -->
      {#if aiConfig.providerPreference !== 'openrouter'}
        <div class="surface-1 rounded-xl p-5 space-y-4">
          <h3 class="text-foreground font-semibold">💻 Local Ollama Model Names</h3>
          <p class="text-muted-foreground text-sm">Override which pulled Ollama models to use. Must match the model names you have pulled (<code class="surface-2 px-1 rounded text-xs">ollama list</code>).</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="ollama-chat-model" class="block text-foreground/80 text-sm font-medium mb-2">Chat model (e.g. gemma4)</label>
              <input
                id="ollama-chat-model"
                type="text"
                bind:value={aiConfig.ollamaChatModel}
                placeholder="gemma4"
                class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label for="ollama-agent-model" class="block text-foreground/80 text-sm font-medium mb-2">Agent model (e.g. hermes3)</label>
              <input
                id="ollama-agent-model"
                type="text"
                bind:value={aiConfig.ollamaAgentModel}
                placeholder="hermes3"
                class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      {/if}

      <!-- Info box -->
      <div class="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <span class="text-blue-400 text-lg mt-0.5">ℹ️</span>
        <div class="text-blue-300/80 text-xs space-y-1">
          <p><strong class="text-blue-300">API key security:</strong> Your <code class="surface-2 px-1 rounded">OPENROUTER_API_KEY</code> is stored securely in Dokploy environment variables — never in the database.</p>
          <p><strong class="text-blue-300">Live changes:</strong> Model selections are stored in the database. Changes take effect within 60 seconds without redeployment.</p>
          <p><strong class="text-blue-300">Free models:</strong> Models marked "Free" have zero token cost on OpenRouter but may have rate limits.</p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Security Settings -->
  {#if activeTab === 'security'}
    <div class="surface-1 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <h2 class="text-xl font-bold text-foreground">Security Configuration</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Authentication Settings -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">Authentication</h3>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">Two-Factor Authentication</div>
              <div class="text-muted-foreground text-sm">Require 2FA for all admin accounts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={securitySettings.twoFactorRequired} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 surface-1 rounded-lg">
            <div>
              <div class="text-foreground font-medium">Content Encryption</div>
              <div class="text-muted-foreground text-sm">Encrypt stored video content</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={securitySettings.contentEncryption} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="sessionTimeout" class="block text-foreground/80 text-sm font-medium mb-2">Session Timeout (seconds)</label>
              <input
                id="sessionTimeout"
                type="number"
                bind:value={securitySettings.sessionTimeout}
                min="300"
                max="86400"
                class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
              >
            </div>
            <div>
              <label for="maxLoginAttempts" class="block text-foreground/80 text-sm font-medium mb-2">Max Login Attempts</label>
              <input
                id="maxLoginAttempts"
                type="number"
                bind:value={securitySettings.maxLoginAttempts}
                min="3"
                max="10"
                class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
              >
            </div>
          </div>
        </div>

        <!-- API and Rate Limiting -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-foreground">API Security</h3>
          
          <div>
            <label for="apiRateLimit" class="block text-foreground/80 text-sm font-medium mb-2">API Rate Limit (requests/hour)</label>
            <input
              id="apiRateLimit"
              type="number"
              bind:value={securitySettings.apiRateLimit}
              min="100"
              max="10000"
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
            >
          </div>
          
          <div>
            <label for="passwordMinLength" class="block text-foreground/80 text-sm font-medium mb-2">Password Min Length</label>
            <input
              id="passwordMinLength"
              type="number"
              bind:value={securitySettings.passwordMinLength}
              min="8"
              max="20"
              class="w-full surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-red-500"
            >
          </div>
        </div>
      </div>

      <!-- IP Whitelist -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-foreground">IP Whitelist</h3>
        
        <div class="flex flex-wrap gap-2 mb-3">
          {#each securitySettings.ipWhitelist as ip}
            <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
              <span>{ip}</span>
              <button onclick={() => removeIpFromWhitelist(ip)} class="text-blue-200 hover:text-foreground">×</button>
            </span>
          {/each}
          {#if securitySettings.ipWhitelist.length === 0}
            <span class="text-muted-foreground text-sm">No IP restrictions configured</span>
          {/if}
        </div>
        
        <div class="flex space-x-2">
          <input
            id="newIp"
            type="text"
            bind:value={newIp}
            placeholder="Add IP address (e.g., 192.168.1.1)"
            class="flex-1 surface-2 border border-gray-600 rounded-lg px-4 py-2 text-foreground placeholder-gray-400 focus:outline-none focus:border-red-500"
          >
          <button
            onclick={addIpToWhitelist}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add IP
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>