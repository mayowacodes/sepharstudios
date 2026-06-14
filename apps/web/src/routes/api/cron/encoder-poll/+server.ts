import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * POST /api/cron/encoder-poll
 *
 * Pull-only fallback for environments where the encoder couldn't push
 * webhooks. With Temporal the workflow emits status webhooks reliably
 * (retries are declarative on the activity's RetryPolicy), so this poll
 * is no longer needed and the function is a no-op.
 *
 * Kept around as a stable endpoint so existing cron schedules in Dokploy
 * don't 404 on the next tick. Can be deleted once that cron is removed
 * from the scheduler.
 */

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) return json({ error: 'CRON_SECRET not configured' }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: 'Unauthorized' }, { status: 401 });

	return json({ ok: true, polled: 0, updated: 0, notified: 0, note: 'Temporal pushes webhooks directly; this poll is now a no-op.' });
};
