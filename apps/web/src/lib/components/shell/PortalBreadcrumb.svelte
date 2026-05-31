<script lang="ts">
  import { page } from '$app/state';
  import { ChevronRight } from '@lucide/svelte';
  import { ADMIN_LABELS, CREATOR_LABELS } from './portal-nav';

  interface Props {
    portal: 'admin' | 'creator';
  }

  let { portal }: Props = $props();

  const labels = $derived(portal === 'admin' ? ADMIN_LABELS : CREATOR_LABELS);

  // Build a breadcrumb from the path. We resolve each prefix segment
  // against the nav label map; anything not in the map is treated as a
  // detail page and rendered title-cased from the slug. The portal root
  // (`/admin` or `/creator`) is always the first crumb.
  interface Crumb { href: string; label: string; }

  const crumbs = $derived.by<Crumb[]>(() => {
    const path = page.url.pathname;
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return [];

    const root = `/${segments[0]}`;
    const result: Crumb[] = [{
      href: root,
      label: portal === 'admin' ? 'Admin' : 'Creator Studio'
    }];

    let acc = root;
    for (let i = 1; i < segments.length; i++) {
      acc += `/${segments[i]}`;
      const label = labels[acc] ?? prettify(segments[i]);
      result.push({ href: acc, label });
      // Skip a final id-looking segment if the prior was a known page
      // (e.g. /admin/content/abc-123 — show "Content" not the UUID).
      if (i === segments.length - 1 && looksLikeId(segments[i]) && labels[acc.replace(`/${segments[i]}`, '')]) {
        result.pop();
      }
    }
    return result;
  });

  function prettify(slug: string): string {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function looksLikeId(s: string): boolean {
    // UUIDs, hex hashes, or anything with > 12 chars and a digit + dash
    return /^[0-9a-f-]{12,}$/i.test(s) || /^\d+$/.test(s);
  }
</script>

<nav aria-label="Breadcrumb" class="text-sm text-muted-foreground flex items-center gap-1.5 min-w-0">
  {#each crumbs as c, i (c.href)}
    {#if i > 0}
      <ChevronRight class="w-3.5 h-3.5 shrink-0 opacity-50" aria-hidden="true" />
    {/if}
    {#if i === crumbs.length - 1}
      <span class="text-foreground font-medium truncate">{c.label}</span>
    {:else}
      <a href={c.href} class="hover:text-foreground transition-colors truncate">{c.label}</a>
    {/if}
  {/each}
</nav>
