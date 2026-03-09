<script lang="ts">
  import { onMount } from 'svelte';

  interface Question {
    question: string;
    options: string[];
  }

  interface Props {
    contentId?: string;
    title?: string;
    sessionId?: string;
    questions?: Question[];
    onComplete?: (score: number, total: number, passed: boolean) => void;
  }

  let { contentId, sessionId, questions, onComplete }: Props = $props();
  let activeSessionId = $state(sessionId ?? '');
  let quizQuestions = $state<Question[]>(questions ?? []);
  let loadingQuiz = $state(false);

  let current = $state(0);
  let answers = $state<number[]>([]);
  let selected = $state<number | null>(null);
  let revealed = $state(false);
  let submitting = $state(false);
  let result = $state<{ score: number; total: number; passed: boolean; results: { correct: boolean; correctIndex: number }[] } | null>(null);

  onMount(async () => {
    if (!contentId || quizQuestions.length > 0) return;
    loadingQuiz = true;
    try {
      const res = await fetch('/api/kids/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId })
      });
      if (!res.ok) return;
      const data = await res.json() as { sessionId: string; questions: Question[] };
      activeSessionId = data.sessionId;
      quizQuestions = data.questions ?? [];
    } finally {
      loadingQuiz = false;
    }
  });

  function choose(idx: number) {
    if (revealed) return;
    selected = idx;
    revealed = true;
    answers = [...answers, idx];
  }

  async function next() {
    if (current < quizQuestions.length - 1) {
      current++;
      selected = null;
      revealed = false;
      return;
    }

    submitting = true;
    try {
      const res = await fetch('/api/kids/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: activeSessionId, answers })
      });
      const data = await res.json();
      result = data;
      onComplete?.(data.score, data.total, data.passed);
    } finally {
      submitting = false;
    }
  }

  const q = $derived(quizQuestions[current]);
</script>

<div class="bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 space-y-5 max-w-lg mx-auto">
  {#if result}
    <div class="text-center space-y-4 py-4">
      <div class="text-5xl">{result.passed ? 'Passed' : 'Try Again'}</div>
      <h2 class="text-white text-xl font-bold">
        {result.passed ? 'Great job!' : 'Good try!'}
      </h2>
      <p class="text-gray-400">You got <strong class="text-white">{result.score}</strong> out of <strong class="text-white">{result.total}</strong> correct!</p>
      {#if result.passed}
        <div class="bg-[#FFBF00]/10 border border-[#FFBF00]/30 rounded-xl p-4 text-[#FFBF00] text-sm">
          You passed and may have earned STC tokens.
        </div>
      {:else}
        <p class="text-gray-400 text-sm">Try again to improve your score.</p>
      {/if}
    </div>
  {:else if loadingQuiz}
    <div class="text-center text-gray-400 text-sm py-8">Preparing quiz...</div>
  {:else if !q}
    <div class="text-center text-gray-400 text-sm py-8">Quiz is not available right now.</div>
  {:else}
    <div class="flex items-center gap-3">
      <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          class="h-full bg-[#FFBF00] rounded-full transition-all duration-500"
          style="width: {((current) / quizQuestions.length) * 100}%"
        ></div>
      </div>
      <span class="text-gray-400 text-xs shrink-0">{current + 1} / {quizQuestions.length}</span>
    </div>

    <div class="space-y-2">
      <div class="text-xs text-[#FFBF00] font-semibold uppercase tracking-wider">Question {current + 1}</div>
      <h3 class="text-white font-semibold text-base leading-snug">{q.question}</h3>
    </div>

    <div class="grid gap-2">
      {#each q.options as option, i}
        <button
          onclick={() => choose(i)}
          disabled={revealed}
          class="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all
            {!revealed
              ? 'border-white/10 bg-white/5 text-gray-200 hover:border-[#FFBF00]/40 hover:bg-[#FFBF00]/5'
              : selected === i
                ? 'border-[#FFBF00] bg-[#FFBF00]/10 text-[#FFBF00]'
                : 'border-white/5 bg-white/3 text-gray-500'}"
        >
          <span class="mr-2 text-gray-500">{String.fromCharCode(65 + i)}.</span>{option}
        </button>
      {/each}
    </div>

    {#if revealed}
      <button
        onclick={next}
        disabled={submitting}
        class="w-full bg-[#FFBF00] hover:bg-[#FFBF00]/90 disabled:opacity-50 text-black font-semibold py-3 rounded-xl transition-colors"
      >
        {submitting ? 'Finishing...' : current < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
      </button>
    {/if}
  {/if}
</div>
