<script lang="ts">
  import { onMount } from 'svelte';

  type Tab = 'stories' | 'sponsorships' | 'tickets';

  interface Story {
    id: string;
    name: string;
    channel: string | null;
    story: string;
    status: string;
    moderationNote: string | null;
    createdAt: string;
    reviewedAt: string | null;
    userId: string | null;
  }
  interface Sponsorship {
    id: string;
    projectTitle: string;
    genre: string | null;
    synopsis: string;
    contactEmail: string | null;
    documents: Array<{ kind: string; url: string; name: string }> | null;
    status: string;
    adminNote: string | null;
    createdAt: string;
    reviewedAt: string | null;
    userId: string | null;
  }
  interface Ticket {
    id: string;
    email: string;
    subject: string;
    category: string | null;
    priority: string;
    description: string;
    attachments: Array<{ url: string; name: string }> | null;
    status: string;
    adminResponse: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string | null;
  }

  let active = $state<Tab>('stories');
  let statusFilter = $state('pending');
  let loading = $state(false);

  let stories = $state<Story[]>([]);
  let sponsorships = $state<Sponsorship[]>([]);
  let tickets = $state<Ticket[]>([]);

  let detailFor = $state<Sponsorship | Ticket | null>(null);
  let noteDrafts = $state<Record<string, string>>({});

  const STATUS_OPTIONS: Record<Tab, string[]> = {
    stories: ['pending', 'approved', 'rejected'],
    sponsorships: ['pending', 'reviewing', 'approved', 'rejected'],
    tickets: ['open', 'in_progress', 'resolved', 'closed']
  };

  async function load() {
    loading = true;
    try {
      if (active === 'stories') {
        const res = await fetch(`/api/admin/success-stories?status=${statusFilter}`);
        const body = await res.json();
        stories = body.stories ?? [];
      } else if (active === 'sponsorships') {
        const res = await fetch(`/api/admin/sponsorships?status=${statusFilter}`);
        const body = await res.json();
        sponsorships = body.applications ?? [];
      } else {
        const res = await fetch(`/api/admin/support-tickets?status=${statusFilter}`);
        const body = await res.json();
        tickets = body.tickets ?? [];
      }
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    active; statusFilter;
    statusFilter = STATUS_OPTIONS[active][0];
    void load();
  });

  onMount(() => { void load(); });

  async function reviewStory(id: string, status: string) {
    const note = noteDrafts[id] ?? '';
    await fetch(`/api/admin/success-stories/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, moderationNote: note || null })
    });
    delete noteDrafts[id];
    await load();
  }
  async function reviewSponsorship(id: string, status: string) {
    const note = noteDrafts[id] ?? '';
    await fetch(`/api/admin/sponsorships/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNote: note || null })
    });
    delete noteDrafts[id];
    await load();
  }
  async function reviewTicket(id: string, status: string) {
    const note = noteDrafts[id] ?? '';
    await fetch(`/api/admin/support-tickets/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminResponse: note || null })
    });
    delete noteDrafts[id];
    await load();
  }
</script>

<div class="min-h-screen p-6 text-white space-y-6">
  <div>
    <h1 class="text-2xl font-bold mb-2">Submissions Moderation</h1>
    <p class="text-sm text-gray-400">Triage success stories, sponsorship pitches, and support tickets.</p>
  </div>

  <!-- Tab chips -->
  <div class="flex flex-wrap gap-2">
    {#each ['stories', 'sponsorships', 'tickets'] as tab}
      <button
        type="button"
        onclick={() => active = tab as Tab}
        class="px-4 py-2 rounded-lg text-sm capitalize {active === tab ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/15'}"
      >{tab}</button>
    {/each}
    <div class="flex-1"></div>
    <select
      bind:value={statusFilter}
      class="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm"
    >
      {#each STATUS_OPTIONS[active] as s}
        <option value={s}>{s}</option>
      {/each}
    </select>
  </div>

  {#if loading}
    <div class="text-center text-gray-400 py-12">Loading…</div>
  {:else if active === 'stories'}
    {#if stories.length === 0}
      <div class="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-gray-400">No stories in this state.</div>
    {:else}
      <div class="space-y-3">
        {#each stories as s (s.id)}
          <div class="bg-white/5 border border-white/10 rounded-xl p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold">{s.name}{s.channel ? ` — ${s.channel}` : ''}</h3>
                <p class="text-sm text-gray-300 mt-1 whitespace-pre-line">{s.story}</p>
                <p class="text-xs text-gray-500 mt-2">Submitted {new Date(s.createdAt).toLocaleString()}</p>
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-purple-700/40 text-purple-200">{s.status}</span>
            </div>
            <input
              type="text"
              bind:value={noteDrafts[s.id]}
              placeholder="Optional moderation note"
              class="w-full mt-3 px-3 py-2 bg-white/10 border border-white/20 rounded text-sm"
            />
            <div class="flex gap-2 mt-3">
              <button onclick={() => reviewStory(s.id, 'approved')} class="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm">Approve</button>
              <button onclick={() => reviewStory(s.id, 'rejected')} class="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm">Reject</button>
              <button onclick={() => reviewStory(s.id, 'pending')} class="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm">Reset</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else if active === 'sponsorships'}
    {#if sponsorships.length === 0}
      <div class="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-gray-400">No applications in this state.</div>
    {:else}
      <div class="space-y-3">
        {#each sponsorships as a (a.id)}
          <div class="bg-white/5 border border-white/10 rounded-xl p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold">{a.projectTitle}</h3>
                <p class="text-xs text-gray-400 mt-1">Genre: {a.genre ?? 'unspecified'} • Contact: {a.contactEmail ?? '—'}</p>
                <p class="text-sm text-gray-300 mt-2 line-clamp-3 whitespace-pre-line">{a.synopsis}</p>
                {#if a.documents && a.documents.length > 0}
                  <div class="flex flex-wrap gap-2 mt-2">
                    {#each a.documents as doc}
                      <a href={doc.url} target="_blank" rel="noopener" class="text-xs px-2 py-1 rounded bg-blue-600/30 text-blue-200 hover:bg-blue-600/50">
                        📎 {doc.kind}: {doc.name}
                      </a>
                    {/each}
                  </div>
                {/if}
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-purple-700/40 text-purple-200">{a.status}</span>
            </div>
            <input
              type="text"
              bind:value={noteDrafts[a.id]}
              placeholder="Optional admin note (will be shown to submitter)"
              class="w-full mt-3 px-3 py-2 bg-white/10 border border-white/20 rounded text-sm"
            />
            <div class="flex flex-wrap gap-2 mt-3">
              <button onclick={() => reviewSponsorship(a.id, 'reviewing')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm">Mark reviewing</button>
              <button onclick={() => reviewSponsorship(a.id, 'approved')} class="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm">Approve</button>
              <button onclick={() => reviewSponsorship(a.id, 'rejected')} class="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm">Reject</button>
              <button onclick={() => detailFor = a} class="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm">Full pitch</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    {#if tickets.length === 0}
      <div class="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-gray-400">No tickets in this state.</div>
    {:else}
      <div class="space-y-3">
        {#each tickets as t (t.id)}
          <div class="bg-white/5 border border-white/10 rounded-xl p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold">{t.subject}</h3>
                <p class="text-xs text-gray-400 mt-1">From {t.email} • {t.category ?? 'unspecified'} • priority: {t.priority}</p>
                <p class="text-sm text-gray-300 mt-2 line-clamp-4 whitespace-pre-line">{t.description}</p>
                {#if t.attachments && t.attachments.length > 0}
                  <div class="flex flex-wrap gap-2 mt-2">
                    {#each t.attachments as att}
                      <a href={att.url} target="_blank" rel="noopener" class="text-xs px-2 py-1 rounded bg-blue-600/30 text-blue-200 hover:bg-blue-600/50">
                        📎 {att.name}
                      </a>
                    {/each}
                  </div>
                {/if}
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-purple-700/40 text-purple-200">{t.status}</span>
            </div>
            <textarea
              bind:value={noteDrafts[t.id]}
              rows="2"
              placeholder="Response (shown to submitter)"
              class="w-full mt-3 px-3 py-2 bg-white/10 border border-white/20 rounded text-sm"
            ></textarea>
            <div class="flex flex-wrap gap-2 mt-3">
              <button onclick={() => reviewTicket(t.id, 'in_progress')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm">In progress</button>
              <button onclick={() => reviewTicket(t.id, 'resolved')} class="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm">Resolved</button>
              <button onclick={() => reviewTicket(t.id, 'closed')} class="bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded text-sm">Close</button>
              <button onclick={() => detailFor = t} class="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm">Full ticket</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<!-- Detail modal -->
{#if detailFor}
  <div
    class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
    onclick={() => detailFor = null}
    onkeydown={(e) => { if (e.key === 'Escape') detailFor = null; }}
    role="presentation"
  >
    <div
      class="bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <pre class="text-sm text-white whitespace-pre-wrap wrap-break-word">{JSON.stringify(detailFor, null, 2)}</pre>
      <div class="flex justify-end mt-4">
        <button onclick={() => detailFor = null} class="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm">Close</button>
      </div>
    </div>
  </div>
{/if}
