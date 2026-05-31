<!-- Creator Events -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Calendar } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';

  interface EventRow {
    id: string;
    title: string;
    description: string | null;
    speaker: string | null;
    speakerRole: string | null;
    kind: string;
    startsAt: string;
    durationMinutes: number | null;
    location: string | null;
    capacity: number | null;
    registeredCount: number;
    recordingUrl: string | null;
    isRegistered: boolean;
    status: string;
  }

  let activeTab = $state<'upcoming' | 'past' | 'calendar'>('upcoming');
  let kindFilter = $state<'all' | 'workshop' | 'fellowship' | 'qa' | 'conference'>('all');
  let upcomingEvents = $state<EventRow[]>([]);
  let pastEvents = $state<EventRow[]>([]);
  let loading = $state(true);
  let toggling = $state<string | null>(null);
  let message = $state('');

  onMount(loadEvents);

  async function loadEvents() {
    loading = true;
    try {
      const [up, pa] = await Promise.all([
        fetch('/api/events?audience=creator&filter=upcoming').then((r) => r.json()),
        fetch('/api/events?audience=creator&filter=past').then((r) => r.json())
      ]);
      upcomingEvents = up.events ?? [];
      pastEvents = pa.events ?? [];
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      loading = false;
    }
  }

  async function toggleRegistration(id: string, isRegistered: boolean) {
    toggling = id;
    message = '';
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: isRegistered ? 'DELETE' : 'POST'
      });
      if (res.status === 401) {
        goto('/auth/login?redirectTo=/creator/events');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Registration failed');
      message = isRegistered ? 'Cancelled.' : "You're registered — we'll send a reminder.";
      setTimeout(() => (message = ''), 4000);
      await loadEvents();
    } catch (err) {
      message = err instanceof Error ? err.message : 'Something went wrong';
    } finally {
      toggling = null;
    }
  }

  /**
   * Build a downloadable .ics calendar invite for the event. No backend
   * required — generated client-side as a Blob and offered as a file
   * download. Works in Google Calendar / Outlook / iCloud / etc.
   */
  function downloadIcs(e: EventRow) {
    const start = new Date(e.startsAt);
    const end = new Date(start.getTime() + (e.durationMinutes ?? 60) * 60_000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sephar Studios//Events//EN',
      'BEGIN:VEVENT',
      `UID:${e.id}@sepharstudios.com`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${e.title.replace(/[,;\\]/g, '\\$&')}`,
      `DESCRIPTION:${(e.description ?? '').replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')}`,
      `LOCATION:${e.location ?? 'Online'}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${e.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  let filteredUpcoming = $derived(
    kindFilter === 'all'
      ? upcomingEvents
      : upcomingEvents.filter((e) => e.kind === kindFilter)
  );

  let featured = $derived(upcomingEvents[0] ?? null);

  function formatStart(iso: string): string {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }


  function getEventTypeColor(type: string): string {
    const colors: Record<string, string> = {
      workshop: 'blue',
      fellowship: 'purple',
      conference: 'green',
      qa: 'orange',
      orientation: 'yellow',
      masterclass: 'red'
    };
    return colors[type] || 'gray';
  }

  function getEventTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      workshop: '🔧',
      fellowship: '🤝',
      conference: '🎪',
      qa: '❓',
      orientation: '🚀',
      masterclass: '🎓'
    };
    return icons[type] || '📅';
  }
</script>

<div class="container mx-auto px-4 py-6 space-y-6">
  <PageHeader icon={Calendar} title="Creator Events" subtitle="Learn, grow, and connect with fellow faith-based creators." />

  <!-- Featured Event — the soonest upcoming creator event, if any. -->
  {#if featured}
    <div class="bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex-1 min-w-60">
          <h2 class="text-2xl font-bold text-foreground mb-2">{getEventTypeIcon(featured.kind)} {featured.title}</h2>
          {#if featured.description}
            <p class="text-purple-200 mb-4">{featured.description}</p>
          {/if}
          <div class="flex items-center space-x-4 text-sm text-purple-300 flex-wrap gap-y-2">
            <span>📅 {formatStart(featured.startsAt)}</span>
            {#if featured.location}<span>📍 {featured.location}</span>{/if}
            {#if featured.speaker}<span>🎤 {featured.speaker}</span>{/if}
          </div>
        </div>
        <button
          onclick={() => toggleRegistration(featured!.id, featured!.isRegistered)}
          disabled={toggling === featured.id}
          class="px-6 py-3 rounded-lg font-medium disabled:opacity-50 {featured.isRegistered ? 'surface-2 hover:surface-3 text-foreground' : 'bg-purple-600 hover:bg-purple-700 text-white'}"
          aria-pressed={featured.isRegistered}
        >
          {#if toggling === featured.id}
            Working…
          {:else if featured.isRegistered}
            Registered ✓
          {:else}
            Register Now
          {/if}
        </button>
      </div>
    </div>
  {/if}

  <!-- Tab Navigation -->
  <div class="border-b border-border">
    <nav class="flex space-x-8">
      <button
        onclick={() => activeTab = 'upcoming'}
        class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'upcoming' ? 'border-purple-500 text-purple-400' : 'border-transparent text-muted-foreground hover:text-foreground/80'}"
      >
        Upcoming Events
      </button>
      <button
        onclick={() => activeTab = 'past'}
        class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'past' ? 'border-purple-500 text-purple-400' : 'border-transparent text-muted-foreground hover:text-foreground/80'}"
      >
        Past Events & Recordings
      </button>
      <button
        onclick={() => activeTab = 'calendar'}
        class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'calendar' ? 'border-purple-500 text-purple-400' : 'border-transparent text-muted-foreground hover:text-foreground/80'}"
      >
        Event Calendar
      </button>
    </nav>
  </div>

  <!-- Content Sections -->
  {#if activeTab === 'upcoming'}
    <div class="space-y-6">
      <!-- Filter chips — `kindFilter` derives `filteredUpcoming` -->
      <div class="flex flex-wrap gap-2">
        {#each [
          { id: 'all', label: 'All Events' },
          { id: 'workshop', label: 'Workshops' },
          { id: 'fellowship', label: 'Fellowship' },
          { id: 'qa', label: 'Q&A Sessions' },
          { id: 'conference', label: 'Conferences' }
        ] as chip (chip.id)}
          <button
            onclick={() => (kindFilter = chip.id as typeof kindFilter)}
            class="px-3 py-1 rounded-full text-sm transition-colors {kindFilter === chip.id ? 'bg-purple-600 text-foreground' : 'surface-2 text-white/80 hover:surface-3'}"
            aria-pressed={kindFilter === chip.id}
          >{chip.label}</button>
        {/each}
      </div>

      <!-- Upcoming Events List -->
      {#if loading}
        <p class="text-sm text-muted-foreground py-6 text-center">Loading events…</p>
      {:else if filteredUpcoming.length === 0}
        <div class="surface-1 border border-border/40 rounded-xl p-8 text-center">
          <p class="text-sm text-muted-foreground">No upcoming events match this filter.</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each filteredUpcoming as event (event.id)}
            <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2 flex-wrap">
                    <span class="text-2xl">{getEventTypeIcon(event.kind)}</span>
                    <h3 class="text-xl font-bold text-foreground">{event.title}</h3>
                    <span class="bg-{getEventTypeColor(event.kind)}-600 text-{getEventTypeColor(event.kind)}-100 text-xs px-2 py-1 rounded capitalize">
                      {event.kind}
                    </span>
                    {#if event.isRegistered}
                      <span class="bg-green-600 text-green-100 text-xs px-2 py-1 rounded">✅ Registered</span>
                    {/if}
                  </div>

                  {#if event.description}
                    <p class="text-foreground/80 mb-4">{event.description}</p>
                  {/if}

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="space-y-2">
                      <div class="flex items-center text-sm text-muted-foreground">
                        <span class="mr-2">📅</span>
                        <span>{formatStart(event.startsAt)}{event.durationMinutes ? ` (${event.durationMinutes} min)` : ''}</span>
                      </div>
                      {#if event.location}
                        <div class="flex items-center text-sm text-muted-foreground">
                          <span class="mr-2">📍</span>
                          <span>{event.location}</span>
                        </div>
                      {/if}
                      {#if event.speaker}
                        <div class="flex items-center text-sm text-muted-foreground">
                          <span class="mr-2">🎤</span>
                          <span>Speaker: {event.speaker}{event.speakerRole ? ` · ${event.speakerRole}` : ''}</span>
                        </div>
                      {/if}
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center text-sm text-muted-foreground">
                        <span class="mr-2">👥</span>
                        <span>
                          {event.registeredCount} attending{event.capacity ? ` / ${event.capacity} max` : ''}
                        </span>
                      </div>
                      {#if event.capacity}
                        <div class="w-full bg-gray-700 rounded-full h-2">
                          <div
                            class="bg-purple-600 h-2 rounded-full"
                            style="width: {Math.min((event.registeredCount / event.capacity) * 100, 100)}%"
                          ></div>
                        </div>
                      {/if}
                    </div>
                  </div>

                  <div class="flex items-center space-x-3 flex-wrap gap-y-2">
                    <button
                      onclick={() => toggleRegistration(event.id, event.isRegistered)}
                      disabled={toggling === event.id || (event.capacity !== null && event.registeredCount >= event.capacity && !event.isRegistered)}
                      class="px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors {event.isRegistered ? 'surface-2 hover:surface-3 text-foreground' : 'bg-purple-600 hover:bg-purple-700 text-white'}"
                      aria-pressed={event.isRegistered}
                    >
                      {#if toggling === event.id}
                        Working…
                      {:else if event.isRegistered}
                        Cancel registration
                      {:else if event.capacity !== null && event.registeredCount >= event.capacity}
                        Full
                      {:else}
                        Register
                      {/if}
                    </button>
                    <button
                      onclick={() => downloadIcs(event)}
                      class="text-muted-foreground hover:text-foreground"
                      aria-label="Download calendar invite"
                    >
                      📅 Add to Calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if message}
        <p class="text-center text-sm text-muted-foreground">{message}</p>
      {/if}
    </div>

  {:else if activeTab === 'past'}
    <div class="space-y-6">
      <div class="bg-blue-600/20 border border-blue-600 rounded-xl p-4">
        <h3 class="text-lg font-bold text-foreground mb-2">📺 Access Event Recordings</h3>
        <p class="text-blue-200">
          Couldn't attend an event? Access recordings of past workshops, sessions, and conferences.
        </p>
      </div>

      {#if loading}
        <p class="text-sm text-muted-foreground py-6 text-center">Loading…</p>
      {:else if pastEvents.length === 0}
        <div class="surface-1 border border-border/40 rounded-xl p-8 text-center">
          <p class="text-sm text-muted-foreground">No past events on file yet.</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each pastEvents as event (event.id)}
            <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <div class="flex-1 min-w-60">
                  <div class="flex items-center space-x-3 mb-2 flex-wrap">
                    <span class="text-2xl">{getEventTypeIcon(event.kind)}</span>
                    <h3 class="text-lg font-bold text-foreground">{event.title}</h3>
                    <span class="bg-{getEventTypeColor(event.kind)}-600 text-{getEventTypeColor(event.kind)}-100 text-xs px-2 py-1 rounded capitalize">
                      {event.kind}
                    </span>
                  </div>

                  <div class="flex items-center space-x-4 text-sm text-muted-foreground mb-3 flex-wrap">
                    <span>📅 {formatStart(event.startsAt)}</span>
                    <span>👥 {event.registeredCount} attended</span>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  {#if event.recordingUrl}
                    <a
                      href={event.recordingUrl}
                      target="_blank"
                      rel="noopener"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-block"
                    >
                      📺 Watch Recording
                    </a>
                  {:else}
                    <span class="text-xs text-muted-foreground">Recording pending</span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

  {:else if activeTab === 'calendar'}
    <div class="space-y-6">
      <!-- Calendar Subscription — real .ics feed -->
      <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-lg font-bold text-foreground mb-2">📅 Subscribe to creator events</h3>
        <p class="text-foreground/80 mb-4">
          Add Sephar Studios creator events to Google Calendar, Apple Calendar or Outlook. Your calendar app polls the feed automatically — newly-scheduled events appear without you doing anything.
        </p>
        <div class="space-y-3">
          <div class="bg-black/30 rounded-lg p-3 text-xs font-mono break-all flex items-center justify-between gap-3">
            <code>{typeof window !== 'undefined' ? window.location.origin : 'https://sepharstudios.com'}/api/events/feed.ics?audience=creator</code>
            <button
              onclick={() => navigator.clipboard.writeText(`${window.location.origin}/api/events/feed.ics?audience=creator`).then(() => (message = 'Calendar URL copied.'))}
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shrink-0"
            >Copy link</button>
          </div>
          <div class="text-xs text-muted-foreground space-y-1">
            <p><strong>Google Calendar:</strong> Settings → Add calendar → From URL → paste this link.</p>
            <p><strong>Apple Calendar:</strong> File → New Calendar Subscription → paste this link.</p>
            <p><strong>Outlook:</strong> Add calendar → Subscribe from web → paste this link.</p>
          </div>
        </div>
      </div>

      <div class="bg-green-600/20 border border-green-600 rounded-xl p-4">
        <h4 class="font-medium text-foreground mb-2">🔔 Event Notifications</h4>
        <p class="text-green-200 text-sm mb-3">
          Notifications for registration confirmations + reminders are sent automatically. Manage delivery (in-app vs email) from Settings.
        </p>
        <a href="/settings" class="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
          Notification Settings
        </a>
      </div>

      <!-- Regular Schedule -->
      <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-lg font-bold text-foreground mb-4">📋 Regular Schedule</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-foreground mb-3">Weekly Events</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-foreground/80">Tuesday Live Q&A</span>
                <span class="text-muted-foreground">7:00 PM EST</span>
              </div>
              <div class="flex justify-between">
                <span class="text-foreground/80">Thursday Creator Workshop</span>
                <span class="text-muted-foreground">8:00 PM EST</span>
              </div>
              <div class="flex justify-between">
                <span class="text-foreground/80">Sunday Fellowship Time</span>
                <span class="text-muted-foreground">6:00 PM EST</span>
              </div>
            </div>
          </div>
          <div>
            <h4 class="font-medium text-foreground mb-3">Monthly Events</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-foreground/80">Creator Spotlight</span>
                <span class="text-muted-foreground">First Friday</span>
              </div>
              <div class="flex justify-between">
                <span class="text-foreground/80">Ministry Masterclass</span>
                <span class="text-muted-foreground">Third Saturday</span>
              </div>
              <div class="flex justify-between">
                <span class="text-foreground/80">Community Prayer</span>
                <span class="text-muted-foreground">Last Thursday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Event Suggestions -->
  <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-6">
    <h3 class="text-lg font-bold text-foreground mb-4">💡 Suggest an Event</h3>
    <p class="text-purple-200 mb-4">
      Have an idea for a workshop, topic, or speaker you'd like to see? We'd love to hear from you!
    </p>
    <div class="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="What event would you like to see?"
        class="flex-1 px-4 py-2 surface-2 border border-border rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:border-purple-500"
      />
      <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">
        Submit Suggestion
      </button>
    </div>
  </div>
</div>