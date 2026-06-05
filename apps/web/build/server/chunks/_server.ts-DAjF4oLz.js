import { b as getGovernanceActor, e as executeProposal } from './governance-auth-Bawc8d5Y.js';
import { j as json } from './index-Cv5VcsYq.js';
import './drizzle-CKUH7ukq.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './admin-auth-DwogZLlW.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

export { POST };
//# sourceMappingURL=_server.ts-DAjF4oLz.js.map
