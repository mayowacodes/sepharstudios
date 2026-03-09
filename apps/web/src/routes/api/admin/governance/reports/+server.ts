import { json, type RequestHandler } from '@sveltejs/kit';
import { getGovernanceActor } from '$lib/server/governance-auth';
import { listAuditEntries, listProposals } from '$lib/server/governance-store';

export const GET: RequestHandler = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, 'governance.reports.view');
	if (!allowed) return json({ error: 'Forbidden' }, { status: 403 });

	const proposals = await listProposals();
	const audit = await listAuditEntries();
	const total = proposals.length;
	const executed = proposals.filter((p) => p.status === 'executed').length;
	const queued = proposals.filter((p) => p.status === 'queued' || p.status === 'executable').length;

	return json({
		generatedAt: new Date().toISOString(),
		summary: {
			totalProposals: total,
			executedProposals: executed,
			queuedProposals: queued,
			executionRate: total > 0 ? Number(((executed / total) * 100).toFixed(2)) : 0
		},
		entries: proposals.slice(0, 100),
		auditEntries: audit.slice(0, 200)
	});
};
