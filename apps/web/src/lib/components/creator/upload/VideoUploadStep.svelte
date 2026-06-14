<!-- Video Upload Step -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { toast } from 'svelte-sonner';
  import type { VideoUploadProgress } from '$lib/types/creator';

  // Each field is a $bindable prop — the parent's wizardState owns the
  // single source of truth and bind: passes through directly. See plan for
  // why this avoids the sync-effect race that wiped user input previously.
  let {
    videoFile = $bindable<File | null>(null),
    trailerFile = $bindable<File | null>(null),
    videoProgress = $bindable<VideoUploadProgress | null>(null),
    trailerProgress = $bindable<VideoUploadProgress | null>(null)
  }: {
    videoFile?: File | null;
    trailerFile?: File | null;
    videoProgress?: VideoUploadProgress | null;
    trailerProgress?: VideoUploadProgress | null;
  } = $props();

  let videoDragOver = $state(false);
  let trailerDragOver = $state(false);

  // Minimum vertical resolution accepted. Sourced from /api/platform-settings
  // so admins can raise (or lower, for need-based overrides) the floor
  // without a code change. Falls back to 1080 (the recommended default) if
  // the fetch fails. Floor of the clamp is 360 so an admin choosing 360p
  // in /admin/settings actually takes effect.
  let minVideoHeight = $state(1080);

  onMount(async () => {
    try {
      const res = await fetch('/api/platform-settings');
      if (res.ok) {
        const body = await res.json();
        if (Number.isFinite(body.minVideoHeight)) {
          minVideoHeight = Math.max(360, Math.min(2160, Number(body.minVideoHeight)));
        }
      }
    } catch {
      // keep fallback default
    }
  });

  function minResolutionWidth(h: number) {
    // Round to nearest 16:9 width.
    return Math.round((h * 16) / 9);
  }

  const minResolutionLabel = $derived(`${minVideoHeight}p (${minResolutionWidth(minVideoHeight)}x${minVideoHeight})`);

  // Admin-role users always pass the resolution gate. Lets QA staff test
  // low-res clips end-to-end without changing the platform-wide policy.
  // Reads the role from `page.data.user`, which the (creator) layout's
  // server load function already populates (see (creator)/+layout.server.ts).
  // Non-admins see the admin-set threshold (360 / 720 / 1080 / 1440 / 2160)
  // exactly as before.
  const isAdmin = $derived(page.data?.user?.role === 'admin');

  // No client-side size cap on video or trailer. 4K + HDR sources routinely
  // run above 5 GB; high-quality trailers can exceed 500 MB. The encoder
  // accepts whatever the source is and any practical ceiling comes from the
  // browser's XHR memory budget or the network, not from us. Keep format
  // and resolution gates below — those catch unusable files cheaply.

  // Browsers report different MIME types for video files (MOV may be
  // video/quicktime, MKV is video/x-matroska, etc.). We accept the
  // common container formats explicitly + any extension fallback for
  // ones the OS doesn't tag (Windows often reports `application/octet
  // -stream` for unknown files).
  const ALLOWED_VIDEO_MIME = new Set([
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi',
    'video/x-m4v', 'video/webm', 'video/mpeg', 'video/x-matroska'
  ]);
  const ALLOWED_VIDEO_EXT = /\.(mp4|mov|m4v|avi|webm|mpeg|mpg|mkv)$/i;

  function isAcceptedVideo(file: File): boolean {
    if (ALLOWED_VIDEO_MIME.has(file.type)) return true;
    if (ALLOWED_VIDEO_EXT.test(file.name)) return true;
    return false;
  }

  // Single client-side gate for both video and trailer. Runs format check
  // → resolution check (which is async). Bailing on the first failure
  // keeps the toast specific instead of stacking two. No size cap — see
  // the comment above the (deleted) MAX_VIDEO_BYTES / MAX_TRAILER_BYTES
  // constants for why.
  async function passesAllGates(file: File, _role: 'video' | 'trailer'): Promise<boolean> {
    if (!isAcceptedVideo(file)) {
      toast.error('Unsupported video format', {
        description: `${file.name || 'this file'} is not a recognized video. Use MP4, MOV, M4V, AVI, WebM, MPEG, or MKV.`
      });
      return false;
    }
    return await passesResolutionGate(file);
  }

  // Inspect a video file's actual encoded height via a hidden <video> element.
  // Resolves to height in pixels, or null when the browser can't decode it.
  function readVideoHeight(file: File): Promise<number | null> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.onloadedmetadata = () => {
        const h = video.videoHeight;
        URL.revokeObjectURL(url);
        resolve(Number.isFinite(h) && h > 0 ? h : null);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      video.src = url;
    });
  }

  // Returns true when the file passes the minimum-resolution gate (or the
  // gate cannot be evaluated, in which case server-side encoder validation
  // catches it later).
  async function passesResolutionGate(file: File): Promise<boolean> {
    if (isAdmin) {
      console.warn('[upload] admin role — resolution gate bypassed');
      return true;
    }
    const height = await readVideoHeight(file);
    if (height === null) return true; // can't measure → defer to server
    if (height < minVideoHeight) {
      toast.error('Video resolution too low', {
        description: `Detected ${height}p. Minimum allowed is ${minResolutionLabel}.`
      });
      return false;
    }
    return true;
  }

  async function handleVideoFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const candidate = input.files[0];
      if (!(await passesAllGates(candidate, 'video'))) {
        input.value = '';
        return;
      }
      videoFile = candidate;
      startVideoUpload(videoFile);
    }
  }

  async function handleTrailerFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const candidate = input.files[0];
      if (!(await passesAllGates(candidate, 'trailer'))) {
        input.value = '';
        return;
      }
      trailerFile = candidate;
      startTrailerUpload(trailerFile);
    }
  }

  async function handleVideoDrop(event: DragEvent) {
    event.preventDefault();
    videoDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const candidate = event.dataTransfer.files[0];
      if (!(await passesAllGates(candidate, 'video'))) return;
      videoFile = candidate;
      startVideoUpload(videoFile);
    }
  }

  async function handleTrailerDrop(event: DragEvent) {
    event.preventDefault();
    trailerDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const candidate = event.dataTransfer.files[0];
      if (!(await passesAllGates(candidate, 'trailer'))) return;
      trailerFile = candidate;
      startTrailerUpload(trailerFile);
    }
  }

  async function performActualUpload(type: 'video' | 'trailer', file: File) {
    const currentProgress = type === 'video' ? videoProgress : trailerProgress;
    if (!currentProgress) return;

    const progress: VideoUploadProgress = currentProgress;

    try {
      // Final upload happens after the content row exists, during submit.
      progress.progressPercentage = 100;
      progress.uploadedBytes = file.size;
      progress.isUploading = false;
      progress.isCompleted = true;
      progress.uploadUrl = 'staged-for-encoding';
      if (type === 'video') videoProgress = { ...progress };
      else trailerProgress = { ...progress };
    } catch (error: any) {
      handleError(error.message || 'Failed to stage upload');
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
    videoProgress = {
      fileName: file.name,
      fileSize: file.size,
      uploadedBytes: 0,
      progressPercentage: 0,
      isUploading: true,
      isCompleted: false,
      hasError: false
    };
    performActualUpload('video', file);
  }

  function startTrailerUpload(file: File) {
    trailerProgress = {
      fileName: file.name,
      fileSize: file.size,
      uploadedBytes: 0,
      progressPercentage: 0,
      isUploading: true,
      isCompleted: false,
      hasError: false
    };
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
        class="border-2 border-dashed border-border rounded-xl p-8 text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] {videoDragOver ? 'border-primary bg-primary/5 shadow-[0_0_15px_hsla(var(--primary)/0.15)]' : 'hover:border-muted-foreground/30 bg-white/2'}"
        ondragover={(e) => { e.preventDefault(); videoDragOver = true; }}
        ondragleave={() => (videoDragOver = false)}
        ondrop={handleVideoDrop}
        role="button"
        tabindex="0"
        aria-label="Drop video file here or click to browse"
        onkeydown={(e) => { if (e.key === 'Enter') document.getElementById('video-upload')?.click(); }}
      >
        <div class="text-4xl mb-4 floating-icon">🎬</div>
        <div class="text-white font-medium mb-2">Drop your video file here or click to browse</div>
        <div class="text-gray-400 text-sm mb-4">Supported formats: MP4, MOV, AVI, MKV, WebM. Any size — 4K originals welcome.</div>
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-m4v,video/webm,video/mpeg,video/x-matroska,.mp4,.mov,.m4v,.avi,.webm,.mpeg,.mpg,.mkv"
          onchange={handleVideoFileSelect}
          class="hidden"
          id="video-upload"
        />
        <label
          for="video-upload"
          class="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-lg cursor-pointer inline-block font-semibold transition-opacity"
        >
          Choose Video File
        </label>
      </div>
    {:else if videoProgress}
      <div class="bg-white/5 border border-border/80 rounded-xl p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="min-w-0 flex-1 pr-4">
            <div class="text-white font-medium truncate">{videoProgress.fileName}</div>
            <div class="text-gray-400 text-sm">{formatFileSize(videoProgress.fileSize)}</div>
          </div>
          {#if videoProgress.isCompleted}
            <div class="flex items-center gap-2 shrink-0">
              <div class="text-emerald-400 flex items-center font-medium">
                <span class="mr-2">✓</span> Staged
              </div>
              <button type="button" onclick={removeVideo} aria-label="Remove staged video" class="text-red-400 hover:text-red-300 text-lg">✗</button>
            </div>
          {:else if videoProgress.hasError}
            <div class="text-red-400 flex items-center font-medium shrink-0">
              <span class="mr-2">✗</span> Error
            </div>
          {:else}
            <button type="button" onclick={removeVideo} aria-label="Cancel" class="text-red-400 hover:text-red-300 text-lg shrink-0">✗</button>
          {/if}
        </div>

        {#if videoProgress.isUploading || !videoProgress.isCompleted}
          <div class="mb-2">
            <div class="flex justify-between text-sm text-gray-400 mb-1">
              <span>{videoProgress.isCompleted ? 'Ready to encode' : 'Preparing...'}</span>
              <span>{Math.round(videoProgress.progressPercentage)}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-300"
                style="width: {videoProgress.progressPercentage}%"
              ></div>
            </div>
          </div>
        {/if}

        {#if videoProgress.isCompleted && !videoProgress.hasError}
          <!-- Explicit explanation of what "Staged" means. The video file
               isn't transmitted yet — the actual upload runs at Submit
               via an encoder-signed URL, and a 5 GB transfer at this
               point would be wasted if the user backs out. Without this
               line the wizard looks like it lied about completing. -->
          <div class="mt-3 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-foreground/90">
            <span class="text-primary text-lg leading-none">ℹ</span>
            <div>
              <div class="font-medium text-white">Staged for encoding</div>
              <div class="text-gray-300">
                Your video is queued locally. The actual transfer runs when you click
                <span class="font-medium text-white">Submit for review</span> on the last step.
                Don't close this tab before then.
              </div>
            </div>
          </div>
        {:else}
          <div class="text-sm text-gray-400">
            {formatFileSize(videoProgress.uploadedBytes)} / {formatFileSize(videoProgress.fileSize)}
          </div>
        {/if}
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
        class="border-2 border-dashed border-border rounded-xl p-6 text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] {trailerDragOver ? 'border-secondary bg-secondary/5 shadow-[0_0_15px_hsla(var(--secondary)/0.15)]' : 'hover:border-muted-foreground/30 bg-white/2'}"
        ondragover={(e) => { e.preventDefault(); trailerDragOver = true; }}
        ondragleave={() => (trailerDragOver = false)}
        ondrop={handleTrailerDrop}
        role="button"
        tabindex="0"
        aria-label="Drop trailer file here or click to browse"
        onkeydown={(e) => { if (e.key === 'Enter') document.getElementById('trailer-upload')?.click(); }}
      >
        <div class="text-3xl mb-3 floating-icon-delayed">🎞️</div>
        <div class="text-white font-medium mb-2">Drop trailer here or click to browse</div>
        <div class="text-gray-400 text-sm mb-4">Short preview of your content. No size cap.</div>
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-m4v,video/webm,video/mpeg,video/x-matroska,.mp4,.mov,.m4v,.avi,.webm,.mpeg,.mpg,.mkv"
          onchange={handleTrailerFileSelect}
          class="hidden"
          id="trailer-upload"
        />
        <label
          for="trailer-upload"
          class="bg-secondary hover:opacity-90 text-secondary-foreground px-4 py-2 rounded-lg cursor-pointer inline-block font-semibold transition-opacity"
        >
          Choose Trailer
        </label>
      </div>
    {:else if trailerProgress}
      <div class="bg-white/5 border border-border/80 rounded-xl p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="text-white font-medium">{trailerProgress.fileName}</div>
            <div class="text-gray-400 text-sm">{formatFileSize(trailerProgress.fileSize)}</div>
          </div>
          {#if trailerProgress.isCompleted}
            <div class="flex items-center gap-2 shrink-0">
              <div class="text-emerald-400 flex items-center font-medium">
                <span class="mr-2">✓</span> Staged
              </div>
              <button type="button" onclick={removeTrailer} aria-label="Remove staged trailer" class="text-red-400 hover:text-red-300 text-lg">✗</button>
            </div>
          {:else if trailerProgress.hasError}
            <div class="text-red-400 flex items-center font-medium">
              <span class="mr-2">✗</span> Error
            </div>
          {:else}
            <button type="button" onclick={removeTrailer} class="text-red-400 hover:text-red-300 text-lg">✗</button>
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
                class="bg-secondary h-2 rounded-full transition-all duration-300"
                style="width: {trailerProgress.progressPercentage}%"
              ></div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Upload Guidelines -->
  <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4">
    <div class="flex items-start">
      <div class="text-2xl mr-3">⚠️</div>
      <div>
        <div class="font-medium text-white mb-1">Video Upload Guidelines</div>
        <div class="text-sm text-yellow-100 space-y-1">
          <div>• Videos should be in MP4 format for best compatibility</div>
          <div>• Minimum resolution: {minResolutionLabel}</div>
          <div>• Audio should be clear and free from background noise</div>
          <div>• Content will be processed and optimized after upload</div>
          <div>• Upload may take several minutes depending on file size</div>
        </div>
      </div>
    </div>
  </div>
</div>
