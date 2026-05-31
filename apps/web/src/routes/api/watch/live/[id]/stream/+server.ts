import { type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { liveStreams } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { eventStream } from '$lib/server/sse';

/**
 * GET /api/watch/live/[id]/stream
 *
 * SSE feed of viewer-facing live state for one stream. Open to any
 * authenticated viewer; private streams blocked.
 */

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const [stream] = await db.select({ visibility: liveStreams.visibility, creatorId: liveStreams.creatorId })
		.from(liveStreams)
		.where(eq(liveStreams.id, params.id!))
		.limit(1);
	if (!stream) return new Response('Not found', { status: 404 });
	if (stream.visibility === 'private' && stream.creatorId !== session.user.id) {
		return new Response('Forbidden', { status: 403 });
	}

	return eventStream([`live:${params.id}`]);
};
