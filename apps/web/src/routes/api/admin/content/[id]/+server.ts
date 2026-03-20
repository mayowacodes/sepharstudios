import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const contentId = params.id;
	if (!contentId) return json({ error: 'Missing content ID' }, { status: 400 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const item = await db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			mediaType: mediaLibrary.mediaType,
			ageRating: mediaLibrary.ageRating,
			thumbnail: mediaLibrary.thumbnail,
			posterUrl: mediaLibrary.posterUrl,
			backdropUrl: mediaLibrary.backdropUrl,
			trailerUrl: mediaLibrary.trailerUrl,
			videoUrl: mediaLibrary.videoUrl,
			duration: mediaLibrary.duration,
			genres: mediaLibrary.genres,
			topics: mediaLibrary.topics,
			keywords: mediaLibrary.keywords,
			language: mediaLibrary.language,
			bibleReference: mediaLibrary.bibleReference,
			status: mediaLibrary.status,
			isActive: mediaLibrary.isActive,
			createdAt: mediaLibrary.createdAt,
			reviewNotes: mediaLibrary.reviewNotes,
			rejectionReason: mediaLibrary.rejectionReason,
			creatorId: mediaLibrary.creatorId,
			creatorName: user.name,
			creatorEmail: user.email
		})
		.from(mediaLibrary)
		.leftJoin(user, eq(mediaLibrary.creatorId, user.id))
		.where(eq(mediaLibrary.id, contentId))
		.then(r => r[0]);

	if (!item) return json({ error: 'Content not found' }, { status: 404 });
	return json(item);
};
