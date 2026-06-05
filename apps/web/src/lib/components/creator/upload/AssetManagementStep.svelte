<script lang="ts">
  import { toast } from 'svelte-sonner';
  import type { AssetUploadProgress, ContentAssets } from '$lib/types/creator';

  // Each field is a $bindable prop — parent owns wizardState, bind: writes
  // through. Removes the sync-effect race that was wiping user edits.
  let {
    uploadedAssets = $bindable<Partial<ContentAssets>>({}),
    assetProgress = $bindable<AssetUploadProgress[]>([])
  }: {
    uploadedAssets?: Partial<ContentAssets>;
    assetProgress?: AssetUploadProgress[];
  } = $props();

  const MB = 1024 * 1024;
  // Standard photographic image MIME set used by every slot except the
  // title logo, which must be a transparent PNG (so AVIF/JPG/WebP are
  // explicitly rejected even though they're fine for posters/backdrops).
  const STD_IMAGE_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
  const STD_IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp,image/avif,.png,.jpg,.jpeg,.webp,.avif';
  const STD_IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;
  const PNG_ONLY_EXT = /\.png$/i;

  const assetTypes = [
    {
      key: 'posterPortrait' as keyof ContentAssets,
      title: 'Portrait Poster',
      description: 'Required. 2:3 vertical card used for movie tiles and browsing.',
      accept: STD_IMAGE_ACCEPT,
      mime: STD_IMAGE_MIME,
      extRegex: STD_IMAGE_EXT,
      formatLabel: 'PNG, JPG, WebP, or AVIF',
      required: true,
      maxBytes: 2 * MB
    },
    {
      key: 'posterLandscape' as keyof ContentAssets,
      title: 'Landscape Poster',
      description: 'Optional. 16:9 horizontal card used in featured rows.',
      accept: STD_IMAGE_ACCEPT,
      mime: STD_IMAGE_MIME,
      extRegex: STD_IMAGE_EXT,
      formatLabel: 'PNG, JPG, WebP, or AVIF',
      required: false,
      maxBytes: 3 * MB
    },
    {
      key: 'posterSquare' as keyof ContentAssets,
      title: 'Square Poster',
      description: 'Optional. 1:1 card used on mobile and compact layouts.',
      accept: STD_IMAGE_ACCEPT,
      mime: STD_IMAGE_MIME,
      extRegex: STD_IMAGE_EXT,
      formatLabel: 'PNG, JPG, WebP, or AVIF',
      required: false,
      maxBytes: 2 * MB
    },
    {
      key: 'backdropHero' as keyof ContentAssets,
      title: 'Hero Background',
      description: 'Required. 16:9 HD image behind detail pages and featured rows.',
      accept: STD_IMAGE_ACCEPT,
      mime: STD_IMAGE_MIME,
      extRegex: STD_IMAGE_EXT,
      formatLabel: 'PNG, JPG, WebP, or AVIF',
      required: true,
      maxBytes: 5 * MB
    },
    {
      key: 'logoTitle' as keyof ContentAssets,
      title: 'Title Logo',
      // PNG-only because a transparent background is required — JPG has no
      // alpha channel and AVIF/WebP variants get rejected to keep the
      // detail-page composite clean. Players overlay this on top of the
      // backdrop, so any non-transparent format would show a colored box.
      description: 'Optional. Transparent PNG title treatment shown over the hero backdrop.',
      accept: 'image/png,.png',
      mime: ['image/png'],
      extRegex: PNG_ONLY_EXT,
      formatLabel: 'transparent PNG',
      required: false,
      maxBytes: 1 * MB
    },
    {
      key: 'thumbnail' as keyof ContentAssets,
      title: 'Video Thumbnail',
      description: 'Optional. Compact preview image used in cards and notifications.',
      accept: STD_IMAGE_ACCEPT,
      mime: STD_IMAGE_MIME,
      extRegex: STD_IMAGE_EXT,
      formatLabel: 'PNG, JPG, WebP, or AVIF',
      required: false,
      maxBytes: 1 * MB
    }
  ];

  function formatSize(bytes: number): string {
    if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  function validateImage(file: File, asset: typeof assetTypes[number]): boolean {
    const mimeOk = asset.mime.includes(file.type);
    const extOk = asset.extRegex.test(file.name);
    if (!mimeOk && !extOk) {
      toast.error(`Unsupported format for ${asset.title}`, {
        description: `Use ${asset.formatLabel}.`
      });
      return false;
    }

    if (file.size > asset.maxBytes) {
      toast.error(`${asset.title} is too large`, {
        description: `${formatSize(file.size)} exceeds the ${formatSize(asset.maxBytes)} limit.`
      });
      return false;
    }

    return true;
  }

  function progressFor(assetType: keyof ContentAssets) {
    return assetProgress.find((item) => item.assetType === assetType);
  }

  function setProgress(assetType: keyof ContentAssets, patch: Partial<AssetUploadProgress>) {
    const current = progressFor(assetType);
    if (!current) return;
    assetProgress = assetProgress.map((item) =>
      item.assetType === assetType ? { ...item, ...patch } : item
    );
  }

  function handleFileSelect(assetType: keyof ContentAssets, event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    const asset = assetTypes.find((item) => item.key === assetType);
    if (!file || !asset) return;

    if (!validateImage(file, asset)) {
      input.value = '';
      return;
    }

    void uploadAsset(assetType, file);
  }

  // Strip characters MinIO and our presign endpoint won't accept, so a
  // user dropping `My Logo (Final v2)!.png` doesn't fail validation just
  // because of the exclamation mark. Only letters, digits, `._-() ` are
  // allowed by the server-side `SAFE_FILENAME` regex.
  function sanitizeFilename(name: string): string {
    const cleaned = name.replace(/[^A-Za-z0-9._\-() ]/g, '_').trim();
    return cleaned.length > 0 ? cleaned : `upload-${Date.now()}.bin`;
  }

  // Three-step upload — no file bytes ever pass through our SvelteKit
  // server. The wizard previously POSTed the whole multipart body to
  // `/api/files`, which was subject to BODY_SIZE_LIMIT (default 512 KB
  // in adapter-node) and to every reverse-proxy body cap between the
  // browser and our app. Even with the cap raised, large files were
  // hitting silent 403s from upstream middleware. Going browser →
  // MinIO directly bypasses all of it.
  //
  //   1. POST /api/files/sign   → { uploadUrl, objectName, bucket }
  //   2. PUT  <uploadUrl>       → bytes go directly to MinIO; XHR
  //                                progress events drive the UI bar
  //   3. POST /api/files/commit → records the row in filesTable and
  //                                returns the durable directUrl
  async function uploadAsset(assetType: keyof ContentAssets, file: File) {
    const progressItem: AssetUploadProgress = {
      assetType,
      fileName: file.name,
      fileSize: file.size,
      progressPercentage: 0,
      isCompleted: false,
      hasError: false
    };

    assetProgress = [...assetProgress.filter((item) => item.assetType !== assetType), progressItem];

    const safeName = sanitizeFilename(file.name);
    const contentType = file.type || 'application/octet-stream';

    // Step 1: ask the server for a presigned PUT URL.
    let signed: { uploadUrl: string; objectName: string; bucket: string };
    try {
      const signRes = await fetch('/api/files/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: safeName, bucket: 'thumbnails', contentType })
      });
      const body = (await signRes.json().catch(() => ({}))) as {
        uploadUrl?: string;
        objectName?: string;
        bucket?: string;
        error?: string;
        detail?: string;
      };
      if (!signRes.ok || !body.uploadUrl || !body.objectName || !body.bucket) {
        handleUploadError(assetType, body.detail ?? body.error ?? `Could not start upload (HTTP ${signRes.status}).`);
        return;
      }
      signed = { uploadUrl: body.uploadUrl, objectName: body.objectName, bucket: body.bucket };
    } catch (err) {
      handleUploadError(assetType, err instanceof Error ? err.message : 'Could not reach the upload service.');
      return;
    }

    // Step 2: PUT directly to MinIO. XMLHttpRequest is required (not
    // fetch) because `fetch` still has no upload-progress events as of
    // 2025-ish — we need `xhr.upload.onprogress` to drive the bar.
    const putOk = await new Promise<boolean>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signed.uploadUrl);
      xhr.setRequestHeader('Content-Type', contentType);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(assetType, { progressPercentage: (event.loaded / event.total) * 100 });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true);
        } else {
          // MinIO returns XML on error, not JSON. Extract the <Message>
          // tag if present; otherwise fall back to a status-based note.
          const xml = xhr.responseText || '';
          const m = xml.match(/<Message>([^<]+)<\/Message>/);
          handleUploadError(
            assetType,
            m ? `Storage rejected the upload: ${m[1]}` : `Upload failed at storage (HTTP ${xhr.status}).`
          );
          resolve(false);
        }
      };

      xhr.onerror = () => {
        handleUploadError(assetType, 'Network error while sending the file to storage.');
        resolve(false);
      };

      xhr.send(file);
    });

    if (!putOk) return;

    // Step 3: tell our server the bytes are in MinIO so it can record
    // the row and hand back the durable directUrl.
    try {
      const commitRes = await fetch('/api/files/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectName: signed.objectName,
          bucket: signed.bucket,
          size: file.size,
          contentType,
          filename: safeName
        })
      });
      const body = (await commitRes.json().catch(() => ({}))) as {
        directUrl?: string;
        error?: string;
        detail?: string;
      };
      if (!commitRes.ok || !body.directUrl) {
        handleUploadError(assetType, body.detail ?? body.error ?? `Could not finalize upload (HTTP ${commitRes.status}).`);
        return;
      }

      uploadedAssets = { ...uploadedAssets, [assetType]: body.directUrl };
      setProgress(assetType, { progressPercentage: 100, isCompleted: true, url: body.directUrl });
      toast.success('Image uploaded', { description: file.name });
    } catch (err) {
      handleUploadError(assetType, err instanceof Error ? err.message : 'Could not finalize upload.');
    }
  }

  function handleUploadError(assetType: keyof ContentAssets, message: string) {
    setProgress(assetType, { hasError: true, errorMessage: message });
    toast.error('Image upload failed', { description: message });
  }

  function removeAsset(assetType: keyof ContentAssets) {
    const nextAssets = { ...uploadedAssets };
    delete nextAssets[assetType];
    uploadedAssets = nextAssets;
    assetProgress = assetProgress.filter((item) => item.assetType !== assetType);
  }
</script>

<div class="space-y-6">
  <div class="text-center">
    <h2 class="text-2xl font-bold text-white">Image Assets</h2>
    <p class="text-gray-400">Upload the artwork used across the platform</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each assetTypes as asset (asset.key)}
      {@const progress = progressFor(asset.key)}
      {@const assetUrl = uploadedAssets[asset.key]}
      <section class="bg-white/5 border border-border/80 rounded-xl p-4 space-y-3">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-white">{asset.title}</h3>
            {#if asset.required}
              <span class="text-[10px] uppercase tracking-wide bg-primary text-primary-foreground rounded px-2 py-0.5">Required</span>
            {/if}
          </div>
          <p class="text-sm text-gray-400">{asset.description}</p>
          <p class="text-xs text-gray-500">Max {formatSize(asset.maxBytes)}</p>
        </div>

        {#if assetUrl && progress?.isCompleted}
          <div class="space-y-3">
            <img src={assetUrl} alt={asset.title} class="w-full h-32 object-cover rounded-lg border border-border/60" />
            <div class="flex items-center justify-between gap-3 text-sm">
              <span class="text-emerald-400 truncate">{progress.fileName}</span>
              <button type="button" class="text-red-400 hover:text-red-300" onclick={() => removeAsset(asset.key)}>
                Remove
              </button>
            </div>
          </div>
        {:else}
          <div class="space-y-2">
            <label for={`asset-${asset.key}`} class="block text-sm font-medium text-white">
              Choose {asset.title}
            </label>
            <input
              id={`asset-${asset.key}`}
              data-testid={`asset-input-${asset.key}`}
              type="file"
              accept={asset.accept}
              onchange={(event) => handleFileSelect(asset.key, event)}
              class="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:opacity-90"
            />
          </div>
        {/if}

        {#if progress && !progress.isCompleted && !progress.hasError}
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-gray-400">
              <span class="truncate">{progress.fileName}</span>
              <span>{Math.round(progress.progressPercentage)}%</span>
            </div>
            <div class="h-2 rounded-full bg-gray-800 overflow-hidden">
              <div class="h-full bg-primary transition-all" style="width: {progress.progressPercentage}%"></div>
            </div>
          </div>
        {/if}

        {#if progress?.hasError}
          <p class="text-sm text-red-300">{progress.errorMessage}</p>
        {/if}
      </section>
    {/each}
  </div>

  <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4 text-sm text-yellow-100">
    Required before continuing: Portrait Poster and Hero Background.
  </div>
</div>
