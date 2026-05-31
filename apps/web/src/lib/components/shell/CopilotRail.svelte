<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Sparkles, Send, X, Check, AlertTriangle, Plus, ChevronRight } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { copilotState, resetCopilot, clearQueuedQuery } from './copilot-rail-store';

  interface Props {
    variant: 'creator' | 'admin';
    /** When true, the rail is rendered. When false, only the icon spine
     *  is visible (collapsed). PortalShell owns this state so ⌘J at the
     *  shell level can toggle it. */
    open: boolean;
  }

  let { variant, open = $bindable(true) }: Props = $props();

  let input = $state('');
  let listEl: HTMLDivElement | null = $state(null);

  // If the palette queued a question, replay it on mount.
  onMount(async () => {
    const queued = $copilotState.queuedQuery;
    if (queued) {
      input = queued;
      clearQueuedQuery();
      await tick();
      void send();
    }
  });

  async function send() {
    const text = input.trim();
    if (!text) return;
    if ($copilotState.sending) return;

    copilotState.update((s) => ({
      ...s,
      sending: true,
      messages: [...s.messages, { id: `temp-${Date.now()}`, role: 'user', content: text }]
    }));
    input = '';
    await tick();
    scrollToBottom();

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          variant,
          conversationId: $copilotState.conversationId,
          message: text
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Copilot failed');
      copilotState.update((s) => ({
        ...s,
        conversationId: body.conversationId,
        messages: [...s.messages, ...(body.messages ?? [])],
        pending: body.pendingApproval ?? null
      }));
      await tick();
      scrollToBottom();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Copilot failed');
    } finally {
      copilotState.update((s) => ({ ...s, sending: false }));
    }
  }

  async function approve() {
    const cur = $copilotState;
    if (!cur.pending || !cur.conversationId) return;
    copilotState.update((s) => ({ ...s, sending: true }));
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          actionId: cur.pending.actionId,
          conversationId: cur.conversationId,
          variant
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Approval failed');
      copilotState.update((s) => ({
        ...s,
        messages: [...s.messages, { id: `approved-${Date.now()}`, role: 'assistant', content: `Approved ${body.tool}.` }],
        pending: null
      }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Approval failed');
    } finally {
      copilotState.update((s) => ({ ...s, sending: false }));
    }
  }

  function decline() {
    copilotState.update((s) => ({
      ...s,
      pending: null,
      messages: [...s.messages, { id: `declined-${Date.now()}`, role: 'assistant', content: 'OK — I won\'t take that action.' }]
    }));
  }

  function newChat() {
    resetCopilot();
    input = '';
  }

  function scrollToBottom() {
    if (listEl) listEl.scrollTop = listEl.scrollHeight;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void send();
    }
  }

  const accentClass = $derived(variant === 'admin' ? 'text-red-300' : 'text-purple-300');
  const sendBtnClass = $derived(variant === 'admin' ? 'text-red-300 hover:text-red-200' : 'text-purple-300 hover:text-purple-200');
</script>

<aside
  class="hidden md:flex relative h-full transition-[width] duration-200 border-l border-white/10 surface-glass shrink-0 flex-col {open ? 'w-80' : 'w-12'}"
  aria-label="AI Copilot"
>
  <!-- Collapsed spine — clickable to expand -->
  {#if !open}
    <button
      type="button"
      onclick={() => (open = true)}
      class="flex flex-col items-center gap-3 w-full pt-4 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Open Copilot (⌘J)"
      title="Open Copilot (⌘J)"
    >
      <Sparkles class="w-4 h-4 {accentClass}" />
      <span class="rotate-180 text-[10px] uppercase tracking-wider font-medium" style="writing-mode: vertical-rl;">Copilot ⌘J</span>
    </button>
    {#if $copilotState.messages.length > 0}
      <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true"></span>
    {/if}
  {:else}
    <header class="h-12 px-3 border-b border-white/10 flex items-center gap-2 shrink-0">
      <Sparkles class="w-4 h-4 {accentClass}" />
      <h2 class="text-xs font-semibold text-foreground uppercase tracking-wide">Copilot</h2>
      <span class="text-[10px] {accentClass} font-mono">⌘J</span>
      <span class="flex-1"></span>
      <button
        type="button"
        onclick={newChat}
        class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5"
        title="Start a new chat"
      >
        <Plus class="w-3 h-3" /> New
      </button>
      <button
        type="button"
        onclick={() => (open = false)}
        class="text-muted-foreground hover:text-foreground"
        aria-label="Collapse Copilot (⌘J)"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </header>

    <div bind:this={listEl} class="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
      {#if $copilotState.messages.length === 0}
        <div class="text-center text-muted-foreground text-xs space-y-2 py-8">
          <Sparkles class="w-5 h-5 {accentClass} mx-auto" />
          <p>Ask me anything about your {variant === 'admin' ? 'platform' : 'content'}.</p>
          <p class="text-[10px] text-muted-foreground/70">
            {variant === 'admin'
              ? 'Try: "How many reviews are pending?"'
              : 'Try: "Summarize my last 30 days"'}
          </p>
        </div>
      {/if}

      {#each $copilotState.messages as m (m.id)}
        {#if m.role === 'user'}
          <div class="flex justify-end" in:fly={{ y: 8, duration: 180 }}>
            <div class="max-w-[85%] bg-primary text-primary-foreground text-xs rounded-lg px-2.5 py-1.5">{m.content}</div>
          </div>
        {:else if m.role === 'tool'}
          <div class="surface-2 rounded-lg px-2.5 py-1.5 text-[11px]" in:fly={{ y: 8, duration: 180 }}>
            <div class="text-[9px] uppercase tracking-wide {accentClass} mb-0.5">Tool: {m.toolName ?? '?'}</div>
            <pre class="whitespace-pre-wrap text-foreground/80 max-h-24 overflow-y-auto">{m.content.length > 400 ? m.content.slice(0, 400) + '…' : m.content}</pre>
          </div>
        {:else}
          <div class="flex justify-start" in:fly={{ y: 8, duration: 180 }}>
            <div class="max-w-[85%] surface-1 text-foreground text-xs rounded-lg px-2.5 py-1.5 whitespace-pre-line">{m.content}</div>
          </div>
        {/if}
      {/each}

      {#if $copilotState.pending}
        <div class="border border-yellow-500/40 bg-yellow-500/10 rounded-lg p-2.5 space-y-2">
          <div class="flex items-center gap-1.5 text-[11px] text-yellow-200">
            <AlertTriangle class="w-3 h-3" />
            Approval required: {$copilotState.pending.tool}
          </div>
          <pre class="text-[10px] text-yellow-100 bg-black/30 rounded p-1.5 overflow-x-auto max-h-32">{JSON.stringify($copilotState.pending.preview, null, 2)}</pre>
          <div class="flex gap-1.5 justify-end">
            <button type="button" onclick={decline} class="text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-foreground">Decline</button>
            <button type="button" onclick={approve} disabled={$copilotState.sending} class="text-[11px] px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white inline-flex items-center gap-0.5">
              <Check class="w-3 h-3" /> Confirm
            </button>
          </div>
        </div>
      {/if}

      {#if $copilotState.sending}
        <div class="text-[11px] text-muted-foreground italic">Thinking…</div>
      {/if}
    </div>

    <footer class="border-t border-white/10 p-2 shrink-0">
      <div class="relative">
        <textarea
          bind:value={input}
          onkeydown={onKeydown}
          rows="2"
          placeholder="Ask the Copilot…"
          class="w-full surface-1 rounded-lg pl-2.5 pr-8 py-1.5 text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground"
        ></textarea>
        <button
          type="button"
          onclick={send}
          disabled={$copilotState.sending || !input.trim()}
          class="absolute right-1.5 bottom-1.5 {sendBtnClass} disabled:opacity-40"
          aria-label="Send"
        >
          <Send class="w-3.5 h-3.5" />
        </button>
      </div>
      <div class="text-[9px] text-muted-foreground mt-0.5">⌘+Enter to send</div>
    </footer>
  {/if}
</aside>
