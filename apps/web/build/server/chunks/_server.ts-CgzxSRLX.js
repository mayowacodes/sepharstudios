import { b as getGovernanceActor, a as approveProposal } from './governance-auth-MOcI2nxc.js';
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

export { POST };
//# sourceMappingURL=_server.ts-CgzxSRLX.js.map
