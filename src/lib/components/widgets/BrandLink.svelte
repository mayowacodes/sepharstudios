<script lang="ts">
  import Logo from "$lib/components/icons/logo.svelte";
  import { Constants } from "$lib/constants";
</script>
<a href="/" rel="prefetch" aria-label="logo" class="flex items-center gap-2">
  <Logo class="w-[70px] h-[40px]" />
  <span class="font-bold text-lg hidden sm:block">{Constants.BRANDNAME}</span>
</a>
