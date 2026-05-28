import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaWatchProgress, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq, desc, ne } from 'drizzle-orm';

// GET /api/watch/history — continue watching list for current profile
export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const user = locals.user;
		if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

		const profileId = url.searchParams.get('profileId');
		const limit = Number(url.searchParams.get('limit') ?? '10');

		const rows = await db.select({
			progress: mediaWatchProgress,
			content: {
				id: mediaLibrary.id,
				title: mediaLibrary.title,
				thumbnail: mediaLibrary.thumbnail,
				posterUrl: mediaLibrary.posterUrl,
				mediaType: mediaLibrary.mediaType,
				duration: mediaLibrary.duration
			}
		})
			.from(mediaWatchProgress)
			.innerJoin(mediaLibrary, eq(mediaWatchProgress.contentId, mediaLibrary.id))
			.where(and(
				eq(mediaWatchProgress.userId, user.id),
				ne(mediaWatchProgress.isCompleted, true),
				profileId ? eq(mediaWatchProgress.profileId, profileId) : undefined
			))
			.orderBy(desc(mediaWatchProgress.updatedAt))
			.limit(limit);

		return json(rows.map((r) => ({
			...r.content,
			positionSeconds: r.progress.positionSeconds,
			durationSeconds: r.progress.durationSeconds,
			completionPercent: r.progress.completionPercent,
			lastWatched: r.progress.updatedAt
		})));
	} catch (e) {
		console.error('GET /api/watch/history failed', e);
		return json({ error: 'Failed to load watch history' }, { status: 500 });
	}
};
