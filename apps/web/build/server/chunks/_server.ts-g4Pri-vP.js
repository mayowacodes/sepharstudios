import { b as getGovernanceActor, f as listProposals, c as createProposal } from './governance-auth-MOcI2nxc.js';
import { j as json } from './index-5kYmxIr9.js';
import './drizzle-BjmsPAPl.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './admin-auth-Cru3g_J0.js';
import './index-DBqjc0Yf.js';

//#region src/lib/server/governance-validation.ts
function assessRisk(type, payload) {
	if (type === "emergency_action") return "high";
	if (type === "policy_change") return "high";
	if (type === "treasury_action") return "medium";
	if (type === "parameter_update") {
		const percent = Number(payload.changePercent ?? 0);
		if (Math.abs(percent) >= 15) return "high";
		if (Math.abs(percent) >= 5) return "medium";
		return "low";
	}
	return "low";
}
function getGuardrailWarnings(type, payload) {
	const warnings = [];
	const percent = Number(payload.changePercent ?? 0);
	if (type === "parameter_update") {
		if (Number.isFinite(percent) && Math.abs(percent) > 10) warnings.push("Parameter change exceeds 10%; supermajority review is recommended.");
		if (Number.isFinite(percent) && Math.abs(percent) > 25) warnings.push("Change exceeds hard policy comfort range (25%).");
	}
	if (type === "policy_change") warnings.push("Policy changes use extended timelock and require high scrutiny.");
	if (type === "emergency_action") warnings.push("Emergency action should include incident ID and postmortem commitment.");
	return warnings;
}
function getHardValidationErrors(type, payload) {
	const errors = [];
	if (type === "parameter_update") {
		const percent = Number(payload.changePercent);
		if (!Number.isFinite(percent)) errors.push("parameter_update requires numeric payload.changePercent");
		else if (Math.abs(percent) > 25) errors.push("parameter_update changePercent cannot exceed 25% in either direction");
	}
	if (type === "emergency_action") {
		const incidentId = String(payload.incidentId ?? "").trim();
		const postmortemEta = String(payload.postmortemEta ?? "").trim();
		if (!incidentId) errors.push("emergency_action requires payload.incidentId");
		if (!postmortemEta) errors.push("emergency_action requires payload.postmortemEta");
	}
	return errors;
}
//#endregion
//#region src/routes/api/admin/governance/proposals/+server.ts
var GET = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, "governance.view");
	if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
	return json(await listProposals());
};
var POST = async ({ locals, request }) => {
	const { actor, allowed } = await getGovernanceActor(locals, "governance.proposal.create");
	if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json();
	if (!body.title || !body.description || !body.type) return json({ error: "title, description, and type are required" }, { status: 400 });
	const payload = body.payload ?? {};
	const validationErrors = getHardValidationErrors(body.type, payload);
	if (validationErrors.length > 0) return json({
		error: validationErrors[0],
		details: validationErrors
	}, { status: 400 });
	return json(createProposal({
		title: body.title,
		description: body.description,
		type: body.type,
		payload,
		createdBy: actor.id,
		createdByName: actor.name,
		riskLevel: assessRisk(body.type, payload),
		guardrailWarnings: getGuardrailWarnings(body.type, payload)
	}, actor), { status: 201 });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-g4Pri-vP.js.map
