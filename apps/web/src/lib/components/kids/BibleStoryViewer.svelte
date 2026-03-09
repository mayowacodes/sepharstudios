<script lang="ts">
  import { onDestroy } from 'svelte';

  interface StoryPage {
    text: string;
    imageUrl?: string;
  }

  interface Props {
    title: string;
    bibleReference: string;
    pages: StoryPage[];
    storyId: string;
    onComplete?: () => void;
  }

  let { title, bibleReference, pages, storyId, onComplete }: Props = $props();

  let currentPage = $state(0);
  let reading = $state(false);
  let utterance: SpeechSynthesisUtterance | null = null;

  const totalPages = $derived(pages.length);
  const isFirst = $derived(currentPage === 0);
  const isLast = $derived(currentPage === totalPages - 1);
  const progress = $derived(Math.round(((currentPage + 1) / totalPages) * 100));

  function nextPage() {
    if (!isLast) {
      stopReading();
      currentPage++;
    } else {
      stopReading();
      onComplete?.();
    }
  }

  function prevPage() {
    if (!isFirst) {
      stopReading();
      currentPage--;
    }
  }

  function startReading() {
    if (!('speechSynthesis' in window)) return;
    stopReading();
    utterance = new SpeechSynthesisUtterance(pages[currentPage].text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onend = () => { reading = false; };
    utterance.onerror = () => { reading = false; };
    speechSynthesis.speak(utterance);
    reading = true;
  }

  function stopReading() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    reading = false;
    utterance = null;
  }

  onDestroy(() => stopReading());
</script>

<div class="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl overflow-hidden shadow-xl max-w-2xl mx-auto">
  <!-- Header -->
  <div class="bg-gradient-to-r from-amber-500 to-orange-400 px-6 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-white font-bold text-lg leading-tight">{title}</h2>
        <p class="text-amber-100 text-xs">📖 {bibleReference}</p>
      </div>
      <div class="text-amber-100 text-sm font-medium">
        {currentPage + 1} / {totalPages}
      </div>
    </div>
    <!-- Progress bar -->
    <div class="mt-3 h-2 bg-amber-300/40 rounded-full overflow-hidden">
      <div
        class="h-full bg-white rounded-full transition-all duration-500"
        style="width: {progress}%"
      ></div>
    </div>
  </div>

  <!-- Story page -->
  <div class="p-6 min-h-64">
    {#if pages[currentPage]?.imageUrl}
      <img
        src={pages[currentPage].imageUrl}
        alt="Story illustration"
        class="w-full rounded-2xl mb-5 object-cover max-h-48 shadow-md"
      />
    {/if}

    <p class="text-gray-800 text-lg leading-relaxed font-medium text-center">
      {pages[currentPage]?.text ?? ''}
    </p>
  </div>

  <!-- Controls -->
  <div class="px-6 pb-6 flex items-center gap-3">
    <button
      onclick={prevPage}
      disabled={isFirst}
      class="w-12 h-12 rounded-full bg-amber-200 hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-amber-800 text-xl font-bold transition-colors"
      aria-label="Previous page"
    >
      ←
    </button>

    <!-- TTS button -->
    <button
      onclick={reading ? stopReading : startReading}
      class="flex-1 py-3 rounded-2xl font-bold text-sm transition-colors {reading ? 'bg-red-400 hover:bg-red-500 text-white' : 'bg-amber-300 hover:bg-amber-400 text-amber-900'}"
    >
      {reading ? '⏹ Stop Reading' : '🔊 Read Aloud'}
    </button>

    <button
      onclick={nextPage}
      class="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white text-xl font-bold shadow-md transition-colors"
      aria-label={isLast ? 'Finish story' : 'Next page'}
    >
      {isLast ? '✓' : '→'}
    </button>
  </div>
</div>
