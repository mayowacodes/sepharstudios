import { g as getGovernanceActor, e as executeProposal } from './governance-auth-Pot4Aj6r.js';
import { j as json } from './index.js-DwRgOKlO.js';
import './drizzle-DlGuU73K.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './admin-auth-i1sA9-vE.js';

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
//# sourceMappingURL=_server.ts-CaUq9UG2.js.map
