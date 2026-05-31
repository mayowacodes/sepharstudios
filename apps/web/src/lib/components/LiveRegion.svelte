<script lang="ts">
  /**
   * Singleton aria-live region. Mount once per portal layout.
   * Listens to the live-region store and renders into a visually-hidden
   * span; assistive tech reads it out as text changes.
   */
  import { liveRegionBuffer } from '$lib/stores/live-region';
</script>

<span class="sr-only" aria-live="polite" aria-atomic="true" role="status">
  {$liveRegionBuffer}
</span>
