<!-- Video Upload Step -->
<script lang="ts">
  import type { VideoUploadProgress, UploadWizardState, UploadStep } from '$lib/types/creator';
  
  export let data: UploadWizardState['stepData'][UploadStep.VIDEO_UPLOAD];
  export let onUpdate: (data: any) => void;
  
  let videoFile: File | null = data.videoFile || null;
  let trailerFile: File | null = data.trailerFile || null;
  let videoProgress: VideoUploadProgress | null = data.videoProgress || null;
  let trailerProgress: VideoUploadProgress | null = data.trailerProgress || null;
  
  let videoDragOver = false;
  let trailerDragOver = false;
  
  // Update parent when data changes
  $: onUpdate({ videoFile, trailerFile, videoProgress, trailerProgress });
  
  function handleVideoFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      videoFile = input.files[0];
      startVideoUpload(videoFile);
    }
  }
  
  function handleTrailerFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      trailerFile = input.files[0];
      startTrailerUpload(trailerFile);
    }
  }
  
  function handleVideoDrop(event: DragEvent) {
    event.preventDefault();
    videoDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      videoFile = event.dataTransfer.files[0];
      startVideoUpload(videoFile);
    }
  }
  
  function handleTrailerDrop(event: DragEvent) {
    event.preventDefault();
    trailerDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      trailerFile = event.dataTransfer.files[0];
      startTrailerUpload(trailerFile);
    }
  }
  
  async function performActualUpload(type: 'video' | 'trailer', file: File) {
    const currentProgress = type === 'video' ? videoProgress : trailerProgress;
    if (!currentProgress) return;
    
    // Use a local variable that TS can narrow effectively
    const progress: VideoUploadProgress = currentProgress;

    try {
      // 1. Get presigned URL
      const res = await fetch('/api/encoder/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type })
      });
      
      const { presignedUrl, objectName, publicUrl } = await res.json();
      
      // 2. Upload directly to MinIO
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          progress.progressPercentage = (event.loaded / event.total) * 100;
          progress.uploadedBytes = event.loaded;
          if (type === 'video') videoProgress = { ...progress };
          else trailerProgress = { ...progress };
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          progress.isUploading = false;
          progress.isCompleted = true;
          progress.uploadUrl = publicUrl;
          progress.objectName = objectName;
          if (type === 'video') videoProgress = { ...progress };
          else trailerProgress = { ...progress };
        } else {
          handleError('Upload failed with status ' + xhr.status);
        }
      };
      
      xhr.onerror = () => handleError('Network error during upload');
      xhr.send(file);
      
    } catch (error: any) {
      handleError(error.message || 'Failed to start upload');
    }

    function handleError(msg: string) {
      progress.hasError = true;
      progress.errorMessage = msg;
      progress.isUploading = false;
      if (type === 'video') videoProgress = { ...progress };
      else trailerProgress = { ...progress };
    }
  }

  function startVideoUpload(file: File) {
    const initialProgress: VideoUploadProgress = {
      fileName: file.name,
      fileSize: file.size,
      uploadedBytes: 0,
      progressPercentage: 0,
      isUploading: true,
      isCompleted: false,
      hasError: false
    };
    videoProgress = initialProgress;
    
    performActualUpload('video', file);
  }
  
  function startTrailerUpload(file: File) {
    const initialProgress: VideoUploadProgress = {
      fileName: file.name,
      fileSize: file.size,
      uploadedBytes: 0,
      progressPercentage: 0,
      isUploading: true,
      isCompleted: false,
      hasError: false
    };
    trailerProgress = initialProgress;
    
    performActualUpload('trailer', file);
  }
  
  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function removeVideo() {
    videoFile = null;
    videoProgress = null;
  }
  
  function removeTrailer() {
    trailerFile = null;
    trailerProgress = null;
  }
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-white mb-2">Upload Video Content</h2>
    <p class="text-gray-300">Upload your main content and optional trailer</p>
  </div>
  
  <!-- Main Video Upload -->
  <div>
    <div class="block text-sm font-medium text-white mb-3">Main Video Content *</div>
    
    {#if !videoFile && !videoProgress}
      <div 
        class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center transition-all {videoDragOver ? 'border-purple-600 bg-purple-600/10' : 'hover:border-gray-500'}"
        on:dragover|preventDefault={() => videoDragOver = true}
        on:dragleave={() => videoDragOver = false}
        on:drop={handleVideoDrop}
        role="button"
        tabindex="0"
        aria-label="Drop video file here or click to browse"
        on:keydown={(e) => e.key === 'Enter' && document.getElementById('video-upload')?.click()}
      >
        <div class="text-4xl mb-4">🎬</div>
        <div class="text-white font-medium mb-2">Drop your video file here or click to browse</div>
        <div class="text-gray-400 text-sm mb-4">Supported formats: MP4, MOV, AVI (Max: 5GB)</div>
        <input 
          type="file" 
          accept="video/*"
          on:change={handleVideoFileSelect}
          class="hidden"
          id="video-upload"
        />
        <label 
          for="video-upload" 
          class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer inline-block transition-colors"
        >
          Choose Video File
        </label>
      </div>
    {:else if videoProgress}
      <div class="bg-white/10 rounded-lg p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="text-white font-medium">{videoProgress.fileName}</div>
            <div class="text-gray-400 text-sm">{formatFileSize(videoProgress.fileSize)}</div>
          </div>
          {#if videoProgress.isCompleted}
            <div class="text-green-400 flex items-center">
              <span class="mr-2">✓</span> Uploaded
            </div>
          {:else if videoProgress.hasError}
            <div class="text-red-400 flex items-center">
              <span class="mr-2">✗</span> Error
            </div>
          {:else}
            <button on:click={removeVideo} class="text-red-400 hover:text-red-300">✗</button>
          {/if}
        </div>
        
        {#if videoProgress.isUploading || !videoProgress.isCompleted}
          <div class="mb-2">
            <div class="flex justify-between text-sm text-gray-400 mb-1">
              <span>Uploading...</span>
              <span>{Math.round(videoProgress.progressPercentage)}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style="width: {videoProgress.progressPercentage}%"
              ></div>
            </div>
          </div>
        {/if}
        
        <div class="text-sm text-gray-400">
          {formatFileSize(videoProgress.uploadedBytes)} / {formatFileSize(videoProgress.fileSize)}
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Trailer Upload (Optional) -->
  <div>
    <div class="block text-sm font-medium text-white mb-3">
      Trailer (Optional)
      <span class="text-gray-400 text-sm ml-2">Helps with discoverability</span>
    </div>
    
    {#if !trailerFile && !trailerProgress}
      <div 
        class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-all {trailerDragOver ? 'border-blue-600 bg-blue-600/10' : 'hover:border-gray-500'}"
        on:dragover|preventDefault={() => trailerDragOver = true}
        on:dragleave={() => trailerDragOver = false}
        on:drop={handleTrailerDrop}
        role="button"
        tabindex="0"
        aria-label="Drop trailer file here or click to browse"
        on:keydown={(e) => e.key === 'Enter' && document.getElementById('trailer-upload')?.click()}
      >
        <div class="text-3xl mb-3">🎞️</div>
        <div class="text-white font-medium mb-2">Drop trailer here or click to browse</div>
        <div class="text-gray-400 text-sm mb-4">Short preview of your content (Max: 500MB)</div>
        <input 
          type="file" 
          accept="video/*"
          on:change={handleTrailerFileSelect}
          class="hidden"
          id="trailer-upload"
        />
        <label 
          for="trailer-upload" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block transition-colors"
        >
          Choose Trailer
        </label>
      </div>
    {:else if trailerProgress}
      <div class="bg-white/10 rounded-lg p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="text-white font-medium">{trailerProgress.fileName}</div>
            <div class="text-gray-400 text-sm">{formatFileSize(trailerProgress.fileSize)}</div>
          </div>
          {#if trailerProgress.isCompleted}
            <div class="text-green-400 flex items-center">
              <span class="mr-2">✓</span> Uploaded
            </div>
          {:else if trailerProgress.hasError}
            <div class="text-red-400 flex items-center">
              <span class="mr-2">✗</span> Error
            </div>
          {:else}
            <button on:click={removeTrailer} class="text-red-400 hover:text-red-300">✗</button>
          {/if}
        </div>
        
        {#if trailerProgress.isUploading}
          <div class="mb-2">
            <div class="flex justify-between text-sm text-gray-400 mb-1">
              <span>Uploading...</span>
              <span>{Math.round(trailerProgress.progressPercentage)}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style="width: {trailerProgress.progressPercentage}%"
              ></div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
  
  <!-- Upload Guidelines -->
  <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
    <div class="flex items-start">
      <div class="text-2xl mr-3">⚠️</div>
      <div>
        <div class="font-medium text-white mb-1">Video Upload Guidelines</div>
        <div class="text-sm text-yellow-200 space-y-1">
          <div>• Videos should be in MP4 format for best compatibility</div>
          <div>• Minimum resolution: 720p (1280x720)</div>
          <div>• Audio should be clear and free from background noise</div>
          <div>• Content will be processed and optimized after upload</div>
          <div>• Upload may take several minutes depending on file size</div>
        </div>
      </div>
    </div>
  </div>
</div>