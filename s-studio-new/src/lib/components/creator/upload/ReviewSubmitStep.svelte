<!-- Review and Submit Step -->
<script lang="ts">
  import type { UploadWizardState } from '$lib/types/creator';
  
  export let data: any;
  export let allStepData: UploadWizardState;
  export let onUpdate: (data: any) => void;
  export let onSubmit: () => void;
  
  let termsAccepted = data.termsAccepted || false;
  let guidelinesAccepted = data.guidelinesAccepted || false;
  
  // Update parent when data changes
  $: onUpdate({ termsAccepted, guidelinesAccepted });
  
  // Get basic info for display
  $: basicInfo = allStepData.stepData[1];
  $: videoData = allStepData.stepData[2];
  $: assetData = allStepData.stepData[3];
  $: metadataInfo = allStepData.stepData[4];
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-white mb-2">Review & Submit</h2>
    <p class="text-gray-300">Review your content details before submitting for approval</p>
  </div>
  
  <!-- Content Summary -->
  <div class="bg-white/10 rounded-lg p-6">
    <h3 class="text-xl font-bold text-white mb-4">Content Summary</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Basic Information -->
      <div>
        <h4 class="font-medium text-white mb-2">Basic Information</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Title:</span>
            <span class="text-white">{basicInfo.title || 'Not provided'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Type:</span>
            <span class="text-white">{basicInfo.contentType || 'Not selected'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Age Rating:</span>
            <span class="text-white">{basicInfo.ageRating || 'Not selected'}</span>
          </div>
        </div>
      </div>
      
      <!-- Video Files -->
      <div>
        <h4 class="font-medium text-white mb-2">Video Content</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Main Video:</span>
            <span class="text-white">
              {#if videoData.videoProgress?.isCompleted}
                <span class="text-green-400">✓ Uploaded</span>
              {:else}
                <span class="text-red-400">Not uploaded</span>
              {/if}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Trailer:</span>
            <span class="text-white">
              {#if videoData.trailerProgress?.isCompleted}
                <span class="text-green-400">✓ Uploaded</span>
              {:else}
                <span class="text-gray-400">Optional</span>
              {/if}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Assets -->
      <div>
        <h4 class="font-medium text-white mb-2">Image Assets</h4>
        <div class="text-sm">
          <span class="text-gray-400">Uploaded:</span>
          <span class="text-white ml-2">
            {Object.keys(assetData.uploadedAssets || {}).length} assets
          </span>
        </div>
      </div>
      
      <!-- Metadata -->
      <div>
        <h4 class="font-medium text-white mb-2">Additional Details</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Duration:</span>
            <span class="text-white">{metadataInfo.duration ? `${metadataInfo.duration} min` : 'Not specified'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Language:</span>
            <span class="text-white">{metadataInfo.language || 'English'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Bible References:</span>
            <span class="text-white">{metadataInfo.bibleReferences?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Description Preview -->
    {#if basicInfo.description}
      <div class="mt-6">
        <h4 class="font-medium text-white mb-2">Description</h4>
        <div class="text-sm text-gray-300 bg-white/5 p-3 rounded">
          {basicInfo.description}
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Review Process Information -->
  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-6">
    <h3 class="text-xl font-bold text-white mb-4">Review Process</h3>
    <div class="space-y-3 text-sm text-blue-200">
      <div class="flex items-start">
        <span class="text-lg mr-3">1️⃣</span>
        <div>
          <div class="font-medium">Theological Review</div>
          <div>Content will be reviewed for doctrinal accuracy and biblical alignment</div>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-lg mr-3">2️⃣</span>
        <div>
          <div class="font-medium">Content Moderation</div>
          <div>General content review for appropriateness and quality</div>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-lg mr-3">3️⃣</span>
        <div>
          <div class="font-medium">Technical Quality Assurance</div>
          <div>Video and audio quality, technical specifications check</div>
        </div>
      </div>
      <div class="flex items-start">
        <span class="text-lg mr-3">✅</span>
        <div>
          <div class="font-medium">Final Approval & Publishing</div>
          <div>Content goes live on the platform for all users</div>
        </div>
      </div>
    </div>
    
    <div class="mt-4 p-3 bg-blue-700/30 rounded">
      <div class="text-sm text-blue-100">
        <strong>Expected Review Time:</strong> 3-5 business days<br>
        <strong>Status Updates:</strong> You'll receive email notifications at each stage
      </div>
    </div>
  </div>
  
  <!-- Terms and Guidelines -->
  <div class="space-y-4">
    <h3 class="text-xl font-bold text-white">Terms and Guidelines</h3>
    
    <div class="bg-white/10 rounded-lg p-6 space-y-4">
      <label class="flex items-start">
        <input 
          type="checkbox" 
          bind:checked={guidelinesAccepted}
          class="mt-1 mr-4 w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
        />
        <div class="text-sm">
          <div class="text-white font-medium mb-1">Content Guidelines Acceptance</div>
          <div class="text-gray-300">
            I confirm that my content aligns with Sephar Studios' faith-based content guidelines, 
            promotes positive Christian values, and is appropriate for the intended audience. 
            I understand that content not meeting these standards may be rejected.
          </div>
        </div>
      </label>
      
      <label class="flex items-start">
        <input 
          type="checkbox" 
          bind:checked={termsAccepted}
          class="mt-1 mr-4 w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
        />
        <div class="text-sm">
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
  <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
    <div class="flex items-start">
      <div class="text-2xl mr-3">⚠️</div>
      <div>
        <div class="font-medium text-white mb-1">Before You Submit</div>
        <div class="text-sm text-yellow-200 space-y-1">
          <div>• Ensure all required fields are completed accurately</div>
          <div>• Double-check your video quality and audio clarity</div>
          <div>• Verify that all uploaded images represent your content appropriately</div>
          <div>• Make sure your content aligns with our faith-based community standards</div>
          <div>• Content cannot be edited once submitted - you'll need to resubmit if changes are needed</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Submit Button -->
  <div class="text-center pt-6">
    <button 
      on:click={onSubmit}
      disabled={!termsAccepted || !guidelinesAccepted}
      class="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:text-green-300 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors disabled:cursor-not-allowed"
    >
      {#if !termsAccepted || !guidelinesAccepted}
        Please Accept Terms to Continue
      {:else}
        🚀 Submit Content for Review
      {/if}
    </button>
    
    {#if termsAccepted && guidelinesAccepted}
      <div class="text-sm text-gray-400 mt-2">
        Your content will be submitted to our review team
      </div>
    {/if}
  </div>
</div>