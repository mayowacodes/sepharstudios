<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { toast } from 'svelte-sonner';
  import { UploadStep, type UploadWizardState, ContentType, AgeRating } from '$lib/types/creator';
  import StepIndicator from '$lib/components/creator/upload/StepIndicator.svelte';
  import BasicInfoStep from '$lib/components/creator/upload/BasicInfoStep.svelte';
  import VideoUploadStep from '$lib/components/creator/upload/VideoUploadStep.svelte';
  import AssetManagementStep from '$lib/components/creator/upload/AssetManagementStep.svelte';
  import MetadataStep from '$lib/components/creator/upload/MetadataStep.svelte';
  import ReviewSubmitStep from '$lib/components/creator/upload/ReviewSubmitStep.svelte';
  import { Upload } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';

  let isSubmitting = $state(false);
  // Submission progress UX: when the wizard is uploading the video file
  // to the orchestrator's storage (the slowest step), surface a real
  // progress bar instead of a silent spinner. Without this the user
  // sees "Processing…" for minutes on big uploads and can't tell if it
  // froze.
  let submitStep = $state<'idle' | 'metadata' | 'job' | 'uploading' | 'committing'>('idle');
  let videoUploadPct = $state(0);
  let videoUploadXhr: XMLHttpRequest | null = null;

  /**
   * Upload a video file to an orchestrator-signed URL with progress
   * reporting. Uses XMLHttpRequest because `fetch` doesn't expose upload
   * progress events in browsers. Resolves when the PUT returns a 2xx;
   * rejects on network failure or non-2xx status.
   */
  function uploadVideoWithProgress(url: string, method: string, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      videoUploadXhr = xhr;
      xhr.open(method, url);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          videoUploadPct = (e.loaded / e.total) * 100;
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Failed to upload video to encoder storage (${xhr.status})`));
        videoUploadXhr = null;
      };
      xhr.onerror = () => {
        reject(new Error('Network error during video upload. Check your connection and try again.'));
        videoUploadXhr = null;
      };
      xhr.onabort = () => {
        reject(new Error('Upload cancelled.'));
        videoUploadXhr = null;
      };
      xhr.send(file);
    });
  }

  function cancelUpload() {
    if (videoUploadXhr) videoUploadXhr.abort();
  }
  /** When set, the wizard pre-fills from this content's metadata. The video
   *  must still be uploaded fresh (existing rows keep their video URL until
   *  the submit flow swaps in the new one). */
  let editId: string | null = $state(null);
  // Tracks the row's status at edit-mode entry so the submit flow can
  // detect the "completing a previously-approved Coming Soon by
  // attaching the main video" case and ping admin to re-review the
  // video. Without this we'd have no way to distinguish "creator is
  // editing a coming-soon row's metadata only" from "creator is
  // attaching the missing video for review".
  let editPrefilledStatus: string | null = $state(null);
  // IMPORTANT: every bindable field used in a child step's `bind:` must be
  // initialized to a defined value here. Empty objects (`{}`) for stepData
  // entries leave the inner fields as `undefined`, which Svelte 5 treats as
  // an invalid value when the child declares the prop with `$bindable()` —
  // it throws `props_invalid_value` during the upload page's first paint
  // and the whole route blanks. Initialize each field explicitly to its
  // empty form (string, null, array, object) instead.
  let wizardState = $state<UploadWizardState>({
    currentStep: UploadStep.BASIC_INFO,
    stepData: {
      [UploadStep.BASIC_INFO]: {
        title: '',
        description: '',
        contentType: '',
        ageRating: '',
        audience: 'general',
        // Series-only — populated when contentType=SERIES. Episode 1
        // metadata that gets posted alongside the series row so the
        // creator never lands in an empty-shell series state. S1E1 defaults.
        episodeTitle: '',
        seasonNumber: 1,
        episodeNumber: 1,
        // Coming Soon decision lives here (moved from REVIEW_SUBMIT)
        // so the Video Upload step's validator can skip the file gate
        // when the creator is just submitting an announcement.
        comingSoon: false,
        comingSoonReleaseDate: ''
      },
      [UploadStep.VIDEO_UPLOAD]: {
        videoFile: null,
        trailerFile: null,
        videoProgress: null,
        trailerProgress: null
      },
      [UploadStep.ASSET_MANAGEMENT]: {
        uploadedAssets: {},
        assetProgress: []
      },
      [UploadStep.METADATA]: {
        bibleReferences: [],
        themes: [],
        ministryAffiliation: '',
        duration: '',
        language: 'English',
        hasSubtitles: false,
        hasClosedCaptions: false,
        tags: [],
        keywords: [],
        genre: [],
        cast: [],
        crew: []
      },
      [UploadStep.REVIEW_SUBMIT]: {
        termsAccepted: false,
        guidelinesAccepted: false
      }
    },
    // Kept on the state object for shape compatibility with UploadWizardState
    // and the localStorage draft, but the SOURCE OF TRUTH for Next-button
    // enablement is the `stepValidity` $derived below. The previous
    // imperative `validateStep()` write was unreliable — Svelte 5 didn't
    // always re-trigger downstream `disabled={…}` reads after the nested
    // proxy mutation, so the button stayed dim even when every field was
    // filled in. A $derived eliminates the race entirely.
    isValid: {
      [UploadStep.BASIC_INFO]: false,
      [UploadStep.VIDEO_UPLOAD]: false,
      [UploadStep.ASSET_MANAGEMENT]: false,
      [UploadStep.METADATA]: false,
      [UploadStep.REVIEW_SUBMIT]: false
    }
  });
  
  // StepIndicator's StepConfig expects `{ id, label }`. We keep id as the
  // UploadStep number stringified so it stays stable across migrations.
  const steps = [
    { id: String(UploadStep.BASIC_INFO), label: 'Basic Info' },
    { id: String(UploadStep.VIDEO_UPLOAD), label: 'Video Upload' },
    { id: String(UploadStep.ASSET_MANAGEMENT), label: 'Images & Assets' },
    { id: String(UploadStep.METADATA), label: 'Metadata' },
    { id: String(UploadStep.REVIEW_SUBMIT), label: 'Review & Submit' }
  ];
  
  let isTransitioningStep = $state(false);

  function goToStep(step: UploadStep) {
    if (isTransitioningStep || isSubmitting) return;
    isTransitioningStep = true;
    setTimeout(() => {
      wizardState.currentStep = step;
      isTransitioningStep = false;
    }, 300);
  }

  function nextStep() {
    if (isTransitioningStep || isSubmitting) return;
    if (wizardState.currentStep < UploadStep.REVIEW_SUBMIT) {
      isTransitioningStep = true;
      setTimeout(() => {
        wizardState.currentStep++;
        isTransitioningStep = false;
      }, 300);
    }
  }

  function previousStep() {
    if (isTransitioningStep || isSubmitting) return;
    if (wizardState.currentStep > UploadStep.BASIC_INFO) {
      isTransitioningStep = true;
      setTimeout(() => {
        wizardState.currentStep--;
        isTransitioningStep = false;
      }, 300);
    }
  }
  
  // Returns the list of missing/invalid fields for the given step from any
  // wizard state. Pure — does NOT read `wizardState` directly — so the
  // draft-rehydration path in `sanitizeWizardState` can call it against a
  // freshly-loaded state to find the lowest still-invalid step and clamp
  // `currentStep` there. The thin wrapper below is what the Next button +
  // tooltip use against the live `wizardState`.
  function missingFieldsInState(state: UploadWizardState, step: UploadStep): string[] {
    const missing: string[] = [];
    switch (step) {
      case UploadStep.BASIC_INFO: {
        const d = state.stepData[step];
        if (!d.title || d.title.trim().length < 5) missing.push('Title (at least 5 characters)');
        if (!d.description || d.description.trim().length < 50) missing.push('Description (at least 50 characters)');
        if (!d.contentType) missing.push('Content type');
        if (!d.ageRating) missing.push('Age rating');
        // Series-specific gate: the episode's title is required when the
        // creator chose Series. Without it, we'd create an unnamed
        // episode row that's effectively useless. Label the missing
        // field with the actual S/E numbers (e.g. "S2 E5 title") so
        // creators uploading something other than S1E1 don't see a
        // confusing "Episode 1 title" prompt.
        if (d.contentType === ContentType.SERIES && (!d.episodeTitle || d.episodeTitle.trim().length < 2)) {
          missing.push(`S${d.seasonNumber || 1} E${d.episodeNumber || 1} title (at least 2 characters)`);
        }
        // Coming Soon gate: release date is required + must be today or
        // later. Without this the inline red warning in BasicInfo would
        // show but submit could still go through, leaving the cron with
        // no scheduledPublishAt to auto-publish on.
        if (d.comingSoon) {
          const today = new Date().toISOString().slice(0, 10);
          if (!d.comingSoonReleaseDate || d.comingSoonReleaseDate < today) {
            missing.push('Coming Soon release date (today or later)');
          }
        }
        break;
      }
      case UploadStep.VIDEO_UPLOAD: {
        // Two-part check. `videoFile` must be an actual File object in
        // memory (Files do NOT survive `JSON.stringify`, so a rehydrated
        // draft will fail this and force the user back to Step 2 even if
        // a prior session marked it complete). `uploadUrl` must be the
        // sentinel `staged-for-encoding` value that `performActualUpload`
        // assigns when the user drops a video — `isCompleted` alone is
        // too loose, since it can be a stale draft remnant.
        //
        // Coming Soon entries are announcements — the main video is
        // optional at submission time. The creator can upload it now
        // (in which case it encodes + sits until the release date) or
        // later from /creator/content/<id>. Either path is valid;
        // we skip the gate entirely when the BASIC_INFO step's
        // `comingSoon` flag is on.
        const isComingSoon = state.stepData[UploadStep.BASIC_INFO].comingSoon;
        if (isComingSoon) break;
        const d = state.stepData[step];
        if (!(d.videoFile instanceof File)) missing.push('Video file');
        else if (d.videoProgress?.uploadUrl !== 'staged-for-encoding') missing.push('Video upload');
        break;
      }
      case UploadStep.ASSET_MANAGEMENT: {
        // AssetManagementStep marks `posterPortrait` and `backdropHero`
        // as REQUIRED in its own UI — but the wizard previously only
        // checked Object.keys().length > 0, which let a single optional
        // asset (e.g. the thumbnail) satisfy the gate. Make the
        // validator match the UI: both required assets must be present.
        const d = state.stepData[step];
        if (!d.uploadedAssets?.posterPortrait) missing.push('Portrait poster');
        if (!d.uploadedAssets?.backdropHero) missing.push('Hero background');
        break;
      }
      case UploadStep.METADATA:
        // Optional step — never blocks Next.
        break;
      case UploadStep.REVIEW_SUBMIT: {
        const d = state.stepData[step];
        if (!d.termsAccepted) missing.push('Terms acceptance');
        if (!d.guidelinesAccepted) missing.push('Guidelines acceptance');
        break;
      }
    }
    return missing;
  }

  // Live-state wrapper used by the Next button, tooltip, and `stepValidity`
  // derivation. Always reads the current reactive `wizardState`.
  function missingFieldsForStep(step: UploadStep): string[] {
    return missingFieldsInState(wizardState, step);
  }

  // Single source of truth for which steps are complete. Recomputes
  // automatically whenever stepData changes, so the Next button can never
  // get out of sync with the user's actual input. Each step's entry is
  // also mirrored back into wizardState.isValid via the $effect below so
  // the localStorage draft + StepIndicator prop stay consistent with the
  // legacy shape.
  const stepValidity = $derived({
    [UploadStep.BASIC_INFO]: missingFieldsForStep(UploadStep.BASIC_INFO).length === 0,
    [UploadStep.VIDEO_UPLOAD]: missingFieldsForStep(UploadStep.VIDEO_UPLOAD).length === 0,
    [UploadStep.ASSET_MANAGEMENT]: missingFieldsForStep(UploadStep.ASSET_MANAGEMENT).length === 0,
    [UploadStep.METADATA]: missingFieldsForStep(UploadStep.METADATA).length === 0,
    [UploadStep.REVIEW_SUBMIT]: missingFieldsForStep(UploadStep.REVIEW_SUBMIT).length === 0,
  });

  // Mirror back into wizardState.isValid so the StepIndicator and the
  // localStorage draft both see the freshest validity.
  $effect(() => {
    wizardState.isValid = { ...stepValidity };
  });

  // Derived blocker list for the CURRENT step so the Next button can show
  // a tooltip / inline message about what's missing in real time.
  const currentStepBlockers = $derived(missingFieldsForStep(wizardState.currentStep));
  const isCurrentStepValid = $derived(stepValidity[wizardState.currentStep]);
  
  /**
   * Probe the source video's height (client-side) and choose the matching
   * orchestrator profile. The encoder's HLS ladder is:
   *   vod-multi      → up to 1080p (H.264)
   *   vod-multi-2k   → up to 1440p (HEVC ≥1440, H.264 ≤1080)
   *   vod-multi-4k   → up to 2160p (HEVC ≥1440, H.264 ≤1080)
   *   vod-480        → 480p only (rarely picked; for tiny clips)
   * We never upscale, so picking a smaller profile for a tall source just
   * wastes the source's resolution. Probing happens via a hidden <video>
   * element — zero bytes leave the browser.
   */
  async function pickEncoderProfile(file: File): Promise<'vod-multi' | 'vod-multi-2k' | 'vod-multi-4k' | 'vod-480'> {
    try {
      const height = await new Promise<number>((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const v = document.createElement('video');
        v.preload = 'metadata';
        v.muted = true;
        const cleanup = () => { URL.revokeObjectURL(url); };
        v.onloadedmetadata = () => { resolve(v.videoHeight); cleanup(); };
        v.onerror = () => { reject(new Error('metadata read failed')); cleanup(); };
        // Guard against indefinite hangs on tricky files.
        setTimeout(() => { reject(new Error('metadata timeout')); cleanup(); }, 8000);
        v.src = url;
      });
      if (!Number.isFinite(height) || height <= 0) return 'vod-multi';
      if (height >= 1900) return 'vod-multi-4k';
      if (height >= 1300) return 'vod-multi-2k';
      return 'vod-multi';
    } catch {
      return 'vod-multi';
    }
  }

  async function submitContent() {
    isSubmitting = true;
    submitStep = 'metadata';
    videoUploadPct = 0;
    // Tracks whether THIS run created a fresh content row that we own
    // cleanup for. If the encoder step or upload fails, we soft-archive
    // the row so the creator's content list isn't littered with
    // half-broken submissions. For the edit path (editId set) we never
    // delete — the existing row + old video should stay intact.
    let createdContentId: string | null = null;
    try {
      const videoData = wizardState.stepData[UploadStep.VIDEO_UPLOAD];
      const videoFile = videoData.videoFile;

      const basic = wizardState.stepData[UploadStep.BASIC_INFO];

      // When editing an existing row, a fresh video is OPTIONAL — the creator
      // may just want to tweak metadata.
      // For NEW submissions, the video is also OPTIONAL when the row is
      // a Coming Soon announcement — the creator may not have the final
      // file yet. Otherwise (new non-Coming-Soon row) it's required to
      // kick off the encoder pipeline.
      if (!editId && !videoFile && !basic.comingSoon) {
        throw new Error('Video file is required');
      }

      const meta = wizardState.stepData[UploadStep.METADATA];
      const assets = wizardState.stepData[UploadStep.ASSET_MANAGEMENT].uploadedAssets;

      let contentId: string;

      if (editId) {
        // PATCH the existing row in place. The server's allow-list ignores
        // any admin-only fields we accidentally send. Skips the encoder step
        // when no new video file was uploaded — preserving the existing one.
        const patchBody: Record<string, unknown> = {
          title: basic.title,
          description: basic.description,
          contentType: basic.contentType,
          ageRating: basic.ageRating,
          audience: basic.audience ?? 'general',
          genres: meta.genre ? (Array.isArray(meta.genre) ? meta.genre : [meta.genre]) : [],
          topics: meta.themes ?? [],
          keywords: meta.keywords ?? [],
          bibleReference: Array.isArray(meta.bibleReferences) ? meta.bibleReferences[0] : null,
          language: meta.language,
          duration: meta.duration?.toString(),
          thumbnail: assets.thumbnail,
          posterUrl: assets.posterPortrait,
          posterLandscapeUrl: assets.posterLandscape,
          posterSquareUrl: assets.posterSquare,
          logoTitleUrl: assets.logoTitle,
          backdropUrl: assets.backdropHero,
          // Cast/crew live on the row as jsonb arrays. Send through PATCH
          // so edits can revise the people list without re-uploading.
          cast: Array.isArray(meta.cast) ? meta.cast : [],
          crew: Array.isArray(meta.crew) ? meta.crew : [],
          // Trailer URL is written later by /api/creator/trailer-upload/commit
          // after the real file is uploaded direct to encoder MinIO. We
          // explicitly send `null` here so the row doesn't keep the bogus
          // "staged-for-encoding" sentinel from the wizard's progress state.
          trailerUrl: null,
          // Coming Soon edit can adjust the release date or flip the
          // toggle off (re-publish immediately). The PATCH endpoint
          // accepts scheduledPublishAt as a string or null.
          scheduledPublishAt: basic.comingSoon
            ? (basic.comingSoonReleaseDate || null)
            : null
        };

        // "I'm completing my Coming Soon by attaching the main video":
        // creator opened the wizard on a coming_soon row, supplied a
        // video file. Send the row back to admin review so the video
        // gets a fresh look before the cron auto-publishes on the
        // release date. The PATCH endpoint validates the transition.
        if (editPrefilledStatus === 'coming_soon' && videoFile) {
          patchBody.status = 'submitted';
        }

        const patchRes = await fetch(`/api/creator/content/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patchBody)
        });
        if (!patchRes.ok) {
          const errBody = await patchRes.json().catch(() => ({}));
          throw new Error(errBody.error ?? 'Failed to update content');
        }
        contentId = editId;

        // No new video → done. No need to re-encode.
        if (!videoFile) {
          toast.success('Content updated', { description: 'Your changes have been saved.' });
          localStorage.removeItem('upload_draft');
          window.location.href = '/creator/content';
          return;
        }
        // New video was provided — fall through to encoder job below.
      } else {
        // POST a brand-new row. Trailer URL is written later by
        // /api/creator/trailer-upload/commit after the real file is
        // uploaded direct to encoder MinIO (step 5 below). We send `null`
        // here so the row doesn't carry the bogus "staged-for-encoding"
        // sentinel from the wizard's progress state.
        // Coming Soon now lives on BASIC_INFO, so `...basic` already
        // carries `comingSoon` + `comingSoonReleaseDate`. The server
        // reads them and stashes the release date as
        // scheduledPublishAt so the existing cron's auto-publish path
        // takes over from here.
        const submissionData = {
            ...basic,
            ...meta,
            assets,
            trailerUrl: null,
            comingSoonReleaseDate: basic.comingSoonReleaseDate || null
        };
        const res = await fetch('/api/creator/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData)
        });
        if (!res.ok) throw new Error('Failed to save metadata');
        const body = await res.json();
        contentId = body.contentId;
        createdContentId = contentId;
      }

      // 1.5 Fire AI auto-tagging in the background. The endpoint reads from DB
      // by contentId, generates genres/topics/Bible refs/ageRating, and writes
      // them back. Non-blocking: if AI is down, the upload still completes — a
      // human can fill metadata in afterwards.
      void fetch('/api/ai/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId })
      }).catch((err) => console.warn('AI tagging skipped:', err));

      // 2-4. Encoder pipeline — only runs when a real video file is in hand.
      // Two paths skip this entire block:
      //   - Coming Soon announcement with no video → row carries
      //     scheduledPublishAt; trailer + posters are the announcement;
      //     creator adds the main video later from /creator/content/<id>.
      //   - Edit of an existing row without re-uploading the video → we
      //     already returned early above when no encoder work was needed.
      //
      // When the video IS present we run the full pipeline regardless of
      // Coming Soon — that's the "I have the full movie + a future
      // release date" path the user explicitly wanted to support. The
      // encoder writes a playable videoUrl; the cron's auto-publish
      // logic flips the row to live when the release date passes.
      if (videoFile) {
        // Auto-pick the encoder profile from the source resolution. The
        // browser reads dimensions out of the file via a hidden <video>
        // element; we never decode the file. Falls back to vod-multi (1080p
        // ladder) if probing fails or the file isn't readable.
        const profile = await pickEncoderProfile(videoFile);

        submitStep = 'job';
        const jobRes = await fetch('/api/encoder/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contentId,
                filename: videoFile.name,
                profile,
                durationHint: meta.duration ? Number(meta.duration) * 60 : undefined
            })
        });

        if (!jobRes.ok) throw new Error('Failed to create encoder job');
        const { jobId, upload } = await jobRes.json();

        // 3. Upload directly to orchestrator-controlled object storage.
        // Surfaces real progress so the user can see the bar move on big
        // files instead of staring at a silent spinner.
        submitStep = 'uploading';
        await uploadVideoWithProgress(upload.url, upload.method || 'PUT', videoFile);

        // 4. Commit the job so workers can encode it.
        submitStep = 'committing';
        const commitRes = await fetch(`/api/encoder/jobs/${jobId}/commit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!commitRes.ok) throw new Error('Failed to queue encoder job');
      }

      // 5. Upload the trailer (if provided) directly to encoder MinIO.
      // Trailers are stored as-is (no transcoding) — most creators upload
      // MP4/h264 which every browser plays natively in <video src>.
      // Best-effort: if it fails, the main submission still succeeded
      // and we toast a soft warning so the creator can re-attach the
      // trailer later from /creator/content/<id>.
      //
      // The sign endpoint enforces a strict filename character set
      // (A-Za-z0-9._-() and space). Names with apostrophes, accents,
      // emoji, or parens-with-anything-weird ("My Trailer v2!.mp4")
      // were the common silent-failure mode — the wizard would toast
      // "trailer was not attached" without explaining why. We sanitize
      // the filename to match the endpoint's rules so the upload only
      // fails for real reasons (network, auth, bucket missing).
      const trailerFile = wizardState.stepData[UploadStep.VIDEO_UPLOAD].trailerFile;
      if (trailerFile && contentId) {
        const safeName = (() => {
          const cleaned = trailerFile.name
            .replace(/[^A-Za-z0-9._\-() ]+/g, '_')
            .replace(/_+/g, '_')
            .slice(0, 200);
          return cleaned || `trailer.mp4`;
        })();
        const trailerType = trailerFile.type && trailerFile.type.startsWith('video/')
          ? trailerFile.type
          : 'video/mp4';
        try {
          const trailerSignRes = await fetch('/api/creator/trailer-upload/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contentId,
              filename: safeName,
              contentType: trailerType
            })
          });
          const signBody = await trailerSignRes.json().catch(() => ({}));
          if (!trailerSignRes.ok) {
            throw new Error(signBody.detail ?? signBody.error ?? `Trailer presign failed (HTTP ${trailerSignRes.status}).`);
          }
          const { uploadUrl, objectKey } = signBody as { uploadUrl: string; objectKey: string };

          // Reuse the same XHR-with-progress uploader the main video used —
          // it surfaces a real progress bar and handles network errors
          // consistently.
          await uploadVideoWithProgress(uploadUrl, 'PUT', trailerFile);

          const trailerCommitRes = await fetch('/api/creator/trailer-upload/commit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contentId, objectKey })
          });
          if (!trailerCommitRes.ok) {
            const body = await trailerCommitRes.json().catch(() => ({}));
            throw new Error(body.detail ?? body.error ?? `Trailer commit failed (HTTP ${trailerCommitRes.status}).`);
          }
        } catch (trailerErr) {
          console.warn('Trailer upload failed (non-blocking):', trailerErr);
          // Surface the actual reason so the creator knows whether to
          // rename their file, try a smaller upload, or contact support.
          // The prior generic "you can re-upload from your content
          // library" hid 4xx errors completely.
          const reason = trailerErr instanceof Error ? trailerErr.message : 'Unknown error';
          toast.warning('Trailer was not attached', {
            description: `${reason} Your main video submitted successfully — re-upload the trailer from /creator/content/<id> when ready.`
          });
        }
      }

      // 6. Series-only — create the first episode row alongside the series.
      // Without this, uploading a series leaves the creator with an empty-
      // shell series row in mediaLibrary and zero episodes attached, so
      // the browse card exists but the watch page has nothing to play. We
      // skip in edit mode: editing an existing series should never create
      // a second episode 1. The episode's videoUrl stays null and the
      // watch-page falls back to the series row's videoUrl that the
      // encoder writes — so playback works as soon as encoding finishes.
      const isNewSeries =
        !editId &&
        basic.contentType === ContentType.SERIES &&
        !!basic.episodeTitle?.trim();
      if (isNewSeries) {
        try {
          const epRes = await fetch(`/api/creator/content/${contentId}/episodes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              seasonNumber: basic.seasonNumber ?? 1,
              episodeNumber: basic.episodeNumber ?? 1,
              title: basic.episodeTitle?.trim(),
              description: basic.description,
              thumbnail: assets.thumbnail ?? assets.posterLandscape ?? null,
              // videoUrl intentionally null — the encoder writes the
              // playback URL onto the series row; the watch page falls
              // back to series.videoUrl when episode.videoUrl is null.
              videoUrl: null,
              duration: meta.duration?.toString()
            })
          });
          if (!epRes.ok) {
            const epBody = await epRes.json().catch(() => ({}));
            console.warn('[upload] episode-1 creation failed:', epBody);
            toast.warning('Series created, but Episode 1 was not added', {
              description: `${epBody.error ?? 'Unexpected error'} — add it manually from the episodes manager.`
            });
          }
        } catch (epErr) {
          console.warn('[upload] episode-1 creation threw:', epErr);
          toast.warning('Series created, but Episode 1 was not added', {
            description: 'Add it manually from the episodes manager.'
          });
        }
      }

      // Success toast — tone the description to match the submission type:
      // - Coming Soon announcement (no video) → "Announcement submitted"
      // - Coming Soon completion (edit + video on previously-approved coming-soon) → "Sent back to review"
      // - Coming Soon with full video → "Submitted; will auto-publish on <date>"
      // - Standard submission → "in the encoding queue"
      // - Series submission → mention the seeded first episode
      const isAnnouncementOnly = basic.comingSoon && !videoFile;
      const isComingSoonWithVideo = basic.comingSoon && !!videoFile;
      const isCompletingComingSoon = editId && editPrefilledStatus === 'coming_soon' && !!videoFile;
      const releaseDate = basic.comingSoonReleaseDate || '';
      toast.success(
        isCompletingComingSoon
          ? 'Video added · sent back to review'
          : isAnnouncementOnly
            ? 'Coming Soon announcement submitted'
            : 'Content submitted successfully',
        {
          description: isCompletingComingSoon
            ? `Admin will review the new video. The cron flips this to live on ${releaseDate || 'the release date'}.`
            : isAnnouncementOnly
              ? `Releases ${releaseDate}. Admin will review during the wait. Upload the main video any time from /creator/content/<id>.`
              : isComingSoonWithVideo
                ? `Your video is encoding. Once admin approves, it auto-publishes on ${releaseDate}.`
                : isNewSeries
                  ? `Series + S${basic.seasonNumber || 1}E${basic.episodeNumber || 1} "${basic.episodeTitle}" are in the encoding queue. Add more episodes from the episodes manager when ready.`
                  : 'Your video is now in the encoding queue. We\'ll notify you when it\'s ready.'
        }
      );
      localStorage.removeItem('upload_draft');
      window.location.href = '/creator';

    } catch (error) {
        console.error('Submission error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        // Rollback the orphan row created by step 1 so the creator's
        // content list isn't polluted with broken stubs. Best-effort:
        // if the cleanup fetch fails we surface a softer warning but
        // don't mask the original failure.
        if (createdContentId) {
          try {
            const cleanup = await fetch(`/api/creator/content/${createdContentId}`, { method: 'DELETE' });
            if (!cleanup.ok) {
              console.warn(`Rollback DELETE failed for ${createdContentId}: HTTP ${cleanup.status}`);
              toast.warning('Submission failed and cleanup did not finish', {
                description: 'You may see an archived/broken entry in your content list. Contact support if it persists.'
              });
            }
          } catch (cleanupErr) {
            console.warn(`Rollback DELETE threw for ${createdContentId}:`, cleanupErr);
          }
        }
        toast.error('Submission failed', { description: message });
    } finally {
        isSubmitting = false;
        submitStep = 'idle';
        videoUploadPct = 0;
    }
  }
  
  // Surfaces a banner on the wizard when we're editing an existing row
  // so the creator knows the Video + Assets steps are still empty and
  // must be re-uploaded if they want to replace the media (otherwise
  // those steps look mysteriously blank even though Basic Info is full).
  let editPrefillBanner = $state<{ title: string; existingThumb: string | null } | null>(null);

  async function prefillFromExistingContent(contentId: string) {
    try {
      // Use the by-id endpoint that returns `{ content, analytics }`. The
      // older `?id=` query against the list endpoint was ignored by the
      // server and ended up grabbing `data[0]` — i.e. whichever content
      // happened to be sorted first, not the one being edited.
      const res = await fetch(`/api/creator/content/${contentId}`);
      if (!res.ok) {
        toast.error('Could not load the content you wanted to edit.');
        return;
      }
      const body = await res.json().catch(() => ({}));
      const item = body.content;
      if (!item) return;

      // Remember the row's current status. Used by submitContent to
      // detect the "creator is completing a Coming Soon by attaching
      // the main video" path and send the row back to review.
      editPrefilledStatus = typeof item.status === 'string' ? item.status : null;

      // Pre-fill Basic Info + Metadata only. Video / assets must be uploaded
      // fresh — we don't reuse the old URLs since edit may include replacing
      // the actual media file.
      // Reassignments below MUST keep every bindable field defined —
      // any undefined slot reaches a $bindable child as undefined and
      // crashes the page with Svelte 5's props_invalid_value error.
      wizardState.stepData[UploadStep.BASIC_INFO] = {
        title: item.title ?? '',
        description: item.description ?? '',
        contentType: item.mediaType ?? '',
        ageRating: item.ageRating ?? '',
        // Map schema `category` back to the wizard's Audience radio. NULL
        // (or anything outside kids/teens) reads as General.
        audience: item.category === 'kids' || item.category === 'teens' ? item.category : 'general',
        // Episode 1 placeholders for the type contract. Edit mode never
        // creates a fresh episode (the series already has its episodes),
        // but the BasicInfo step still reads these bindable fields and
        // wants defined values.
        episodeTitle: 'Episode 1',
        seasonNumber: 1,
        episodeNumber: 1,
        // Rehydrate Coming Soon from the existing row's scheduledPublishAt
        // so the creator can adjust the date or flip the toggle off when
        // editing. Empty when the row is/was not Coming Soon.
        comingSoon: item.status === 'coming_soon' || !!item.scheduledPublishAt,
        comingSoonReleaseDate: item.scheduledPublishAt
          ? String(item.scheduledPublishAt).slice(0, 10)
          : ''
      };
      wizardState.stepData[UploadStep.METADATA] = {
        bibleReferences: item.bibleReference ? [item.bibleReference] : [],
        themes: item.topics ?? [],
        ministryAffiliation: '',
        duration: '',
        language: item.language ?? 'English',
        hasSubtitles: false,
        hasClosedCaptions: false,
        tags: item.genres ?? [],
        keywords: item.keywords ?? [],
        // Schema uses plural `genres`; wizard's `genre` is an array of
        // genre strings. Mirror the full list here.
        genre: Array.isArray(item.genres) ? item.genres : [],
        cast: Array.isArray(item.cast) ? item.cast : [],
        crew: Array.isArray(item.crew) ? item.crew : []
      };
      editPrefillBanner = {
        title: item.title,
        existingThumb: item.thumbnail ?? item.posterUrl ?? null
      };
    } catch (err) {
      console.error('Failed to prefill from existing content:', err);
    }
  }

  function sanitizeWizardState(draft: any): UploadWizardState {
    const defaultState: UploadWizardState = {
      currentStep: UploadStep.BASIC_INFO,
      stepData: {
        [UploadStep.BASIC_INFO]: {
          title: '',
          description: '',
          contentType: '',
          ageRating: '',
          audience: 'general',
          episodeTitle: '',
          seasonNumber: 1,
          episodeNumber: 1,
          comingSoon: false,
          comingSoonReleaseDate: ''
        },
        [UploadStep.VIDEO_UPLOAD]: {
          videoFile: null,
          trailerFile: null,
          videoProgress: null,
          trailerProgress: null
        },
        [UploadStep.ASSET_MANAGEMENT]: {
          uploadedAssets: {},
          assetProgress: []
        },
        [UploadStep.METADATA]: {
          bibleReferences: [],
          themes: [],
          ministryAffiliation: '',
          duration: '',
          language: 'English',
          hasSubtitles: false,
          hasClosedCaptions: false,
          tags: [],
          keywords: [],
          genre: [],
          cast: [],
          crew: []
        },
        [UploadStep.REVIEW_SUBMIT]: {
          termsAccepted: false,
          guidelinesAccepted: false
        }
      },
      isValid: {
        [UploadStep.BASIC_INFO]: false,
        [UploadStep.VIDEO_UPLOAD]: false,
        [UploadStep.ASSET_MANAGEMENT]: false,
        [UploadStep.METADATA]: false,
        [UploadStep.REVIEW_SUBMIT]: false
      }
    };

    if (!draft) return defaultState;

    // Safely copy stepData fields to prevent undefined properties crashing `$bindable` bindings
    for (const stepKey of Object.keys(defaultState.stepData)) {
      const step = Number(stepKey) as UploadStep;
      if (draft.stepData?.[step]) {
        const draftStepData = draft.stepData[step];
        const defaultStepData = defaultState.stepData[step] as any;
        for (const key of Object.keys(defaultStepData)) {
          if (draftStepData[key] !== undefined && draftStepData[key] !== null) {
            defaultStepData[key] = draftStepData[key];
          }
        }
      }
    }

    // Clamp `currentStep` to the lowest still-invalid step. Previously we
    // restored `draft.currentStep` verbatim — that was the root cause of
    // "Step 2 is not loading, jumping to Step 3": a draft saved on Step 3
    // would skip the user past Step 2 on reload, even though Step 2's
    // `videoFile` (a File object) had been dropped by JSON serialization
    // and the wizard had nothing to encode. Walk steps in order and stop
    // at the first one missing required input. Fall through to the saved
    // step only if every earlier step is complete.
    const orderedSteps = [
      UploadStep.BASIC_INFO,
      UploadStep.VIDEO_UPLOAD,
      UploadStep.ASSET_MANAGEMENT,
      UploadStep.METADATA,
      UploadStep.REVIEW_SUBMIT,
    ];
    const firstInvalid = orderedSteps.find(
      (s) => missingFieldsInState(defaultState, s).length > 0
    );
    const savedStep =
      draft.currentStep && Object.values(UploadStep).includes(draft.currentStep)
        ? (draft.currentStep as UploadStep)
        : UploadStep.BASIC_INFO;
    defaultState.currentStep = firstInvalid
      ? (Math.min(savedStep, firstInvalid) as UploadStep)
      : savedStep;

    return defaultState;
  }

  onMount(() => {
    const editParam = page.url.searchParams.get('edit');
    if (editParam) {
      editId = editParam;
      void prefillFromExistingContent(editParam);
      return; // skip localStorage draft when editing
    }

    // ?cs=1 lands the wizard with the Coming Soon toggle pre-checked.
    // Comes from the "Schedule a Coming Soon release" tile on the
    // creator dashboard so the flow is one click instead of "upload,
    // step through wizard, find the toggle". The toggle lives on the
    // Basic Info step now (so step 2's video-required gate can read
    // it); the date input expands inline the moment the toggle is on.
    if (page.url.searchParams.get('cs') === '1') {
      wizardState.stepData[UploadStep.BASIC_INFO].comingSoon = true;
    }

    // Load any draft data from localStorage. The wizard shape evolves over
    // time (added/renamed fields, new steps); old drafts persisted before a
    // schema change would silently corrupt wizardState if spread blindly.
    // Bump DRAFT_SCHEMA_VERSION whenever any UploadStep payload structure
    // changes — stale drafts are discarded with a one-time toast.
    //
    // NEW: don't silently rehydrate. A creator who finished an upload, had
    // the page redirect to /creator, then opens /creator/upload again to
    // start a NEW video used to land into the prior draft's state — making
    // them think they had to "clear" the old video's assets, which felt
    // destructive. Instead we surface a banner that lets them pick
    // "Resume" or "Start fresh."
    const draftData = localStorage.getItem('upload_draft');
    if (draftData) {
      try {
        const parsed = JSON.parse(draftData);
        if (parsed?._version === DRAFT_SCHEMA_VERSION) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _version, _savedAt, ...payload } = parsed;
          pendingDraft = {
            payload,
            savedAt: typeof _savedAt === 'number' ? _savedAt : null
          };
        } else {
          localStorage.removeItem('upload_draft');
          toast.info('Earlier draft was discarded because the upload form has changed.');
        }
      } catch (e) {
        console.error('Failed to load draft data:', e);
        localStorage.removeItem('upload_draft');
      }
    }
  });

  // Banner state — set by onMount when a valid draft is found; cleared by
  // either Resume (loads it into wizardState) or Start fresh (drops it).
  // Suppress auto-save while the banner is showing so the act of waiting
  // doesn't constantly overwrite _savedAt.
  let pendingDraft = $state<{ payload: any; savedAt: number | null } | null>(null);

  function resumeDraft(): void {
    if (!pendingDraft) return;
    const sanitized = sanitizeWizardState(pendingDraft.payload);
    wizardState = sanitized;
    pendingDraft = null;
  }

  function startFreshDraft(): void {
    try { localStorage.removeItem('upload_draft'); } catch { /* ignore */ }
    pendingDraft = null;
    // wizardState is already at default; just nudge it to step 1 in case
    // something earlier in the mount path bumped it.
    wizardState.currentStep = UploadStep.BASIC_INFO;
  }

  function formatRelativeTime(ts: number | null): string {
    if (!ts) return 'a moment ago';
    const diff = Date.now() - ts;
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return `${Math.floor(diff / 86_400_000)}d ago`;
  }

  // Bump whenever the wizardState shape changes — even a renamed field on
  // any UploadStep payload. Mismatched versions in onMount trigger a clean
  // reset so the creator never sees fields populated from an obsolete
  // schema.
  // v3: stricter Step 2 validator + sanitize-time clamp of currentStep to
  // the first invalid step. Older v2 drafts had a saved currentStep that
  // could land users past Step 2 even though their videoFile (a File
  // object) was lost on rehydration. Bumping to 3 flushes those drafts.
  const DRAFT_SCHEMA_VERSION = 3;

  // Auto-save draft data (excluding File objects). In runes mode, $: is no
  // longer reactive — use $effect to track wizardState changes.
  //
  // Skipped while the Resume / Start fresh banner is showing so a creator
  // who's about to pick "Start fresh" doesn't accidentally overwrite the
  // draft they were considering resuming.
  $effect(() => {
    if (typeof localStorage === 'undefined') return;
    if (pendingDraft) return;
    const stateToSave = JSON.parse(JSON.stringify(wizardState));
    localStorage.setItem('upload_draft', JSON.stringify({
      _version: DRAFT_SCHEMA_VERSION,
      _savedAt: Date.now(),
      ...stateToSave
    }));
  });
</script>

<div class="mx-auto px-4 py-6 space-y-6 max-w-5xl">
  <PortalHero compact eyebrow="Create" title="New upload" subtitle="Submit a new video for review and encoding." icon={Upload} />

  <!-- Draft-resume banner. Surfaces when localStorage has a saved draft
       from a prior session so the creator can pick "Resume" (load the
       saved fields) or "Start fresh" (clear it and begin a new video).
       This replaces the prior silent-rehydrate behavior, which made the
       wizard feel locked to the previous upload's assets. -->
  {#if pendingDraft}
    <div class="bg-yellow-500/5 border border-yellow-500/30 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div class="text-sm flex-1">
        <strong class="text-foreground">Resume previous draft?</strong>
        <p class="text-foreground/70 mt-1">
          You have a saved draft from {formatRelativeTime(pendingDraft.savedAt)}.
          Resume to continue where you left off, or start fresh for a new upload.
        </p>
      </div>
      <div class="flex gap-2 shrink-0">
        <button
          type="button"
          onclick={startFreshDraft}
          class="text-sm rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white/90 px-3 py-1.5 transition-colors"
        >
          Start fresh
        </button>
        <button
          type="button"
          onclick={resumeDraft}
          class="text-sm rounded-md bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white font-semibold px-3 py-1.5 transition-colors"
        >
          Resume
        </button>
      </div>
    </div>
  {/if}

  {#if editPrefillBanner}
    <div class="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start">
      {#if editPrefillBanner.existingThumb}
        <img src={editPrefillBanner.existingThumb} alt="" class="w-20 h-12 object-cover rounded shrink-0" />
      {/if}
      <div class="text-sm flex-1">
        <strong class="text-foreground">Editing "{editPrefillBanner.title}"</strong>
        <p class="text-foreground/80 mt-1">
          Basic info and metadata have been pre-filled. The
          <strong>Video upload</strong> and <strong>Images &amp; assets</strong>
          steps are intentionally blank — re-upload them only if you want to
          replace the existing media. Leaving them empty keeps the current
          video and posters in place.
        </p>
      </div>
    </div>
  {/if}
  
  <!-- Step Indicator. UploadStep is 1-indexed but StepIndicator expects
       0-based indices, so we shift in both directions at the boundary. -->
  <StepIndicator
    {steps}
    currentStep={wizardState.currentStep - 1}
    onStepClick={(index) => goToStep((index + 1) as UploadStep)}
  />
  
  <!-- Step Content -->
  <div class="surface-glass border border-border/80 rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
    {#if wizardState.currentStep === UploadStep.BASIC_INFO}
      <BasicInfoStep
        bind:title={wizardState.stepData[UploadStep.BASIC_INFO].title}
        bind:description={wizardState.stepData[UploadStep.BASIC_INFO].description}
        bind:contentType={wizardState.stepData[UploadStep.BASIC_INFO].contentType}
        bind:ageRating={wizardState.stepData[UploadStep.BASIC_INFO].ageRating}
        bind:audience={wizardState.stepData[UploadStep.BASIC_INFO].audience}
        bind:episodeTitle={wizardState.stepData[UploadStep.BASIC_INFO].episodeTitle}
        bind:seasonNumber={wizardState.stepData[UploadStep.BASIC_INFO].seasonNumber}
        bind:episodeNumber={wizardState.stepData[UploadStep.BASIC_INFO].episodeNumber}
        bind:comingSoon={wizardState.stepData[UploadStep.BASIC_INFO].comingSoon}
        bind:comingSoonReleaseDate={wizardState.stepData[UploadStep.BASIC_INFO].comingSoonReleaseDate}
      />
    {:else if wizardState.currentStep === UploadStep.VIDEO_UPLOAD}
      <VideoUploadStep
        bind:videoFile={wizardState.stepData[UploadStep.VIDEO_UPLOAD].videoFile}
        bind:trailerFile={wizardState.stepData[UploadStep.VIDEO_UPLOAD].trailerFile}
        bind:videoProgress={wizardState.stepData[UploadStep.VIDEO_UPLOAD].videoProgress}
        bind:trailerProgress={wizardState.stepData[UploadStep.VIDEO_UPLOAD].trailerProgress}
      />
    {:else if wizardState.currentStep === UploadStep.ASSET_MANAGEMENT}
      <AssetManagementStep
        bind:uploadedAssets={wizardState.stepData[UploadStep.ASSET_MANAGEMENT].uploadedAssets}
        bind:assetProgress={wizardState.stepData[UploadStep.ASSET_MANAGEMENT].assetProgress}
      />
    {:else if wizardState.currentStep === UploadStep.METADATA}
      <MetadataStep
        bind:bibleReferences={wizardState.stepData[UploadStep.METADATA].bibleReferences}
        bind:themes={wizardState.stepData[UploadStep.METADATA].themes}
        bind:ministryAffiliation={wizardState.stepData[UploadStep.METADATA].ministryAffiliation}
        bind:duration={wizardState.stepData[UploadStep.METADATA].duration}
        bind:language={wizardState.stepData[UploadStep.METADATA].language}
        bind:hasSubtitles={wizardState.stepData[UploadStep.METADATA].hasSubtitles}
        bind:hasClosedCaptions={wizardState.stepData[UploadStep.METADATA].hasClosedCaptions}
        bind:tags={wizardState.stepData[UploadStep.METADATA].tags}
        bind:keywords={wizardState.stepData[UploadStep.METADATA].keywords}
        bind:genre={wizardState.stepData[UploadStep.METADATA].genre}
        bind:cast={wizardState.stepData[UploadStep.METADATA].cast}
        bind:crew={wizardState.stepData[UploadStep.METADATA].crew}
      />
    {:else if wizardState.currentStep === UploadStep.REVIEW_SUBMIT}
      <ReviewSubmitStep
        bind:termsAccepted={wizardState.stepData[UploadStep.REVIEW_SUBMIT].termsAccepted}
        bind:guidelinesAccepted={wizardState.stepData[UploadStep.REVIEW_SUBMIT].guidelinesAccepted}
        allStepData={wizardState}
        submitting={isSubmitting}
      />
    {/if}
  </div>
  
  <!-- Sticky bottom navigation — Form-template pattern. Wizard's
       Previous / Next (or Submit) live here so they're always reachable
       regardless of how long any step's body gets. The submission
       progress overlay is rendered separately and sits above this bar
       while in-flight. -->
  <div
    class="fixed bottom-0 inset-x-0 z-30 backdrop-blur-md border-t pointer-events-none"
    style="background: hsl(var(--portal-bg-elevated)/0.92); border-color: hsl(var(--portal-border));"
  >
    <div class="mx-auto px-4 py-3 max-w-5xl flex justify-between items-center gap-3 pointer-events-auto">
    <button
      onclick={previousStep}
      disabled={wizardState.currentStep === UploadStep.BASIC_INFO || isSubmitting || isTransitioningStep}
      class="bg-muted hover:bg-muted/80 disabled:opacity-50 text-foreground px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
    >
      {#if isTransitioningStep}
        <svg class="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      {:else}
        ← Previous
      {/if}
    </button>
    
    <div class="text-center text-muted-foreground font-medium">
      Step {wizardState.currentStep} of {UploadStep.REVIEW_SUBMIT}
    </div>
    
    {#if wizardState.currentStep < UploadStep.REVIEW_SUBMIT}
      <div class="flex flex-col items-end gap-1">
        <button
          onclick={nextStep}
          disabled={!isCurrentStepValid || isSubmitting || isTransitioningStep}
          title={currentStepBlockers.length > 0 ? `Still needed: ${currentStepBlockers.join(', ')}` : undefined}
          class="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground disabled:text-muted-foreground px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          {#if isTransitioningStep}
            <svg class="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          {:else}
            Next →
          {/if}
        </button>
        {#if currentStepBlockers.length > 0}
          <p class="text-xs text-muted-foreground max-w-xs text-right">
            Still needed: <span class="text-foreground">{currentStepBlockers.join(', ')}</span>
          </p>
        {/if}
      </div>
    {:else}
      <div class="flex flex-col items-end gap-1">
        <button
          onclick={submitContent}
          disabled={!isCurrentStepValid || isSubmitting || isTransitioningStep}
          title={currentStepBlockers.length > 0 ? `Still needed: ${currentStepBlockers.join(', ')}` : undefined}
          class="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground disabled:text-muted-foreground px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
        >
          {#if isSubmitting}
            <svg class="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing…
          {:else}
            Submit for review
          {/if}
        </button>
        {#if currentStepBlockers.length > 0}
          <p class="text-xs text-muted-foreground max-w-xs text-right">
            Still needed: <span class="text-foreground">{currentStepBlockers.join(', ')}</span>
          </p>
        {/if}
      </div>
    {/if}
    </div>
  </div>
  <!-- Spacer so the sticky bar doesn't cover the last field of any step -->
  <div aria-hidden="true" class="h-24"></div>

  <!-- Submission progress overlay — shows live state and a real progress
       bar during the slow video upload step so the user knows it isn't
       stuck. Closing the tab aborts the upload. -->
  {#if isSubmitting && submitStep !== 'idle'}
    <div class="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pointer-events-none">
      <div class="max-w-2xl mx-auto surface-glass border border-border rounded-2xl p-4 shadow-2xl pointer-events-auto">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
            <div class="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-foreground">
              {#if submitStep === 'metadata'}Saving metadata…
              {:else if submitStep === 'job'}Preparing encoder job…
              {:else if submitStep === 'uploading'}Uploading video — {Math.round(videoUploadPct)}%
              {:else if submitStep === 'committing'}Queueing for encoding…
              {/if}
            </div>
            <div class="text-xs text-muted-foreground">
              {submitStep === 'uploading'
                ? 'Keep this tab open. Closing it will cancel the upload.'
                : 'This should only take a moment.'}
            </div>
          </div>
          {#if submitStep === 'uploading'}
            <button type="button" onclick={cancelUpload} class="text-xs text-red-400 hover:text-red-300 shrink-0">
              Cancel
            </button>
          {/if}
        </div>
        {#if submitStep === 'uploading'}
          <div class="h-1.5 surface-2 rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-200" style="width: {videoUploadPct}%"></div>
          </div>
        {:else}
          <div class="h-1.5 surface-2 rounded-full overflow-hidden">
            <div class="h-full bg-primary/60 w-1/3 animate-pulse"></div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
