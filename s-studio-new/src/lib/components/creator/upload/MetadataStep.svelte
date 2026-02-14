<!-- Metadata Step -->
<script lang="ts">
  export let data: any;
  export let onUpdate: (data: any) => void;
  
  let bibleReferences: string[] = data.bibleReferences || [];
  let themes: string[] = data.themes || [];
  let ministryAffiliation = data.ministryAffiliation || '';
  let duration = data.duration || '';
  let language = data.language || 'English';
  let hasSubtitles = data.hasSubtitles || false;
  let hasClosedCaptions = data.hasClosedCaptions || false;
  let tags: string[] = data.tags || [];
  let keywords: string[] = data.keywords || [];
  let genre: string[] = data.genre || [];
  
  // Update parent when data changes
  $: onUpdate({ 
    bibleReferences, themes, ministryAffiliation, duration, language, 
    hasSubtitles, hasClosedCaptions, tags, keywords, genre 
  });
  
  let newBibleRef = '';
  let newTag = '';
  let newKeyword = '';
  
  const commonThemes = [
    'Faith', 'Hope', 'Love', 'Forgiveness', 'Redemption', 'Grace', 'Prayer', 
    'Worship', 'Community', 'Service', 'Family', 'Marriage', 'Parenting',
    'Youth', 'Evangelism', 'Discipleship', 'Leadership', 'Testimony'
  ];
  
  const commonGenres = [
    'Drama', 'Documentary', 'Biography', 'Musical', 'Comedy', 'Family',
    'Historical', 'Inspirational', 'Educational', 'Children\'s', 'Youth'
  ];
  
  const languages = [
    'English', 'Spanish', 'French', 'Portuguese', 'German', 'Italian',
    'Korean', 'Mandarin', 'Arabic', 'Hindi', 'Other'
  ];
  
  function addBibleReference() {
    if (newBibleRef.trim() && !bibleReferences.includes(newBibleRef.trim())) {
      bibleReferences = [...bibleReferences, newBibleRef.trim()];
      newBibleRef = '';
    }
  }
  
  function removeBibleReference(ref: string) {
    bibleReferences = bibleReferences.filter(r => r !== ref);
  }
  
  function toggleTheme(theme: string) {
    if (themes.includes(theme)) {
      themes = themes.filter(t => t !== theme);
    } else {
      themes = [...themes, theme];
    }
  }
  
  function toggleGenre(selectedGenre: string) {
    if (genre.includes(selectedGenre)) {
      genre = genre.filter(g => g !== selectedGenre);
    } else {
      genre = [...genre, selectedGenre];
    }
  }
  
  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      tags = [...tags, newTag.trim()];
      newTag = '';
    }
  }
  
  function removeTag(tag: string) {
    tags = tags.filter(t => t !== tag);
  }
  
  function addKeyword() {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      keywords = [...keywords, newKeyword.trim()];
      newKeyword = '';
    }
  }
  
  function removeKeyword(keyword: string) {
    keywords = keywords.filter(k => k !== keyword);
  }
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-white mb-2">Content Metadata</h2>
    <p class="text-gray-300">Add details to help users discover and understand your content</p>
  </div>
  
  <!-- Bible References -->
  <div>
    <label for="bible-references" class="block text-sm font-medium text-white mb-3">Bible References</label>
    <div class="flex gap-2 mb-3">
      <input 
        type="text" 
        id="bible-references"
        bind:value={newBibleRef}
        placeholder="e.g., John 3:16, Romans 8:28"
        class="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        on:keydown={(e) => e.key === 'Enter' && addBibleReference()}
      />
      <button 
        on:click={addBibleReference}
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Add
      </button>
    </div>
    
    {#if bibleReferences.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each bibleReferences as ref}
          <span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
            {ref}
            <button on:click={() => removeBibleReference(ref)} class="ml-2 hover:text-red-300">×</button>
          </span>
        {/each}
      </div>
    {/if}
    <div class="text-xs text-gray-400 mt-1">
      Add relevant Bible verses that relate to your content's message
    </div>
  </div>
  
  <!-- Themes -->
  <div>
    <label for = "themes" class="block text-sm font-medium text-white mb-3">Themes</label>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {#each commonThemes as theme}
        <label class="cursor-pointer">
          <input 
            type="checkbox" 
            checked={themes.includes(theme)}
            on:change={() => toggleTheme(theme)}
            class="sr-only"
          />
          <div class="p-2 border rounded-lg text-center text-sm transition-all {themes.includes(theme) ? 'border-green-600 bg-green-600/20 text-white' : 'border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500'}">
            {theme}
          </div>
        </label>
      {/each}
    </div>
  </div>
  
  <!-- Ministry Affiliation -->
  <div>
    <label for="ministry" class="block text-sm font-medium text-white mb-2">Ministry/Organization Affiliation</label>
    <input 
      type="text" 
      id="ministry"
      bind:value={ministryAffiliation}
      placeholder="e.g., Grace Community Church, Victory Ministries"
      class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
    />
    <div class="text-xs text-gray-400 mt-1">
      Optional: Name of the church, ministry, or organization associated with this content
    </div>
  </div>
  
  <!-- Duration and Language -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label for="duration" class="block text-sm font-medium text-white mb-2">Duration (minutes)</label>
      <input 
        type="number" 
        id="duration"
        bind:value={duration}
        placeholder="90"
        min="1"
        class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
      />
    </div>
    
    <div>
      <label for="language" class="block text-sm font-medium text-white mb-2">Primary Language</label>
      <select 
        id="language"
        bind:value={language}
        class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
      >
        {#each languages as lang}
          <option value={lang}>{lang}</option>
        {/each}
      </select>
    </div>
  </div>
  
  <!-- Accessibility Features -->
  <div>
    <label for ="accessibilityFeatures" class="block text-sm font-medium text-white mb-3">Accessibility Features</label>
    <div class="space-y-2">
      <label class="flex items-center">
        <input 
          type="checkbox" 
          bind:checked={hasSubtitles}
          class="mr-3 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
        />
        <span class="text-white">Has Subtitles</span>
      </label>
      
      <label class="flex items-center">
        <input 
          type="checkbox" 
          bind:checked={hasClosedCaptions}
          class="mr-3 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
        />
        <span class="text-white">Has Closed Captions</span>
      </label>
    </div>
  </div>
  
  <!-- Genres -->
  <div>
    <label for = "genres" class="block text-sm font-medium text-white mb-3">Genres</label>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {#each commonGenres as genreOption}
        <label class="cursor-pointer">
          <input 
            type="checkbox" 
            checked={genre.includes(genreOption)}
            on:change={() => toggleGenre(genreOption)}
            class="sr-only"
          />
          <div class="p-2 border rounded-lg text-center text-sm transition-all {genre.includes(genreOption) ? 'border-blue-600 bg-blue-600/20 text-white' : 'border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500'}">
            {genreOption}
          </div>
        </label>
      {/each}
    </div>
  </div>
  
  <!-- Tags -->
  <div>
    <label for="tags-input" class="block text-sm font-medium text-white mb-3">Tags</label>
    <div class="flex gap-2 mb-3">
      <input 
        type="text" 
        id="tags-input"
        bind:value={newTag}
        placeholder="Add custom tags..."
        class="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        on:keydown={(e) => e.key === 'Enter' && addTag()}
      />
      <button 
        on:click={addTag}
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Add
      </button>
    </div>
    
    {#if tags.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each tags as tag}
          <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
            {tag}
            <button on:click={() => removeTag(tag)} class="ml-2 hover:text-red-300">×</button>
          </span>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- SEO Keywords -->
  <div>
    <label for="keywords-input" class="block text-sm font-medium text-white mb-3">SEO Keywords</label>
    <div class="flex gap-2 mb-3">
      <input 
        type="text" 
        id="keywords-input"
        bind:value={newKeyword}
        placeholder="Add search keywords..."
        class="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        on:keydown={(e) => e.key === 'Enter' && addKeyword()}
      />
      <button 
        on:click={addKeyword}
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Add
      </button>
    </div>
    
    {#if keywords.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each keywords as keyword}
          <span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
            {keyword}
            <button on:click={() => removeKeyword(keyword)} class="ml-2 hover:text-red-300">×</button>
          </span>
        {/each}
      </div>
    {/if}
    <div class="text-xs text-gray-400 mt-1">
      Keywords help users find your content through search
    </div>
  </div>
  
  <!-- Metadata Guidelines -->
  <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
    <div class="flex items-start">
      <div class="text-2xl mr-3">📝</div>
      <div>
        <div class="font-medium text-white mb-1">Metadata Best Practices</div>
        <div class="text-sm text-green-200 space-y-1">
          <div>• Add relevant Bible references that connect to your content's message</div>
          <div>• Choose themes that accurately represent your content</div>
          <div>• Use specific, searchable keywords that your audience might use</div>
          <div>• Be honest about content duration and accessibility features</div>
          <div>• Well-structured metadata improves discoverability</div>
        </div>
      </div>
    </div>
  </div>
</div>