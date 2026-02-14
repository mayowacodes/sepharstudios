<!-- Admin Dashboard Home -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  // Mock admin data - TODO: Replace with real API
  let adminStats = {
    pendingReviews: 0,
    totalCreators: 0,
    publishedContent: 0,
    rejectedContent: 0,
    totalViews: 0
  };
  
  onMount(() => {
    // TODO: Load admin stats from API
    adminStats = {
      pendingReviews: 15,
      totalCreators: 127,
      publishedContent: 892,
      rejectedContent: 23,
      totalViews: 2456782
    };
  });
</script>

<div class="space-y-8">
  <!-- Welcome Header -->
  <div class="text-center">
    <h1 class="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
    <p class="text-xl text-gray-300">Manage platform content and creator community</p>
  </div>

  <!-- Quick Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-yellow-400">{adminStats.pendingReviews}</div>
      <div class="text-gray-300 text-sm">Pending Reviews</div>
    </div>
    
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-blue-400">{adminStats.totalCreators}</div>
      <div class="text-gray-300 text-sm">Active Creators</div>
    </div>
    
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-green-400">{adminStats.publishedContent}</div>
      <div class="text-gray-300 text-sm">Published Content</div>
    </div>
    
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-red-400">{adminStats.rejectedContent}</div>
      <div class="text-gray-300 text-sm">Rejected Content</div>
    </div>
    
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-purple-400">{adminStats.totalViews.toLocaleString()}</div>
      <div class="text-gray-300 text-sm">Platform Views</div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
    <a href="/admin/review" class="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-center hover:from-yellow-700 hover:to-orange-700 transition-all">
      <div class="text-3xl mb-3">👁️</div>
      <h3 class="text-lg font-bold text-white mb-1">Review Queue</h3>
      <p class="text-gray-200 text-sm">Review pending content</p>
    </a>
    
    <a href="/admin/content" class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center hover:from-blue-700 hover:to-indigo-700 transition-all">
      <div class="text-3xl mb-3">🎬</div>
      <h3 class="text-lg font-bold text-white mb-1">Content Library</h3>
      <p class="text-gray-200 text-sm">Manage all content</p>
    </a>
    
    <a href="/admin/creators" class="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-center hover:from-green-700 hover:to-teal-700 transition-all">
      <div class="text-3xl mb-3">👥</div>
      <h3 class="text-lg font-bold text-white mb-1">Creators</h3>
      <p class="text-gray-200 text-sm">Manage creator accounts</p>
    </a>
    
    <a href="/admin/policies" class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-center hover:from-purple-700 hover:to-indigo-700 transition-all">
      <div class="text-3xl mb-3">📋</div>
      <h3 class="text-lg font-bold text-white mb-1">Policies</h3>
      <p class="text-gray-200 text-sm">Content guidelines</p>
    </a>
    
    <a href="/admin/workflow" class="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl p-6 text-center hover:from-pink-700 hover:to-rose-700 transition-all">
      <div class="text-3xl mb-3">⚡</div>
      <h3 class="text-lg font-bold text-white mb-1">Workflow</h3>
      <p class="text-gray-200 text-sm">Automation rules</p>
    </a>
    
    <a href="/admin/communications" class="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-center hover:from-cyan-700 hover:to-blue-700 transition-all">
      <div class="text-3xl mb-3">💬</div>
      <h3 class="text-lg font-bold text-white mb-1">Messages</h3>
      <p class="text-gray-200 text-sm">Creator communication</p>
    </a>
  </div>

  <!-- Urgent Reviews -->
  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
    <h2 class="text-2xl font-bold text-white mb-4">Urgent Reviews Required</h2>
    <div class="space-y-4">
      <div class="flex items-center justify-between py-3 border-b border-gray-700">
        <div>
          <div class="text-white font-medium">"The Gospel Truth" - Documentary</div>
          <div class="text-gray-400 text-sm">Submitted 3 days ago • Theological Review Required</div>
        </div>
        <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Urgent</span>
      </div>
      
      <div class="flex items-center justify-between py-3 border-b border-gray-700">
        <div>
          <div class="text-white font-medium">"Youth Ministry Series" - Episode 1</div>
          <div class="text-gray-400 text-sm">Submitted 2 days ago • Content Review Required</div>
        </div>
        <span class="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">High</span>
      </div>
      
      <div class="flex items-center justify-between py-3">
        <div>
          <div class="text-white font-medium">"Worship & Praise Collection"</div>
          <div class="text-gray-400 text-sm">Submitted 1 day ago • Technical Review Required</div>
        </div>
        <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Normal</span>
      </div>
    </div>
    
    <div class="mt-6">
      <a href="/admin/review" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg inline-block transition-colors">
        Review All Pending Content
      </a>
    </div>
  </div>
</div>