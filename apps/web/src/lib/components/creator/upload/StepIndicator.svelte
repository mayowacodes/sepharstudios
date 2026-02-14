

<!-- Upload Wizard Step Indicator -->
<script lang="ts">
  import { UploadStep } from '$lib/types/creator';
  
  interface Step {
    step: UploadStep;
    title: string;
    description: string;
  }
  
  export let steps: Step[];
  export let currentStep: UploadStep;
  export let isStepValid: { [key: number]: boolean };
  export let onStepClick: (step: UploadStep) => void;
  
  function getStepStatus(stepNumber: UploadStep) {
    if (stepNumber < currentStep && isStepValid[stepNumber]) {
      return 'completed';
    } else if (stepNumber === currentStep) {
      return 'current';
    } else if (stepNumber < currentStep) {
      return 'error';
    } else {
      return 'pending';
    }
  }
  
  function getStepClasses(stepNumber: UploadStep) {
    const status = getStepStatus(stepNumber);
    const baseClasses = 'flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-all cursor-pointer';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-600 border-green-600 text-white`;
      case 'current':
        return `${baseClasses} bg-purple-600 border-purple-600 text-white`;
      case 'error':
        return `${baseClasses} bg-red-600 border-red-600 text-white`;
      default:
        return `${baseClasses} border-gray-500 text-gray-400`;
    }
  }
  
  function getConnectorClasses(stepNumber: UploadStep) {
    const isCompleted = stepNumber < currentStep && isStepValid[stepNumber];
    return `flex-1 h-1 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-600'}`;
  }
</script>

<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
  <div class="flex items-center justify-between">
    {#each steps as step, index}
      <div class="flex items-center {index === steps.length - 1 ? '' : 'flex-1'}">
        <!-- Step Circle -->
        <div class="flex flex-col items-center">
          <button 
            class={getStepClasses(step.step)}
            on:click={() => onStepClick(step.step)}
            disabled={step.step > currentStep && !isStepValid[step.step - 1]}
            aria-label={`Step ${step.step}: ${step.title} - ${getStepStatus(step.step)}`}
            aria-current={step.step === currentStep ? 'step' : undefined}
          >
            {#if getStepStatus(step.step) === 'completed'}
              ✓
            {:else}
              {step.step}
            {/if}
          </button>
          
          <div class="mt-2 text-center">
            <div class="text-sm font-medium text-white">{step.title}</div>
            <div class="text-xs text-gray-400 max-w-20">{step.description}</div>
          </div>
        </div>
        
        <!-- Connector Line -->
        {#if index < steps.length - 1}
          <div class={getConnectorClasses(step.step)}></div>
        {/if}
      </div>
    {/each}
  </div>
  
  <!-- Progress Bar -->
  <div class="mt-6">
    <div class="flex justify-between text-sm text-gray-400 mb-2">
      <span>Progress</span>
      <span>{Math.round((currentStep / steps.length) * 100)}%</span>
    </div>
    <div class="w-full bg-gray-700 rounded-full h-2">
      <div 
        class="bg-purple-600 h-2 rounded-full transition-all duration-300"
        style="width: {(currentStep / steps.length) * 100}%"
      ></div>
    </div>
  </div>
</div>