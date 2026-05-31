import { type RequestHandler } from '@sveltejs/kit';
import { eventStream } from '$lib/server/sse';

/**
 * GET /api/admin/encoder-stream
 *
 * Admin-only SSE feed of every encoder job's transitions. Backs the
 * system-health page's live encoder table.
 */

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}
	return eventStream(['encoder:all']);
};
