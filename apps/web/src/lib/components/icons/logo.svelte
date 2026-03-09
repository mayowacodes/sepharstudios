<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';

  let { class: className, ...rest }: HTMLImgAttributes = $props();
</script>

<img src="/logo-alone-sepharstudios.png" alt="Sephar Studios" class={className || ""} {...rest} />
