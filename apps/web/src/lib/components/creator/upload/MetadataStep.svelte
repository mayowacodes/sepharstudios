<!-- Metadata Step -->
<script lang="ts">
  // Each field is a $bindable prop — parent owns wizardState, bind: writes
  // through. Eliminates the manual sync-and-propagate dance that raced
  // itself and wiped user input.
  let {
    bibleReferences = $bindable<string[]>([]),
    themes = $bindable<string[]>([]),
    ministryAffiliation = $bindable<string>(''),
    duration = $bindable<number | ''>(''),
    language = $bindable<string>('English'),
    hasSubtitles = $bindable<boolean>(false),
    hasClosedCaptions = $bindable<boolean>(false),
    tags = $bindable<string[]>([]),
    keywords = $bindable<string[]>([]),
    genre = $bindable<string[]>([])
  }: {
    bibleReferences?: string[];
    themes?: string[];
    ministryAffiliation?: string;
    duration?: number | '';
    language?: string;
    hasSubtitles?: boolean;
    hasClosedCaptions?: boolean;
    tags?: string[];
    keywords?: string[];
    genre?: string[];
  } = $props();

  // Caps so a malicious or careless paste can't push thousands of strings
  // through validation; surface the limit as a toast instead of silently
  // dropping input.
  const MAX_BIBLE_REFS = 20;
  const MAX_TAGS = 25;
  const MAX_KEYWORDS = 25;

  let newBibleRef = $state('');
  let newTag = $state('');
  let newKeyword = $state('');

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
    const ref = newBibleRef.trim();
    if (!ref) return;
    if (bibleReferences.includes(ref)) {
      newBibleRef = '';
      return;
    }
    if (bibleReferences.length >= MAX_BIBLE_REFS) {
      alert(`Up to ${MAX_BIBLE_REFS} Bible references can be added.`);
      return;
    }
    bibleReferences = [...bibleReferences, ref];
    newBibleRef = '';
  }

  function removeBibleReference(ref: string) {
    bibleReferences = bibleReferences.filter((r) => r !== ref);
  }

  function toggleTheme(theme: string) {
    if (themes.includes(theme)) {
      themes = themes.filter((t) => t !== theme);
    } else {
      themes = [...themes, theme];
    }
  }

  function toggleGenre(selectedGenre: string) {
    if (genre.includes(selectedGenre)) {
      genre = genre.filter((g) => g !== selectedGenre);
    } else {
      genre = [...genre, selectedGenre];
    }
  }

  function addTag() {
    const tag = newTag.trim();
    if (!tag) return;
    if (tags.includes(tag)) {
      newTag = '';
      return;
    }
    if (tags.length >= MAX_TAGS) {
      alert(`Up to ${MAX_TAGS} tags can be added.`);
      return;
    }
    tags = [...tags, tag];
    newTag = '';
  }

  function removeTag(tag: string) {
    tags = tags.filter((t) => t !== tag);
  }

  function addKeyword() {
    const k = newKeyword.trim();
    if (!k) return;
    if (keywords.includes(k)) {
      newKeyword = '';
      return;
    }
    if (keywords.length >= MAX_KEYWORDS) {
      alert(`Up to ${MAX_KEYWORDS} keywords can be added.`);
      return;
    }
    keywords = [...keywords, k];
    newKeyword = '';
  }

  function removeKeyword(keyword: string) {
    keywords = keywords.filter((k) => k !== keyword);
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
        class="flex-1 px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        onkeydown={(e) => { if (e.key === 'Enter') addBibleReference(); }}
      />
      <button
        type="button"
        onclick={addBibleReference}
        class="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition-opacity"
      >
        Add
      </button>
    </div>

    {#if bibleReferences.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each bibleReferences as ref (ref)}
          <span class="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center font-medium shadow-sm">
            {ref}
            <button type="button" onclick={() => removeBibleReference(ref)} class="ml-2 hover:text-red-200 font-bold">×</button>
          </span>
        {/each}
      </div>
    {/if}
    <div class="text-xs text-gray-400 mt-1">
      Add relevant Bible verses that relate to your content's message
    </div>
  </div>

  <!-- Themes -->
  <div role="group" aria-labelledby="themes-label">
    <div id="themes-label" class="block text-sm font-medium text-white mb-3">Themes</div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {#each commonThemes as theme (theme)}
        <label class="cursor-pointer">
          <input
            type="checkbox"
            value={theme}
            bind:group={themes}
            class="sr-only"
          />
          <div class="p-2 border rounded-xl text-center text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] {themes.includes(theme) ? 'border-primary bg-primary/10 shadow-[0_0_12px_hsla(var(--primary)/0.2)] text-white scale-[1.03]' : 'border-border bg-white/2 text-gray-300 hover:border-muted-foreground/30'}">
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
      class="w-full px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
        class="w-full px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>

    <div>
      <label for="language" class="block text-sm font-medium text-white mb-2">Primary Language</label>
      <select
        id="language"
        bind:value={language}
        class="w-full px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {#each languages as lang (lang)}
          <option value={lang} class="bg-card text-foreground">{lang}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Accessibility Features -->
  <div role="group" aria-labelledby="accessibility-label">
    <div id="accessibility-label" class="block text-sm font-medium text-white mb-3">Accessibility Features</div>
    <div class="space-y-2">
      <label class="flex items-center cursor-pointer">
        <input
          type="checkbox"
          bind:checked={hasSubtitles}
          class="mr-3 w-4 h-4 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none"
        />
        <span class="text-white text-sm">Has Subtitles</span>
      </label>

      <label class="flex items-center cursor-pointer">
        <input
          type="checkbox"
          bind:checked={hasClosedCaptions}
          class="mr-3 w-4 h-4 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none"
        />
        <span class="text-white text-sm">Has Closed Captions</span>
      </label>
    </div>
  </div>

  <!-- Genres -->
  <div role="group" aria-labelledby="genres-label">
    <div id="genres-label" class="block text-sm font-medium text-white mb-3">Genres</div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {#each commonGenres as genreOption (genreOption)}
        <label class="cursor-pointer">
          <input
            type="checkbox"
            value={genreOption}
            bind:group={genre}
            class="sr-only"
          />
          <div class="p-2 border rounded-xl text-center text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] {genre.includes(genreOption) ? 'border-secondary bg-secondary/10 shadow-[0_0_12px_hsla(var(--secondary)/0.2)] text-white scale-[1.03]' : 'border-border bg-white/2 text-gray-300 hover:border-muted-foreground/30'}">
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
        class="flex-1 px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        onkeydown={(e) => { if (e.key === 'Enter') addTag(); }}
      />
      <button
        type="button"
        onclick={addTag}
        class="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition-opacity"
      >
        Add
      </button>
    </div>

    {#if tags.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each tags as tag (tag)}
          <span class="bg-primary/90 text-white px-3 py-1 rounded-full text-sm flex items-center font-medium shadow-sm">
            {tag}
            <button type="button" onclick={() => removeTag(tag)} class="ml-2 hover:text-red-200 font-bold">×</button>
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
        class="flex-1 px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        onkeydown={(e) => { if (e.key === 'Enter') addKeyword(); }}
      />
      <button
        type="button"
        onclick={addKeyword}
        class="bg-secondary hover:opacity-90 text-secondary-foreground px-4 py-2 rounded-lg font-semibold transition-opacity"
      >
        Add
      </button>
    </div>

    {#if keywords.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each keywords as keyword (keyword)}
          <span class="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center font-semibold shadow-sm">
            {keyword}
            <button type="button" onclick={() => removeKeyword(keyword)} class="ml-2 hover:text-red-200 font-bold">×</button>
          </span>
        {/each}
      </div>
    {/if}
    <div class="text-xs text-gray-400 mt-1">
      Keywords help users find your content through search
    </div>
  </div>

  <!-- Metadata Guidelines -->
  <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4">
    <div class="flex items-start">
      <div class="text-2xl mr-3">📝</div>
      <div>
        <div class="font-medium text-white mb-1">Metadata Best Practices</div>
        <div class="text-sm text-yellow-100 space-y-1">
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
