<!-- Basic Info Step -->
<script lang="ts">
  import { ContentType, AgeRating } from '$lib/types/creator';
  
  export let data: any;
  export let onUpdate: (data: any) => void;
  
  let title = data.title || '';
  let description = data.description || '';
  let contentType = data.contentType || '';
  let ageRating = data.ageRating || '';
  let isPpv = data.isPpv || false;
  let ppvPriceDollars = data.ppvPriceDollars || '';

  // Update parent when data changes
  $: onUpdate({ title, description, contentType, ageRating, isPpv, ppvPriceDollars: isPpv ? ppvPriceDollars : '' });
  
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
      class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
      class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
    ></textarea>
    <div class="flex justify-between text-sm mt-1">
      <span class="text-gray-400">
        {#if description.length < 50}
          <span class="text-red-400">Description should be at least 50 characters</span>
        {:else}
          <span class="text-green-400">Good description length</span>
        {/if}
      </span>
      <span class="text-gray-400">{description.length}/1000</span>
    </div>
  </div>
  
  <!-- Content Type -->
  <div>
    <label for = "contentType" class="block text-sm font-medium text-white mb-3">Content Type *</label>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      {#each contentTypes as type}
        <label class="cursor-pointer">
          <input 
            type="radio" 
            bind:group={contentType} 
            value={type.value}
            class="sr-only"
          />
          <div class="p-4 border-2 rounded-lg transition-all {contentType === type.value ? 'border-purple-600 bg-purple-600/20' : 'border-gray-600 bg-white/5 hover:border-gray-500'}">
            <div class="font-medium text-white">{type.label}</div>
            <div class="text-sm text-gray-400">{type.description}</div>
          </div>
        </label>
      {/each}
    </div>
  </div>
  
  <!-- Age Rating -->
  <div>
    <label for = "ageRating" class="block text-sm font-medium text-white mb-3">Age Rating *</label>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      {#each ageRatings as rating}
        <label class="cursor-pointer">
          <input 
            type="radio" 
            bind:group={ageRating} 
            value={rating.value}
            class="sr-only"
          />
          <div class="p-3 border-2 rounded-lg text-center transition-all {ageRating === rating.value ? 'border-green-600 bg-green-600/20' : 'border-gray-600 bg-white/5 hover:border-gray-500'}">
            <div class="font-bold text-white">{rating.label}</div>
            <div class="text-xs text-gray-400">{rating.description}</div>
          </div>
        </label>
      {/each}
    </div>
  </div>
  
  <!-- Pay-Per-View -->
  <div>
    <label class="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" bind:checked={isPpv} class="w-4 h-4 accent-purple-600" />
      <span class="text-sm font-medium text-white">Suggest Pay-Per-View (PPV) pricing</span>
    </label>
    <p class="text-xs text-gray-400 mt-1 ml-7">Admin will review and set the final price. PPV content earns you a higher per-view revenue share.</p>

    {#if isPpv}
      <div class="mt-3 ml-7">
        <label for="ppvPrice" class="block text-xs text-gray-300 mb-1">Suggested price (USD)</label>
        <div class="flex items-center gap-2 w-40">
          <span class="text-gray-400">$</span>
          <input
            type="number"
            id="ppvPrice"
            bind:value={ppvPriceDollars}
            min="0.99"
            max="49.99"
            step="0.01"
            placeholder="4.99"
            class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
      </div>
    {/if}
  </div>

  <!-- Faith-Based Content Notice -->
  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
    <div class="flex items-start">
      <div class="text-2xl mr-3">ℹ️</div>
      <div>
        <div class="font-medium text-white mb-1">Faith-Based Content Guidelines</div>
        <div class="text-sm text-blue-200">
          All content will be reviewed to ensure it aligns with our Christian values and community guidelines. 
          Content should be appropriate for a faith-based audience and promote positive Christian messages.
        </div>
      </div>
    </div>
  </div>
</div>