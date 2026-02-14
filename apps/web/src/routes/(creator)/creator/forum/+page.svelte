<!-- Creator Forum -->
<script lang="ts">
  let activeCategory = 'all';
  let searchTerm = '';

  const categories = [
    { id: 'all', title: 'All Topics', icon: '💬', color: 'purple' },
    { id: 'getting-started', title: 'Getting Started', icon: '🚀', color: 'blue' },
    { id: 'technical', title: 'Technical Help', icon: '⚙️', color: 'green' },
    { id: 'content-creation', title: 'Content Creation', icon: '🎬', color: 'orange' },
    { id: 'ministry', title: 'Ministry & Faith', icon: '✝️', color: 'yellow' },
    { id: 'community', title: 'Community', icon: '❤️', color: 'red' }
  ];

  const forumPosts = [
    {
      id: 1,
      title: "How to improve video quality on a budget?",
      author: "FaithFilmMaker",
      category: "technical",
      replies: 12,
      likes: 8,
      lastActivity: "2 hours ago",
      excerpt: "Looking for affordable ways to upgrade my video production quality. Any recommendations for budget-friendly equipment?",
      isSticky: false
    },
    {
      id: 2,
      title: "Best practices for sermon recordings",
      author: "PastorDavid",
      category: "content-creation",
      replies: 24,
      likes: 18,
      lastActivity: "4 hours ago",
      excerpt: "What are your tips for recording engaging sermon content? Audio setup, camera angles, lighting tips welcome!",
      isSticky: true
    },
    {
      id: 3,
      title: "Dealing with negative comments - how do you respond?",
      author: "GraceAndTruth",
      category: "ministry",
      replies: 31,
      likes: 25,
      lastActivity: "6 hours ago",
      excerpt: "Sometimes receive challenging comments on Biblical topics. How do you handle criticism while staying loving?",
      isSticky: false
    },
    {
      id: 4,
      title: "New creator introduction and prayer request",
      author: "NewBeginnings2024",
      category: "getting-started",
      replies: 19,
      likes: 22,
      lastActivity: "8 hours ago",
      excerpt: "Hi everyone! Just starting my ministry channel. Could use prayers and any advice for new creators.",
      isSticky: false
    },
    {
      id: 5,
      title: "Weekly Prayer Thread - January 2024",
      author: "CommunityModerator",
      category: "community",
      replies: 156,
      likes: 89,
      lastActivity: "1 hour ago",
      excerpt: "Share your prayer requests and lift each other up in prayer this week.",
      isSticky: true
    }
  ];

  $: filteredPosts = forumPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function getCategoryColor(categoryId: string): string {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'gray';
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Creator Community Forum</h1>
    <p class="text-gray-300">Connect, learn, and grow together with fellow faith-based creators</p>
  </div>

  <!-- Forum Stats -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-blue-400">1,247</div>
      <div class="text-sm text-blue-200">Active Members</div>
    </div>
    <div class="bg-green-600/20 border border-green-600 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-green-400">3,891</div>
      <div class="text-sm text-green-200">Total Posts</div>
    </div>
    <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-purple-400">89</div>
      <div class="text-sm text-purple-200">Online Now</div>
    </div>
    <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-orange-400">456</div>
      <div class="text-sm text-orange-200">This Week</div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Sidebar -->
    <div class="lg:col-span-1 space-y-6">
      <!-- New Post Button -->
      <button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
        ✍️ Start New Discussion
      </button>

      <!-- Categories -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <h3 class="text-lg font-bold text-white mb-4">Categories</h3>
        <nav class="space-y-2">
          {#each categories as category}
            <button
              onclick={() => activeCategory = category.id}
              class="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 {activeCategory === category.id ? `bg-${category.color}-600 text-white` : 'text-gray-300 hover:text-white hover:bg-white/10'}"
            >
              <span>{category.icon}</span>
              <span class="text-sm font-medium">{category.title}</span>
            </button>
          {/each}
        </nav>
      </div>

      <!-- Quick Links -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <h3 class="text-lg font-bold text-white mb-4">Quick Links</h3>
        <div class="space-y-2">
          <a href="/creator/guidelines" class="block text-gray-300 hover:text-white text-sm">
            📋 Content Guidelines
          </a>
          <a href="/creator/support" class="block text-gray-300 hover:text-white text-sm">
            🆘 Get Support
          </a>
          <a href="/creator/best-practices" class="block text-gray-300 hover:text-white text-sm">
            ⭐ Best Practices
          </a>
          <a href="/creator/events" class="block text-gray-300 hover:text-white text-sm">
            📅 Upcoming Events
          </a>
        </div>
      </div>

      <!-- Community Guidelines -->
      <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">
        <h3 class="text-sm font-bold text-white mb-2">💛 Community Guidelines</h3>
        <ul class="text-yellow-200 text-xs space-y-1">
          <li>• Be respectful and encouraging</li>
          <li>• Stay on topic and relevant</li>
          <li>• No spam or self-promotion</li>
          <li>• Share with love and grace</li>
          <li>• Pray for one another</li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <div class="lg:col-span-3 space-y-6">
      <!-- Search and Filters -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              bind:value={searchTerm}
              placeholder="Search discussions..."
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div class="flex gap-2">
            <select class="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none">
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="active">Most Active</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Featured Announcements -->
      <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-4">
        <h3 class="text-lg font-bold text-white mb-2 flex items-center">
          <span class="mr-2">📢</span> Community Announcements
        </h3>
        <div class="space-y-2">
          <div class="text-purple-200 text-sm">
            🎉 <strong>New Feature:</strong> Live Q&A sessions now available every Thursday at 7 PM EST
          </div>
          <div class="text-purple-200 text-sm">
            📚 <strong>Resource Library:</strong> Check out our new collection of free graphics and music
          </div>
          <div class="text-purple-200 text-sm">
            🏆 <strong>Creator Spotlight:</strong> Nominate fellow creators for monthly recognition
          </div>
        </div>
      </div>

      <!-- Forum Posts -->
      <div class="space-y-4">
        {#each filteredPosts as post}
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors cursor-pointer">
            <div class="flex items-start space-x-4">
              <!-- Avatar -->
              <div class="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                {post.author.charAt(0).toUpperCase()}
              </div>

              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      {#if post.isSticky}
                        <span class="text-yellow-400">📌</span>
                      {/if}
                      <h3 class="text-lg font-medium text-white hover:text-purple-300">
                        {post.title}
                      </h3>
                      <span class="bg-{getCategoryColor(post.category)}-600 text-{getCategoryColor(post.category)}-100 text-xs px-2 py-1 rounded">
                        {categories.find(c => c.id === post.category)?.title || post.category}
                      </span>
                    </div>

                    <p class="text-gray-300 text-sm mb-2">
                      {post.excerpt}
                    </p>

                    <div class="flex items-center space-x-4 text-xs text-gray-400">
                      <span>by <strong class="text-purple-400">{post.author}</strong></span>
                      <span>•</span>
                      <span>{post.lastActivity}</span>
                    </div>
                  </div>

                  <!-- Stats -->
                  <div class="text-right space-y-1">
                    <div class="flex items-center space-x-3 text-sm text-gray-400">
                      <span class="flex items-center">
                        <span class="mr-1">💬</span>
                        {post.replies}
                      </span>
                      <span class="flex items-center">
                        <span class="mr-1">❤️</span>
                        {post.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Pagination -->
      <div class="flex justify-center">
        <div class="flex space-x-2">
          <button class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white">Previous</button>
          <button class="px-3 py-2 bg-purple-600 rounded-lg text-white">1</button>
          <button class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white">2</button>
          <button class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white">3</button>
          <button class="px-3 py-2 bg-white/10 rounded-lg text-gray-300 hover:text-white">Next</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Active Discussions Widget -->
  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
    <h3 class="text-lg font-bold text-white mb-4">🔥 Trending This Week</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="text-center">
        <div class="text-2xl mb-2">🎬</div>
        <div class="text-sm text-white font-medium">Video Production Tips</div>
        <div class="text-xs text-gray-400">45 new posts</div>
      </div>
      <div class="text-center">
        <div class="text-2xl mb-2">🙏</div>
        <div class="text-sm text-white font-medium">Prayer & Ministry</div>
        <div class="text-xs text-gray-400">38 new posts</div>
      </div>
      <div class="text-center">
        <div class="text-2xl mb-2">📊</div>
        <div class="text-sm text-white font-medium">Analytics & Growth</div>
        <div class="text-xs text-gray-400">29 new posts</div>
      </div>
    </div>
  </div>
</div>