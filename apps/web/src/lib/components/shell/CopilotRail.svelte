<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Sparkles, Send, X, Check, AlertTriangle, Plus, ChevronRight, StopCircle, RotateCw, History } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { Chat } from '@ai-sdk/svelte';
  import { DefaultChatTransport, type UIMessage } from 'ai';
  import { copilotState, clearQueuedQuery } from './copilot-rail-store';

  interface Props {
    variant: 'creator' | 'admin';
    /** When true, the rail is rendered. When false, only the icon spine
     *  is visible (collapsed). PortalShell owns this state so ⌘J at the
     *  shell level can toggle it. */
    open: boolean;
  }

  let { variant, open = $bindable(true) }: Props = $props();

  // The Chat instance from @ai-sdk/svelte owns ALL the message state, the
  // streaming lifecycle, and the abort/regenerate primitives. We just
  // give it the endpoint and let it run. The variant is passed via `body`
  // so it isn't polluting the messages array — that's the canonical
  // multi-tenant pattern from the Vercel AI SDK production guide.
  let input = $state('');
  let listEl: HTMLDivElement | null = $state(null);
  let conversationId = $state<string | null>(null);
  let conversations = $state<Array<{ id: string; title: string; updatedAt: string }>>([]);
  let showHistory = $state(false);
  let loadingConversation = $state(false);

  const chat = new Chat({
    transport: new DefaultChatTransport({
      api: '/api/ai/copilot',
      body: () => ({
        variant,
        conversationId
      })
    }),
    onFinish: () => {
      void tick().then(scrollToBottom);
      // Refresh the conversation list whenever a turn settles so the
      // history dropdown's recency ordering stays accurate.
      void refreshConversations();
    },
    onError: (err: Error) => {
      console.error('[copilot] chat error:', err);
      toast.error(err.message || 'Copilot is unavailable.');
    }
  });

  // On first mount: replay any palette-queued question AND load the
  // signed-in user's recent conversations into the switcher dropdown.
  onMount(async () => {
    await refreshConversations();
    const queued = $copilotState.queuedQuery;
    if (queued) {
      clearQueuedQuery();
      await chat.sendMessage({ text: queued });
    }
  });

  async function refreshConversations() {
    try {
      const res = await fetch(`/api/ai/copilot/conversations?variant=${variant}`);
      if (!res.ok) return;
      const body = await res.json().catch(() => ({} as { conversations?: Array<{ id: string; title: string; updatedAt: string }> }));
      conversations = body.conversations ?? [];
    } catch (err) {
      console.warn('[copilot] failed to load conversation list:', err);
    }
  }

  async function loadConversation(id: string) {
    if (loadingConversation || id === conversationId) {
      showHistory = false;
      return;
    }
    loadingConversation = true;
    try {
      const res = await fetch(`/api/ai/copilot/conversations?id=${encodeURIComponent(id)}`);
      if (!res.ok) {
        toast.error(`Couldn't load conversation (HTTP ${res.status}).`);
        return;
      }
      const body = await res.json().catch(() => ({} as { initialMessages?: UIMessage[] }));
      const restored = (body.initialMessages ?? []) as UIMessage[];
      chat.messages = restored;
      conversationId = id;
      showHistory = false;
      await tick();
      scrollToBottom();
    } catch (err) {
      console.error('[copilot] loadConversation failed:', err);
      toast.error('Could not load that conversation.');
    } finally {
      loadingConversation = false;
    }
  }

  function send() {
    const text = input.trim();
    if (!text) return;
    if (chat.status === 'submitted' || chat.status === 'streaming') return;
    input = '';
    void chat.sendMessage({ text });
  }

  async function approveAction(actionId: string) {
    try {
      const res = await fetch('/api/ai/copilot/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId })
      });
      const body = await res.json().catch(() => ({} as { error?: string; tool?: string }));
      if (!res.ok) throw new Error(body.error ?? `Approve failed (HTTP ${res.status})`);
      toast.success(`Approved ${body.tool ?? 'action'}.`);
      // Re-prompt the model so it summarizes the approval into the thread.
      await chat.regenerate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Approve failed');
    }
  }

  function newChat() {
    chat.messages = [];
    conversationId = null;
    input = '';
    showHistory = false;
  }

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d`;
    return new Date(iso).toLocaleDateString();
  }

  function scrollToBottom() {
    if (listEl) listEl.scrollTop = listEl.scrollHeight;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  }

  // Helpers for rendering tool result parts. A streamed part has type
  // 'tool-<toolName>' and may carry an `output` shaped as either a
  // result payload OR the approval-gate envelope from buildCopilotTools.
  type ApprovalOutput = {
    approval: 'required' | 'failed';
    actionId?: string;
    tool?: string;
    preview?: unknown;
    error?: string;
  };
  function isApprovalRequired(output: unknown): output is ApprovalOutput & { approval: 'required'; actionId: string } {
    return !!output && typeof output === 'object'
      && (output as ApprovalOutput).approval === 'required'
      && typeof (output as ApprovalOutput).actionId === 'string';
  }

  const accentClass = $derived(variant === 'admin' ? 'text-red-300' : 'text-purple-300');
  const sendBtnClass = $derived(variant === 'admin' ? 'text-red-300 hover:text-red-200' : 'text-purple-300 hover:text-purple-200');
  const streaming = $derived(chat.status === 'submitted' || chat.status === 'streaming');
  const canSend = $derived(!streaming && input.trim().length > 0);
</script>

<!-- Rail fully collapses to width 0 when closed so the main pane
     reclaims the entire right column. Re-open via the Copilot chip
     in the header or the ⌘J keybind. The old "icon strip when
     collapsed" pattern (a 48px vertical column with a rotated label)
     was visually intrusive when the creator just wanted the AI gone. -->
<aside
  class="hidden md:flex relative h-full transition-[width] duration-200 border-l border-white/10 surface-glass shrink-0 flex-col overflow-hidden {open ? 'w-80' : 'w-0 border-l-0'}"
  aria-label="AI Copilot"
  aria-hidden={!open}
>
  {#if open}
    <header class="h-12 px-3 border-b border-white/10 flex items-center gap-2 shrink-0 relative">
      <Sparkles class="w-4 h-4 {accentClass}" />
      <h2 class="text-xs font-semibold text-foreground uppercase tracking-wide">Copilot</h2>
      <span class="text-[10px] {accentClass} font-mono">⌘J</span>
      <span class="flex-1"></span>
      {#if conversations.length > 0}
        <button
          type="button"
          onclick={() => (showHistory = !showHistory)}
          class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5"
          title="Recent conversations"
          aria-expanded={showHistory}
        >
          <History class="w-3 h-3" /> History
        </button>
      {/if}
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

      {#if showHistory}
        <!-- Conversation switcher: last 20 chats for this variant, most
             recently updated first. Click → loadConversation(id) replaces
             chat.messages with the restored UIMessage[]. -->
        <div
          class="absolute top-12 right-2 w-64 max-h-72 overflow-y-auto surface-2 border border-border/40 rounded-lg shadow-xl z-10 p-1 space-y-0.5"
          role="menu"
        >
          {#each conversations as c (c.id)}
            <button
              type="button"
              onclick={() => loadConversation(c.id)}
              disabled={loadingConversation}
              class="w-full text-left px-2 py-1.5 rounded hover:surface-3 disabled:opacity-50 text-xs {c.id === conversationId ? `${accentClass} font-medium` : 'text-foreground/90'}"
            >
              <div class="truncate">{c.title || 'Untitled'}</div>
              <div class="text-[10px] text-muted-foreground">{relativeTime(c.updatedAt)} ago</div>
            </button>
          {/each}
        </div>
      {/if}
    </header>

    <div bind:this={listEl} class="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
      {#if chat.messages.length === 0}
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

      {#each chat.messages as m (m.id)}
        {#if m.role === 'user'}
          <div class="flex justify-end" in:fly={{ y: 8, duration: 180 }}>
            <div class="max-w-[85%] bg-primary text-primary-foreground text-xs rounded-lg px-2.5 py-1.5 whitespace-pre-line">
              {#each m.parts as part (part)}
                {#if part.type === 'text'}{part.text}{/if}
              {/each}
            </div>
          </div>
        {:else}
          {#each m.parts as part, partIdx (partIdx)}
            {#if part.type === 'text'}
              <div class="flex justify-start" in:fly={{ y: 8, duration: 180 }}>
                <div class="max-w-[85%] surface-1 text-foreground text-xs rounded-lg px-2.5 py-1.5 whitespace-pre-line">{part.text}</div>
              </div>
            {:else if part.type.startsWith('tool-')}
              {@const toolName = part.type.slice('tool-'.length)}
              {@const toolPart = part as { type: string; state?: string; input?: unknown; output?: unknown; errorText?: string }}
              <div class="surface-2 rounded-lg px-2.5 py-1.5 text-[11px]" in:fly={{ y: 8, duration: 180 }}>
                <div class="text-[9px] uppercase tracking-wide {accentClass} mb-0.5">Tool: {toolName}</div>
                {#if toolPart.state === 'input-streaming' || toolPart.state === 'input-available'}
                  <div class="text-[10px] text-muted-foreground italic">Running…</div>
                {:else if toolPart.state === 'output-error'}
                  <div class="text-[10px] text-red-300">Error: {toolPart.errorText ?? 'tool failed'}</div>
                {:else if isApprovalRequired(toolPart.output)}
                  {@const approval = toolPart.output}
                  <div class="border border-yellow-500/40 bg-yellow-500/10 rounded-lg p-2 space-y-2 mt-1">
                    <div class="flex items-center gap-1.5 text-[11px] text-yellow-200">
                      <AlertTriangle class="w-3 h-3" />
                      Approval required: {approval.tool ?? toolName}
                    </div>
                    <pre class="text-[10px] text-yellow-100 bg-black/30 rounded p-1.5 overflow-x-auto max-h-32">{JSON.stringify(approval.preview, null, 2)}</pre>
                    <div class="flex gap-1.5 justify-end">
                      <button
                        type="button"
                        onclick={() => approveAction(approval.actionId)}
                        disabled={streaming}
                        class="text-[11px] px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white inline-flex items-center gap-0.5"
                      >
                        <Check class="w-3 h-3" /> Confirm
                      </button>
                    </div>
                  </div>
                {:else if toolPart.output !== undefined}
                  <pre class="whitespace-pre-wrap text-foreground/80 max-h-24 overflow-y-auto">{JSON.stringify(toolPart.output).slice(0, 400)}</pre>
                {/if}
              </div>
            {/if}
          {/each}
        {/if}
      {/each}

      {#if chat.status === 'submitted'}
        <div class="text-[11px] text-muted-foreground italic">Thinking…</div>
      {/if}
      {#if chat.error}
        <div class="text-[11px] text-red-300 bg-red-500/10 border border-red-500/30 rounded px-2 py-1">
          ⚠️ {chat.error.message}
        </div>
      {/if}
    </div>

    <footer class="border-t border-white/10 p-2 shrink-0">
      <div class="relative">
        <textarea
          bind:value={input}
          onkeydown={onKeydown}
          rows="2"
          placeholder="Ask the Copilot…"
          class="w-full surface-1 rounded-lg pl-2.5 pr-16 py-1.5 text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground"
        ></textarea>
        {#if streaming}
          <button
            type="button"
            onclick={() => chat.stop()}
            class="absolute right-8 bottom-1.5 text-muted-foreground hover:text-foreground"
            aria-label="Stop"
            title="Stop generating"
          >
            <StopCircle class="w-3.5 h-3.5" />
          </button>
        {:else if chat.messages.length > 0}
          <button
            type="button"
            onclick={() => chat.regenerate()}
            class="absolute right-8 bottom-1.5 text-muted-foreground hover:text-foreground"
            aria-label="Regenerate"
            title="Regenerate last response"
          >
            <RotateCw class="w-3.5 h-3.5" />
          </button>
        {/if}
        <button
          type="button"
          onclick={send}
          disabled={!canSend}
          class="absolute right-1.5 bottom-1.5 {sendBtnClass} disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 disabled:hover:scale-100 transition-transform"
          aria-label="Send"
        >
          <Send class="w-3.5 h-3.5" />
        </button>
      </div>
      <div class="text-[9px] text-muted-foreground mt-0.5">⌘+Enter to send</div>
    </footer>
  {/if}
</aside>
