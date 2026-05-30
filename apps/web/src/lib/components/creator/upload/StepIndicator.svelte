<!-- Upload Wizard Step Indicator -->
<script lang="ts">
  import { UploadStep } from '$lib/types/creator';

  interface Step {
    step: UploadStep;
    title: string;
    description: string;
  }

  interface Props {
    steps: Step[];
    currentStep: UploadStep;
    isStepValid: { [key: number]: boolean };
    onStepClick: (step: UploadStep) => void;
  }

  let { steps, currentStep, isStepValid, onStepClick }: Props = $props();

  // Past steps that were completed validly are green; past steps that were
  // skipped or invalid are red; the active step is purple; future steps are
  // gray-outlined. Recomputed on every render so prop updates propagate.
  function statusFor(stepNumber: UploadStep): 'completed' | 'current' | 'error' | 'pending' {
    if (stepNumber < currentStep && isStepValid[stepNumber]) return 'completed';
    if (stepNumber === currentStep) return 'current';
    if (stepNumber < currentStep) return 'error';
    return 'pending';
  }

  function classesFor(stepNumber: UploadStep): string {
    const base = 'flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-all cursor-pointer';
    switch (statusFor(stepNumber)) {
      case 'completed': return `${base} bg-green-600 border-green-600 text-white`;
      case 'current':   return `${base} bg-purple-600 border-purple-600 text-white`;
      case 'error':     return `${base} bg-red-600 border-red-600 text-white`;
      default:          return `${base} border-gray-500 text-gray-400`;
    }
  }

  function connectorClasses(stepNumber: UploadStep): string {
    const completed = stepNumber < currentStep && isStepValid[stepNumber];
    return `flex-1 h-1 mx-4 transition-colors ${completed ? 'bg-green-600' : 'bg-gray-600'}`;
  }

  // Progress bar: how much of the wizard is BEHIND us. On step 1, 0% done.
  // On the final step, 100%. Fixes the off-by-one where the bar was already
  // 20% filled before the user did anything.
  const progressPct = $derived(
    steps.length <= 1 ? 0 : Math.round(((currentStep - 1) / (steps.length - 1)) * 100)
  );
</script>

<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
  <div class="flex items-center justify-between">
    {#each steps as step, index (step.step)}
      <div class="flex items-center {index === steps.length - 1 ? '' : 'flex-1'}">
        <!-- Step Circle -->
        <div class="flex flex-col items-center">
          <button
            type="button"
            class={classesFor(step.step)}
            onclick={() => onStepClick(step.step)}
            disabled={step.step > currentStep && !isStepValid[step.step - 1]}
            aria-label={`Step ${step.step}: ${step.title} - ${statusFor(step.step)}`}
            aria-current={step.step === currentStep ? 'step' : undefined}
          >
            {#if statusFor(step.step) === 'completed'}
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
          <div class={connectorClasses(step.step)}></div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Progress Bar -->
  <div class="mt-6">
    <div class="flex justify-between text-sm text-gray-400 mb-2">
      <span>Progress</span>
      <span>{progressPct}%</span>
    </div>
    <div class="w-full bg-gray-700 rounded-full h-2">
      <div
        class="bg-purple-600 h-2 rounded-full transition-all duration-300"
        style="width: {progressPct}%"
      ></div>
    </div>
  </div>
</div>
