import type { ProposalType } from '$lib/server/governance-store';

export function assessRisk(type: ProposalType, payload: Record<string, unknown>): 'low' | 'medium' | 'high' {
	if (type === 'emergency_action') return 'high';
	if (type === 'policy_change') return 'high';
	if (type === 'treasury_action') return 'medium';
	if (type === 'parameter_update') {
		const percent = Number(payload.changePercent ?? 0);
		if (Math.abs(percent) >= 15) return 'high';
		if (Math.abs(percent) >= 5) return 'medium';
		return 'low';
	}
	return 'low';
}

export function getGuardrailWarnings(type: ProposalType, payload: Record<string, unknown>): string[] {
	const warnings: string[] = [];
	const percent = Number(payload.changePercent ?? 0);

	if (type === 'parameter_update') {
		if (Number.isFinite(percent) && Math.abs(percent) > 10) {
			warnings.push('Parameter change exceeds 10%; supermajority review is recommended.');
		}
		if (Number.isFinite(percent) && Math.abs(percent) > 25) {
			warnings.push('Change exceeds hard policy comfort range (25%).');
		}
	}

	if (type === 'policy_change') {
		warnings.push('Policy changes use extended timelock and require high scrutiny.');
	}

	if (type === 'emergency_action') {
		warnings.push('Emergency action should include incident ID and postmortem commitment.');
	}

	return warnings;
}

export function getHardValidationErrors(type: ProposalType, payload: Record<string, unknown>): string[] {
	const errors: string[] = [];

	if (type === 'parameter_update') {
		const percent = Number(payload.changePercent);
		if (!Number.isFinite(percent)) {
			errors.push('parameter_update requires numeric payload.changePercent');
		} else if (Math.abs(percent) > 25) {
			errors.push('parameter_update changePercent cannot exceed 25% in either direction');
		}
	}

	if (type === 'emergency_action') {
		const incidentId = String(payload.incidentId ?? '').trim();
		const postmortemEta = String(payload.postmortemEta ?? '').trim();
		if (!incidentId) errors.push('emergency_action requires payload.incidentId');
		if (!postmortemEta) errors.push('emergency_action requires payload.postmortemEta');
	}

	return errors;
}
