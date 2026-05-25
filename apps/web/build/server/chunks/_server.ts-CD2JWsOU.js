import { j as json } from './index-BcOZ6EV9.js';
import { g as getGovernanceActor, q as queueProposal } from './governance-auth-C645BtCl.js';
import './utils-FiC4zhrQ.js';
import './drizzle-CW7hPjGG.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

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

export { POST };
//# sourceMappingURL=_server.ts-CD2JWsOU.js.map
