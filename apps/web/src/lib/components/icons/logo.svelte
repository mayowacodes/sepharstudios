<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';

  let { class: className, ...rest }: HTMLImgAttributes = $props();
</script>

<img src="/asl-logo.png" alt="ASL Logo" class={className || ""} {...rest} />
