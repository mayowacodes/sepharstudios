import { json } from "@sveltejs/kit";
import { g as getGovernanceActor, q as queueProposal } from "../../../../../../chunks/governance-auth.js";
const POST = async ({ locals, request }) => {
  const { actor, allowed } = await getGovernanceActor(locals, "governance.proposal.queue");
  if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
  const { proposalId } = await request.json();
  if (!proposalId) return json({ error: "proposalId required" }, { status: 400 });
  const proposal = await queueProposal(proposalId, { id: actor.id, name: actor.name });
  if (!proposal) return json({ error: "Proposal not found" }, { status: 404 });
  if (proposal.status !== "queued") {
    return json(
      {
        error: "Proposal cannot be queued yet. It may need additional approvals.",
        proposal
      },
      { status: 409 }
    );
  }
  return json(proposal);
};
export {
  POST
};
