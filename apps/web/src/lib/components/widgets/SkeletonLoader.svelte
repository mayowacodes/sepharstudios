<script lang="ts">
  let { width = '100%', height = '100px', rounded = true, className = '' }: { width?: string; height?: string; rounded?: boolean; className?: string } = $props();
</script>

<div
  class={`bg-gray-300 animate-pulse ${rounded ? 'rounded-lg' : ''} ${className}`}
  style={`width: ${width}; height: ${height};`}
></div>
