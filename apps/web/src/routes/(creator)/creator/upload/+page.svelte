<script lang="ts">
  import MinioRegistryUploader from '$lib/components/MinioRegistryUploader.svelte';
  import { BUCKETS } from '$lib/constants/minio';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";

  let uploadedFile: any = null;

  function handleUploadComplete(event: CustomEvent) {
    const results = event.detail;
    if (results && results.length > 0) {
      uploadedFile = results[0];
    }
  }
</script>

<div class="container max-w-4xl py-10 space-y-8">
  <div class="space-y-2">
    <h1 class="text-3xl font-bold tracking-tight">Post New Content</h1>
    <p class="text-muted-foreground">Upload your videos to the Sephar Studios Registry.</p>
  </div>

  <div class="grid gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Video Upload</CardTitle>
        <CardDescription>Select a video file to upload to your creator studio.</CardDescription>
      </CardHeader>
      <CardContent>
        <MinioRegistryUploader 
          bucket="videos" 
          accept="video/*" 
          label="Drop video here"
          on:uploadComplete={handleUploadComplete}
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Thumbnail</CardTitle>
        <CardDescription>Upload a high-quality poster for your video.</CardDescription>
      </CardHeader>
      <CardContent>
        <MinioRegistryUploader 
          bucket="thumbnails" 
          accept="image/*" 
          label="Drop thumbnail here"
        />
      </CardContent>
    </Card>
  </div>

  {#if uploadedFile}
    <div class="p-6 border rounded-xl bg-primary/5 animate-in fade-in zoom-in-95">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <Badge variant="outline" class="bg-primary/10 text-primary border-primary/20">Uploaded to Registry</Badge>
            <span class="text-xs font-mono text-muted-foreground">ID: {uploadedFile.dbId}</span>
          </div>
          <h3 class="text-lg font-semibold">{uploadedFile.filename}</h3>
          <p class="text-sm text-muted-foreground truncate max-w-md">{uploadedFile.directUrl}</p>
        </div>
        <a href={uploadedFile.directUrl} target="_blank" class="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
          Preview Content
        </a>
      </div>
    </div>
  {/if}
</div>