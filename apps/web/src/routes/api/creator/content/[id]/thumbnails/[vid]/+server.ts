import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { contentThumbnailVariants, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * DELETE /api/creator/content/[id]/thumbnails/[vid]
 *
 * Removes a variant. Ownership check on the parent content row.
 */

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const [content] = await db.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id!))
		.limit(1);
	if (!content) return json({ error: 'Not found' }, { status: 404 });
	if (content.creatorId !== session.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	await db.delete(contentThumbnailVariants)
		.where(and(
			eq(contentThumbnailVariants.id, params.vid!),
			eq(contentThumbnailVariants.contentId, content.id)
		));

	return json({ success: true });
};
