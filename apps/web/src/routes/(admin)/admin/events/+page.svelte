<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Calendar, Plus, Edit, Trash2, Users, ExternalLink } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';

  interface EventRow {
    id: string;
    title: string;
    description: string | null;
    speaker: string | null;
    speakerRole: string | null;
    kind: string;
    track: string | null;
    audience: 'public' | 'creator';
    startsAt: string;
    endsAt: string | null;
    durationMinutes: number | null;
    location: string | null;
    capacity: number | null;
    meetingUrl: string | null;
    recordingUrl: string | null;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    createdBy: string | null;
    createdAt: string;
    updatedAt: string;
  }

  let events = $state<EventRow[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let message = $state('');
  let audienceFilter = $state<'all' | 'public' | 'creator'>('all');

  // Form state — also used for "edit" mode (editingId !== null)
  let dialogOpen = $state(false);
  let editingId = $state<string | null>(null);
  let form = $state<{
    title: string;
    description: string;
    speaker: string;
    speakerRole: string;
    kind: string;
    track: string;
    audience: 'public' | 'creator';
    startsAt: string; // datetime-local format
    durationMinutes: string;
    location: string;
    capacity: string;
    meetingUrl: string;
    recordingUrl: string;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  }>({
    title: '', description: '', speaker: '', speakerRole: '',
    kind: 'webinar', track: '', audience: 'public',
    startsAt: '', durationMinutes: '60',
    location: 'Online', capacity: '', meetingUrl: '', recordingUrl: '',
    status: 'scheduled'
  });

  onMount(loadEvents);

  async function loadEvents() {
    loading = true;
    try {
      const res = await fetch('/api/admin/events');
      if (res.ok) {
        const data = await res.json();
        events = data.events ?? [];
      }
    } finally {
      loading = false;
    }
  }

  let filtered = $derived(
    audienceFilter === 'all' ? events : events.filter((e) => e.audience === audienceFilter)
  );

  function openCreate() {
    editingId = null;
    form = {
      title: '', description: '', speaker: '', speakerRole: '',
      kind: 'webinar', track: '', audience: 'public',
      startsAt: '', durationMinutes: '60',
      location: 'Online', capacity: '', meetingUrl: '', recordingUrl: '',
      status: 'scheduled'
    };
    dialogOpen = true;
  }

  function openEdit(e: EventRow) {
    editingId = e.id;
    form = {
      title: e.title,
      description: e.description ?? '',
      speaker: e.speaker ?? '',
      speakerRole: e.speakerRole ?? '',
      kind: e.kind,
      track: e.track ?? '',
      audience: e.audience,
      startsAt: new Date(e.startsAt).toISOString().slice(0, 16),
      durationMinutes: e.durationMinutes?.toString() ?? '',
      location: e.location ?? '',
      capacity: e.capacity?.toString() ?? '',
      meetingUrl: e.meetingUrl ?? '',
      recordingUrl: e.recordingUrl ?? '',
      status: e.status
    };
    dialogOpen = true;
  }

  async function save() {
    if (!form.title.trim() || !form.startsAt) {
      message = 'Title and start time are required';
      return;
    }
    saving = true;
    message = '';
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        speaker: form.speaker || null,
        speakerRole: form.speakerRole || null,
        kind: form.kind,
        track: form.track || null,
        audience: form.audience,
        startsAt: new Date(form.startsAt).toISOString(),
        durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes, 10) : null,
        location: form.location || null,
        capacity: form.capacity ? parseInt(form.capacity, 10) : null,
        meetingUrl: form.meetingUrl || null,
        recordingUrl: form.recordingUrl || null,
        status: form.status
      };

      const res = editingId
        ? await fetch(`/api/admin/events/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        : await fetch('/api/admin/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');

      message = editingId ? 'Event updated.' : 'Event created.';
      dialogOpen = false;
      await loadEvents();
      setTimeout(() => (message = ''), 4000);
    } catch (err: any) {
      message = `Error: ${err.message}`;
    } finally {
      saving = false;
    }
  }

  async function cancelEvent(e: EventRow) {
    if (!confirm(`Cancel "${e.title}"? All ${0} registrants will be notified.`)) return;
    saving = true;
    try {
      const res = await fetch(`/api/admin/events/${e.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Cancel failed');
      message = `Event cancelled. ${data.cancelledRegistrants ?? 0} registrants notified.`;
      await loadEvents();
      setTimeout(() => (message = ''), 5000);
    } catch (err: any) {
      message = `Error: ${err.message}`;
    } finally {
      saving = false;
    }
  }

  function fmt(iso: string): string {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  }

  function statusColor(s: string): string {
    if (s === 'scheduled') return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    if (s === 'live') return 'bg-green-500/15 text-green-300 border-green-500/30';
    if (s === 'completed') return 'bg-gray-500/15 text-foreground/80 border-gray-500/30';
    return 'bg-red-500/15 text-red-300 border-red-500/30'; // cancelled
  }
</script>

<svelte:head>
  <title>Events · Admin</title>
</svelte:head>

<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">
  <PortalHero
    compact
    eyebrow="Calendar"
    title="Events"
    subtitle="Webinars, workshops, conferences. Powers /webinars and /creator/events."
    icon={Calendar}
  >
    {#snippet actions()}
      <Button onclick={openCreate} size="sm" class="rounded-full">
        <Plus class="w-3.5 h-3.5 mr-1" /> New event
      </Button>
    {/snippet}
  </PortalHero>

  {#if message}
    <div class="rounded-md border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">{message}</div>
  {/if}

  <!-- Audience filter -->
  <div class="flex gap-2">
    {#each [{ id: 'all', label: 'All' }, { id: 'public', label: 'Public (webinars)' }, { id: 'creator', label: 'Creator portal' }] as chip (chip.id)}
      <button
        onclick={() => (audienceFilter = chip.id as typeof audienceFilter)}
        class="px-3 py-1 rounded-full text-sm transition-colors {audienceFilter === chip.id ? 'bg-primary text-primary-foreground' : 'bg-muted/40 text-muted-foreground hover:bg-muted'}"
        aria-pressed={audienceFilter === chip.id}
      >{chip.label}</button>
    {/each}
  </div>

  {#if loading}
    <p class="text-sm text-muted-foreground py-8 text-center">Loading events…</p>
  {:else if filtered.length === 0}
    <Card>
      <CardContent class="py-12 text-center text-sm text-muted-foreground">
        No events in this audience. Click <strong>New event</strong> to create the first one.
      </CardContent>
    </Card>
  {:else}
    <div class="grid gap-3">
      {#each filtered as event (event.id)}
        <Card>
          <CardContent class="p-5 flex items-start justify-between gap-4 flex-wrap">
            <div class="flex-1 min-w-72">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" class="capitalize">{event.kind}</Badge>
                <Badge variant="secondary" class="capitalize">{event.audience}</Badge>
                <span class="text-xs px-2 py-0.5 rounded-full border {statusColor(event.status)}">{event.status}</span>
                {#if event.track}<Badge variant="outline" class="capitalize">{event.track}</Badge>{/if}
              </div>
              <h2 class="text-lg font-semibold mb-1">{event.title}</h2>
              {#if event.description}
                <p class="text-sm text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
              {/if}
              <div class="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>📅 {fmt(event.startsAt)}</span>
                {#if event.durationMinutes}<span>⏱ {event.durationMinutes}m</span>{/if}
                {#if event.location}<span>📍 {event.location}</span>{/if}
                {#if event.speaker}<span>🎤 {event.speaker}</span>{/if}
                {#if event.capacity}<span><Users class="inline w-3 h-3" /> cap: {event.capacity}</span>{/if}
                {#if event.meetingUrl}
                  <a href={event.meetingUrl} target="_blank" rel="noopener" class="text-primary hover:underline inline-flex items-center gap-1">
                    Meeting <ExternalLink class="w-3 h-3" />
                  </a>
                {/if}
              </div>
            </div>
            <div class="flex flex-col gap-2 shrink-0">
              <Button size="sm" variant="outline" onclick={() => openEdit(event)}>
                <Edit class="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              {#if event.status !== 'cancelled'}
                <Button size="sm" variant="outline" class="text-red-400 hover:text-red-300" onclick={() => cancelEvent(event)}>
                  <Trash2 class="w-3.5 h-3.5 mr-1" /> Cancel
                </Button>
              {/if}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}
</div>

<!-- Create/Edit dialog -->
{#if dialogOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
    onclick={() => (dialogOpen = false)}
  >
    <div
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby="event-dialog-title"
      class="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl my-8 shadow-2xl"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 id="event-dialog-title" class="text-xl font-bold mb-4">
        {editingId ? 'Edit event' : 'New event'}
      </h2>

      <form onsubmit={(e) => { e.preventDefault(); save(); }} class="space-y-4">
        <div>
          <Label for="evt-title">Title <span class="text-red-400">*</span></Label>
          <Input id="evt-title" bind:value={form.title} required />
        </div>

        <div>
          <Label for="evt-description">Description</Label>
          <textarea
            id="evt-description"
            bind:value={form.description}
            rows="3"
            class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label for="evt-speaker">Speaker</Label>
            <Input id="evt-speaker" bind:value={form.speaker} />
          </div>
          <div>
            <Label for="evt-speaker-role">Speaker role</Label>
            <Input id="evt-speaker-role" bind:value={form.speakerRole} />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label for="evt-kind">Kind</Label>
            <select id="evt-kind" bind:value={form.kind} class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="webinar">Webinar</option>
              <option value="workshop">Workshop</option>
              <option value="fellowship">Fellowship</option>
              <option value="conference">Conference</option>
              <option value="qa">Q&amp;A</option>
              <option value="ama">AMA</option>
            </select>
          </div>
          <div>
            <Label for="evt-audience">Audience</Label>
            <select id="evt-audience" bind:value={form.audience} class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="public">Public (/webinars)</option>
              <option value="creator">Creator (/creator/events)</option>
            </select>
          </div>
          <div>
            <Label for="evt-track">Track</Label>
            <select id="evt-track" bind:value={form.track} class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="">— None —</option>
              <option value="creator">Creator</option>
              <option value="tokenomics">Tokenomics</option>
              <option value="theology">Theology</option>
              <option value="tech">Tech</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label for="evt-starts">Starts at <span class="text-red-400">*</span></Label>
            <Input id="evt-starts" type="datetime-local" bind:value={form.startsAt} required />
          </div>
          <div>
            <Label for="evt-duration">Duration (min)</Label>
            <Input id="evt-duration" type="number" min="0" bind:value={form.durationMinutes} />
          </div>
          <div>
            <Label for="evt-capacity">Capacity</Label>
            <Input id="evt-capacity" type="number" min="0" bind:value={form.capacity} placeholder="Unlimited" />
          </div>
        </div>

        <div>
          <Label for="evt-location">Location</Label>
          <Input id="evt-location" bind:value={form.location} placeholder="Online / city" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label for="evt-meeting">Meeting URL <span class="text-xs text-muted-foreground">(Zoom/Meet — gated to registrants)</span></Label>
            <Input id="evt-meeting" type="url" bind:value={form.meetingUrl} />
          </div>
          <div>
            <Label for="evt-recording">Recording URL <span class="text-xs text-muted-foreground">(set after the event)</span></Label>
            <Input id="evt-recording" type="url" bind:value={form.recordingUrl} />
          </div>
        </div>

        {#if editingId}
          <div>
            <Label for="evt-status">Status</Label>
            <select id="evt-status" bind:value={form.status} class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        {/if}

        <div class="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onclick={() => (dialogOpen = false)}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create event'}
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if}
