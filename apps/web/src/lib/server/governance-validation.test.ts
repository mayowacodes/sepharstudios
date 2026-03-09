import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assessRisk, getGuardrailWarnings, getHardValidationErrors } from '$lib/server/governance-validation';

describe('governance validation', () => {
	it('flags hard errors for invalid parameter update payload', () => {
		const errors = getHardValidationErrors('parameter_update', { changePercent: 30 });
		assert.ok(errors.length > 0);
		assert.ok(errors[0]?.includes('cannot exceed 25%'));
	});

	it('requires incident metadata for emergency action', () => {
		const errors = getHardValidationErrors('emergency_action', {});
		assert.ok(errors.includes('emergency_action requires payload.incidentId'));
		assert.ok(errors.includes('emergency_action requires payload.postmortemEta'));
	});

	it('produces warnings and elevated risk for larger parameter changes', () => {
		const warnings = getGuardrailWarnings('parameter_update', { changePercent: 12 });
		assert.ok(warnings.length > 0);
		assert.equal(assessRisk('parameter_update', { changePercent: 12 }), 'medium');
		assert.equal(assessRisk('parameter_update', { changePercent: 20 }), 'high');
	});
});
