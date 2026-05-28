<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { BadgeCheck, Heart, HeartOff, ExternalLink } from '@lucide/svelte';
  import MovieCard from '$lib/components/MovieCard.svelte';
  import { SiteMeta } from '$lib/constants';

  const { data } = $props();
  let creator = $derived(data.creator);
  let content = $derived(data.content);
  // followerCount + isFollowing live in local state so the optimistic update
  // from toggleFollow can mutate them. SvelteKit re-mounts this component
  // when navigating between /creators/<id> URLs, so stale initial-value
  // capture isn't a concern in practice.
  let followerCount = $state(0);
  let isFollowing = $state(false);
  let isOwnProfile = $derived(data.isOwnProfile);
  let toggling = $state(false);

  $effect(() => {
    followerCount = data.followerCount;
    isFollowing = data.isFollowing;
  });

  async function toggleFollow() {
    toggling = true;
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(`/api/creators/${creator.id}/follow`, { method });
      if (res.status === 401) {
        // Not signed in — bounce to login then back here.
        goto(`/auth/login?redirectTo=/creators/${creator.id}`);
        return;
      }
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Follow toggle failed');
      isFollowing = body.following;
      followerCount = body.followerCount;
    } catch (err: any) {
      alert(err.message);
    } finally {
      toggling = false;
    }
  }
</script>

<svelte:head>
  <title>{creator.displayName} · Sephar Studios</title>
  <meta name="description" content={creator.bio ?? `${creator.displayName} on Sephar Studios — faith-based content creator.`} />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content={`${creator.displayName} · Sephar Studios`} />
  <meta property="og:description" content={creator.bio ?? ''} />
  {#if creator.avatarUrl}
    <meta property="og:image" content={creator.avatarUrl} />
  {/if}
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': creator.creatorType === 'organization' ? 'Organization' : 'Person',
    name: creator.displayName,
    description: creator.bio ?? undefined,
    image: creator.avatarUrl ?? undefined,
    url: `${SiteMeta.link}/creators/${creator.id}`
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-background text-white">
  <!-- Banner -->
  <div class="relative h-48 sm:h-64 bg-linear-to-br from-primary/20 via-background to-background">
    {#if creator.bannerUrl}
      <img src={creator.bannerUrl} alt="" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-linear-to-t from-background to-transparent"></div>
    {/if}
  </div>

  <div class="max-w-5xl mx-auto px-4 -mt-16 relative">
    <!-- Avatar + Identity -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div class="flex items-end gap-4">
        <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-card border-4 border-background shadow-xl overflow-hidden shrink-0">
          {#if creator.avatarUrl}
            <img src={creator.avatarUrl} alt="" class="w-full h-full object-cover" />
          {:else}
            <div class="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
              {creator.displayName.slice(0, 1).toUpperCase()}
            </div>
          {/if}
        </div>
        <div class="pb-2">
          <h1 class="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            {creator.displayName}
            {#if creator.isVerified}
              <BadgeCheck class="w-6 h-6 text-primary" aria-label="Verified creator" />
            {/if}
          </h1>
          <div class="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
            <Badge variant="outline" class="capitalize">{creator.creatorType?.replace('_', ' ') ?? 'creator'}</Badge>
            {#if creator.denomination}
              <Badge variant="secondary">{creator.denomination}</Badge>
            {/if}
            <span>{followerCount.toLocaleString()} {followerCount === 1 ? 'follower' : 'followers'}</span>
          </div>
        </div>
      </div>

      {#if !isOwnProfile}
        <Button
          onclick={toggleFollow}
          disabled={toggling}
          variant={isFollowing ? 'outline' : 'default'}
          aria-pressed={isFollowing}
        >
          {#if isFollowing}
            <HeartOff class="w-4 h-4 mr-2" />
            {toggling ? 'Unfollowing…' : 'Following'}
          {:else}
            <Heart class="w-4 h-4 mr-2" />
            {toggling ? 'Following…' : 'Follow'}
          {/if}
        </Button>
      {/if}
    </div>

    <!-- Bio -->
    {#if creator.bio}
      <div class="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">About</h2>
        <p class="text-sm whitespace-pre-line">{creator.bio}</p>
      </div>
    {/if}

    <!-- Social links -->
    {#if creator.socialLinks && Object.keys(creator.socialLinks).length > 0}
      <div class="flex flex-wrap gap-3 mb-8">
        {#each Object.entries(creator.socialLinks) as [platform, url] (platform)}
          {#if typeof url === 'string' && url}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {platform}
              <ExternalLink class="w-3 h-3" />
            </a>
          {/if}
        {/each}
      </div>
    {/if}

    <!-- Content grid -->
    <h2 class="text-xl font-bold mb-4">Content from {creator.displayName}</h2>
    {#if content.length === 0}
      <div class="bg-card border border-border rounded-2xl p-12 text-center">
        <p class="text-muted-foreground">No published content yet.</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pb-16">
        {#each content as item (item.id)}
          <MovieCard movie={item} />
        {/each}
      </div>
    {/if}
  </div>
</div>
