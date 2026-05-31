import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { executeAgent, agentsEnabled } from '$lib/server/agents/runtime';
import { abuseTriageAgent } from '$lib/server/agents/abuse-triage';
import { anomalyWatchAgent } from '$lib/server/agents/anomaly-watch';
import { contentQualityAuditorAgent } from '$lib/server/agents/content-quality-auditor';
import { theologyMonitorAgent } from '$lib/server/agents/theology-monitor';

/**
 * POST /api/cron/agents/[name]
 *
 * Single entry point for all autonomous agents. Each cron job hits a
 * distinct name. Bearer-gated by CRON_SECRET; additionally gated by the
 * AI_AGENTS_ENABLED=true kill-switch (defaults OFF).
 *
 * Recommended schedule:
 *   abuse-triage             — daily 02:00 UTC
 *   anomaly-watch            — hourly
 *   theology-monitor         — daily 03:00 UTC
 *   content-quality-auditor  — quarterly (cron with @reboot+monthly skip)
 */

const REGISTRY = {
	'abuse-triage': abuseTriageAgent,
	'anomaly-watch': anomalyWatchAgent,
	'content-quality-auditor': contentQualityAuditorAgent,
	'theology-monitor': theologyMonitorAgent
};

export const POST: RequestHandler = async ({ params, request }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) return json({ error: 'CRON_SECRET not configured' }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: 'Unauthorized' }, { status: 401 });

	if (!agentsEnabled()) {
		return json({ skipped: true, reason: 'AI_AGENTS_ENABLED is not true' });
	}

	const name = params.name as keyof typeof REGISTRY | undefined;
	const agent = name ? REGISTRY[name] : undefined;
	if (!agent) {
		return json({ error: `Unknown agent: ${name}` }, { status: 404 });
	}

	const result = await executeAgent(agent);
	return json(result);
};
