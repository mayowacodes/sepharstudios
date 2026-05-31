import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * POST /api/admin/agents/[name]/fire
 *
 * Admin-only proxy that fires an agent run on demand. The underlying
 * `/api/cron/agents/[name]` endpoint requires CRON_SECRET, which we
 * can't send from the browser — this proxy auth-gates on the admin
 * session and then attaches the secret server-side.
 *
 * Names mirror the cron registry: abuse-triage, anomaly-watch,
 * theology-monitor, content-quality-auditor.
 */

const ALLOWED_NAMES = new Set([
	'abuse-triage',
	'anomaly-watch',
	'theology-monitor',
	'content-quality-auditor'
]);

export const POST: RequestHandler = async ({ params, locals, fetch }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const name = params.name;
	if (!name || !ALLOWED_NAMES.has(name)) {
		return json({ error: 'Unknown agent name' }, { status: 400 });
	}

	const secret = env.CRON_SECRET;
	if (!secret) return json({ error: 'CRON_SECRET not configured' }, { status: 500 });

	// Same-origin internal fetch — SvelteKit's `fetch` shortcut routes
	// through the local handler without an extra TCP hop.
	const res = await fetch(`/api/cron/agents/${name}`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${secret}` }
	});

	const text = await res.text();
	let body: unknown;
	try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }

	return json(
		{ ok: res.ok, agent: name, upstream: body },
		{ status: res.ok ? 200 : res.status }
	);
};
