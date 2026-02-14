<script lang="ts">
  export let width: string = '100%'; // Default width, can be overridden
  export let height: string = '100px'; // Default height, can be overridden
  export let rounded: boolean = true; // Whether the skeleton is rounded
  export let className: string = ''; // Additional classes for custom styling
</script>

<div
  class={`bg-gray-300 animate-pulse ${rounded ? 'rounded-lg' : ''} ${className}`}
  style={`width: ${width}; height: ${height};`}
></div>
