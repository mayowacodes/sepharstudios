<!-- Creator Forum — backed by /api/forum/threads -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { MessagesSquare, Plus } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';

  interface ThreadRow {
    id: string;
    title: string;
    category: string;
    body: string;
    isSticky: boolean;
    isLocked: boolean;
    likeCount: number;
    replyCount: number;
    lastReplyAt: string | null;
    createdAt: string;
    authorId: string | null;
    authorName: string | null;
    authorImage: string | null;
  }

  const categories = [
    { id: 'all', title: 'All Topics', icon: '💬', color: 'purple' },
    { id: 'getting-started', title: 'Getting Started', icon: '🚀', color: 'blue' },
    { id: 'technical', title: 'Technical Help', icon: '⚙️', color: 'green' },
    { id: 'content-creation', title: 'Content Creation', icon: '🎬', color: 'orange' },
    { id: 'ministry', title: 'Ministry & Faith', icon: '✝️', color: 'yellow' },
    { id: 'community', title: 'Community', icon: '❤️', color: 'red' }
  ];

  let activeCategory = $state('all');
  let searchTerm = $state('');
  let sort = $state<'latest' | 'top'>('latest');
  let threads = $state<ThreadRow[]>([]);
  let page = $state(1);
  let hasMore = $state(false);
  let loading = $state(true);
  let total = $state(0);

  let searchDebounceTimer: ReturnType<typeof setTimeout> | undefined;

  async function loadThreads() {
    loading = true;
    try {
      const params = new URLSearchParams({
        category: activeCategory,
        sort,
        page: String(page)
      });
      if (searchTerm.trim()) params.set('q', searchTerm.trim());

      const res = await fetch(`/api/forum/threads?${params}`);
      const body = await res.json();
      threads = body.threads ?? [];
      total = body.total ?? 0;
      hasMore = !!body.hasMore;
    } catch (err) {
      console.error('Forum load failed:', err);
      threads = [];
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    // refetch on filter/sort/page change
    activeCategory; sort; page;
    void loadThreads();
  });

  function onSearchInput() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      page = 1;
      void loadThreads();
    }, 300);
  }

  function categoryTitle(id: string): string {
    return categories.find(c => c.id === id)?.title ?? id;
  }
  function categoryColor(id: string): string {
    return categories.find(c => c.id === id)?.color ?? 'gray';
  }
  function relativeTime(iso: string | null): string {
    if (!iso) return '';
    const t = new Date(iso).getTime();
    const diff = Date.now() - t;
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return new Date(iso).toLocaleDateString();
  }
</script>

<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">
  <PortalHero
    compact
    eyebrow="Community"
    title="Forum"
    subtitle="Connect, learn, and grow with fellow faith-based creators."
    icon={MessagesSquare}
  >
    {#snippet actions()}
      <PortalButton variant="primary" size="sm" onclick={() => goto('/creator/forum/new')}>
        <Plus class="w-3.5 h-3.5" /> New discussion
      </PortalButton>
    {/snippet}
  </PortalHero>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Sidebar -->
    <div class="lg:col-span-1 space-y-6">
      <!-- Categories -->
      <div class="surface-2 backdrop-blur-sm rounded-xl p-4">
        <h3 class="text-lg font-bold text-foreground mb-4">Categories</h3>
        <nav class="space-y-2">
          {#each categories as category (category.id)}
            <button
              type="button"
              onclick={() => { activeCategory = category.id; page = 1; }}
              class="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 {activeCategory === category.id ? 'bg-purple-600 text-foreground' : 'text-foreground/80 hover:text-white hover:surface-2'}"
            >
              <span>{category.icon}</span>
              <span class="text-sm font-medium">{category.title}</span>
            </button>
          {/each}
        </nav>
      </div>

      <!-- Quick Links -->
      <div class="surface-2 backdrop-blur-sm rounded-xl p-4">
        <h3 class="text-lg font-bold text-foreground mb-4">Quick Links</h3>
        <div class="space-y-2">
          <a href="/creator/guidelines" class="block text-foreground/80 hover:text-foreground text-sm">📋 Content Guidelines</a>
          <a href="/creator/tech-support" class="block text-foreground/80 hover:text-foreground text-sm">🆘 Get Support</a>
          <a href="/creator/events" class="block text-foreground/80 hover:text-foreground text-sm">📅 Upcoming Events</a>
        </div>
      </div>

      <!-- Community Guidelines -->
      <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">
        <h3 class="text-sm font-bold text-foreground mb-2">💛 Community Guidelines</h3>
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
      <div class="surface-2 backdrop-blur-sm rounded-xl p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              bind:value={searchTerm}
              oninput={onSearchInput}
              placeholder="Search discussions..."
              class="w-full px-4 py-2 surface-2 border border-border rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div class="flex gap-2">
            <select
              bind:value={sort}
              onchange={() => { page = 1; }}
              class="px-4 py-2 surface-2 border border-border rounded-lg text-foreground focus:outline-none"
            >
              <option value="latest">Most Recent</option>
              <option value="top">Most Liked</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Forum Threads -->
      {#if loading && threads.length === 0}
        <div class="text-center text-muted-foreground py-12">Loading discussions…</div>
      {:else if threads.length === 0}
        <div class="surface-1 border border-border/40 rounded-xl p-12 text-center">
          <p class="text-foreground/80">No discussions yet in this category.</p>
          <button
            type="button"
            onclick={() => goto('/creator/forum/new')}
            class="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Be the first to post
          </button>
        </div>
      {:else}
        <div class="space-y-4">
          {#each threads as thread (thread.id)}
            <a
              href={`/creator/forum/${thread.id}`}
              class="block surface-2 backdrop-blur-sm rounded-xl p-6 hover:surface-3 transition-colors"
            >
              <div class="flex items-start space-x-4">
                <div class="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold shrink-0">
                  {(thread.authorName ?? '?').charAt(0).toUpperCase()}
                </div>
                <div class="flex-1">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1 flex-wrap">
                        {#if thread.isSticky}<span class="text-yellow-400" title="Pinned">📌</span>{/if}
                        {#if thread.isLocked}<span class="text-red-400" title="Locked">🔒</span>{/if}
                        <h3 class="text-lg font-medium text-foreground">{thread.title}</h3>
                        <span class="bg-{categoryColor(thread.category)}-600/40 text-{categoryColor(thread.category)}-100 text-xs px-2 py-1 rounded">
                          {categoryTitle(thread.category)}
                        </span>
                      </div>
                      <p class="text-foreground/80 text-sm mb-2 line-clamp-2">{thread.body}</p>
                      <div class="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>by <strong class="text-purple-400">{thread.authorName ?? 'unknown'}</strong></span>
                        <span>•</span>
                        <span>{relativeTime(thread.lastReplyAt ?? thread.createdAt)}</span>
                      </div>
                    </div>
                    <div class="text-right space-y-1 shrink-0">
                      <div class="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span class="flex items-center"><span class="mr-1">💬</span>{thread.replyCount}</span>
                        <span class="flex items-center"><span class="mr-1">❤️</span>{thread.likeCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          {/each}
        </div>

        <!-- Pagination -->
        <div class="flex justify-center items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onclick={() => page = Math.max(1, page - 1)}
            class="px-3 py-2 surface-2 rounded-lg text-foreground/80 hover:text-foreground disabled:opacity-40"
          >Previous</button>
          <span class="text-sm text-muted-foreground px-2">Page {page}</span>
          <button
            type="button"
            disabled={!hasMore}
            onclick={() => page = page + 1}
            class="px-3 py-2 surface-2 rounded-lg text-foreground/80 hover:text-foreground disabled:opacity-40"
          >Next</button>
          {#if total > 0}
            <span class="text-xs text-muted-foreground ml-2">{total} total</span>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
