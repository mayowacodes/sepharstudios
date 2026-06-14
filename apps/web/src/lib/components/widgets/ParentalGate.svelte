<!--
  ParentalGate — a child-safe interstitial between the kids detail page's
  Play CTA and the actual /watch route. Asks a multiplication question
  that a young child can't easily solve but an adult will answer in a
  beat. Industry-standard pattern (used by Disney+ Junior, YouTube Kids
  parental controls, Kids+, etc.) — designed to slow down accidental
  purchases / off-platform navigation, not to be cryptographically
  secure.

  Behaviour:
    - Shown only when `open` is true (parent controls visibility).
    - Locks scroll while open.
    - Esc closes it. Click outside the panel closes it.
    - Correct answer → fires `onPass`. Wrong answer → shake + clears
      input, no progress.
    - Three wrong answers in a row → lockout for 30s with a countdown.

  The question generator picks two numbers between 4–12 (excluding 1
  because n*1 is trivial). Resets when the modal re-opens so a passing
  answer can't be reused.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { X } from '@lucide/svelte';

  interface Props {
    open: boolean;
    onPass: () => void;
    onClose: () => void;
  }

  let { open = false, onPass, onClose }: Props = $props();

  // Question state. Regenerated whenever the modal opens. The number
  // range is deliberately the harder end of single-digit multiplication
  // so the puzzle works for the "preschooler hits Play while parent is
  // in the next room" attack model.
  let factorA = $state(0);
  let factorB = $state(0);
  let answer = $state('');
  let wrongAttempts = $state(0);
  let lockoutUntil = $state(0);
  let lockoutRemaining = $state(0);
  let shaking = $state(false);
  let inputEl: HTMLInputElement | null = $state(null);

  function regenerate(): void {
    // 4..12 inclusive. Skips 1 (trivially solvable) but keeps the
    // arithmetic small enough that a paying parent isn't annoyed.
    factorA = 4 + Math.floor(Math.random() * 9);
    factorB = 4 + Math.floor(Math.random() * 9);
    answer = '';
    shaking = false;
  }

  $effect(() => {
    if (open) {
      // Each open gets a fresh question so a passing answer from an
      // earlier open can't be guessed on the next one.
      regenerate();
      // Focus the input on the next tick so it lands after the modal
      // mounts. The optional chain handles the input not being there
      // yet on the very first render.
      queueMicrotask(() => inputEl?.focus());
      // Lock body scroll while modal is up.
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Lockout tick — runs while a lockout is active, updates the visible
  // countdown each second, lifts the lock when the clock runs out.
  onMount(() => {
    const id = setInterval(() => {
      if (lockoutUntil > 0) {
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
        lockoutRemaining = remaining;
        if (remaining === 0) {
          lockoutUntil = 0;
          wrongAttempts = 0;
          regenerate();
        }
      }
    }, 1000);
    return () => clearInterval(id);
  });

  function submit(): void {
    if (lockoutUntil > Date.now()) return;
    const guess = Number.parseInt(answer.trim(), 10);
    if (Number.isFinite(guess) && guess === factorA * factorB) {
      onPass();
    } else {
      shaking = true;
      answer = '';
      wrongAttempts += 1;
      setTimeout(() => { shaking = false; }, 400);
      if (wrongAttempts >= 3) {
        // 30-second cool-down to discourage brute-force guessing by
        // a determined toddler smashing the keypad.
        lockoutUntil = Date.now() + 30_000;
        lockoutRemaining = 30;
      }
      // Re-focus so the user can retry without clicking the field.
      queueMicrotask(() => inputEl?.focus());
    }
  }

  function onKey(e: KeyboardEvent): void {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  }
</script>

<svelte:window onkeydown={onKey} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    role="button"
    tabindex="-1"
    aria-label="Close grown-up check"
    onclick={onClose}
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="w-full max-w-md bg-gradient-to-br from-yellow-50 to-pink-100 rounded-3xl shadow-2xl border-4 border-pink-300 p-6 relative {shaking ? 'animate-pulse' : ''}"
      role="dialog"
      tabindex="-1"
      aria-labelledby="parental-gate-title"
      aria-modal="true"
      onclick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onclick={onClose}
        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-pink-200 hover:bg-pink-300 text-pink-700 flex items-center justify-center"
        aria-label="Close"
      >
        <X class="w-4 h-4" />
      </button>

      <div id="parental-gate-title" class="text-center space-y-1 mb-5">
        <div class="text-3xl">🪧</div>
        <h2 class="text-xl font-bold text-pink-700">Grown-up check!</h2>
        <p class="text-sm text-pink-700/70">Quick math to make sure a grown-up is here.</p>
      </div>

      {#if lockoutUntil > Date.now()}
        <div class="text-center space-y-3 py-4">
          <div class="text-4xl">⏳</div>
          <div class="text-pink-700 font-semibold">Hold on a moment</div>
          <div class="text-sm text-pink-700/70">
            Too many tries. Try again in {lockoutRemaining}s.
          </div>
        </div>
      {:else}
        <div class="space-y-4">
          <div class="text-center text-4xl sm:text-5xl font-bold text-pink-700">
            {factorA} × {factorB} = ?
          </div>
          <input
            bind:this={inputEl}
            bind:value={answer}
            type="number"
            inputmode="numeric"
            placeholder="Your answer"
            class="w-full px-4 py-3 rounded-xl bg-white border-2 border-pink-300 text-pink-800 text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Answer"
          />
          <button
            type="button"
            onclick={submit}
            class="w-full px-4 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold shadow-lg transition-colors"
          >
            I'm a grown-up
          </button>
          {#if wrongAttempts > 0}
            <p class="text-center text-xs text-pink-600/70">
              Not quite — try again. ({3 - wrongAttempts} {3 - wrongAttempts === 1 ? 'try' : 'tries'} left)
            </p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
