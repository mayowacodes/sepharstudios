<script lang="ts">
  import { tick } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Sparkles, Send, X, Check, AlertTriangle, StopCircle, RotateCw } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { Chat } from '@ai-sdk/svelte';
  import { DefaultChatTransport } from 'ai';

  interface Props {
    open: boolean;
    variant: 'creator' | 'admin';
  }

  let { open = $bindable(false), variant }: Props = $props();

  let input = $state('');
  let listEl: HTMLDivElement | null = $state(null);
  let conversationId = $state<string | null>(null);

  // Same Chat-class architecture as CopilotRail — different chrome.
  // Streaming tokens render directly into chat.messages[].parts as they
  // arrive on the wire, eliminating the 10-30s silent wait that
  // previously made users think the Send button was broken.
  const chat = new Chat({
    transport: new DefaultChatTransport({
      api: '/api/ai/copilot',
      body: () => ({ variant, conversationId })
    }),
    onFinish: () => {
      void tick().then(scrollToBottom);
    },
    onError: (err: Error) => {
      console.error('[copilot-panel] chat error:', err);
      toast.error(err.message || 'Copilot is unavailable.');
    }
  });

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
      await chat.regenerate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Approve failed');
    }
  }

  function newChat() {
    chat.messages = [];
    conversationId = null;
    input = '';
  }

  function scrollToBottom() {
    if (listEl) listEl.scrollTop = listEl.scrollHeight;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
    if (e.key === 'Escape') open = false;
  }

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

  const streaming = $derived(chat.status === 'submitted' || chat.status === 'streaming');
  const canSend = $derived(!streaming && input.trim().length > 0);
</script>

{#if open}
  <div
    in:fly={{ x: 32, duration: 220 }}
    out:fly={{ x: 32, duration: 180 }}
    class="fixed bottom-4 right-4 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)] surface-3 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col overflow-hidden"
    role="dialog"
    aria-label="Sephar Studios Copilot"
  >
    <!-- Header -->
    <header class="px-4 py-3 border-b border-white/10 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-purple-300" />
        <h2 class="text-sm font-semibold text-white">
          {variant === 'admin' ? 'Admin' : 'Creator'} Copilot
        </h2>
        <span class="text-[10px] text-purple-300 font-mono">⌘J</span>
      </div>
      <div class="flex items-center gap-1">
        <button type="button" onclick={newChat} class="text-xs text-gray-400 hover:text-white">New chat</button>
        <button type="button" onclick={() => (open = false)} class="text-gray-400 hover:text-white" aria-label="Close">
          <X class="w-4 h-4" />
        </button>
      </div>
    </header>

    <!-- Message list -->
    <div bind:this={listEl} class="flex-1 overflow-y-auto p-4 space-y-3">
      {#if chat.messages.length === 0}
        <div class="text-center text-gray-400 text-sm space-y-2 py-8">
          <Sparkles class="w-6 h-6 text-purple-300 mx-auto" />
          <p>Ask me anything about your {variant === 'admin' ? 'platform' : 'content'}.</p>
          <p class="text-xs text-gray-500">
            {variant === 'admin'
              ? 'Try: "Which creators have pending applications?" or "Find user by email"'
              : 'Try: "Summarize my last 30 days" or "Find my highest-performing content"'}
          </p>
        </div>
      {/if}

      {#each chat.messages as m (m.id)}
        {#if m.role === 'user'}
          <div class="flex justify-end">
            <div class="max-w-[80%] bg-purple-600 text-white text-sm rounded-lg px-3 py-2 whitespace-pre-line">
              {#each m.parts as part (part)}
                {#if part.type === 'text'}{part.text}{/if}
              {/each}
            </div>
          </div>
        {:else}
          {#each m.parts as part, partIdx (partIdx)}
            {#if part.type === 'text'}
              <div class="flex justify-start">
                <div class="max-w-[80%] bg-white/10 text-gray-100 text-sm rounded-lg px-3 py-2 whitespace-pre-line">{part.text}</div>
              </div>
            {:else if part.type.startsWith('tool-')}
              {@const toolName = part.type.slice('tool-'.length)}
              {@const toolPart = part as { type: string; state?: string; input?: unknown; output?: unknown; errorText?: string }}
              <div class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs">
                <div class="text-[10px] uppercase tracking-wide text-purple-300 mb-1">Tool: {toolName}</div>
                {#if toolPart.state === 'input-streaming' || toolPart.state === 'input-available'}
                  <div class="text-[11px] text-gray-400 italic">Running…</div>
                {:else if toolPart.state === 'output-error'}
                  <div class="text-[11px] text-red-300">Error: {toolPart.errorText ?? 'tool failed'}</div>
                {:else if isApprovalRequired(toolPart.output)}
                  {@const approval = toolPart.output}
                  <div class="border border-yellow-500/40 bg-yellow-500/10 rounded-lg p-3 space-y-2 mt-1">
                    <div class="flex items-center gap-2 text-xs text-yellow-200">
                      <AlertTriangle class="w-3.5 h-3.5" />
                      Approval required: {approval.tool ?? toolName}
                    </div>
                    <pre class="text-[11px] text-yellow-100 bg-black/30 rounded p-2 overflow-x-auto">{JSON.stringify(approval.preview, null, 2)}</pre>
                    <div class="flex gap-2 justify-end">
                      <button
                        type="button"
                        onclick={() => approveAction(approval.actionId)}
                        disabled={streaming}
                        class="text-xs px-3 py-1.5 rounded bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white inline-flex items-center gap-1"
                      >
                        <Check class="w-3 h-3" /> Confirm
                      </button>
                    </div>
                  </div>
                {:else if toolPart.output !== undefined}
                  <pre class="whitespace-pre-wrap text-gray-300 max-h-32 overflow-y-auto">{JSON.stringify(toolPart.output).slice(0, 600)}</pre>
                {/if}
              </div>
            {/if}
          {/each}
        {/if}
      {/each}

      {#if chat.status === 'submitted'}
        <div class="text-xs text-gray-500 italic">Thinking…</div>
      {/if}
      {#if chat.error}
        <div class="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded px-2 py-1">
          ⚠️ {chat.error.message}
        </div>
      {/if}
    </div>

    <!-- Compose -->
    <footer class="border-t border-white/10 p-3">
      <div class="relative">
        <textarea
          bind:value={input}
          onkeydown={onKeydown}
          rows="2"
          placeholder="Ask the Copilot…"
          class="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-20 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        ></textarea>
        {#if streaming}
          <button
            type="button"
            onclick={() => chat.stop()}
            class="absolute right-10 bottom-2 text-gray-400 hover:text-white"
            aria-label="Stop"
            title="Stop generating"
          >
            <StopCircle class="w-4 h-4" />
          </button>
        {:else if chat.messages.length > 0}
          <button
            type="button"
            onclick={() => chat.regenerate()}
            class="absolute right-10 bottom-2 text-gray-400 hover:text-white"
            aria-label="Regenerate"
            title="Regenerate last response"
          >
            <RotateCw class="w-4 h-4" />
          </button>
        {/if}
        <button
          type="button"
          onclick={send}
          disabled={!canSend}
          class="absolute right-2 bottom-2 text-purple-300 hover:text-purple-200 disabled:opacity-40"
          aria-label="Send"
        >
          <Send class="w-4 h-4" />
        </button>
      </div>
      <div class="text-[10px] text-gray-500 mt-1">Ctrl/⌘+Enter to send · Esc to close</div>
    </footer>
  </div>
{/if}
