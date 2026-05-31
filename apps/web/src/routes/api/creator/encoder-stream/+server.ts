import { type RequestHandler } from '@sveltejs/kit';
import { eventStream } from '$lib/server/sse';
import { Role } from '$lib/constants';

/**
 * GET /api/creator/encoder-stream
 *
 * Server-Sent Events feed scoped to the signed-in creator. Each event is
 * a JSON object the webhook + cron broadcast on `encoder:creator:<id>`:
 *
 *   { jobId, mediaId, creatorId, status, progress, stage, error }
 *
 * Used by the upload wizard's "processing" screen + the creator content
 * list to render a live progress bar without polling.
 */

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return new Response('Unauthorized', { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return new Response('Forbidden', { status: 403 });
	}
	return eventStream([`encoder:creator:${session.user.id}`]);
};
