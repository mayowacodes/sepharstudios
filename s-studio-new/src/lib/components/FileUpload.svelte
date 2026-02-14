<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { X } from 'lucide-svelte';

  export let label: string;
  export let name: string;
  export let accept: string = '*';
  export let required: boolean = false;
  export let file: File | null = null; // Allow external binding

  const dispatchChange = () => {
    dispatchEvent(new CustomEvent('change', { detail: { file } }));
  };

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      file = input.files[0];
      dispatchChange();
    }
  }

  function removeFile() {
    file = null;
    dispatchChange();
  }
</script>

<div class="space-y-2">
  <label for={name} class="text-sm font-medium">{label}</label>
  <div class="flex items-center gap-2">
    <Input id={name} type="file" name={name} accept={accept} required={required} on:change={handleFileChange} />
    {#if file}
      <div class="flex items-center gap-2 text-sm border rounded-md p-2">
        {file.name}
        <Button size="icon" variant="ghost" on:click={removeFile}>
          <X size={16} />
        </Button>
      </div>
    {/if}
  </div>
</div>
