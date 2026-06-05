import { writable } from 'svelte/store';

export type StepKey = 'basic' | 'metadata' | 'video' | 'assets' | 'review';

type FormState = {
	currentStep: StepKey;
	data: Record<string, unknown>;
	validity: Record<StepKey, boolean>;
};

function createUploadForm() {
	const { subscribe, update } = writable<FormState>({
		currentStep: 'basic',
		data: {},
		validity: {
			basic: false,
			metadata: false,
			video: false,
			assets: false,
			review: false
		}
	});

	return {
		subscribe,

		updateStepData(step: StepKey, data: unknown, isValid: boolean) {
			update((state) => ({
				...state,
				data: { ...state.data, [step]: data },
				validity: { ...state.validity, [step]: isValid }
			}));
		},

		goTo(step: StepKey) {
			update((state) => ({ ...state, currentStep: step }));
		}
	};
}

export const uploadForm = createUploadForm();
