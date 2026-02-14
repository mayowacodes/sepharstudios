<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Progress } from "$lib/components/ui/progress";
  import { toast } from "svelte-sonner";
  import { Upload, X, CheckCircle2, AlertCircle, FileVideo, FileImage, File } from "lucide-react";

  export let bucket: string = "uploads";
  export let accept: string = "*/*";
  export let label: string = "Upload File";
  export let maxFiles: number = 1;

  const dispatch = createEventDispatcher();

  let files: File[] = [];
  let uploading = false;
  let progress = 0;
  let uploadResults: any[] = [];

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      files = Array.from(target.files).slice(0, maxFiles);
    }
  }

  async function startUpload() {
    if (files.length === 0) return;
    uploading = true;
    progress = 10;

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);

        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const result = await response.json();
        uploadResults = [...uploadResults, result];
        progress += (90 / files.length);
      }

      progress = 100;
      toast.success("Upload completed successfully!");
      dispatch('uploadComplete', uploadResults);
      
      // Cleanup
      setTimeout(() => {
        uploading = false;
        progress = 0;
        files = [];
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.error("An error occurred during upload.");
      uploading = false;
    }
  }

  function getFileIcon(type: string) {
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('image/')) return FileImage;
    return File;
  }
</script>

<div class="w-full space-y-4 p-4 border-2 border-dashed border-muted rounded-xl bg-card transition-all hover:border-primary/50">
  <div class="flex flex-col items-center justify-center space-y-2 py-4">
    <div class="p-3 rounded-full bg-primary/10 text-primary">
      <Upload class="w-6 h-6" />
    </div>
    <div class="text-center">
      <p class="text-sm font-medium">{label}</p>
      <p class="text-xs text-muted-foreground italic">Target Bucket: <span class="font-mono text-primary">{bucket}</span></p>
    </div>
    <Input 
      type="file" 
      {accept} 
      multiple={maxFiles > 1}
      on:change={handleFileSelect}
      disabled={uploading}
      class="max-w-xs cursor-pointer"
    />
  </div>

  {#if files.length > 0}
    <div class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Selected Files</p>
      {#each files as file}
        <div class="flex items-center justify-between p-2 rounded-lg bg-secondary/50 border border-border">
          <div class="flex items-center space-x-3">
            <svelte:component this={getFileIcon(file.type)} class="w-4 h-4 text-muted-foreground" />
            <div class="flex flex-col">
              <span class="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
              <span class="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          <button on:click={() => files = files.filter(f => f !== file)} class="text-muted-foreground hover:text-destructive">
            <X class="w-4 h-4" />
          </button>
        </div>
      {/each}
      
      {#if !uploading}
        <Button class="w-full mt-4 bg-primary hover:bg-primary/90" on:click={startUpload}>
          Start Upload ({files.length} {files.length === 1 ? 'file' : 'files'})
        </Button>
      {/if}
    </div>
  {/if}

  {#if uploading}
    <div class="space-y-2 animate-in fade-in slide-in-from-bottom-2">
      <div class="flex justify-between text-xs">
        <span class="text-muted-foreground">Uploading to MinIO Registry...</span>
        <span class="font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} class="h-2" />
    </div>
  {/if}
</div>
