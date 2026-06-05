import { b as getGovernanceActor, f as listProposals, l as listAuditEntries } from './governance-auth-Bawc8d5Y.js';
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

//#region src/routes/api/admin/governance/reports/+server.ts
var GET = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, "governance.reports.view");
	if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
	const proposals = await listProposals();
	const audit = await listAuditEntries();
	const total = proposals.length;
	const executed = proposals.filter((p) => p.status === "executed").length;
	const queued = proposals.filter((p) => p.status === "queued" || p.status === "executable").length;
	return json({
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		summary: {
			totalProposals: total,
			executedProposals: executed,
			queuedProposals: queued,
			executionRate: total > 0 ? Number((executed / total * 100).toFixed(2)) : 0
		},
		entries: proposals.slice(0, 100),
		auditEntries: audit.slice(0, 200)
	});
};

export { GET };
//# sourceMappingURL=_server.ts-Cxxgy1cQ.js.map
