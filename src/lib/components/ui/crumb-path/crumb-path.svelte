<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { page } from '$app/state';

  const getBreadcrumbs = (url: URL) => {
    const segments = url.pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const name = segment;
      return { name, path };
    });
  };

  let breadcrumbs = $state(getBreadcrumbs(page.url));
</script>

<Breadcrumb.Root>
  <Breadcrumb.List class="items-center">
    {#each breadcrumbs as { name, path }, i}
      <Breadcrumb.Item class={i < breadcrumbs.length - 1 ? 'hidden md:block' : ''}>
        <Breadcrumb.Link href={path} class="capitalize max-w-20 line-clamp-1">{name.replace(/-/g, ' ')}</Breadcrumb.Link>
      </Breadcrumb.Item>
      {#if i < breadcrumbs.length - 1}
        <Breadcrumb.Separator class="hidden md:block -mb-0.5" />
      {/if}
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
