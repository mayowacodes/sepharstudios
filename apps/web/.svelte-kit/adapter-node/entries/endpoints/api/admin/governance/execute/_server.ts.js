import { json } from "@sveltejs/kit";
import { g as getGovernanceActor, e as executeProposal } from "../../../../../../chunks/governance-auth.js";
const POST = async ({ locals, request }) => {
  const { actor, allowed } = await getGovernanceActor(locals, "governance.proposal.execute");
  if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
  const { proposalId } = await request.json();
  if (!proposalId) return json({ error: "proposalId required" }, { status: 400 });
  const proposal = await executeProposal(proposalId, { id: actor.id, name: actor.name });
  if (!proposal) return json({ error: "Proposal not found" }, { status: 404 });
  if (proposal.status !== "executed") {
    return json({ error: "Proposal not yet executable", proposal }, { status: 409 });
  }
  return json(proposal);
};
export {
  POST
};
