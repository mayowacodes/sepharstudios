<script lang="ts">
  import { Search, Loader2, Check } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import { closeSlideOver } from '../slide-over-store';

  /**
   * Send a note to a specific creator without leaving the current page.
   * Looks up creators by name/email as the admin types, then drops the
   * message into `admin_messages` via the existing communications
   * endpoint. Reused inbox styling so the message renders consistently
   * with the rest of the admin↔creator thread surface.
   */

  interface CreatorResult {
    id: string;
    name: string;
    email: string | null;
  }

  let query = $state('');
  let results = $state<CreatorResult[]>([]);
  let selected = $state<CreatorResult | null>(null);
  let subject = $state('');
  let message = $state('');
  let searching = $state(false);
  let sending = $state(false);
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  async function runSearch() {
    const q = query.trim();
    if (q.length < 2) {
      results = [];
      return;
    }
    searching = true;
    try {
      const res = await fetch(`/api/admin/creators?search=${encodeURIComponent(q)}&limit=8`);
      if (res.ok) {
        const body = await res.json();
        const list = Array.isArray(body) ? body : (body.items ?? body.creators ?? []);
        results = list.map((c: { id?: string; userId?: string; name?: string; displayName?: string; email?: string | null }) => ({
          id: c.userId ?? c.id ?? '',
          name: c.displayName ?? c.name ?? '—',
          email: c.email ?? null
        }));
      }
    } finally {
      searching = false;
    }
  }

  function onQueryInput() {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(runSearch, 200);
  }

  function pick(r: CreatorResult) {
    selected = r;
    query = '';
    results = [];
  }

  async function send() {
    if (!selected || !message.trim() || !subject.trim() || sending) return;
    sending = true;
    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: selected.id,
          subject: subject.trim(),
          message: message.trim(),
          type: 'general'
        })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Send failed');
      }
      toast.success(`Note sent to ${selected.name}`);
      closeSlideOver('send-creator-note');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Send failed');
    } finally {
      sending = false;
    }
  }
</script>

<div class="p-4 space-y-4">
  {#if !selected}
    <div>
      <label for="note-search" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
        Find creator
      </label>
      <div class="relative">
        <input
          id="note-search"
          type="text"
          bind:value={query}
          oninput={onQueryInput}
          placeholder="Name or email…"
          class="w-full surface-1 rounded-md pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground"
        />
        <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      {#if searching}
        <div class="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1.5">
          <Loader2 class="w-3 h-3 animate-spin" /> Searching…
        </div>
      {:else if results.length > 0}
        <ul class="mt-2 surface-1 rounded-md divide-y divide-border/40 max-h-64 overflow-y-auto">
          {#each results as r (r.id)}
            <li>
              <button
                type="button"
                onclick={() => pick(r)}
                class="w-full text-left px-3 py-2 hover:surface-2 transition-colors"
              >
                <div class="text-sm text-foreground">{r.name}</div>
                {#if r.email}<div class="text-xs text-muted-foreground truncate">{r.email}</div>{/if}
              </button>
            </li>
          {/each}
        </ul>
      {:else if query.trim().length >= 2}
        <div class="text-xs text-muted-foreground mt-2">No matches.</div>
      {/if}
    </div>
  {:else}
    <div class="surface-1 rounded-md p-3 flex items-center justify-between">
      <div class="min-w-0">
        <div class="text-sm text-foreground">{selected.name}</div>
        {#if selected.email}<div class="text-xs text-muted-foreground truncate">{selected.email}</div>{/if}
      </div>
      <button type="button" onclick={() => (selected = null)} class="text-xs text-muted-foreground hover:text-foreground">
        Change
      </button>
    </div>

    <div>
      <label for="note-subject" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
        Subject
      </label>
      <input
        id="note-subject"
        type="text"
        bind:value={subject}
        placeholder="Brief subject line"
        maxlength="120"
        class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground"
      />
    </div>

    <div>
      <label for="note-msg" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
        Message
      </label>
      <textarea
        id="note-msg"
        bind:value={message}
        rows="6"
        placeholder="Write your message…"
        class="w-full surface-1 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground resize-none"
      ></textarea>
    </div>

    <button
      type="button"
      onclick={send}
      disabled={sending || !message.trim() || !subject.trim()}
      class="w-full px-3 py-2 rounded bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
    >
      {#if sending}<Loader2 class="w-3.5 h-3.5 animate-spin" />{:else}<Check class="w-3.5 h-3.5" />{/if}
      Send note
    </button>
  {/if}
</div>
