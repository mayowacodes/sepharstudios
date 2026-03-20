import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { desc, eq } from 'drizzle-orm';
import { Role } from '$lib/constants';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const items = await db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			mediaType: mediaLibrary.mediaType,
			status: mediaLibrary.status,
			isActive: mediaLibrary.isActive,
			thumbnail: mediaLibrary.thumbnail,
			posterUrl: mediaLibrary.posterUrl,
			backdropUrl: mediaLibrary.backdropUrl,
			duration: mediaLibrary.duration,
			viewCount: mediaLibrary.viewCount,
			genres: mediaLibrary.genres,
			keywords: mediaLibrary.keywords,
			createdAt: mediaLibrary.createdAt,
			updatedAt: mediaLibrary.updatedAt,
			reviewNotes: mediaLibrary.reviewNotes,
			rejectionReason: mediaLibrary.rejectionReason
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.creatorId, session.user.id))
		.orderBy(desc(mediaLibrary.createdAt));

	return json(items);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const data = await request.json();
	const id = crypto.randomUUID();
	const title = String(data.title || '').trim();

	if (!title) return json({ error: 'Title is required' }, { status: 400 });

	try {
		await db.insert(mediaLibrary).values({
			id,
			title,
			description: data.description,
			mediaType: data.contentType,
			ageRating: data.ageRating,
			thumbnail: data.assets?.thumbnail,
			posterUrl: data.assets?.posterPortrait,
			backdropUrl: data.assets?.backdropHero,
			trailerUrl: data.trailerUrl || null,
			language: data.language || 'English',
			bibleReference: data.bibleReferences?.[0] || null,
			genres: data.genre || [],
			topics: data.themes || [],
			keywords: data.keywords || [],
			duration: data.duration?.toString() || null,
			isActive: false,
			isNew: true,
			status: 'submitted',
			creatorId: session.user.id,
			slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id.slice(0, 5)}`,
			link: `/watch/${id}`,
			videoUrl: data.videoUrl || ''
		});

		return json({ success: true, contentId: id });
	} catch (error) {
		console.error('Content submission error:', error);
		return json({ error: 'Failed to save content metadata' }, { status: 500 });
	}
};
