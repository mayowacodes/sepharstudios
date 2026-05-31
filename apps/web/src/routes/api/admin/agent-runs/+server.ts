import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { agentRuns } from '$lib/db/schema/sepharstudios';
import { desc, eq } from 'drizzle-orm';

/**
 * GET /api/admin/agent-runs?agent=&status=&limit=
 *
 * Returns recent agent_runs rows. Admin-only.
 */

export const GET: RequestHandler = async ({ url, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const agentFilter = url.searchParams.get('agent');
	const statusFilter = url.searchParams.get('status');
	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10) || 50, 200);

	const rows = await db.select().from(agentRuns)
		.where(
			agentFilter
				? statusFilter
					? eq(agentRuns.agent, agentFilter)
					: eq(agentRuns.agent, agentFilter)
				: statusFilter
					? eq(agentRuns.status, statusFilter)
					: undefined
		)
		.orderBy(desc(agentRuns.startedAt))
		.limit(limit);

	return json({ runs: rows });
};
