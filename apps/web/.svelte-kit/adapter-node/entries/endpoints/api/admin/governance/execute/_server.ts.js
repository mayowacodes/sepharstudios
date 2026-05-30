import { a as executeProposal, t as getGovernanceActor } from "../../../../../../chunks/governance-auth.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/admin/governance/execute/+server.ts
var POST = async ({ locals, request }) => {
	const { actor, allowed } = await getGovernanceActor(locals, "governance.proposal.execute");
	if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
	const { proposalId } = await request.json();
	if (!proposalId) return json({ error: "proposalId required" }, { status: 400 });
	const proposal = await executeProposal(proposalId, {
		id: actor.id,
		name: actor.name
	});
	if (!proposal) return json({ error: "Proposal not found" }, { status: 404 });
	if (proposal.status !== "executed") return json({
		error: "Proposal not yet executable",
		proposal
	}, { status: 409 });
	return json(proposal);
};
//#endregion
export { POST };
