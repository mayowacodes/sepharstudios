<script lang="ts">
  export interface StepConfig {
    id: string;
    label: string;
  }

  interface Props {
    steps: StepConfig[];
    currentStep: number;
    onStepClick?: (index: number) => void;
  }

  let { steps, currentStep, onStepClick }: Props = $props();

  function handleClick(index: number) {
    if (onStepClick) onStepClick(index);
  }
</script>

<div class="flex items-center justify-between w-full">
  {#each steps as step, index}
    <div class="flex items-center w-full">
      <!-- Step Circle -->
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all
        {index < currentStep
          ? 'bg-primary text-white'
          : index === currentStep
          ? 'bg-white text-black'
          : 'bg-gray-700 text-gray-400'}"
        onclick={() => handleClick(index)}
        aria-label={`Step ${index + 1}: ${step.label}`}
      >
        {index + 1}
      </button>

      <!-- Label -->
      <div class="ml-2 text-sm
        {index === currentStep ? 'text-white' : 'text-gray-400'}">
        {step.label}
      </div>

      <!-- Line -->
      {#if index < steps.length - 1}
        <div class="flex-1 h-0.5 mx-4
          {index < currentStep ? 'bg-primary' : 'bg-gray-700'}"></div>
      {/if}
    </div>
  {/each}
</div>