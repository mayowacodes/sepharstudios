import { type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { eventStream } from '$lib/server/sse';
import { Role } from '$lib/constants';

/**
 * GET /api/creator/content/[id]/thread/stream
 *
 * SSE feed for the admin↔creator thread on this content row. Ownership
 * check: only the content's creator can subscribe.
 */

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return new Response('Unauthorized', { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return new Response('Forbidden', { status: 403 });
	}
	const [row] = await db.select({ creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id!))
		.limit(1);
	if (!row) return new Response('Not found', { status: 404 });
	if (row.creatorId !== session.user.id && session.user.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}
	return eventStream([`thread:${params.id}`]);
};
