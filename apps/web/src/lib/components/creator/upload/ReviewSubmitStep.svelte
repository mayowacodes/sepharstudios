<!-- Review and Submit Step -->
<script lang="ts">
  import { UploadStep, type UploadWizardState } from '$lib/types/creator';

  // Bindable terms checkboxes — parent owns the values. `allStepData` is
  // read-only here (used only to render the review summary). `submitting`
  // lets the parent disable in-step UI while its outer Submit is in flight.
  let {
    termsAccepted = $bindable<boolean>(false),
    guidelinesAccepted = $bindable<boolean>(false),
    allStepData,
    submitting = false
  }: {
    termsAccepted?: boolean;
    guidelinesAccepted?: boolean;
    allStepData: UploadWizardState;
    submitting?: boolean;
  } = $props();

  // Pull each prior step's data via the enum, not literal indices. The old
  // `allStepData.stepData[1]` etc. silently broke if the UploadStep numeric
  // values were ever shuffled.
  const basicInfo = $derived(allStepData.stepData[UploadStep.BASIC_INFO]);
  const videoData = $derived(allStepData.stepData[UploadStep.VIDEO_UPLOAD]);
  const assetData = $derived(allStepData.stepData[UploadStep.ASSET_MANAGEMENT]);
  const metadataInfo = $derived(allStepData.stepData[UploadStep.METADATA]);
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-white mb-2">Review & Submit</h2>
    <p class="text-gray-300">Review your content details before submitting for approval</p>
  </div>

  <!-- Content Summary -->
  <div class="bg-white/5 border border-border/80 rounded-xl p-6">
    <h3 class="text-xl font-bold text-white mb-4">Content Summary</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Basic Information -->
      <div>
        <h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">ℹ️</span> Basic Information</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Title:</span>
            <span class="text-white font-medium">{basicInfo.title || 'Not provided'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Type:</span>
            <span class="text-white capitalize">{basicInfo.contentType || 'Not selected'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Age Rating:</span>
            <span class="text-white font-medium">{basicInfo.ageRating || 'Not selected'}</span>
          </div>
        </div>
      </div>

      <!-- Video Files -->
      <div>
        <h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">🎬</span> Video Content</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Main Video:</span>
            <span class="text-white font-medium">
              {#if videoData.videoProgress?.isCompleted}
                <span class="text-emerald-400">✓ Uploaded</span>
              {:else}
                <span class="text-red-400">Not uploaded</span>
              {/if}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Trailer:</span>
            <span class="text-white font-medium">
              {#if videoData.trailerProgress?.isCompleted}
                <span class="text-emerald-400">✓ Uploaded</span>
              {:else}
                <span class="text-gray-400">Optional</span>
              {/if}
            </span>
          </div>
        </div>
      </div>

      <!-- Assets -->
      <div>
        <h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">🖼️</span> Image Assets</h4>
        <div class="text-sm flex justify-between">
          <span class="text-gray-400">Uploaded Assets:</span>
          <span class="text-white font-medium">
            {Object.keys(assetData.uploadedAssets || {}).length} file(s)
          </span>
        </div>
      </div>

      <!-- Metadata -->
      <div>
        <h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">📝</span> Additional Details</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Duration:</span>
            <span class="text-white font-medium">{metadataInfo.duration ? `${metadataInfo.duration} min` : 'Not specified'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Language:</span>
            <span class="text-white font-medium">{metadataInfo.language || 'English'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Bible References:</span>
            <span class="text-white font-medium">{metadataInfo.bibleReferences?.length || 0} reference(s)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Description Preview -->
    {#if basicInfo.description}
      <div class="mt-6 border-t border-border/40 pt-4">
        <h4 class="font-semibold text-white mb-2">Description</h4>
        <div class="text-sm text-gray-300 bg-white/2 border border-border/45 p-3 rounded-lg whitespace-pre-line">
          {basicInfo.description}
        </div>
      </div>
    {/if}
  </div>

  <!-- Review Process Information -->
  <div class="bg-primary/5 border border-primary/20 rounded-xl p-6">
    <h3 class="text-xl font-bold text-white mb-4">Review Process</h3>
    <div class="space-y-3 text-sm text-gray-300">
      <div class="flex items-start">
        <span class="text-lg mr-3">1️⃣</span>
        <div>
          <div class="font-semibold text-white">Theological Review</div>
          <div class="text-gray-400">Content will be reviewed for doctrinal accuracy and biblical alignment</div>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-lg mr-3">2️⃣</span>
        <div>
          <div class="font-semibold text-white">Content Moderation</div>
          <div class="text-gray-400">General content review for appropriateness and quality</div>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-lg mr-3">3️⃣</span>
        <div>
          <div class="font-semibold text-white">Technical Quality Assurance</div>
          <div class="text-gray-400">Video and audio quality, technical specifications check</div>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-lg mr-3">✅</span>
        <div>
          <div class="font-semibold text-white">Final Approval & Publishing</div>
          <div class="text-gray-400">Content goes live on the platform for all users</div>
        </div>
      </div>
    </div>

    <div class="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
      <div class="text-sm text-white/90">
        <strong>Expected Review Time:</strong> 3-5 business days<br>
        <strong>Status Updates:</strong> You'll receive dashboard and email notifications at each stage
      </div>
    </div>
  </div>

  <!-- Terms and Guidelines -->
  <div class="space-y-4">
    <h3 class="text-xl font-bold text-white">Terms and Guidelines</h3>

    <div class="bg-white/5 border border-border/80 rounded-xl p-6 space-y-4">
      <label class="flex items-start cursor-pointer">
        <input
          type="checkbox"
          bind:checked={guidelinesAccepted}
          class="mt-1 mr-4 w-5 h-5 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none cursor-pointer"
        />
        <div class="text-sm select-none">
          <div class="text-white font-medium mb-1">Content Guidelines Acceptance</div>
          <div class="text-gray-300">
            I confirm that my content aligns with Sephar Studios' faith-based content guidelines,
            promotes positive Christian values, and is appropriate for the intended audience.
            I understand that content not meeting these standards may be rejected.
          </div>
        </div>
      </label>

      <label class="flex items-start cursor-pointer">
        <input
          type="checkbox"
          bind:checked={termsAccepted}
          class="mt-1 mr-4 w-5 h-5 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none cursor-pointer"
        />
        <div class="text-sm select-none">
          <div class="text-white font-medium mb-1">Terms of Service Agreement</div>
          <div class="text-gray-300">
            I agree to the Sephar Studios Terms of Service, Creator Agreement, and Privacy Policy.
            I confirm that I have the rights to submit this content and that it does not infringe
            on any third-party copyrights or intellectual property.
          </div>
        </div>
      </label>
    </div>
  </div>

  <!-- Submission Warning -->
  <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4">
    <div class="flex items-start">
      <div class="text-2xl mr-3">⚠️</div>
      <div>
        <div class="font-medium text-white mb-1">Before You Submit</div>
        <div class="text-sm text-yellow-100 space-y-1">
          <div>• Ensure all required fields are completed accurately</div>
          <div>• Double-check your video quality and audio clarity</div>
          <div>• Verify that all uploaded images represent your content appropriately</div>
          <div>• Make sure your content aligns with our faith-based community standards</div>
          <div>• Content cannot be edited once submitted - you'll need to resubmit if changes are needed</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Submission summary -->
  <div class="text-center pt-6 text-sm text-gray-400">
    {#if !termsAccepted || !guidelinesAccepted}
      Tick both boxes above, then use the
      <span class="text-white font-medium">Submit for review</span>
      button below to send this for approval.
    {:else}
      Ready. Use the Submit for review button below to send this for approval.
    {/if}
  </div>
</div>
