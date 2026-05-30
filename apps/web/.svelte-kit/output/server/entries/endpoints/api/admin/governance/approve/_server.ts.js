import { r as approveProposal, t as getGovernanceActor } from "../../../../../../chunks/governance-auth.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/admin/governance/approve/+server.ts
var POST = async ({ locals, request }) => {
	const { actor, allowed } = await getGovernanceActor(locals, "governance.proposal.approve");
	if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
	const { proposalId } = await request.json();
	if (!proposalId) return json({ error: "proposalId required" }, { status: 400 });
	const proposal = await approveProposal(proposalId, {
		id: actor.id,
		name: actor.name
	});
	if (!proposal) return json({ error: "Proposal not found" }, { status: 404 });
	return json(proposal);
};
//#endregion
export { POST };
