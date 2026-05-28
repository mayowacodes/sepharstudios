<script lang="ts">
  import { Video, Calendar, Clock, Users, ArrowRight, Bell } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  interface Webinar {
    id: string;
    title: string;
    speaker: string;
    speakerRole: string;
    date: string;
    duration: string;
    track: 'creator' | 'tokenomics' | 'theology' | 'tech';
    registered: number;
    description: string;
    upcoming: boolean;
    recordingUrl?: string;
  }

  const tracks = {
    creator: { label: 'Creator Track', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    tokenomics: { label: 'STC & Web3', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
    theology: { label: 'Theology', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    tech: { label: 'Platform Tech', color: 'bg-green-500/15 text-green-300 border-green-500/30' }
  } as const;

  const webinars: Webinar[] = [
    {
      id: 'w-001',
      title: 'Launching your first faith-based series on Sephar Studios',
      speaker: 'Pastor Daniel Okafor',
      speakerRole: 'Lead Creator, Living Word Films',
      date: '2026-06-04T18:00:00Z',
      duration: '60 min',
      track: 'creator',
      registered: 247,
      description: 'A step-by-step walkthrough of submitting your pilot, navigating review and unlocking the creator payments stream.',
      upcoming: true
    },
    {
      id: 'w-002',
      title: 'STC tokenomics deep dive: staking, NFT tiers and revenue share',
      speaker: 'Mayowa Animasaun',
      speakerRole: 'Founder, Sephar Studios',
      date: '2026-06-11T18:00:00Z',
      duration: '75 min',
      track: 'tokenomics',
      registered: 412,
      description: 'How discount tiers stack, what the buyback mechanism really does, and how creators get paid from the revenue pool.',
      upcoming: true
    },
    {
      id: 'w-003',
      title: 'Writing scripts that honour scripture and respect the craft',
      speaker: 'Esther Adebanjo',
      speakerRole: 'Script consultant, BibleVerse Studios',
      date: '2026-06-18T17:00:00Z',
      duration: '45 min',
      track: 'theology',
      registered: 156,
      description: 'Practical principles for translating Biblical narrative into watchable, emotionally honest screen drama.',
      upcoming: true
    },
    {
      id: 'w-004',
      title: 'Production AMA: cameras, lighting and budget tiers under $5k',
      speaker: 'Caleb Mensah',
      speakerRole: 'DP, Crown Productions',
      date: '2026-05-21T18:00:00Z',
      duration: '60 min',
      track: 'creator',
      registered: 308,
      description: 'Recording available — gear breakdown for indie creators starting out.',
      upcoming: false,
      recordingUrl: '/archive'
    },
    {
      id: 'w-005',
      title: 'Onchain royalties: NFT subscription mechanics explained',
      speaker: 'Mayowa Animasaun',
      speakerRole: 'Founder, Sephar Studios',
      date: '2026-05-14T18:00:00Z',
      duration: '50 min',
      track: 'tokenomics',
      registered: 521,
      description: 'Recording available — how the subscription NFT contract issues, transfers and renews.',
      upcoming: false,
      recordingUrl: '/archive'
    }
  ];

  const upcoming = webinars.filter((w) => w.upcoming);
  const past = webinars.filter((w) => !w.upcoming);

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

      <div class="grid gap-4 md:grid-cols-2">
        {#each upcoming as w}
          <article class="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors">
            <div class="flex items-start justify-between gap-3">
              <span class="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border {tracks[w.track].color}">
                {tracks[w.track].label}
              </span>
              <div class="flex items-center text-xs text-muted-foreground gap-1">
                <Users class="w-3.5 h-3.5" /> {w.registered}
              </div>
            </div>
            <h3 class="text-base font-bold leading-snug">{w.title}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
            <div class="text-xs text-muted-foreground space-y-1">
              <div class="flex items-center gap-2"><Calendar class="w-3.5 h-3.5" />{formatDate(w.date)}</div>
              <div class="flex items-center gap-2"><Clock class="w-3.5 h-3.5" />{w.duration}</div>
            </div>
            <div class="pt-2 border-t border-border flex items-center justify-between">
              <div class="text-xs">
                <div class="font-semibold">{w.speaker}</div>
                <div class="text-muted-foreground">{w.speakerRole}</div>
              </div>
              <Button size="sm">Reserve seat <ArrowRight class="w-3.5 h-3.5 ml-2" /></Button>
            </div>
          </article>
        {/each}
      </div>
    </section>

    <!-- Past recordings -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold flex items-center gap-2">
        <Video class="w-5 h-5 text-primary" /> Past recordings
      </h2>
      <div class="grid gap-3">
        {#each past as w}
          <article class="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-4">
            <span class="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border {tracks[w.track].color}">
              {tracks[w.track].label}
            </span>
            <div class="flex-1 min-w-[240px]">
              <h3 class="text-sm font-semibold">{w.title}</h3>
              <p class="text-xs text-muted-foreground">{w.speaker} · {formatDate(w.date)} · {w.duration}</p>
            </div>
            <Button size="sm" variant="outline" href={w.recordingUrl ?? '/archive'}>Watch recording</Button>
          </article>
        {/each}
      </div>
    </section>

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
