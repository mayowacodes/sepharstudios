import { type RequestHandler } from '@sveltejs/kit';
import { eventStream } from '$lib/server/sse';
import { Role } from '$lib/constants';

/**
 * GET /api/creator/analytics/stream
 *
 * Per-creator SSE feed of `watch_start` / `watch_complete` events on
 * the creator's own content. Published from /api/watch/progress
 * scoped to the content's creatorId. Backs the "Live now" panel on
 * /creator/analytics.
 */
export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return new Response('Unauthorized', { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return new Response('Forbidden', { status: 403 });
	}
	return eventStream([`analytics:watch-events:creator:${session.user.id}`]);
};
