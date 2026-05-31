import { type RequestHandler } from '@sveltejs/kit';
import { eventStream } from '$lib/server/sse';

/**
 * GET /api/admin/content/[id]/thread/stream
 *
 * Admin-only SSE feed mirroring the creator stream. Same topic so a single
 * publish hits both panels.
 */

export const GET: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return new Response('Forbidden', { status: 403 });
	return eventStream([`thread:${params.id}`]);
};
