<script lang="ts" module>
export interface iSelect {
  label: string;
  value: string;
}
</script>
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import { cn } from "$lib/utils";
  interface Props {
    options: iSelect[];
    value?: string;
    placeholder: string;
    name: string;
    class?: string;
    disabled?: boolean;
    onValueChange?: (val: string) => void;
  }
  let { options = [], value = $bindable(''), placeholder, class: className, name, disabled = false, onValueChange }: Props = $props();
  const triggerContent = $derived(options.find((f) => f.value === value)?.label ?? placeholder);
</script>
<Select.Root type="single" {name} bind:value {disabled} {onValueChange}>
  <Select.Trigger class={cn("w-[180px]", className)} aria-label={name}>{triggerContent}</Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each options as option (option.value)}
        <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
