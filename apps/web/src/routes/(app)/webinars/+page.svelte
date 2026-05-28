<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Video, Calendar, Clock, Users, ArrowRight, Bell } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  interface EventRow {
    id: string;
    title: string;
    description: string | null;
    speaker: string | null;
    speakerRole: string | null;
    track: 'creator' | 'tokenomics' | 'theology' | 'tech' | null;
    startsAt: string;
    durationMinutes: number | null;
    registeredCount: number;
    capacity: number | null;
    recordingUrl: string | null;
    isRegistered: boolean;
    status: string;
  }

  const tracks = {
    creator: { label: 'Creator Track', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    tokenomics: { label: 'STC & Web3', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
    theology: { label: 'Theology', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    tech: { label: 'Platform Tech', color: 'bg-green-500/15 text-green-300 border-green-500/30' }
  } as const;

  let upcoming = $state<EventRow[]>([]);
  let past = $state<EventRow[]>([]);
  let loading = $state(true);
  let toggling = $state<string | null>(null);
  let message = $state('');

  onMount(loadEvents);

  async function loadEvents() {
    loading = true;
    try {
      const [up, pa] = await Promise.all([
        fetch('/api/events?audience=public&filter=upcoming').then((r) => r.json()),
        fetch('/api/events?audience=public&filter=past').then((r) => r.json())
      ]);
      upcoming = up.events ?? [];
      past = pa.events ?? [];
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      loading = false;
    }
  }

  async function toggleRegistration(eventId: string, isRegistered: boolean) {
    toggling = eventId;
    message = '';
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: isRegistered ? 'DELETE' : 'POST'
      });
      if (res.status === 401) {
        goto(`/auth/login?redirectTo=/webinars`);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Registration failed');
      message = isRegistered ? 'Cancelled.' : "You're registered — we'll send a reminder.";
      setTimeout(() => (message = ''), 4000);
      // Refresh the lists so registeredCount + isRegistered re-fetch.
      await loadEvents();
    } catch (err) {
      message = err instanceof Error ? err.message : 'Something went wrong';
    } finally {
      toggling = null;
    }
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }

  function formatDuration(minutes: number | null): string {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h} hr` : `${h}h ${m}m`;
  }
</script>

<svelte:head>
  <title>Webinars · Sephar Studios</title>
  <meta name="description" content="Live and on-demand sessions for Sephar Studios creators, viewers and STC holders." />
</svelte:head>

<div class="min-h-screen bg-background text-white px-4 py-10">
  <div class="max-w-5xl mx-auto space-y-10">
    <header class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
        <Video class="w-4 h-4" /> Live & On-Demand
      </div>
      <h1 class="text-3xl md:text-4xl font-bold">Sephar Studios Webinars</h1>
      <p class="text-muted-foreground max-w-2xl mx-auto">
        Weekly sessions for creators, viewers and STC holders — production craft, theology,
        platform mechanics and token economics, taught by the people building Sephar Studios.
      </p>
    </header>

    <!-- Upcoming -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <Calendar class="w-5 h-5 text-primary" /> Upcoming sessions
        </h2>
        <Button variant="outline" size="sm">
          <Bell class="w-4 h-4 mr-2" /> Subscribe to calendar
        </Button>
      </div>

      {#if loading}
        <p class="text-sm text-muted-foreground py-6 text-center">Loading webinars…</p>
      {:else if upcoming.length === 0}
        <div class="bg-card border border-border rounded-xl p-8 text-center">
          <p class="text-sm text-muted-foreground">No upcoming sessions scheduled. Subscribe to the calendar or follow us for announcements.</p>
        </div>
      {:else}
        <div class="grid gap-4 md:grid-cols-2">
          {#each upcoming as w (w.id)}
            <article class="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors">
              <div class="flex items-start justify-between gap-3">
                {#if w.track && tracks[w.track]}
                  <span class="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border {tracks[w.track].color}">
                    {tracks[w.track].label}
                  </span>
                {:else}
                  <span></span>
                {/if}
                <div class="flex items-center text-xs text-muted-foreground gap-1">
                  <Users class="w-3.5 h-3.5" /> {w.registeredCount}{w.capacity ? ` / ${w.capacity}` : ''}
                </div>
              </div>
              <h3 class="text-base font-bold leading-snug">{w.title}</h3>
              {#if w.description}
                <p class="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
              {/if}
              <div class="text-xs text-muted-foreground space-y-1">
                <div class="flex items-center gap-2"><Calendar class="w-3.5 h-3.5" />{formatDate(w.startsAt)}</div>
                {#if w.durationMinutes}
                  <div class="flex items-center gap-2"><Clock class="w-3.5 h-3.5" />{formatDuration(w.durationMinutes)}</div>
                {/if}
              </div>
              <div class="pt-2 border-t border-border flex items-center justify-between">
                <div class="text-xs">
                  {#if w.speaker}<div class="font-semibold">{w.speaker}</div>{/if}
                  {#if w.speakerRole}<div class="text-muted-foreground">{w.speakerRole}</div>{/if}
                </div>
                <Button
                  size="sm"
                  variant={w.isRegistered ? 'outline' : 'default'}
                  disabled={toggling === w.id || (w.capacity !== null && w.registeredCount >= w.capacity && !w.isRegistered)}
                  onclick={() => toggleRegistration(w.id, w.isRegistered)}
                  aria-pressed={w.isRegistered}
                >
                  {#if toggling === w.id}
                    Working…
                  {:else if w.isRegistered}
                    Registered
                  {:else if w.capacity !== null && w.registeredCount >= w.capacity}
                    Full
                  {:else}
                    Reserve seat <ArrowRight class="w-3.5 h-3.5 ml-2" />
                  {/if}
                </Button>
              </div>
            </article>
          {/each}
        </div>
      {/if}

      {#if message}
        <p class="text-xs text-center text-muted-foreground">{message}</p>
      {/if}
    </section>

    <!-- Past recordings -->
    {#if !loading && past.length > 0}
      <section class="space-y-4">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <Video class="w-5 h-5 text-primary" /> Past recordings
        </h2>
        <div class="grid gap-3">
          {#each past as w (w.id)}
            <article class="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-4">
              {#if w.track && tracks[w.track]}
                <span class="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border {tracks[w.track].color}">
                  {tracks[w.track].label}
                </span>
              {/if}
              <div class="flex-1 min-w-60">
                <h3 class="text-sm font-semibold">{w.title}</h3>
                <p class="text-xs text-muted-foreground">
                  {w.speaker ?? 'Sephar Studios'} · {formatDate(w.startsAt)}{w.durationMinutes ? ` · ${formatDuration(w.durationMinutes)}` : ''}
                </p>
              </div>
              {#if w.recordingUrl}
                <Button size="sm" variant="outline" href={w.recordingUrl}>Watch recording</Button>
              {:else}
                <span class="text-xs text-muted-foreground">Recording pending</span>
              {/if}
            </article>
          {/each}
        </div>
      </section>
    {/if}

    <!-- CTA -->
    <section class="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
      <h2 class="text-lg font-semibold">Want to speak at a session?</h2>
      <p class="text-sm text-muted-foreground max-w-xl mx-auto">
        Pitch a topic to our creator success team. Approved sessions reach 200+ live viewers and stay in the archive permanently.
      </p>
      <Button href="/contact">Pitch a session</Button>
    </section>
  </div>
</div>
