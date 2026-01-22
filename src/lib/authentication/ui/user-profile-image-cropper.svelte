<script lang="ts">
  import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { Camera, Upload } from "@lucide/svelte";
  import { cn } from "$lib/utils";

  let { src, onCropped } = $props<{ src?: string, onCropped: (url: string) => void }>();
  let input: HTMLInputElement;

  const handleFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onCropped(url);
    }
  };
</script>

<div class="relative group cursor-pointer inline-block" onclick={() => input.click()}>
  <Avatar class="h-24 w-24 border-2 border-border transition-opacity group-hover:opacity-80">
    <AvatarImage {src} />
    <AvatarFallback>User</AvatarFallback>
  </Avatar>
  <div class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
    <Camera class="h-6 w-6 text-white" />
  </div>
  <input bind:this={input} type="file" accept="image/*" class="hidden" onchange={handleFileChange} />
</div>
