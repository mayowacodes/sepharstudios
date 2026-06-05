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
    ageRating = $bindable('')
  }: {
    title?: string;
    description?: string;
    contentType?: string;
    ageRating?: string;
  } = $props();

  const contentTypes = [
    { value: ContentType.MOVIE, label: '🎬 Movie', description: 'Full-length feature film' },
    { value: ContentType.SERIES, label: '📺 Series', description: 'TV series or web series' },
    { value: ContentType.DOCUMENTARY, label: '📚 Documentary', description: 'Educational or informational content' },
    { value: ContentType.SHORT_FILM, label: '🎞️ Short Film', description: 'Short narrative content' },
    { value: ContentType.SERMON, label: '⛪ Sermon', description: 'Religious teaching or preaching' },
    { value: ContentType.WORSHIP, label: '🎵 Worship', description: 'Worship music or service' },
    { value: ContentType.KIDS_CONTENT, label: '🧸 Kids Content', description: 'Child-appropriate content' }
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
