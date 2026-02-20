<!-- Asset Management Step -->
<script lang="ts">
  import type { ContentAssets, AssetUploadProgress } from '$lib/types/creator';
  
  export let data: any;
  export let onUpdate: (data: any) => void;
  
  let uploadedAssets: Partial<ContentAssets> = data.uploadedAssets || {};
  let assetProgress: AssetUploadProgress[] = data.assetProgress || [];
  
  // Update parent when data changes
  $: onUpdate({ uploadedAssets, assetProgress });
  
  const assetTypes = [
    {
      key: 'posterPortrait' as keyof ContentAssets,
      title: 'Portrait Poster',
      description: '2:3 ratio - Main movie cards',
      icon: '📱',
      aspectRatio: '2:3',
      required: true,
      recommendations: 'Minimum 400x600px, Max 2MB'
    },
    {
      key: 'backdropHero' as keyof ContentAssets,
      title: 'Hero Background',
      description: '16:9 ratio - Hero carousel',
      icon: '🖼️',
      aspectRatio: '16:9',
      required: true,
      recommendations: 'Minimum 1920x1080px, Max 5MB'
    },
    {
      key: 'posterLandscape' as keyof ContentAssets,
      title: 'Landscape Poster',
      description: '16:9 ratio - Horizontal cards',
      icon: '🖥️',
      aspectRatio: '16:9',
      required: false,
      recommendations: 'Minimum 800x450px, Max 3MB'
    },
    {
      key: 'posterSquare' as keyof ContentAssets,
      title: 'Square Poster',
      description: '1:1 ratio - Mobile/compact views',
      icon: '📐',
      aspectRatio: '1:1',
      required: false,
      recommendations: 'Minimum 400x400px, Max 2MB'
    },
    {
      key: 'logoTitle' as keyof ContentAssets,
      title: 'Title Logo',
      description: 'Transparent PNG - Movie title',
      icon: '🏷️',
      aspectRatio: 'flexible',
      required: false,
      recommendations: 'PNG with transparency, Max 1MB'
    },
    {
      key: 'thumbnail' as keyof ContentAssets,
      title: 'Video Thumbnail',
      description: '16:9 ratio - Video preview',
      icon: '🎬',
      aspectRatio: '16:9',
      required: false,
      recommendations: 'Minimum 640x360px, Max 1MB'
    }
  ];
  
  function handleFileUpload(assetType: keyof ContentAssets, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      startAssetUpload(assetType, file);
    }
  }
  
  function handleFileDrop(assetType: keyof ContentAssets, event: DragEvent) {
    event.preventDefault();
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      startAssetUpload(assetType, file);
    }
  }
  
  async function startAssetUpload(assetType: keyof ContentAssets, file: File) {
    // Add to progress tracking
    const progressItem: AssetUploadProgress = {
      assetType,
      fileName: file.name,
      fileSize: file.size,
      progressPercentage: 0,
      isCompleted: false,
      hasError: false
    };
    
    assetProgress = [...assetProgress.filter(p => p.assetType !== assetType), progressItem];
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'thumbnails');

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/files');
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const current = assetProgress.find(p => p.assetType === assetType);
          if (current) {
            current.progressPercentage = (event.loaded / event.total) * 100;
            assetProgress = [...assetProgress];
          }
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const current = assetProgress.find(p => p.assetType === assetType);
          if (current) {
            current.isCompleted = true;
            current.url = response.directUrl;
            uploadedAssets[assetType] = response.directUrl;
            uploadedAssets = { ...uploadedAssets };
            assetProgress = [...assetProgress];
          }
        } else {
          handleError('Upload failed');
        }
      };
      
      xhr.onerror = () => handleError('Network error');
      xhr.send(formData);
    } catch (error: any) {
      handleError(error.message || 'Error starting upload');
    }

    function handleError(msg: string) {
      const current = assetProgress.find(p => p.assetType === assetType);
      if (current) {
        current.hasError = true;
        assetProgress = [...assetProgress];
      }
    }
  }
  
  function removeAsset(assetType: keyof ContentAssets) {
    delete uploadedAssets[assetType];
    uploadedAssets = { ...uploadedAssets };
    assetProgress = assetProgress.filter(p => p.assetType !== assetType);
  }
  
  function getAssetProgress(assetType: keyof ContentAssets) {
    return assetProgress.find(p => p.assetType === assetType);
  }
  
  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-white mb-2">Image Assets & Media</h2>
    <p class="text-gray-300">Upload images that will represent your content across the platform</p>
  </div>
  
  <!-- Asset Upload Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each assetTypes as assetType}
      {@const progress = getAssetProgress(assetType.key)}
      {@const isUploaded = uploadedAssets[assetType.key]}
      {@const isUploading = progress && !progress.isCompleted}
      
      <div class="bg-white/10 rounded-lg p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center">
              <span class="text-2xl mr-2">{assetType.icon}</span>
              <div>
                <div class="font-medium text-white">{assetType.title}</div>
                {#if assetType.required}
                  <span class="text-xs bg-red-600 text-white px-2 py-1 rounded">Required</span>
                {/if}
              </div>
            </div>
            <div class="text-sm text-gray-400 mt-1">{assetType.description}</div>
            <div class="text-xs text-gray-500 mt-1">{assetType.recommendations}</div>
          </div>
          
          {#if isUploaded && !isUploading}
            <button 
              on:click={() => removeAsset(assetType.key)}
              class="text-red-400 hover:text-red-300 text-xl"
            >
              ✗
            </button>
          {/if}
        </div>
        
        {#if isUploaded && !isUploading}
          <!-- Uploaded Asset Preview -->
          <div class="relative">
            <img 
              src={uploadedAssets[assetType.key]} 
              alt={assetType.title}
              class="w-full h-32 object-cover rounded-lg"
            />
            <div class="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
              ✓ Uploaded
            </div>
          </div>
        {:else if isUploading && progress}
          <!-- Upload Progress -->
          <div class="space-y-3">
            <div class="text-sm text-white">{progress.fileName}</div>
            <div class="flex justify-between text-xs text-gray-400">
              <span>Uploading...</span>
              <span>{Math.round(progress.progressPercentage)}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style="width: {progress.progressPercentage}%"
              ></div>
            </div>
          </div>
        {:else}
          <!-- Upload Area -->
          <div 
            class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-all"
            on:dragover|preventDefault
            on:drop|preventDefault={(e) => handleFileDrop(assetType.key, e)}
            role="button"
            tabindex="0"
            aria-label={`Drop ${assetType.title} image here or click to browse`}
            on:keydown={(e) => e.key === 'Enter' && document.getElementById(`upload-${assetType.key}`)?.click()}
          >
            <div class="text-gray-400 text-sm mb-3">
              Drop image here or click to browse
            </div>
            <input 
              type="file" 
              accept="image/*"
              on:change={(e) => handleFileUpload(assetType.key, e)}
              class="hidden"
              id="upload-{assetType.key}"
            />
            <label 
              for="upload-{assetType.key}" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm inline-block transition-colors"
            >
              Choose Image
            </label>
            <div class="text-xs text-gray-500 mt-2">
              Aspect Ratio: {assetType.aspectRatio}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
  
  <!-- Asset Guidelines -->
  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
    <div class="flex items-start">
      <div class="text-2xl mr-3">💡</div>
      <div>
        <div class="font-medium text-white mb-1">Image Asset Tips</div>
        <div class="text-sm text-blue-200 space-y-1">
          <div>• High-quality images perform better and look more professional</div>
          <div>• Use images that accurately represent your content</div>
          <div>• Avoid text-heavy images as they may not scale well</div>
          <div>• Ensure images are appropriate for all age groups viewing your content</div>
          <div>• Images will be automatically optimized for different screen sizes</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Progress Summary -->
  {#if assetProgress.length > 0 || Object.keys(uploadedAssets).length > 0}
    <div class="bg-white/10 rounded-lg p-4">
      <div class="text-white font-medium mb-3">Upload Summary</div>
      <div class="text-sm text-gray-300">
        {Object.keys(uploadedAssets).length} of {assetTypes.filter(a => a.required).length} required assets uploaded
      </div>
      <div class="text-sm text-gray-300">
        {Object.keys(uploadedAssets).length} of {assetTypes.length} total assets uploaded
      </div>
    </div>
  {/if}
</div>