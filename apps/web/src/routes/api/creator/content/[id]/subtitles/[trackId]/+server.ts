import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, contentSubtitleTracks } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [content] = await db.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id!))
		.limit(1);
	if (!content) return json({ error: 'Content not found' }, { status: 404 });
	if (content.creatorId !== session.user.id) return json({ error: 'Forbidden' }, { status: 403 });

	const result = await db.delete(contentSubtitleTracks)
		.where(and(
			eq(contentSubtitleTracks.id, params.trackId!),
			eq(contentSubtitleTracks.contentId, content.id)
		))
		.returning({ id: contentSubtitleTracks.id });

	if (result.length === 0) return json({ error: 'Track not found' }, { status: 404 });
	return json({ success: true });
};
