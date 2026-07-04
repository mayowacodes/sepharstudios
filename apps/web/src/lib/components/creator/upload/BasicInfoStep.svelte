<!-- Basic Info Step -->
<script lang="ts">
  import { ContentType, AgeRating } from '$lib/types/creator';

  // Each field is a $bindable prop — the parent's wizardState owns the
  // single source of truth, and bind:value / onchange handlers below write
  // through directly. Previously this component shadowed each field as
  // local $state and synced via two duelling $effect blocks, but the
  // sync-from-parent effect raced the propagate-to-parent effect on every
  // keystroke and wiped the user's input before it reached the parent.
  // See sveltejs/svelte#12320 and Svelte 5 $bindable docs.
  let {
    title = $bindable(''),
    description = $bindable(''),
    contentType = $bindable(''),
    ageRating = $bindable(''),
    audience = $bindable<'general' | 'kids' | 'teens'>('general'),
    // Series-only — visible + required when contentType === 'series'. The
    // wizard creates Episode 1 alongside the series row so the creator
    // never lands in an empty-shell series state where the series exists
    // but has no episodes attached.
    episodeTitle = $bindable(''),
    seasonNumber = $bindable<number>(1),
    episodeNumber = $bindable<number>(1),
    // Coming Soon — declared up-front so the rest of the wizard knows
    // not to require the main video file. Creators can still upload
    // posters, trailer, and optionally the final video (which then
    // encodes and sits until the release date), but the wizard no
    // longer blocks them at step 2 if they only have the announcement.
    comingSoon = $bindable<boolean>(false),
    comingSoonReleaseDate = $bindable<string>('')
  }: {
    title?: string;
    description?: string;
    contentType?: string;
    ageRating?: string;
    audience?: 'general' | 'kids' | 'teens';
    episodeTitle?: string;
    seasonNumber?: number;
    episodeNumber?: number;
    comingSoon?: boolean;
    comingSoonReleaseDate?: string;
  } = $props();

  // Min date for the release-date input — today in the CREATOR'S LOCAL
  // timezone, YYYY-MM-DD. toISOString() is UTC and would reject the
  // local "today" for anyone west of UTC in the evening. Mirrors the
  // wizard validator's localTodayYYYYMMDD().
  const minComingSoonDate = (() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  })();

  // True when the creator selected "Series" — drives the episode sub-
  // panel so they capture their first episode's title + numbering in
  // the same flow instead of having to detour through the episodes
  // manager after upload.
  const isSeries = $derived(contentType === ContentType.SERIES);

  // Human-readable S/E label that tracks whatever the creator typed,
  // so the panel header / placeholder / Toasts read "S1 E2" when
  // they're uploading Episode 2 rather than always claiming
  // "Episode 1". The wizard doesn't insist on starting at S1E1 —
  // a creator partway through a series can begin here with any
  // episode they're ready to encode.
  const episodeLabel = $derived(`S${seasonNumber || 1} E${episodeNumber || 1}`);

  // Slimmed list — Sermon, Worship, and "Kids Content" were dropped from
  // the dropdown (no destination page today). Kids/Teens audience is now
  // a separate "Audience" selector below, so a creator can upload e.g.
  // a Kids Series or a Teens Short without conflating format + audience.
  // Legacy rows uploaded with the old values are tolerated by the reader
  // code; only the wizard surface is trimmed.
  const contentTypes = [
    { value: ContentType.MOVIE, label: '🎬 Movie', description: 'Full-length feature film' },
    { value: ContentType.SERIES, label: '📺 Series', description: 'TV series or web series' },
    { value: ContentType.SHORT_FILM, label: '🎞️ Short Film', description: 'Short narrative content' },
    { value: ContentType.DOCUMENTARY, label: '📚 Documentary', description: 'Educational or informational content' }
  ];

  const audiences = [
    { value: 'general' as const, label: 'General', description: 'Appears on /movies, /shows, or /documentaries' },
    { value: 'kids' as const, label: 'Kiddies', description: 'Appears on the Kiddies portal' },
    { value: 'teens' as const, label: 'Teens', description: 'Appears on the Teens portal' }
  ];

  const ageRatings = [
    { value: AgeRating.ALL_AGES, label: 'All Ages', description: 'Suitable for everyone' },
    { value: AgeRating.SEVEN_PLUS, label: '7+', description: 'Ages 7 and above' },
    { value: AgeRating.TEN_PLUS, label: '10+', description: 'Ages 10 and above' },
    { value: AgeRating.TWELVE_PLUS, label: '12+', description: 'Ages 12 and above' },
    { value: AgeRating.SIXTEEN_PLUS, label: '16+', description: 'Ages 16 and above' },
    { value: AgeRating.EIGHTEEN_PLUS, label: '18+', description: 'Adults only' }
  ];

  
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-white mb-2">Basic Information</h2>
    <p class="text-gray-300">Tell us about your content</p>
  </div>

  <!-- Title -->
  <div>
    <label for="title" class="block text-sm font-medium text-white mb-2">Content Title *</label>
    <input
      type="text"
      id="title"
      bind:value={title}
      placeholder="Enter your content title"
      class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    />
    {#if title.length > 0 && title.length < 5}
      <p class="text-red-400 text-sm mt-1">Title must be at least 5 characters long</p>
    {/if}
  </div>

  <!-- Description -->
  <div>
    <label for="description" class="block text-sm font-medium text-white mb-2">Description *</label>
    <textarea
      id="description"
      bind:value={description}
      placeholder="Provide a compelling description of your content..."
      rows="4"
      maxlength="1000"
      class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
    ></textarea>
    <div class="flex justify-between text-sm mt-2">
      <span class="text-gray-400">
        {#if description.length === 0}
          <span class="text-gray-400">Description is required</span>
        {:else if description.length < 50}
          <span class="text-red-400">{50 - description.length} more character{50 - description.length === 1 ? '' : 's'} needed</span>
        {:else if description.length > 1000}
          <span class="text-red-400">Over limit by {description.length - 1000} character{description.length - 1000 === 1 ? '' : 's'}</span>
        {:else}
          <span class="text-emerald-400">✓ Good description length</span>
        {/if}
      </span>
      <span class="font-medium {description.length > 1000 ? 'text-red-400' : description.length >= 50 ? 'text-emerald-400' : 'text-gray-400'}">{description.length}/1000</span>
    </div>
  </div>

  <!-- Content Type -->
  <div role="radiogroup" aria-labelledby="contentType-label">
    <div id="contentType-label" class="block text-sm font-medium text-white mb-3">Content Type *</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      {#each contentTypes as type (type.value)}
        <label class="cursor-pointer">
          <input
            type="radio"
            name="contentType"
            value={type.value}
            checked={contentType === type.value}
            onchange={() => (contentType = type.value)}
            class="sr-only"
          />
          <div class="p-4 border-2 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] {contentType === type.value ? 'border-primary bg-primary/10 shadow-[0_0_15px_hsla(var(--primary)/0.25)] scale-[1.02]' : 'border-border bg-white/2 hover:border-muted-foreground/30'}">
            <div class="font-medium text-white">{type.label}</div>
            <div class="text-sm text-gray-400 mt-0.5">{type.description}</div>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!--
    Episode sub-panel — only when contentType=Series. The "Content
    Title" above is the SERIES title (e.g. "The Bible Series"); this
    block captures the EPISODE the creator is uploading right now.
    Defaults to S1E1 but the season + episode fields are free-form —
    a creator can start mid-series (e.g. "Episode 5 of Season 2")
    and the labels here re-render to match. Episodes besides the
    one started here get added via the episodes manager after submit.
  -->
  {#if isSeries}
    <div class="bg-cyan-500/8 border border-cyan-500/30 rounded-xl p-5 space-y-4">
      <div class="flex items-start gap-3">
        <span class="text-2xl">📺</span>
        <div>
          <div class="font-semibold text-white">{episodeLabel} details</div>
          <div class="text-xs text-cyan-100/70 mt-0.5">
            The video you upload next becomes <span class="text-cyan-100 font-medium">{episodeLabel}</span> of your series.
            You can add more episodes after submit from the episodes manager —
            this wizard creates the series + this single episode in one go.
          </div>
        </div>
      </div>

      <div>
        <label for="episodeTitle" class="block text-sm font-medium text-white mb-2">{episodeLabel} Title *</label>
        <input
          type="text"
          id="episodeTitle"
          bind:value={episodeTitle}
          placeholder="e.g. Pilot, Genesis, The Throne, The Reckoning"
          class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {#if episodeTitle.length > 0 && episodeTitle.length < 2}
          <p class="text-red-400 text-sm mt-1">Episode title must be at least 2 characters</p>
        {/if}
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="seasonNumber" class="block text-sm font-medium text-white mb-2">Season number</label>
          <input
            type="number"
            id="seasonNumber"
            min="1"
            bind:value={seasonNumber}
            class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label for="episodeNumber" class="block text-sm font-medium text-white mb-2">Episode number</label>
          <input
            type="number"
            id="episodeNumber"
            min="1"
            bind:value={episodeNumber}
            class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  {/if}

  <!-- Audience — separate from Content Type so a creator can upload a
       "Kids Series" or a "Teens Short" without conflating format with
       audience. Drives the `category` column on submit, which the
       /kids/kiddies and /kids/teens portals filter on. -->
  <div role="radiogroup" aria-labelledby="audience-label">
    <div id="audience-label" class="block text-sm font-medium text-white mb-3">Audience *</div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      {#each audiences as a (a.value)}
        <label class="cursor-pointer">
          <input
            type="radio"
            name="audience"
            value={a.value}
            checked={audience === a.value}
            onchange={() => (audience = a.value)}
            class="sr-only"
          />
          <div class="p-4 border-2 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] {audience === a.value ? 'border-primary bg-primary/10 shadow-[0_0_15px_hsla(var(--primary)/0.25)] scale-[1.02]' : 'border-border bg-white/2 hover:border-muted-foreground/30'}">
            <div class="font-medium text-white">{a.label}</div>
            <div class="text-sm text-gray-400 mt-0.5">{a.description}</div>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!--
    Coming Soon — declared at the top of the wizard so the rest of
    the steps know not to enforce the main-video gate. Flexible:
       - Trailer-only announcement → upload posters + (optionally) trailer; skip the main video; submit
       - Full title with future release → upload everything; the video encodes; admin can review during the wait; the cron flips to live on the release date
    Either way the row carries scheduledPublishAt and surfaces on the
    /coming-soon carousels with a "Notify me" bell after admin approval.
  -->
  <div class="bg-violet-500/8 border border-violet-500/30 rounded-xl p-5 space-y-4">
    <label class="flex items-start cursor-pointer">
      <input
        type="checkbox"
        bind:checked={comingSoon}
        class="mt-1 mr-4 w-5 h-5 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none cursor-pointer"
      />
      <div class="text-sm select-none">
        <div class="text-white font-medium mb-1 flex items-center gap-2">
          <span class="text-lg">🗓️</span>
          This is a Coming Soon release
        </div>
        <div class="text-violet-100/80">
          Skip the main video and submit the announcement now — or upload everything (trailer + final video) and let the cron auto-publish on your release date.
          Either way, the row goes through admin review during the wait and surfaces on the Coming Soon carousels with a "Notify me" bell.
        </div>
      </div>
    </label>

    {#if comingSoon}
      <div class="pl-9 space-y-2">
        <label for="comingSoonReleaseDate" class="block text-sm font-medium text-white">
          Release date *
        </label>
        <input
          id="comingSoonReleaseDate"
          type="date"
          bind:value={comingSoonReleaseDate}
          min={minComingSoonDate}
          class="w-full md:w-64 px-3 py-2 bg-gray-900 border border-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p class="text-xs text-violet-100/70">
          On this date, the cron auto-flips the row to live (provided the encoder has a playable video). Otherwise the row stays in Coming Soon until you add the main video from your content library.
        </p>
      </div>
    {/if}
  </div>

  <!-- Age Rating -->
  <div role="radiogroup" aria-labelledby="ageRating-label">
    <div id="ageRating-label" class="block text-sm font-medium text-white mb-3">Age Rating *</div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      {#each ageRatings as rating (rating.value)}
        <label class="cursor-pointer">
          <input
            type="radio"
            name="ageRating"
            value={rating.value}
            checked={ageRating === rating.value}
            onchange={() => (ageRating = rating.value)}
            class="sr-only"
          />
          <div class="p-3 border-2 rounded-xl text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] {ageRating === rating.value ? 'border-secondary bg-secondary/10 shadow-[0_0_15px_hsla(var(--secondary)/0.25)] scale-[1.02]' : 'border-border bg-white/2 hover:border-muted-foreground/30'}">
            <div class="font-bold text-white">{rating.label}</div>
            <div class="text-xs text-gray-400 mt-0.5">{rating.description}</div>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- Faith-Based Content Notice -->
  <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4">
    <div class="flex items-start">
      <div class="text-2xl mr-3">ℹ️</div>
      <div>
        <div class="font-medium text-white mb-1">Faith-Based Content Guidelines</div>
        <div class="text-sm text-yellow-100">
          All content will be reviewed to ensure it aligns with our Christian values and community guidelines.
          Content should be appropriate for a faith-based audience and promote positive Christian messages.
        </div>
      </div>
    </div>
  </div>
</div>
