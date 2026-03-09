<script lang="ts">
  import { onMount } from 'svelte';
  import BibleQuizCard from '$lib/components/kids/BibleQuizCard.svelte';
  import { BookOpen, Star } from '@lucide/svelte';

  interface ContentItem {
    id: string;
    title: string;
    thumbnail: string | null;
    bibleReference: string | null;
  }

  let items = $state<ContentItem[]>([]);
  let loading = $state(true);
  let selectedContent = $state<ContentItem | null>(null);
  let quizKey = $state(0);

  onMount(async () => {
    try {
      // Fetch kids content that has Bible references
      const res = await fetch('/api/content/kids?hasBibleRef=true&limit=12');
      if (res.ok) items = await res.json();
    } finally {
      loading = false;
    }
  });

  function startQuiz(item: ContentItem) {
    selectedContent = item;
    quizKey++;
  }

  function backToList() {
    selectedContent = null;
  }
</script>

<svelte:head>
  <title>Bible Quiz - Sephar Kids</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-background px-4 py-8">
  <div class="max-w-3xl mx-auto">

    {#if selectedContent}
      <!-- Quiz view -->
      <div>
        <button onclick={backToList} class="flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6 transition-colors">
          ← Back to Bible Stories
        </button>
        {#key quizKey}
          <BibleQuizCard contentId={selectedContent.id} title={selectedContent.title} />
        {/key}
      </div>

    {:else}
      <!-- Story selection -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
          <BookOpen class="w-8 h-8 text-indigo-300" />
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Bible Quiz Time!</h1>
        <p class="text-white/60 text-sm">Pick a story and answer questions to earn STC stars!</p>
      </div>

      {#if loading}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {#each [1,2,3,4,5,6] as _}
            <div class="aspect-square bg-white/5 rounded-2xl animate-pulse"></div>
          {/each}
        </div>
      {:else if items.length === 0}
        <div class="text-center py-16">
          <BookOpen class="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p class="text-white/40 text-sm">No Bible story quizzes available yet.</p>
          <p class="text-white/30 text-xs mt-1">Check back soon!</p>
        </div>
      {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {#each items as item}
            <button
              onclick={() => startQuiz(item)}
              class="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02] text-left"
            >
              {#if item.thumbnail}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
              {/if}
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-3">
                <p class="text-white font-semibold text-sm leading-tight">{item.title}</p>
                {#if item.bibleReference}
                  <p class="text-indigo-300 text-xs mt-0.5">{item.bibleReference}</p>
                {/if}
              </div>
              <div class="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star class="w-2.5 h-2.5 fill-yellow-900" />
                Quiz
              </div>
            </button>
          {/each}
        </div>
      {/if}
    {/if}

  </div>
</div>
