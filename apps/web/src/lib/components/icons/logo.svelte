<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';

  let { class: className, ...rest }: HTMLImgAttributes = $props();
</script>

<img src="/logo.svg" alt="Logo" class={"block dark:hidden " + (className || "")} {...rest} />
<img src="/logo-dark.svg" alt="Logo" class={"hidden dark:block " + (className || "")} {...rest} />
