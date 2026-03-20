<!-- Admin Settings Panel -->
<script lang="ts">
  import { onMount } from 'svelte';
  
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
  
  let platformSettings: PlatformSettings = {
    siteName: 'Sephar Studios',
    siteDescription: 'Faith-based content streaming platform',
    maintenanceMode: false,
    registrationOpen: true,
    creatorApplicationsOpen: true,
    maxUploadSize: 5000,
    supportedFormats: ['mp4', 'mov', 'avi', 'mkv'],
    moderationMode: 'hybrid',
    minContentDuration: 60,
    maxContentDuration: 7200
  };
  
  let paymentSettings: PaymentSettings = {
    stripePublishableKey: '',
    stripeWebhookSecret: '',
    paypalClientId: '',
    minimumPayout: 25.00,
    payoutSchedule: 'monthly',
    platformFee: 15,
    processingFee: 2.9
  };
  
  let notificationSettings: NotificationSettings = {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    adminAlerts: true,
    creatorAlerts: true,
    userAlerts: true,
    moderationAlerts: true
  };
  
  let securitySettings: SecuritySettings = {
    twoFactorRequired: false,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    contentEncryption: true,
    ipWhitelist: [],
    apiRateLimit: 1000
  };
  
  let loading = false;
  let saveSuccess = false;
  let activeTab = 'platform';
  let newIp = '';
  let newFormat = '';
  
  const tabs = [
    { id: 'platform', label: 'Platform', icon: '⚙️' },
    { id: 'payment', label: 'Payments', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];
  
  onMount(() => {
    loadSettings();
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

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-white">Platform Settings</h1>
      <p class="text-gray-300">Configure platform behavior and integrations</p>
    </div>
    
    <div class="flex items-center space-x-4">
      <button 
        onclick={resetSettings}
        class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        🔄 Reset to Default
      </button>
      <button 
        onclick={saveSettings}
        disabled={loading}
        class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : '💾 Save Changes'}
      </button>
    </div>
  </div>

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
  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-2">
    <nav class="flex space-x-2">
      {#each tabs as tab}
        <button
          onclick={() => activeTab = tab.id}
          class="flex items-center space-x-2 px-4 py-3 rounded-lg transition-all {activeTab === tab.id ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}"
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      {/each}
    </nav>
  </div>

  <!-- Platform Settings -->
  {#if activeTab === 'platform'}
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <h2 class="text-xl font-bold text-white">Platform Configuration</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Settings -->
        <div class="space-y-4">
          <div>
            <label for="siteName" class="block text-gray-300 text-sm font-medium mb-2">Site Name</label>
            <input
              id="siteName"
              type="text"
              bind:value={platformSettings.siteName}
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
          
          <div>
            <label for="siteDescription" class="block text-gray-300 text-sm font-medium mb-2">Site Description</label>
            <textarea
              id="siteDescription"
              bind:value={platformSettings.siteDescription}
              rows="3"
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            ></textarea>
          </div>
          
          <div>
            <label for="maxUploadSize" class="block text-gray-300 text-sm font-medium mb-2">Max Upload Size (MB)</label>
            <input
              id="maxUploadSize"
              type="number"
              bind:value={platformSettings.maxUploadSize}
              min="100"
              max="10000"
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
        </div>

        <!-- Toggle Settings -->
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">Maintenance Mode</div>
              <div class="text-gray-400 text-sm">Disable public access to the platform</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={platformSettings.maintenanceMode} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">User Registration</div>
              <div class="text-gray-400 text-sm">Allow new users to register</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={platformSettings.registrationOpen} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">Creator Applications</div>
              <div class="text-gray-400 text-sm">Allow new creator applications</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={platformSettings.creatorApplicationsOpen} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Content Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-white">Content Settings</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="moderationMode" class="block text-gray-300 text-sm font-medium mb-2">Moderation Mode</label>
            <select
              id="moderationMode"
              bind:value={platformSettings.moderationMode}
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value="auto">Automatic</option>
              <option value="manual">Manual Review</option>
              <option value="hybrid">Hybrid (Auto + Manual)</option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="minDuration" class="block text-gray-300 text-sm font-medium mb-2">Min Duration (seconds)</label>
              <input
                id="minDuration"
                type="number"
                bind:value={platformSettings.minContentDuration}
                min="30"
                class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              >
            </div>
            <div>
              <label for="maxDuration" class="block text-gray-300 text-sm font-medium mb-2">Max Duration (seconds)</label>
              <input
                id="maxDuration"
                type="number"
                bind:value={platformSettings.maxContentDuration}
                min="300"
                class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              >
            </div>
          </div>
        </div>

        <!-- Supported Formats -->
        <div>
          <label for="newFormat" class="block text-gray-300 text-sm font-medium mb-2">Supported Video Formats</label>
          <div class="flex flex-wrap gap-2 mb-3">
            {#each platformSettings.supportedFormats as format}
              <span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <span>.{format}</span>
                <button onclick={() => removeSupportedFormat(format)} class="text-red-200 hover:text-white">×</button>
              </span>
            {/each}
          </div>
          <div class="flex space-x-2">
            <input
              id="newFormat"
              type="text"
              bind:value={newFormat}
              placeholder="Add format (e.g., webm)"
              class="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
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
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <h2 class="text-xl font-bold text-white">Payment Configuration</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Stripe Settings -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-white">Stripe Integration</h3>
          <div>
            <label for="stripePublishableKey" class="block text-gray-300 text-sm font-medium mb-2">Publishable Key</label>
            <input
              id="stripePublishableKey"
              type="text"
              bind:value={paymentSettings.stripePublishableKey}
              placeholder="pk_live_..."
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
          <div>
            <label for="stripeWebhookSecret" class="block text-gray-300 text-sm font-medium mb-2">Webhook Secret</label>
            <input
              id="stripeWebhookSecret"
              type="password"
              bind:value={paymentSettings.stripeWebhookSecret}
              placeholder="whsec_..."
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
        </div>

        <!-- PayPal Settings -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-white">PayPal Integration</h3>
          <div>
            <label for="paypalClientId" class="block text-gray-300 text-sm font-medium mb-2">Client ID</label>
            <input
              id="paypalClientId"
              type="text"
              bind:value={paymentSettings.paypalClientId}
              placeholder="PayPal Client ID"
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
          </div>
        </div>
      </div>

      <!-- Payout Settings -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-white">Payout Configuration</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label for="minimumPayout" class="block text-gray-300 text-sm font-medium mb-2">Minimum Payout ($)</label>
            <input
              id="minimumPayout"
              type="number"
              bind:value={paymentSettings.minimumPayout}
              min="10"
              step="5"
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            >
          </div>
          
          <div>
            <label for="payoutSchedule" class="block text-gray-300 text-sm font-medium mb-2">Payout Schedule</label>
            <select
              id="payoutSchedule"
              bind:value={paymentSettings.payoutSchedule}
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label for="platformFee" class="block text-gray-300 text-sm font-medium mb-2">Platform Fee (%)</label>
            <input
              id="platformFee"
              type="number"
              bind:value={paymentSettings.platformFee}
              min="5"
              max="30"
              step="0.5"
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            >
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Notification Settings -->
  {#if activeTab === 'notifications'}
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">Notification Settings</h2>
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
          <h3 class="text-lg font-bold text-white">General Notifications</h3>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">Email Notifications</div>
              <div class="text-gray-400 text-sm">Send notifications via email</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.emailNotifications} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">Push Notifications</div>
              <div class="text-gray-400 text-sm">Send browser push notifications</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.pushNotifications} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">SMS Notifications</div>
              <div class="text-gray-400 text-sm">Send notifications via SMS</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.smsNotifications} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        <!-- Alert Types -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-white">Alert Types</h3>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">Admin Alerts</div>
              <div class="text-gray-400 text-sm">System and security alerts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.adminAlerts} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">Creator Alerts</div>
              <div class="text-gray-400 text-sm">Creator activity and content alerts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.creatorAlerts} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">User Alerts</div>
              <div class="text-gray-400 text-sm">User activity and engagement alerts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.userAlerts} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">Moderation Alerts</div>
              <div class="text-gray-400 text-sm">Content moderation alerts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={notificationSettings.moderationAlerts} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Security Settings -->
  {#if activeTab === 'security'}
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <h2 class="text-xl font-bold text-white">Security Configuration</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Authentication Settings -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-white">Authentication</h3>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">Two-Factor Authentication</div>
              <div class="text-gray-400 text-sm">Require 2FA for all admin accounts</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={securitySettings.twoFactorRequired} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div class="text-white font-medium">Content Encryption</div>
              <div class="text-gray-400 text-sm">Encrypt stored video content</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" bind:checked={securitySettings.contentEncryption} class="sr-only peer">
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="sessionTimeout" class="block text-gray-300 text-sm font-medium mb-2">Session Timeout (seconds)</label>
              <input
                id="sessionTimeout"
                type="number"
                bind:value={securitySettings.sessionTimeout}
                min="300"
                max="86400"
                class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              >
            </div>
            <div>
              <label for="maxLoginAttempts" class="block text-gray-300 text-sm font-medium mb-2">Max Login Attempts</label>
              <input
                id="maxLoginAttempts"
                type="number"
                bind:value={securitySettings.maxLoginAttempts}
                min="3"
                max="10"
                class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              >
            </div>
          </div>
        </div>

        <!-- API and Rate Limiting -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-white">API Security</h3>
          
          <div>
            <label for="apiRateLimit" class="block text-gray-300 text-sm font-medium mb-2">API Rate Limit (requests/hour)</label>
            <input
              id="apiRateLimit"
              type="number"
              bind:value={securitySettings.apiRateLimit}
              min="100"
              max="10000"
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            >
          </div>
          
          <div>
            <label for="passwordMinLength" class="block text-gray-300 text-sm font-medium mb-2">Password Min Length</label>
            <input
              id="passwordMinLength"
              type="number"
              bind:value={securitySettings.passwordMinLength}
              min="8"
              max="20"
              class="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            >
          </div>
        </div>
      </div>

      <!-- IP Whitelist -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-white">IP Whitelist</h3>
        
        <div class="flex flex-wrap gap-2 mb-3">
          {#each securitySettings.ipWhitelist as ip}
            <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
              <span>{ip}</span>
              <button onclick={() => removeIpFromWhitelist(ip)} class="text-blue-200 hover:text-white">×</button>
            </span>
          {/each}
          {#if securitySettings.ipWhitelist.length === 0}
            <span class="text-gray-400 text-sm">No IP restrictions configured</span>
          {/if}
        </div>
        
        <div class="flex space-x-2">
          <input
            id="newIp"
            type="text"
            bind:value={newIp}
            placeholder="Add IP address (e.g., 192.168.1.1)"
            class="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
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