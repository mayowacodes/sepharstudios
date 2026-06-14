<script lang="ts">
  import MediaDetailPage from '$lib/components/MediaDetailPage.svelte';
  import { SiteMeta } from '$lib/constants';
  const { data } = $props();
</script>

<svelte:head>
  <title>{data.content.title} — Sephar Studios</title>
  <meta name="description" content={data.content.description ?? ''} />
  <meta property="og:type" content="video.movie" />
  <meta property="og:title" content={`${data.content.title} — Sephar Studios`} />
  <meta property="og:description" content={data.content.description ?? ''} />
  <meta property="og:image" content={data.content.posterUrl || data.content.thumbnail || `${SiteMeta.link}${SiteMeta.ogimage}`} />
</svelte:head>

<MediaDetailPage
  content={data.content}
  episodes={data.episodes}
  watchProgress={data.watchProgress}
  isInMyList={data.isInMyList}
  mode="standard"
  previewDurationSec={60}
/>
