import { type RequestHandler } from '@sveltejs/kit';
import { eventStream } from '$lib/server/sse';

/**
 * GET /api/admin/analytics/stream
 *
 * Admin-only SSE feed of every `watch_start` and `watch_complete` event
 * happening on the platform right now. Published from
 * /api/watch/progress on real watch transitions. Backs the "Live now"
 * panel on /admin/analytics.
 */
export const GET: RequestHandler = async ({ locals }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}
	return eventStream(['analytics:watch-events:all']);
};
