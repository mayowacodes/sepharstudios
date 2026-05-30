import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, contentSubtitleTracks } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

/**
 * GET /api/content/[id]/subtitles
 *
 * Public read used by the watch page when fetching subtitle tracks for the
 * VideoPlayer. Visibility-gated: returns empty for `private` content unless
 * the caller is the creator. (Auth check is best-effort — the watch page
 * itself enforces a stricter access gate; this just avoids leaking labels.)
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const [content] = await db
		.select({
			id: mediaLibrary.id,
			visibility: mediaLibrary.visibility,
			isActive: mediaLibrary.isActive,
			creatorId: mediaLibrary.creatorId
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id!))
		.limit(1);

	if (!content) return json({ tracks: [] });

	if (content.visibility === 'private') {
		const session = await locals.auth.getSession();
		if (!session || session.user.id !== content.creatorId) {
			return json({ tracks: [] });
		}
	}

	const tracks = await db.select()
		.from(contentSubtitleTracks)
		.where(eq(contentSubtitleTracks.contentId, content.id));

	return json({ tracks });
};
