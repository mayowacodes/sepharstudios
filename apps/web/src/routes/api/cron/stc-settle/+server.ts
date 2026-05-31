import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { settleOneBatch } from '$lib/server/stc-settlement';

/**
 * POST /api/cron/stc-settle
 *
 * Periodically processes pending STC earn transactions: moves them from
 * `pending` to `completed` (off-chain) or transfers STC on-chain via the
 * treasury wallet and writes the resulting tx hash. Behavior is controlled
 * by env: see `lib/server/stc-settlement.ts` for the matrix.
 *
 * Recommended schedule: every 5 minutes when settlement is enabled.
 *
 * Auth: CRON_SECRET bearer.
 */

export const POST: RequestHandler = async ({ request, url }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) return json({ error: 'CRON_SECRET not configured' }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: 'Unauthorized' }, { status: 401 });

	const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get('limit') ?? '50', 10)));
	const result = await settleOneBatch(limit);
	return json({ ok: true, runAt: new Date().toISOString(), ...result });
};
