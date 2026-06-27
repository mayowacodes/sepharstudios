import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { agentRuns } from '$lib/db/schema/sepharstudios';
import { desc } from 'drizzle-orm';

/**
 * GET /api/admin/agents/status
 *
 * Diagnostic endpoint for the /admin/ai-runs page. Tells the admin
 * WHY the runs table might be empty:
 *   - enabled=false → AI_AGENTS_ENABLED env var is off; runs never start
 *   - enabled=true + no recent run → cron isn't firing the agents
 *
 * Returns:
 *   { enabled: boolean, lastRunAt: string | null }
 */
export const GET: RequestHandler = async ({ locals }) => {
	if (locals.user?.role !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const enabled = (env.AI_AGENTS_ENABLED ?? '').toLowerCase() === 'true';

	let lastRunAt: string | null = null;
	try {
		const [row] = await db
			.select({ startedAt: agentRuns.startedAt })
			.from(agentRuns)
			.orderBy(desc(agentRuns.startedAt))
			.limit(1);
		lastRunAt = row?.startedAt ? new Date(row.startedAt).toISOString() : null;
	} catch (err) {
		console.warn('[admin/agents/status] lastRunAt query failed', err);
	}

	return json({ enabled, lastRunAt });
};
