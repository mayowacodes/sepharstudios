import { and, asc, count, desc, eq, inArray, isNotNull, lte } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import {
	governanceAuditEntries,
	governanceMemberships,
	governancePauseEvents,
	governanceProposalApprovals,
	governanceProposals
} from '$lib/db/schema/sepharstudios';
import { getDelayMsForProposalType, isExecutable, isQueueable } from '$lib/server/governance-policy';

export type ProposalStatus = 'draft' | 'submitted' | 'queued' | 'executable' | 'executed' | 'cancelled';
export type ProposalType = 'policy_change' | 'treasury_action' | 'emergency_action' | 'parameter_update';
export type AuditAction = 'created' | 'approved' | 'queued' | 'executed' | 'pause_triggered';
export type GovernancePermission =
	| 'governance.view'
	| 'governance.proposal.create'
	| 'governance.proposal.approve'
	| 'governance.proposal.queue'
	| 'governance.proposal.execute'
	| 'governance.pause.trigger'
	| 'governance.reports.view'
	| 'governance.roles.manage';

export interface GovernanceProposal {
	id: string;
	title: string;
	description: string;
	type: ProposalType;
	payload: Record<string, unknown>;
	createdBy: string;
	createdByName: string;
	createdAt: string;
	status: ProposalStatus;
	riskLevel: 'low' | 'medium' | 'high';
	eta?: string;
	executedAt?: string;
	guardrailWarnings: string[];
	approvals: string[];
	approvalNames: string[];
	requiredApprovals: number;
}

export interface PauseEvent {
	id: string;
	reason: string;
	triggeredBy: string;
	triggeredByName: string;
	triggeredAt: string;
	active: boolean;
	resolvedAt?: string;
}

export interface AuditEntry {
	id: string;
	proposalId?: string;
	action: AuditAction;
	actorId: string;
	actorName: string;
	note: string;
	createdAt: string;
}

const REQUIRED_APPROVALS = 4;

export const DEFAULT_GOVERNANCE_PERMISSIONS: GovernancePermission[] = [
	'governance.view',
	'governance.proposal.create',
	'governance.proposal.approve',
	'governance.proposal.queue',
	'governance.proposal.execute',
	'governance.pause.trigger',
	'governance.reports.view',
	'governance.roles.manage'
];

function asIso(value?: Date | null): string | undefined {
	return value ? value.toISOString() : undefined;
}

async function addAuditEntry(entry: Omit<AuditEntry, 'id' | 'createdAt'>): Promise<void> {
	await db.insert(governanceAuditEntries).values({
		proposalId: entry.proposalId ?? null,
		action: entry.action,
		actorId: entry.actorId,
		actorName: entry.actorName,
		note: entry.note
	});
}

async function ensureQueueMaturity(): Promise<void> {
	await db
		.update(governanceProposals)
		.set({
			status: 'executable',
			updatedAt: new Date()
		})
		.where(
			and(
				eq(governanceProposals.status, 'queued'),
				isNotNull(governanceProposals.eta),
				lte(governanceProposals.eta, new Date())
			)
		);
}

async function hydrateProposals(
	rows: Array<typeof governanceProposals.$inferSelect>
): Promise<GovernanceProposal[]> {
	if (rows.length === 0) return [];

	const proposalIds = rows.map((row) => row.id);
	const approvals = await db
		.select({
			proposalId: governanceProposalApprovals.proposalId,
			actorId: governanceProposalApprovals.actorId,
			actorName: governanceProposalApprovals.actorName
		})
		.from(governanceProposalApprovals)
		.where(inArray(governanceProposalApprovals.proposalId, proposalIds));

	const approvalMap = new Map<string, { ids: string[]; names: string[] }>();
	for (const approval of approvals) {
		const existing = approvalMap.get(approval.proposalId) ?? { ids: [], names: [] };
		existing.ids.push(approval.actorId);
		existing.names.push(approval.actorName);
		approvalMap.set(approval.proposalId, existing);
	}

	return rows.map((row) => {
		const approvalState = approvalMap.get(row.id) ?? { ids: [], names: [] };
		return {
			id: row.id,
			title: row.title,
			description: row.description,
			type: row.type as ProposalType,
			payload: (row.payload ?? {}) as Record<string, unknown>,
			createdBy: row.createdBy,
			createdByName: row.createdByName,
			createdAt: row.createdAt.toISOString(),
			status: row.status as ProposalStatus,
			riskLevel: row.riskLevel as 'low' | 'medium' | 'high',
			eta: asIso(row.eta),
			executedAt: asIso(row.executedAt),
			guardrailWarnings: (row.guardrailWarnings ?? []) as string[],
			approvals: approvalState.ids,
			approvalNames: approvalState.names,
			requiredApprovals: row.requiredApprovals
		};
	});
}

export async function listProposals(): Promise<GovernanceProposal[]> {
	await ensureQueueMaturity();
	const rows = await db.select().from(governanceProposals).orderBy(desc(governanceProposals.createdAt));
	return hydrateProposals(rows);
}

export async function listAuditEntries(): Promise<AuditEntry[]> {
	const rows = await db
		.select()
		.from(governanceAuditEntries)
		.orderBy(desc(governanceAuditEntries.createdAt));

	return rows.map((row) => ({
		id: row.id,
		proposalId: row.proposalId ?? undefined,
		action: row.action as AuditAction,
		actorId: row.actorId,
		actorName: row.actorName,
		note: row.note,
		createdAt: row.createdAt.toISOString()
	}));
}

export async function createProposal(
	input: Omit<GovernanceProposal, 'id' | 'createdAt' | 'status' | 'approvals' | 'approvalNames' | 'requiredApprovals'>,
	actor: { id: string; name: string }
): Promise<GovernanceProposal> {
	const [inserted] = await db
		.insert(governanceProposals)
		.values({
			title: input.title,
			description: input.description,
			type: input.type,
			payload: input.payload,
			createdBy: input.createdBy,
			createdByName: input.createdByName,
			status: 'submitted',
			riskLevel: input.riskLevel,
			guardrailWarnings: input.guardrailWarnings,
			requiredApprovals: REQUIRED_APPROVALS
		})
		.returning();

	await addAuditEntry({
		proposalId: inserted.id,
		action: 'created',
		actorId: actor.id,
		actorName: actor.name,
		note: `Proposal created: ${inserted.title}`
	});

	const [proposal] = await hydrateProposals([inserted]);
	return proposal;
}

export async function approveProposal(
	id: string,
	actor: { id: string; name: string }
): Promise<GovernanceProposal | null> {
	const [proposalRow] = await db
		.select()
		.from(governanceProposals)
		.where(eq(governanceProposals.id, id))
		.limit(1);
	if (!proposalRow) return null;

	if (proposalRow.status !== 'submitted') {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}

	const [existing] = await db
		.select({ id: governanceProposalApprovals.id })
		.from(governanceProposalApprovals)
		.where(
			and(
				eq(governanceProposalApprovals.proposalId, proposalRow.id),
				eq(governanceProposalApprovals.actorId, actor.id)
			)
		)
		.limit(1);

	if (!existing) {
		await db.insert(governanceProposalApprovals).values({
			proposalId: proposalRow.id,
			actorId: actor.id,
			actorName: actor.name
		});

		const [countRow] = await db
			.select({ total: count() })
			.from(governanceProposalApprovals)
			.where(eq(governanceProposalApprovals.proposalId, proposalRow.id));

		const approvalsCount = Number(countRow?.total ?? 0);
		await addAuditEntry({
			proposalId: proposalRow.id,
			action: 'approved',
			actorId: actor.id,
			actorName: actor.name,
			note: `Approval recorded (${approvalsCount}/${proposalRow.requiredApprovals})`
		});
	}

	const [freshRow] = await db
		.select()
		.from(governanceProposals)
		.where(eq(governanceProposals.id, proposalRow.id))
		.limit(1);
	const [proposal] = await hydrateProposals([freshRow ?? proposalRow]);
	return proposal;
}

export async function queueProposal(
	id: string,
	actor: { id: string; name: string }
): Promise<GovernanceProposal | null> {
	const [proposalRow] = await db
		.select()
		.from(governanceProposals)
		.where(eq(governanceProposals.id, id))
		.limit(1);
	if (!proposalRow) return null;
	if (proposalRow.status !== 'submitted') {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}

	const approvals = await db
		.select({ id: governanceProposalApprovals.id })
		.from(governanceProposalApprovals)
		.where(eq(governanceProposalApprovals.proposalId, proposalRow.id));

	if (!isQueueable(proposalRow.status as ProposalStatus, approvals.length, proposalRow.requiredApprovals)) {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}

	const eta = new Date(Date.now() + getDelayMsForProposalType(proposalRow.type as ProposalType));
	const [queued] = await db
		.update(governanceProposals)
		.set({
			status: 'queued',
			eta,
			updatedAt: new Date()
		})
		.where(eq(governanceProposals.id, proposalRow.id))
		.returning();

	await addAuditEntry({
		proposalId: proposalRow.id,
		action: 'queued',
		actorId: actor.id,
		actorName: actor.name,
		note: `Queued with ETA ${eta.toISOString()}`
	});

	const [proposal] = await hydrateProposals([queued ?? proposalRow]);
	return proposal;
}

export async function executeProposal(
	id: string,
	actor: { id: string; name: string }
): Promise<GovernanceProposal | null> {
	await ensureQueueMaturity();

	const [proposalRow] = await db
		.select()
		.from(governanceProposals)
		.where(eq(governanceProposals.id, id))
		.limit(1);
	if (!proposalRow) return null;
	if (proposalRow.status !== 'queued' && proposalRow.status !== 'executable') {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}
	if (!isExecutable(proposalRow.status as ProposalStatus, proposalRow.eta, Date.now())) {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}

	const executedAt = new Date();
	const [executed] = await db
		.update(governanceProposals)
		.set({
			status: 'executed',
			executedAt,
			updatedAt: new Date()
		})
		.where(eq(governanceProposals.id, proposalRow.id))
		.returning();

	await addAuditEntry({
		proposalId: proposalRow.id,
		action: 'executed',
		actorId: actor.id,
		actorName: actor.name,
		note: `Executed at ${executedAt.toISOString()}`
	});

	const [proposal] = await hydrateProposals([executed ?? proposalRow]);
	return proposal;
}

export async function listQueue(): Promise<GovernanceProposal[]> {
	await ensureQueueMaturity();
	const rows = await db
		.select()
		.from(governanceProposals)
		.where(inArray(governanceProposals.status, ['queued', 'executable']))
		.orderBy(asc(governanceProposals.eta), asc(governanceProposals.createdAt));
	return hydrateProposals(rows);
}

export async function triggerPause(reason: string, actor: { id: string; name: string }): Promise<PauseEvent> {
	const [active] = await db
		.select()
		.from(governancePauseEvents)
		.where(eq(governancePauseEvents.active, true))
		.orderBy(desc(governancePauseEvents.triggeredAt))
		.limit(1);

	if (active) {
		return {
			id: active.id,
			reason: active.reason,
			triggeredBy: active.triggeredBy,
			triggeredByName: active.triggeredByName,
			triggeredAt: active.triggeredAt.toISOString(),
			active: active.active,
			resolvedAt: asIso(active.resolvedAt)
		};
	}

	const [inserted] = await db
		.insert(governancePauseEvents)
		.values({
			reason,
			triggeredBy: actor.id,
			triggeredByName: actor.name,
			active: true
		})
		.returning();

	await addAuditEntry({
		action: 'pause_triggered',
		actorId: actor.id,
		actorName: actor.name,
		note: reason
	});

	return {
		id: inserted.id,
		reason: inserted.reason,
		triggeredBy: inserted.triggeredBy,
		triggeredByName: inserted.triggeredByName,
		triggeredAt: inserted.triggeredAt.toISOString(),
		active: inserted.active,
		resolvedAt: asIso(inserted.resolvedAt)
	};
}

export async function getActivePause(): Promise<PauseEvent | null> {
	const [row] = await db
		.select()
		.from(governancePauseEvents)
		.where(eq(governancePauseEvents.active, true))
		.orderBy(desc(governancePauseEvents.triggeredAt))
		.limit(1);
	if (!row) return null;
	return {
		id: row.id,
		reason: row.reason,
		triggeredBy: row.triggeredBy,
		triggeredByName: row.triggeredByName,
		triggeredAt: row.triggeredAt.toISOString(),
		active: row.active,
		resolvedAt: asIso(row.resolvedAt)
	};
}

export async function listPauseEvents(): Promise<PauseEvent[]> {
	const rows = await db
		.select()
		.from(governancePauseEvents)
		.orderBy(desc(governancePauseEvents.triggeredAt));
	return rows.map((row) => ({
		id: row.id,
		reason: row.reason,
		triggeredBy: row.triggeredBy,
		triggeredByName: row.triggeredByName,
		triggeredAt: row.triggeredAt.toISOString(),
		active: row.active,
		resolvedAt: asIso(row.resolvedAt)
	}));
}

export async function getGovernancePermissionsForUser(userId: string): Promise<string[]> {
	const [membership] = await db
		.select({ permissions: governanceMemberships.permissions, active: governanceMemberships.active })
		.from(governanceMemberships)
		.where(eq(governanceMemberships.userId, userId))
		.limit(1);

	if (!membership || !membership.active) {
		return DEFAULT_GOVERNANCE_PERMISSIONS;
	}

	const permissions = (membership.permissions ?? []) as string[];
	return permissions.length > 0 ? permissions : DEFAULT_GOVERNANCE_PERMISSIONS;
}

export async function hasGovernancePermission(
	userId: string,
	permission: GovernancePermission
): Promise<boolean> {
	const permissions = await getGovernancePermissionsForUser(userId);
	return permissions.includes('*') || permissions.includes(permission);
}
