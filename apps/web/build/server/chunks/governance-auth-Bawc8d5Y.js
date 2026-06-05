import { w as db, J as governanceProposals, I as governanceProposalApprovals, F as governanceAuditEntries, H as governancePauseEvents, G as governanceMemberships } from './drizzle-CKUH7ukq.js';
import { g as getAdminActor } from './admin-auth-DwogZLlW.js';
import { eq, and, count, desc, inArray, asc, isNotNull, lte } from 'drizzle-orm';

//#region src/lib/server/governance-policy.ts
var TIMESTAMP_MS_ROUTINE = 4320 * 60 * 1e3;
var TIMESTAMP_MS_MONETARY = 10080 * 60 * 1e3;
function getDelayMsForProposalType(type) {
	if (type === "policy_change" || type === "emergency_action") return TIMESTAMP_MS_MONETARY;
	return TIMESTAMP_MS_ROUTINE;
}
function isQueueable(status, approvals, requiredApprovals) {
	return status === "submitted" && approvals >= requiredApprovals;
}
function isExecutable(status, eta, nowMs = Date.now()) {
	if (status !== "queued" && status !== "executable") return false;
	if (!eta) return true;
	return nowMs >= eta.getTime();
}
//#endregion
//#region src/lib/server/governance-store.ts
var REQUIRED_APPROVALS = 4;
var DEFAULT_GOVERNANCE_PERMISSIONS = [
	"governance.view",
	"governance.proposal.create",
	"governance.proposal.approve",
	"governance.proposal.queue",
	"governance.proposal.execute",
	"governance.pause.trigger",
	"governance.reports.view",
	"governance.roles.manage"
];
function asIso(value) {
	return value ? value.toISOString() : void 0;
}
async function addAuditEntry(entry) {
	await db.insert(governanceAuditEntries).values({
		proposalId: entry.proposalId ?? null,
		action: entry.action,
		actorId: entry.actorId,
		actorName: entry.actorName,
		note: entry.note
	});
}
async function ensureQueueMaturity() {
	await db.update(governanceProposals).set({
		status: "executable",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(and(eq(governanceProposals.status, "queued"), isNotNull(governanceProposals.eta), lte(governanceProposals.eta, /* @__PURE__ */ new Date())));
}
async function hydrateProposals(rows) {
	if (rows.length === 0) return [];
	const proposalIds = rows.map((row) => row.id);
	const approvals = await db.select({
		proposalId: governanceProposalApprovals.proposalId,
		actorId: governanceProposalApprovals.actorId,
		actorName: governanceProposalApprovals.actorName
	}).from(governanceProposalApprovals).where(inArray(governanceProposalApprovals.proposalId, proposalIds));
	const approvalMap = /* @__PURE__ */ new Map();
	for (const approval of approvals) {
		const existing = approvalMap.get(approval.proposalId) ?? {
			ids: [],
			names: []
		};
		existing.ids.push(approval.actorId);
		existing.names.push(approval.actorName);
		approvalMap.set(approval.proposalId, existing);
	}
	return rows.map((row) => {
		const approvalState = approvalMap.get(row.id) ?? {
			ids: [],
			names: []
		};
		return {
			id: row.id,
			title: row.title,
			description: row.description,
			type: row.type,
			payload: row.payload ?? {},
			createdBy: row.createdBy,
			createdByName: row.createdByName,
			createdAt: row.createdAt.toISOString(),
			status: row.status,
			riskLevel: row.riskLevel,
			eta: asIso(row.eta),
			executedAt: asIso(row.executedAt),
			guardrailWarnings: row.guardrailWarnings ?? [],
			approvals: approvalState.ids,
			approvalNames: approvalState.names,
			requiredApprovals: row.requiredApprovals
		};
	});
}
async function listProposals() {
	await ensureQueueMaturity();
	return hydrateProposals(await db.select().from(governanceProposals).orderBy(desc(governanceProposals.createdAt)));
}
async function listAuditEntries() {
	return (await db.select().from(governanceAuditEntries).orderBy(desc(governanceAuditEntries.createdAt))).map((row) => ({
		id: row.id,
		proposalId: row.proposalId ?? void 0,
		action: row.action,
		actorId: row.actorId,
		actorName: row.actorName,
		note: row.note,
		createdAt: row.createdAt.toISOString()
	}));
}
async function createProposal(input, actor) {
	const [inserted] = await db.insert(governanceProposals).values({
		title: input.title,
		description: input.description,
		type: input.type,
		payload: input.payload,
		createdBy: input.createdBy,
		createdByName: input.createdByName,
		status: "submitted",
		riskLevel: input.riskLevel,
		guardrailWarnings: input.guardrailWarnings,
		requiredApprovals: REQUIRED_APPROVALS
	}).returning();
	await addAuditEntry({
		proposalId: inserted.id,
		action: "created",
		actorId: actor.id,
		actorName: actor.name,
		note: `Proposal created: ${inserted.title}`
	});
	const [proposal] = await hydrateProposals([inserted]);
	return proposal;
}
async function approveProposal(id, actor) {
	const [proposalRow] = await db.select().from(governanceProposals).where(eq(governanceProposals.id, id)).limit(1);
	if (!proposalRow) return null;
	if (proposalRow.status !== "submitted") {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}
	const [existing] = await db.select({ id: governanceProposalApprovals.id }).from(governanceProposalApprovals).where(and(eq(governanceProposalApprovals.proposalId, proposalRow.id), eq(governanceProposalApprovals.actorId, actor.id))).limit(1);
	if (!existing) {
		await db.insert(governanceProposalApprovals).values({
			proposalId: proposalRow.id,
			actorId: actor.id,
			actorName: actor.name
		});
		const [countRow] = await db.select({ total: count() }).from(governanceProposalApprovals).where(eq(governanceProposalApprovals.proposalId, proposalRow.id));
		const approvalsCount = Number(countRow?.total ?? 0);
		await addAuditEntry({
			proposalId: proposalRow.id,
			action: "approved",
			actorId: actor.id,
			actorName: actor.name,
			note: `Approval recorded (${approvalsCount}/${proposalRow.requiredApprovals})`
		});
	}
	const [freshRow] = await db.select().from(governanceProposals).where(eq(governanceProposals.id, proposalRow.id)).limit(1);
	const [proposal] = await hydrateProposals([freshRow ?? proposalRow]);
	return proposal;
}
async function queueProposal(id, actor) {
	const [proposalRow] = await db.select().from(governanceProposals).where(eq(governanceProposals.id, id)).limit(1);
	if (!proposalRow) return null;
	if (proposalRow.status !== "submitted") {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}
	const approvals = await db.select({ id: governanceProposalApprovals.id }).from(governanceProposalApprovals).where(eq(governanceProposalApprovals.proposalId, proposalRow.id));
	if (!isQueueable(proposalRow.status, approvals.length, proposalRow.requiredApprovals)) {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}
	const eta = new Date(Date.now() + getDelayMsForProposalType(proposalRow.type));
	const [queued] = await db.update(governanceProposals).set({
		status: "queued",
		eta,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(governanceProposals.id, proposalRow.id)).returning();
	await addAuditEntry({
		proposalId: proposalRow.id,
		action: "queued",
		actorId: actor.id,
		actorName: actor.name,
		note: `Queued with ETA ${eta.toISOString()}`
	});
	const [proposal] = await hydrateProposals([queued ?? proposalRow]);
	return proposal;
}
async function executeProposal(id, actor) {
	await ensureQueueMaturity();
	const [proposalRow] = await db.select().from(governanceProposals).where(eq(governanceProposals.id, id)).limit(1);
	if (!proposalRow) return null;
	if (proposalRow.status !== "queued" && proposalRow.status !== "executable") {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}
	if (!isExecutable(proposalRow.status, proposalRow.eta, Date.now())) {
		const [proposal] = await hydrateProposals([proposalRow]);
		return proposal;
	}
	const executedAt = /* @__PURE__ */ new Date();
	const [executed] = await db.update(governanceProposals).set({
		status: "executed",
		executedAt,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(governanceProposals.id, proposalRow.id)).returning();
	await addAuditEntry({
		proposalId: proposalRow.id,
		action: "executed",
		actorId: actor.id,
		actorName: actor.name,
		note: `Executed at ${executedAt.toISOString()}`
	});
	const [proposal] = await hydrateProposals([executed ?? proposalRow]);
	return proposal;
}
async function listQueue() {
	await ensureQueueMaturity();
	return hydrateProposals(await db.select().from(governanceProposals).where(inArray(governanceProposals.status, ["queued", "executable"])).orderBy(asc(governanceProposals.eta), asc(governanceProposals.createdAt)));
}
async function triggerPause(reason, actor) {
	const [active] = await db.select().from(governancePauseEvents).where(eq(governancePauseEvents.active, true)).orderBy(desc(governancePauseEvents.triggeredAt)).limit(1);
	if (active) return {
		id: active.id,
		reason: active.reason,
		triggeredBy: active.triggeredBy,
		triggeredByName: active.triggeredByName,
		triggeredAt: active.triggeredAt.toISOString(),
		active: active.active,
		resolvedAt: asIso(active.resolvedAt)
	};
	const [inserted] = await db.insert(governancePauseEvents).values({
		reason,
		triggeredBy: actor.id,
		triggeredByName: actor.name,
		active: true
	}).returning();
	await addAuditEntry({
		action: "pause_triggered",
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
async function getActivePause() {
	const [row] = await db.select().from(governancePauseEvents).where(eq(governancePauseEvents.active, true)).orderBy(desc(governancePauseEvents.triggeredAt)).limit(1);
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
async function listPauseEvents() {
	return (await db.select().from(governancePauseEvents).orderBy(desc(governancePauseEvents.triggeredAt))).map((row) => ({
		id: row.id,
		reason: row.reason,
		triggeredBy: row.triggeredBy,
		triggeredByName: row.triggeredByName,
		triggeredAt: row.triggeredAt.toISOString(),
		active: row.active,
		resolvedAt: asIso(row.resolvedAt)
	}));
}
async function getGovernancePermissionsForUser(userId) {
	const [membership] = await db.select({
		permissions: governanceMemberships.permissions,
		active: governanceMemberships.active
	}).from(governanceMemberships).where(eq(governanceMemberships.userId, userId)).limit(1);
	if (!membership || !membership.active) return DEFAULT_GOVERNANCE_PERMISSIONS;
	const permissions = membership.permissions ?? [];
	return permissions.length > 0 ? permissions : DEFAULT_GOVERNANCE_PERMISSIONS;
}
async function hasGovernancePermission(userId, permission) {
	const permissions = await getGovernancePermissionsForUser(userId);
	return permissions.includes("*") || permissions.includes(permission);
}
//#endregion
//#region src/lib/server/governance-auth.ts
async function getGovernanceActor(locals, requiredPermission) {
	const actor = await getAdminActor(locals);
	if (!actor) return {
		actor: null,
		allowed: false
	};
	return {
		actor,
		allowed: await hasGovernancePermission(actor.id, requiredPermission)
	};
}

export { DEFAULT_GOVERNANCE_PERMISSIONS as D, approveProposal as a, getGovernanceActor as b, createProposal as c, listPauseEvents as d, executeProposal as e, listProposals as f, getActivePause as g, listQueue as h, listAuditEntries as l, queueProposal as q, triggerPause as t };
//# sourceMappingURL=governance-auth-Bawc8d5Y.js.map
