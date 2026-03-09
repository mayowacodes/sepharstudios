import type { ProposalStatus, ProposalType } from '$lib/server/governance-store';

const TIMESTAMP_MS_ROUTINE = 72 * 60 * 60 * 1000;
const TIMESTAMP_MS_MONETARY = 7 * 24 * 60 * 60 * 1000;

export function getDelayMsForProposalType(type: ProposalType): number {
	if (type === 'policy_change' || type === 'emergency_action') return TIMESTAMP_MS_MONETARY;
	return TIMESTAMP_MS_ROUTINE;
}

export function isQueueable(status: ProposalStatus, approvals: number, requiredApprovals: number): boolean {
	return status === 'submitted' && approvals >= requiredApprovals;
}

export function isExecutable(status: ProposalStatus, eta?: Date | null, nowMs = Date.now()): boolean {
	if (status !== 'queued' && status !== 'executable') return false;
	if (!eta) return true;
	return nowMs >= eta.getTime();
}
