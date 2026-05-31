import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { contentThumbnailVariants, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * POST /api/creator/content/[id]/thumbnails/[vid]/promote
 *
 * Marks a variant as the winner and copies its URL into the parent row's
 * `thumbnail` field. Clears `isWinner` on all sibling variants.
 */

export const POST: RequestHandler = async ({ params, locals }) => {
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

	const [variant] = await db.select()
		.from(contentThumbnailVariants)
		.where(and(
			eq(contentThumbnailVariants.id, params.vid!),
			eq(contentThumbnailVariants.contentId, content.id)
		))
		.limit(1);
	if (!variant) return json({ error: 'Variant not found' }, { status: 404 });

	await db.transaction(async (tx) => {
		await tx.update(contentThumbnailVariants)
			.set({ isWinner: false })
			.where(eq(contentThumbnailVariants.contentId, content.id));
		await tx.update(contentThumbnailVariants)
			.set({ isWinner: true })
			.where(eq(contentThumbnailVariants.id, variant.id));
		await tx.update(mediaLibrary)
			.set({ thumbnail: variant.url, updatedAt: new Date() })
			.where(eq(mediaLibrary.id, content.id));
	});

	return json({ success: true });
};
