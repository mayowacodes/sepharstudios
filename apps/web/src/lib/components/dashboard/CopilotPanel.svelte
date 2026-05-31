<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Sparkles, Send, X, Check, AlertTriangle } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';

  interface Props {
    open: boolean;
    variant: 'creator' | 'admin';
  }

  let { open = $bindable(false), variant }: Props = $props();

  interface CopilotMessage {
    id: string;
    role: 'user' | 'assistant' | 'tool';
    content: string;
    toolName?: string;
    toolOutput?: unknown;
  }

  interface PendingApproval {
    actionId: string;
    tool: string;
    preview: unknown;
  }

  let conversationId = $state<string | null>(null);
  let messages = $state<CopilotMessage[]>([]);
  let input = $state('');
  let sending = $state(false);
  let pending = $state<PendingApproval | null>(null);
  let listEl: HTMLDivElement | null = $state(null);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    sending = true;
    // Optimistic user echo.
    messages = [...messages, { id: `temp-${Date.now()}`, role: 'user', content: text }];
    input = '';
    await tick();
    if (listEl) listEl.scrollTop = listEl.scrollHeight;

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          variant,
          conversationId,
          message: text
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Copilot failed');
      conversationId = body.conversationId;
      messages = [...messages, ...(body.messages ?? [])];
      pending = body.pendingApproval ?? null;
      await tick();
      if (listEl) listEl.scrollTop = listEl.scrollHeight;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Copilot failed');
    } finally {
      sending = false;
    }
  }

  async function approve() {
    if (!pending || !conversationId) return;
    sending = true;
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          actionId: pending.actionId,
          conversationId,
          variant
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Approval failed');
      messages = [...messages, {
        id: `approved-${Date.now()}`,
        role: 'assistant',
        content: `Approved ${body.tool}.`
      }];
      pending = null;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Approval failed');
    } finally {
      sending = false;
    }
  }

  function decline() {
    pending = null;
    messages = [...messages, {
      id: `declined-${Date.now()}`,
      role: 'assistant',
      content: 'OK — I won\'t take that action.'
    }];
  }

  function newChat() {
    conversationId = null;
    messages = [];
    pending = null;
    input = '';
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void send();
    }
    if (e.key === 'Escape') open = false;
  }

  onMount(() => { /* no-op; conversation lazy-loads on first send */ });
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
      {#if messages.length === 0}
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
      {#each messages as m (m.id)}
        {#if m.role === 'user'}
          <div class="flex justify-end">
            <div class="max-w-[80%] bg-purple-600 text-white text-sm rounded-lg px-3 py-2">{m.content}</div>
          </div>
        {:else if m.role === 'tool'}
          <div class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs">
            <div class="text-[10px] uppercase tracking-wide text-purple-300 mb-1">Tool: {m.toolName ?? '?'}</div>
            <pre class="whitespace-pre-wrap text-gray-300 max-h-32 overflow-y-auto">{m.content.length > 600 ? m.content.slice(0, 600) + '…' : m.content}</pre>
          </div>
        {:else}
          <div class="flex justify-start">
            <div class="max-w-[80%] bg-white/10 text-gray-100 text-sm rounded-lg px-3 py-2 whitespace-pre-line">{m.content}</div>
          </div>
        {/if}
      {/each}

      {#if pending}
        <div class="border border-yellow-500/40 bg-yellow-500/10 rounded-lg p-3 space-y-2">
          <div class="flex items-center gap-2 text-xs text-yellow-200">
            <AlertTriangle class="w-3.5 h-3.5" />
            Approval required: {pending.tool}
          </div>
          <pre class="text-[11px] text-yellow-100 bg-black/30 rounded p-2 overflow-x-auto">{JSON.stringify(pending.preview, null, 2)}</pre>
          <div class="flex gap-2 justify-end">
            <button type="button" onclick={decline} class="text-xs px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-white">Decline</button>
            <button type="button" onclick={approve} disabled={sending} class="text-xs px-3 py-1.5 rounded bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white inline-flex items-center gap-1">
              <Check class="w-3 h-3" /> Confirm
            </button>
          </div>
        </div>
      {/if}

      {#if sending}
        <div class="text-xs text-gray-500 italic">Thinking…</div>
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
          class="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        ></textarea>
        <button
          type="button"
          onclick={send}
          disabled={sending || !input.trim()}
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
