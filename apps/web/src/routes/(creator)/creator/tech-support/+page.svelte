<!-- Technical Support -->
<script lang="ts">
  interface TicketForm {
    subject: string;
    category: string;
    priority: string;
    description: string;
    email: string;
    attachments: File[];
  }

  let ticketForm: TicketForm = {
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    email: '',
    attachments: []
  };

  let isSubmitting = false;
  let isSubmitted = false;

  const categories = [
    { value: 'upload', label: 'Upload Issues' },
    { value: 'video-quality', label: 'Video Quality Problems' },
    { value: 'audio', label: 'Audio Issues' },
    { value: 'account', label: 'Account Access' },
    { value: 'analytics', label: 'Analytics Problems' },
    { value: 'monetization', label: 'Monetization Issues' },
    { value: 'mobile', label: 'Mobile App Problems' },
    { value: 'other', label: 'Other Technical Issue' }
  ];

  async function submitTicket(): Promise<void> {
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.description || !ticketForm.email) {
      return;
    }

    isSubmitting = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    isSubmitting = false;
    isSubmitted = true;
  }

  function addAttachment(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      ticketForm.attachments = [...ticketForm.attachments, ...Array.from(files)];
    }
  }

  function removeAttachment(index: number): void {
    ticketForm.attachments = ticketForm.attachments.filter((_, i) => i !== index);
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Technical Support</h1>
    <p class="text-gray-300">Get personalized help from our technical support team</p>
  </div>

  {#if !isSubmitted}
    <!-- Quick Help Section -->
    <div class="bg-blue-600/20 border border-blue-600 rounded-xl p-6">
      <h2 class="text-xl font-bold text-white mb-4">🔍 Quick Solutions</h2>
      <p class="text-blue-200 mb-4">
        Before submitting a ticket, try these common solutions that resolve 80% of technical issues:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white/5 rounded-lg p-4">
          <h3 class="text-white font-medium mb-2">🔄 Clear Browser Cache</h3>
          <p class="text-blue-200 text-sm mb-2">Fixes most dashboard and upload issues</p>
          <button class="text-blue-300 hover:text-blue-100 text-sm">How to clear cache →</button>
        </div>
        <div class="bg-white/5 rounded-lg p-4">
          <h3 class="text-white font-medium mb-2">📱 Try Different Browser</h3>
          <p class="text-blue-200 text-sm mb-2">Switch to Chrome, Firefox, or Safari</p>
          <button class="text-blue-300 hover:text-blue-100 text-sm">Supported browsers →</button>
        </div>
        <div class="bg-white/5 rounded-lg p-4">
          <h3 class="text-white font-medium mb-2">🔌 Check Internet Connection</h3>
          <p class="text-blue-200 text-sm mb-2">Ensure stable connection for uploads</p>
          <button class="text-blue-300 hover:text-blue-100 text-sm">Connection test →</button>
        </div>
        <div class="bg-white/5 rounded-lg p-4">
          <h3 class="text-white font-medium mb-2">📚 Browse Help Articles</h3>
          <p class="text-blue-200 text-sm mb-2">Step-by-step guides for common issues</p>
          <a href="/creator/support" class="text-blue-300 hover:text-blue-100 text-sm">View help center →</a>
        </div>
      </div>
    </div>

    <!-- Support Ticket Form -->
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <h2 class="text-xl font-bold text-white mb-6">🎫 Submit Support Ticket</h2>

      <form class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="email-input" class="block text-white font-medium mb-2">Email Address *</label>
            <input
              id="email-input"
              type="email"
              bind:value={ticketForm.email}
              placeholder="your.email@example.com"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label for="priority-select" class="block text-white font-medium mb-2">Priority Level</label>
            <select
              id="priority-select"
              bind:value={ticketForm.priority}
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="low">🟢 Low - General question</option>
              <option value="medium">🟡 Medium - Issue affecting workflow</option>
              <option value="high">🟠 High - Can't upload or access account</option>
              <option value="urgent">🔴 Urgent - Critical system failure</option>
            </select>
          </div>
        </div>

        <div>
          <label for="category-select" class="block text-white font-medium mb-2">Issue Category *</label>
          <select
            id="category-select"
            bind:value={ticketForm.category}
            class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select a category...</option>
            {#each categories as category}
              <option value={category.value}>{category.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="subject-input" class="block text-white font-medium mb-2">Subject *</label>
          <input
            id="subject-input"
            type="text"
            bind:value={ticketForm.subject}
            placeholder="Brief description of your issue"
            class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label for="description-textarea" class="block text-white font-medium mb-2">Detailed Description *</label>
          <textarea
            id="description-textarea"
            bind:value={ticketForm.description}
            rows="6"
            placeholder="Please provide as much detail as possible:
- What were you trying to do?
- What exactly happened?
- What did you expect to happen?
- When did this issue start?
- Are there any error messages?"
            class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            required
          ></textarea>
        </div>

        <!-- File Attachments -->
        <div>
          <label for="file-upload" class="block text-white font-medium mb-2">Attachments (Optional)</label>
          <div class="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.log"
              onchange={addAttachment}
              class="hidden"
              id="file-upload"
            />
            <label for="file-upload" class="cursor-pointer">
              <div class="text-4xl mb-2">📎</div>
              <p class="text-gray-300 mb-2">Click to attach files</p>
              <p class="text-gray-400 text-sm">Screenshots, error logs, or other relevant files (Max 10MB each)</p>
            </label>
          </div>

          {#if ticketForm.attachments.length > 0}
            <div class="mt-4 space-y-2">
              {#each ticketForm.attachments as file, index}
                <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span class="text-white text-sm">{file.name}</span>
                  <button
                    type="button"
                    onclick={() => removeAttachment(index)}
                    class="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- System Information -->
        <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
          <h3 class="text-white font-medium mb-2">📋 System Information</h3>
          <p class="text-yellow-200 text-sm mb-3">
            This information helps us diagnose your issue faster:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-1">
              <div class="text-yellow-200">Browser: <span class="text-white">Chrome 120.0</span></div>
              <div class="text-yellow-200">OS: <span class="text-white">Windows 11</span></div>
            </div>
            <div class="space-y-1">
              <div class="text-yellow-200">Screen: <span class="text-white">1920x1080</span></div>
              <div class="text-yellow-200">Connection: <span class="text-white">Broadband</span></div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-between">
          <div class="text-gray-400 text-sm">
            * Required fields
          </div>
          <button
            type="button"
            onclick={submitTicket}
            disabled={isSubmitting}
            class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            {#if isSubmitting}
              <span class="animate-spin">⏳</span>
              <span>Submitting...</span>
            {:else}
              <span>🎫</span>
              <span>Submit Ticket</span>
            {/if}
          </button>
        </div>
      </form>
    </div>

  {:else}
    <!-- Success Message -->
    <div class="bg-green-600/20 border border-green-600 rounded-xl p-8 text-center">
      <div class="text-6xl mb-4">✅</div>
      <h2 class="text-2xl font-bold text-white mb-4">Ticket Submitted Successfully!</h2>
      <p class="text-green-200 mb-6">
        Thank you for contacting our support team. We've received your ticket and will respond within 2-4 hours
        during business hours (Monday-Friday, 9 AM - 6 PM EST).
      </p>

      <div class="bg-white/5 rounded-lg p-4 mb-6 max-w-md mx-auto">
        <div class="text-sm text-gray-300">Your ticket number:</div>
        <div class="text-xl font-bold text-white">#TS-2024-{Math.floor(Math.random() * 10000)}</div>
        <div class="text-xs text-gray-400 mt-1">Save this number for your records</div>
      </div>

      <div class="space-y-2">
        <p class="text-green-200 text-sm">
          📧 We've sent a confirmation email to <strong>{ticketForm.email}</strong>
        </p>
        <p class="text-green-200 text-sm">
          🔔 You'll receive updates as we work on your issue
        </p>
      </div>

      <div class="mt-6 space-x-4">
        <button
          onclick={() => {
            isSubmitted = false;
            ticketForm = { subject: '', category: '', priority: 'medium', description: '', email: '', attachments: [] };
          }}
          class="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium"
        >
          Submit Another Ticket
        </button>
        <a href="/creator/support" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium inline-block">
          Browse Help Center
        </a>
      </div>
    </div>
  {/if}

  <!-- Contact Alternatives -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div class="text-3xl mb-3">💬</div>
      <h3 class="text-lg font-bold text-white mb-2">Live Chat</h3>
      <p class="text-gray-300 text-sm mb-4">
        Get instant help during business hours. Perfect for quick questions and urgent issues.
      </p>
      <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
        Start Chat
      </button>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div class="text-3xl mb-3">📧</div>
      <h3 class="text-lg font-bold text-white mb-2">Email Support</h3>
      <p class="text-gray-300 text-sm mb-4">
        Send detailed questions or issues directly to our support team via email.
      </p>
      <a
        href="mailto:support@sepharstudios.com"
        class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-center block"
      >
        Send Email
      </a>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div class="text-3xl mb-3">👥</div>
      <h3 class="text-lg font-bold text-white mb-2">Community Forum</h3>
      <p class="text-gray-300 text-sm mb-4">
        Get help from other creators who may have faced similar issues.
      </p>
      <a
        href="/creator/forum"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-center block"
      >
        Visit Forum
      </a>
    </div>
  </div>

  <!-- Emergency Contact -->
  <div class="bg-red-600/20 border border-red-600 rounded-xl p-4">
    <h3 class="text-lg font-bold text-white mb-2 flex items-center">
      <span class="mr-2">🚨</span> Emergency Support
    </h3>
    <p class="text-red-200 text-sm">
      For critical issues affecting live streams or urgent ministry needs outside business hours:
      <strong class="block mt-1">Call: (555) 123-HELP</strong>
      Available 24/7 for genuine emergencies only.
    </p>
  </div>

  <!-- Support Hours -->
  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
    <h3 class="text-lg font-bold text-white mb-4">🕒 Support Hours & Response Times</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 class="text-white font-medium mb-3">Business Hours</h4>
        <div class="space-y-1 text-sm text-gray-300">
          <div>Monday - Friday: 9:00 AM - 6:00 PM EST</div>
          <div>Saturday: 10:00 AM - 4:00 PM EST</div>
          <div>Sunday: Closed (Emergency support only)</div>
        </div>
      </div>
      <div>
        <h4 class="text-white font-medium mb-3">Response Times</h4>
        <div class="space-y-1 text-sm text-gray-300">
          <div>🔴 Urgent: Within 1 hour</div>
          <div>🟠 High: Within 2-4 hours</div>
          <div>🟡 Medium: Within 4-8 hours</div>
          <div>🟢 Low: Within 24 hours</div>
        </div>
      </div>
    </div>
  </div>
</div>