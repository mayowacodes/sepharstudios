<!-- Creator Success Stories -->
<script lang="ts">
  let activeFilter = 'all';

  const filters = [
    { id: 'all', title: 'All Stories', icon: '⭐' },
    { id: 'growth', title: 'Channel Growth', icon: '📈' },
    { id: 'ministry', title: 'Ministry Impact', icon: '✝️' },
    { id: 'breakthrough', title: 'Breakthrough Moments', icon: '🚀' },
    { id: 'community', title: 'Community Building', icon: '👥' },
    { id: 'monetization', title: 'Monetization Success', icon: '💰' }
  ];

  const successStories = [
    {
      id: 1,
      name: "Pastor Sarah Johnson",
      channel: "Grace & Truth Ministries",
      category: "ministry",
      thumbnail: "/avatars/sarah.jpg",
      subscribers: "125K",
      achievement: "Built a global community reaching 50+ countries",
      story: "Started with just a smartphone and a heart for ministry. Now reaching hundreds of thousands with weekly Bible studies.",
      quote: "Sephar Studios gave me the platform to share God's love beyond my local church walls.",
      metrics: {
        views: "2.3M",
        countries: "52",
        baptisms: "127",
        testimonies: "1,400+"
      },
      featured: true
    },
    {
      id: 2,
      name: "David Martinez",
      channel: "Kingdom Builders",
      category: "growth",
      thumbnail: "/avatars/david.jpg",
      subscribers: "89K",
      achievement: "Grew from 0 to 89K subscribers in 18 months",
      story: "Consistent content creation and community engagement helped build a thriving Christian community online.",
      quote: "The analytics tools helped me understand my audience and create content that really resonates.",
      metrics: {
        growth: "89K in 18mo",
        engagement: "12.4%",
        retention: "78%",
        community: "Active"
      },
      featured: false
    },
    {
      id: 3,
      name: "Michelle Chen",
      channel: "Faith & Family Life",
      category: "breakthrough",
      thumbnail: "/avatars/michelle.jpg",
      subscribers: "67K",
      achievement: "Viral testimony video reached 1.2M people",
      story: "One authentic testimony about overcoming addiction touched millions and opened doors for speaking opportunities.",
      quote: "God used one vulnerable moment to create breakthrough in countless lives.",
      metrics: {
        viral: "1.2M views",
        speaking: "25 events",
        books: "2 published",
        recovery: "500+ stories"
      },
      featured: true
    },
    {
      id: 4,
      name: "James Wilson",
      channel: "Modern Worship",
      category: "monetization",
      thumbnail: "/avatars/james.jpg",
      subscribers: "156K",
      achievement: "Generated $45K annually to fund music ministry",
      story: "Leveraged sponsorships and donations to produce high-quality worship content and support local musicians.",
      quote: "The platform's monetization tools allowed me to turn my passion into sustainable ministry.",
      metrics: {
        revenue: "$45K/year",
        musicians: "12 supported",
        albums: "3 produced",
        concerts: "24 funded"
      },
      featured: false
    },
    {
      id: 5,
      name: "Rebecca Thompson",
      channel: "Women of Faith",
      category: "community",
      thumbnail: "/avatars/rebecca.jpg",
      subscribers: "78K",
      achievement: "Created support network for 5,000+ women",
      story: "Built an online community that provides spiritual support, mentorship, and real-life connections for women worldwide.",
      quote: "We've seen marriages restored, addictions overcome, and faith renewed through our community.",
      metrics: {
        members: "5,000+",
        groups: "45 local",
        mentors: "200+",
        marriages: "89 restored"
      },
      featured: true
    },
    {
      id: 6,
      name: "Pastor Mark Rodriguez",
      channel: "Biblical Archaeology",
      category: "ministry",
      thumbnail: "/avatars/mark.jpg",
      subscribers: "94K",
      achievement: "Made Biblical history accessible to modern audiences",
      story: "Combines archaeological discoveries with Biblical teaching to strengthen faith and reach skeptics.",
      quote: "Seeing people's faith strengthened through historical evidence has been incredibly rewarding.",
      metrics: {
        documentaries: "12",
        universities: "8 partnerships",
        conversions: "2,300+",
        research: "6 published"
      },
      featured: false
    }
  ];

  $: filteredStories = successStories.filter(story =>
    activeFilter === 'all' || story.category === activeFilter
  );

  $: featuredStories = successStories.filter(story => story.featured);

  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      ministry: 'purple',
      growth: 'blue',
      breakthrough: 'green',
      community: 'orange',
      monetization: 'yellow'
    };
    return colors[category] || 'gray';
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Creator Success Stories</h1>
    <p class="text-gray-300">Be inspired by fellow creators who are making a real impact through their ministry</p>
  </div>

  <!-- Impact Statistics -->
  <div class="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
    <h2 class="text-xl font-bold text-white mb-4 text-center">🌟 Community Impact</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-purple-400">12.8M</div>
        <div class="text-sm text-purple-200">Total Views</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-400">340+</div>
        <div class="text-sm text-blue-200">Active Creators</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-400">89</div>
        <div class="text-sm text-green-200">Countries Reached</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-orange-400">15K+</div>
        <div class="text-sm text-orange-200">Lives Changed</div>
      </div>
    </div>
  </div>

  <!-- Featured Stories -->
  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
    <h3 class="text-xl font-bold text-white mb-6">🏆 Featured Success Stories</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each featuredStories as story}
        <div class="bg-white/5 rounded-lg p-4">
          <div class="flex items-center space-x-3 mb-3">
            <div class="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
              {story.name.charAt(0)}
            </div>
            <div>
              <div class="text-white font-medium">{story.name}</div>
              <div class="text-gray-400 text-sm">{story.channel}</div>
            </div>
          </div>
          <p class="text-gray-300 text-sm mb-3">{story.achievement}</p>
          <div class="text-purple-400 text-xs">
            {story.subscribers} subscribers
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Filter Tabs -->
  <div class="flex flex-wrap gap-2">
    {#each filters as filter}
      <button
        onclick={() => activeFilter = filter.id}
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {
          activeFilter === filter.id
            ? 'bg-purple-600 text-white'
            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
        }"
      >
        <span class="mr-2">{filter.icon}</span>
        {filter.title}
      </button>
    {/each}
  </div>

  <!-- Success Stories Grid -->
  <div class="space-y-8">
    {#each filteredStories as story}
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Creator Info -->
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-4 mb-4">
              <div class="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
                {story.name.charAt(0)}
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">{story.name}</h3>
                <p class="text-gray-400">{story.channel}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="bg-{getCategoryColor(story.category)}-600 text-{getCategoryColor(story.category)}-100 text-xs px-2 py-1 rounded capitalize">
                    {story.category}
                  </span>
                  <span class="text-purple-400 text-sm">{story.subscribers} subscribers</span>
                </div>
              </div>
            </div>

            <!-- Metrics -->
            <div class="bg-white/5 rounded-lg p-4">
              <h4 class="text-white font-medium mb-3">Key Metrics</h4>
              <div class="space-y-2">
                {#each Object.entries(story.metrics) as [key, value]}
                  <div class="flex justify-between">
                    <span class="text-gray-400 capitalize text-sm">{key}:</span>
                    <span class="text-white text-sm">{value}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>

          <!-- Story Content -->
          <div class="lg:col-span-2">
            <div class="mb-4">
              <h4 class="text-lg font-bold text-white mb-2">🎯 Achievement</h4>
              <p class="text-green-400 font-medium">{story.achievement}</p>
            </div>

            <div class="mb-4">
              <h4 class="text-lg font-bold text-white mb-2">📖 Story</h4>
              <p class="text-gray-300">{story.story}</p>
            </div>

            <div class="bg-blue-600/20 border-l-4 border-blue-600 pl-4 py-2">
              <p class="text-blue-200 italic">"{story.quote}"</p>
              <p class="text-blue-300 text-sm mt-2">— {story.name}</p>
            </div>

            <div class="mt-4 flex space-x-3">
              <button class="text-purple-400 hover:text-purple-300 text-sm">
                📹 View Channel
              </button>
              <button class="text-purple-400 hover:text-purple-300 text-sm">
                💬 Read Full Interview
              </button>
              <button class="text-purple-400 hover:text-purple-300 text-sm">
                🔗 Connect with {story.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Submit Your Story -->
  <div class="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-8">
    <div class="text-center">
      <div class="text-4xl mb-4">✨</div>
      <h2 class="text-2xl font-bold text-white mb-4">Share Your Success Story</h2>
      <p class="text-green-200 mb-6 max-w-2xl mx-auto">
        Have you seen God work through your content in amazing ways? We'd love to hear your story and
        inspire other creators in our community. Your testimony could be the encouragement someone needs!
      </p>

      <div class="space-y-4 max-w-md mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your name"
            class="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
          />
          <input
            type="text"
            placeholder="Channel name"
            class="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
          />
        </div>
        <textarea
          placeholder="Tell us your success story (what God has done through your content)..."
          rows="4"
          class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
        ></textarea>
        <button class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
          Submit My Story
        </button>
      </div>

      <p class="text-xs text-gray-400 mt-4">
        By submitting, you agree to let us feature your story (with your permission) to inspire other creators.
      </p>
    </div>
  </div>

  <!-- Success Tips -->
  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
    <h3 class="text-xl font-bold text-white mb-6">💡 Common Success Patterns</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 class="text-lg font-medium text-white mb-4">📈 Growth Strategies</h4>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li>• Consistent posting schedule (weekly minimum)</li>
          <li>• Authentic, personal storytelling</li>
          <li>• Active community engagement</li>
          <li>• Cross-platform promotion</li>
          <li>• Collaboration with other creators</li>
          <li>• Prayer and spiritual foundation</li>
        </ul>
      </div>
      <div>
        <h4 class="text-lg font-medium text-white mb-4">🎯 Ministry Impact</h4>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li>• Clear Gospel message in content</li>
          <li>• Personal testimony sharing</li>
          <li>• Interactive community features</li>
          <li>• Prayer request integration</li>
          <li>• Follow-up with viewers</li>
          <li>• Local church partnerships</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Creator Spotlight Program -->
  <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-6">
    <h3 class="text-lg font-bold text-white mb-4">🌟 Monthly Creator Spotlight</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p class="text-purple-200 mb-4">
          Each month, we feature exceptional creators who are making a significant impact through their ministry.
          Nominated creators receive:
        </p>
        <ul class="text-purple-200 text-sm space-y-1">
          <li>• Featured placement on homepage</li>
          <li>• Newsletter feature and interview</li>
          <li>• Social media promotion</li>
          <li>• Speaking opportunity consideration</li>
          <li>• Professional development resources</li>
        </ul>
      </div>
      <div class="space-y-4">
        <button class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
          Nominate a Creator
        </button>
        <button class="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium">
          Apply for Spotlight
        </button>
      </div>
    </div>
  </div>

  <!-- Community Support -->
  <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">
    <h3 class="text-lg font-bold text-white mb-2">🤝 Creator Community Support</h3>
    <p class="text-yellow-200 text-sm">
      Join our Creator Forum to connect with successful creators, ask questions, and get mentorship.
      Many of our featured creators actively participate and share their insights.
    </p>
    <a href="/creator/forum" class="text-yellow-100 underline text-sm">Join the conversation →</a>
  </div>
</div>