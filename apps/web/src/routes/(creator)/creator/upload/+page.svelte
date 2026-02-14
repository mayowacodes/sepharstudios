<!-- Multi-Step Upload Wizard -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { UploadStep, type UploadWizardState, ContentType, AgeRating } from '$lib/types/creator';
  import StepIndicator from '$lib/components/creator/upload/StepIndicator.svelte';
  import BasicInfoStep from '$lib/components/creator/upload/BasicInfoStep.svelte';
  import VideoUploadStep from '$lib/components/creator/upload/VideoUploadStep.svelte';
  import AssetManagementStep from '$lib/components/creator/upload/AssetManagementStep.svelte';
  import MetadataStep from '$lib/components/creator/upload/MetadataStep.svelte';
  import ReviewSubmitStep from '$lib/components/creator/upload/ReviewSubmitStep.svelte';
  
  let wizardState: UploadWizardState = {
    currentStep: UploadStep.BASIC_INFO,
    stepData: {
      [UploadStep.BASIC_INFO]: {},
      [UploadStep.VIDEO_UPLOAD]: {},
      [UploadStep.ASSET_MANAGEMENT]: {
        uploadedAssets: {},
        assetProgress: []
      },
      [UploadStep.METADATA]: {},
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
  
  const steps = [
    { step: UploadStep.BASIC_INFO, title: 'Basic Info', description: 'Content details and type' },
    { step: UploadStep.VIDEO_UPLOAD, title: 'Video Upload', description: 'Upload your content files' },
    { step: UploadStep.ASSET_MANAGEMENT, title: 'Images & Assets', description: 'Upload promotional images' },
    { step: UploadStep.METADATA, title: 'Metadata', description: 'Additional details and tags' },
    { step: UploadStep.REVIEW_SUBMIT, title: 'Review & Submit', description: 'Final review and submission' }
  ];
  
  function goToStep(step: UploadStep) {
    wizardState.currentStep = step;
  }
  
  function nextStep() {
    if (wizardState.currentStep < UploadStep.REVIEW_SUBMIT) {
      wizardState.currentStep++;
    }
  }
  
  function previousStep() {
    if (wizardState.currentStep > UploadStep.BASIC_INFO) {
      wizardState.currentStep--;
    }
  }
  
  function updateStepData(step: UploadStep, data: any) {
    wizardState.stepData[step] = { ...wizardState.stepData[step], ...data };
    validateStep(step);
  }
  
  function validateStep(step: UploadStep) {
    switch (step) {
      case UploadStep.BASIC_INFO:
        const basicData = wizardState.stepData[step];
        wizardState.isValid[step] = !!(basicData.title && basicData.description && basicData.contentType && basicData.ageRating);
        break;
      case UploadStep.VIDEO_UPLOAD:
        const videoData = wizardState.stepData[step];
        wizardState.isValid[step] = !!(videoData.videoFile || videoData.videoProgress?.isCompleted);
        break;
      case UploadStep.ASSET_MANAGEMENT:
        const assetData = wizardState.stepData[step];
        wizardState.isValid[step] = Object.keys(assetData.uploadedAssets).length > 0;
        break;
      case UploadStep.METADATA:
        wizardState.isValid[step] = true; // Metadata is optional
        break;
      case UploadStep.REVIEW_SUBMIT:
        const reviewData = wizardState.stepData[step];
        wizardState.isValid[step] = reviewData.termsAccepted && reviewData.guidelinesAccepted;
        break;
    }
  }
  
  async function submitContent() {
    // TODO: Implement actual submission to API
    console.log('Submitting content:', wizardState);
    alert('Content submitted for review! You will be notified once the review is complete.');
    // Redirect to content management page
    window.location.href = '/creator/content';
  }
  
  onMount(() => {
    // Load any draft data from localStorage
    const draftData = localStorage.getItem('upload_draft');
    if (draftData) {
      try {
        const parsed = JSON.parse(draftData);
        wizardState = { ...wizardState, ...parsed };
      } catch (e) {
        console.error('Failed to load draft data:', e);
      }
    }
  });
  
  // Auto-save draft data
  $: {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('upload_draft', JSON.stringify(wizardState));
    }
  }
</script>

<div class="min-h-screen space-y-8">
  <!-- Header -->
  <div class="text-center">
    <h1 class="text-4xl font-bold text-white mb-2">Upload New Content</h1>
    <p class="text-xl text-gray-300">Share your faith-based content with believers worldwide</p>
  </div>
  
  <!-- Step Indicator -->
  <StepIndicator 
    {steps} 
    currentStep={wizardState.currentStep} 
    isStepValid={wizardState.isValid}
    onStepClick={goToStep}
  />
  
  <!-- Step Content -->
  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto">
    {#if wizardState.currentStep === UploadStep.BASIC_INFO}
      <BasicInfoStep 
        data={wizardState.stepData[UploadStep.BASIC_INFO]}
        onUpdate={(data) => updateStepData(UploadStep.BASIC_INFO, data)}
      />
    {:else if wizardState.currentStep === UploadStep.VIDEO_UPLOAD}
      <VideoUploadStep 
        data={wizardState.stepData[UploadStep.VIDEO_UPLOAD]}
        onUpdate={(data) => updateStepData(UploadStep.VIDEO_UPLOAD, data)}
      />
    {:else if wizardState.currentStep === UploadStep.ASSET_MANAGEMENT}
      <AssetManagementStep 
        data={wizardState.stepData[UploadStep.ASSET_MANAGEMENT]}
        onUpdate={(data) => updateStepData(UploadStep.ASSET_MANAGEMENT, data)}
      />
    {:else if wizardState.currentStep === UploadStep.METADATA}
      <MetadataStep 
        data={wizardState.stepData[UploadStep.METADATA]}
        onUpdate={(data) => updateStepData(UploadStep.METADATA, data)}
      />
    {:else if wizardState.currentStep === UploadStep.REVIEW_SUBMIT}
      <ReviewSubmitStep 
        data={wizardState.stepData[UploadStep.REVIEW_SUBMIT]}
        allStepData={wizardState}
        onUpdate={(data) => updateStepData(UploadStep.REVIEW_SUBMIT, data)}
        onSubmit={submitContent}
      />
    {/if}
  </div>
  
  <!-- Navigation Buttons -->
  <div class="flex justify-between items-center max-w-4xl mx-auto">
    <button 
      onclick={previousStep}
      disabled={wizardState.currentStep === UploadStep.BASIC_INFO}
      class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
    >
      ← Previous
    </button>
    
    <div class="text-center text-gray-300">
      Step {wizardState.currentStep} of {UploadStep.REVIEW_SUBMIT}
    </div>
    
    {#if wizardState.currentStep < UploadStep.REVIEW_SUBMIT}
      <button 
        onclick={nextStep}
        disabled={!wizardState.isValid[wizardState.currentStep]}
        class="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:text-purple-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Next →
      </button>
    {:else}
      <button 
        onclick={submitContent}
        disabled={!wizardState.isValid[wizardState.currentStep]}
        class="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:text-green-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
      >
        Submit for Review
      </button>
    {/if}
  </div>
</div>