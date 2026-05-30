import { b as getGovernanceActor, q as queueProposal } from './governance-auth-MOcI2nxc.js';
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

//#region src/routes/api/admin/governance/queue/+server.ts
var POST = async ({ locals, request }) => {
	const { actor, allowed } = await getGovernanceActor(locals, "governance.proposal.queue");
	if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
	const { proposalId } = await request.json();
	if (!proposalId) return json({ error: "proposalId required" }, { status: 400 });
	const proposal = await queueProposal(proposalId, {
		id: actor.id,
		name: actor.name
	});
	if (!proposal) return json({ error: "Proposal not found" }, { status: 404 });
	if (proposal.status !== "queued") return json({
		error: "Proposal cannot be queued yet. It may need additional approvals.",
		proposal
	}, { status: 409 });
	return json(proposal);
};

export { POST };
//# sourceMappingURL=_server.ts-H7_QqlpH.js.map
