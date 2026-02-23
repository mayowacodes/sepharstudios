<!-- Creator Newsletter -->
<script lang="ts">
  let email = '';
  let isSubscribed = false;
  let preferences = {
    weekly: true,
    events: true,
    resources: true,
    spotlights: false,
    technical: true
  };

  function subscribe() {
    if (email) {
      isSubscribed = true;
    }
  }

  function updatePreferences() {
    // Handle preferences update
    console.log('Preferences updated:', preferences);
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Creator Newsletter</h1>
    <p class="text-gray-300">Stay informed with the latest updates, tips, and opportunities</p>
  </div>

  {#if !isSubscribed}
    <!-- Newsletter Signup -->
    <div class="bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-8">
      <div class="text-center">
        <div class="text-6xl mb-4">📧</div>
        <h2 class="text-2xl font-bold text-white mb-4">Join Our Creator Community</h2>
        <p class="text-purple-200 mb-6 max-w-2xl mx-auto">
          Get exclusive content, early access to features, and stay connected with fellow faith-based creators.
          Our newsletter is packed with actionable tips, success stories, and opportunities to grow your ministry.
        </p>

        <div class="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            bind:value={email}
            placeholder="Enter your email address"
            class="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <button
            onclick={subscribe}
            class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Subscribe
          </button>
        </div>

        <p class="text-xs text-gray-400 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  {:else}
    <!-- Success Message -->
    <div class="bg-green-600/20 border border-green-600 rounded-xl p-6 text-center">
      <div class="text-4xl mb-2">✅</div>
      <h2 class="text-xl font-bold text-white mb-2">Welcome to our community!</h2>
      <p class="text-green-200">
        You'll receive your first newsletter within 24 hours. Check your email for a confirmation link.
      </p>
    </div>
  {/if}

  <!-- Newsletter Benefits -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div class="text-3xl mb-3">📚</div>
      <h3 class="text-lg font-bold text-white mb-2">Weekly Creator Tips</h3>
      <p class="text-gray-300 text-sm">
        Practical advice on content creation, audience building, and ministry growth strategies.
      </p>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div class="text-3xl mb-3">🚀</div>
      <h3 class="text-lg font-bold text-white mb-2">Feature Updates</h3>
      <p class="text-gray-300 text-sm">
        Be first to know about new platform features, tools, and opportunities for creators.
      </p>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div class="text-3xl mb-3">🏆</div>
      <h3 class="text-lg font-bold text-white mb-2">Creator Spotlights</h3>
      <p class="text-gray-300 text-sm">
        Inspiring stories and interviews with successful faith-based creators in our community.
      </p>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div class="text-3xl mb-3">📅</div>
      <h3 class="text-lg font-bold text-white mb-2">Event Notifications</h3>
      <p class="text-gray-300 text-sm">
        Early access to workshops, conferences, and exclusive creator community events.
      </p>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div class="text-3xl mb-3">💡</div>
      <h3 class="text-lg font-bold text-white mb-2">Exclusive Resources</h3>
      <p class="text-gray-300 text-sm">
        Free templates, graphics, music, and other resources to enhance your content creation.
      </p>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <div class="text-3xl mb-3">💰</div>
      <h3 class="text-lg font-bold text-white mb-2">Monetization Opportunities</h3>
      <p class="text-gray-300 text-sm">
        Information about sponsorships, grants, and other revenue opportunities for creators.
      </p>
    </div>
  </div>

  <!-- Newsletter Preferences -->
  {#if isSubscribed}
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <h3 class="text-lg font-bold text-white mb-4">📋 Newsletter Preferences</h3>
      <p class="text-gray-300 mb-6">Customize what content you receive in your newsletter:</p>

      <div class="space-y-4">
        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            bind:checked={preferences.weekly}
            class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <div class="text-white font-medium">Weekly Creator Digest</div>
            <div class="text-gray-400 text-sm">Tips, tutorials, and community highlights</div>
          </div>
        </label>

        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            bind:checked={preferences.events}
            class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <div class="text-white font-medium">Event Announcements</div>
            <div class="text-gray-400 text-sm">Workshops, conferences, and community events</div>
          </div>
        </label>

        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            bind:checked={preferences.resources}
            class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <div class="text-white font-medium">Free Resources</div>
            <div class="text-gray-400 text-sm">Templates, graphics, and downloadable content</div>
          </div>
        </label>

        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            bind:checked={preferences.spotlights}
            class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <div class="text-white font-medium">Creator Spotlights</div>
            <div class="text-gray-400 text-sm">Interviews and success stories from creators</div>
          </div>
        </label>

        <label class="flex items-center space-x-3">
          <input
            type="checkbox"
            bind:checked={preferences.technical}
            class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <div class="text-white font-medium">Technical Updates</div>
            <div class="text-gray-400 text-sm">Platform updates, new features, and technical tips</div>
          </div>
        </label>
      </div>

      <button
        onclick={updatePreferences}
        class="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
      >
        Update Preferences
      </button>
    </div>
  {/if}

  <!-- Recent Newsletter Archives -->
  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
    <h3 class="text-lg font-bold text-white mb-4">📰 Recent Newsletter Issues</h3>
    <p class="text-gray-300 mb-6">
      Missed a newsletter? Catch up on recent issues and browse our archive.
    </p>

    <div class="space-y-4">
      <div class="border border-white/20 rounded-lg p-4">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-white font-medium">Creator Spotlight: Sarah's Ministry Journey</h4>
            <p class="text-gray-400 text-sm mt-1">
              February 12, 2024 • How one creator built a community of 50K+ faithful followers
            </p>
          </div>
          <button class="text-purple-400 hover:text-purple-300 text-sm">Read →</button>
        </div>
      </div>

      <div class="border border-white/20 rounded-lg p-4">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-white font-medium">5 Video Editing Tips for Better Sermons</h4>
            <p class="text-gray-400 text-sm mt-1">
              February 5, 2024 • Professional techniques to enhance your teaching content
            </p>
          </div>
          <button class="text-purple-400 hover:text-purple-300 text-sm">Read →</button>
        </div>
      </div>

      <div class="border border-white/20 rounded-lg p-4">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-white font-medium">New Feature: Prayer Request Integration</h4>
            <p class="text-gray-400 text-sm mt-1">
              January 29, 2024 • Connect deeper with your audience through prayer
            </p>
          </div>
          <button class="text-purple-400 hover:text-purple-300 text-sm">Read →</button>
        </div>
      </div>

      <div class="border border-white/20 rounded-lg p-4">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-white font-medium">Faith & Film Conference Early Bird Registration</h4>
            <p class="text-gray-400 text-sm mt-1">
              January 22, 2024 • Save 40% on tickets with exclusive creator discount
            </p>
          </div>
          <button class="text-purple-400 hover:text-purple-300 text-sm">Read →</button>
        </div>
      </div>
    </div>

    <div class="mt-6 text-center">
      <button class="text-purple-400 hover:text-purple-300 font-medium">
        Browse Full Archive →
      </button>
    </div>
  </div>

  <!-- Newsletter Statistics -->
  <div class="bg-blue-600/20 border border-blue-600 rounded-xl p-6">
    <h3 class="text-lg font-bold text-white mb-4">📊 Newsletter Community</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-400">8,247</div>
        <div class="text-sm text-blue-200">Subscribers</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-400">94%</div>
        <div class="text-sm text-green-200">Open Rate</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-purple-400">156</div>
        <div class="text-sm text-purple-200">Issues Sent</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-orange-400">4.9</div>
        <div class="text-sm text-orange-200">Avg. Rating</div>
      </div>
    </div>
  </div>

  <!-- Testimonials -->
  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
    <h3 class="text-lg font-bold text-white mb-6">💬 What Creators Are Saying</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white/5 rounded-lg p-4">
        <p class="text-gray-300 text-sm mb-3">
          "The weekly newsletter has been invaluable for my ministry. The tips and resources have helped me
          reach thousands more people with the Gospel message."
        </p>
        <div class="text-purple-400 font-medium">— Pastor Mike, SermonStream</div>
      </div>

      <div class="bg-white/5 rounded-lg p-4">
        <p class="text-gray-300 text-sm mb-3">
          "I love the creator spotlights! It's so encouraging to see how God is using other creators to
          impact lives. Plus the technical tips have saved me hours of research."
        </p>
        <div class="text-purple-400 font-medium">— Sarah J., FaithLife Productions</div>
      </div>

      <div class="bg-white/5 rounded-lg p-4">
        <p class="text-gray-300 text-sm mb-3">
          "The event notifications helped me attend workshops that completely transformed my content strategy.
          The ROI from this free newsletter is incredible!"
        </p>
        <div class="text-purple-400 font-medium">— David L., Kingdom Content</div>
      </div>

      <div class="bg-white/5 rounded-lg p-4">
        <p class="text-gray-300 text-sm mb-3">
          "As a new creator, the newsletter has been like having a mentor. The step-by-step guides and
          encouragement keep me motivated to continue growing my ministry online."
        </p>
        <div class="text-purple-400 font-medium">— Grace M., Hope & Healing</div>
      </div>
    </div>
  </div>

  <!-- Contact Info -->
  <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">
    <h3 class="text-lg font-bold text-white mb-2">📧 Newsletter Support</h3>
    <p class="text-yellow-200 text-sm">
      Questions about your subscription or suggestions for content? Email us at
      <a href="mailto:info@sepharstudios.com" class="text-yellow-100 underline">info@sepharstudios.com</a>
    </p>
  </div>
</div>
