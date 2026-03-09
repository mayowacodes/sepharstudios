import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getDelayMsForProposalType, isExecutable, isQueueable } from '$lib/server/governance-policy';

describe('governance lifecycle policy', () => {
	it('computes longer timelock for policy/emergency actions', () => {
		assert.equal(getDelayMsForProposalType('parameter_update'), 72 * 60 * 60 * 1000);
		assert.equal(getDelayMsForProposalType('policy_change'), 7 * 24 * 60 * 60 * 1000);
		assert.equal(getDelayMsForProposalType('emergency_action'), 7 * 24 * 60 * 60 * 1000);
	});

	it('requires submitted status and threshold approvals before queueing', () => {
		assert.equal(isQueueable('submitted', 4, 4), true);
		assert.equal(isQueueable('submitted', 3, 4), false);
		assert.equal(isQueueable('queued', 10, 4), false);
	});

	it('requires executable status and eta maturity before execution', () => {
		const future = new Date(Date.now() + 60_000);
		const past = new Date(Date.now() - 60_000);
		assert.equal(isExecutable('queued', future, Date.now()), false);
		assert.equal(isExecutable('queued', past, Date.now()), true);
		assert.equal(isExecutable('executed', past, Date.now()), false);
	});
});
