import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaWatchProgress, profiles, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, gte, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const profileId = url.searchParams.get('profileId');
	if (!profileId) return json({ error: 'profileId required' }, { status: 400 });

	// Verify the requesting user owns this profile
	const profile = await db
		.select({ userId: profiles.userId, name: profiles.name, type: profiles.type })
		.from(profiles)
		.where(eq(profiles.id, profileId))
		.then(r => r[0]);

	if (!profile || profile.userId !== session.user.id) {
		return json({ error: 'Profile not found' }, { status: 404 });
	}

	// Last 30 days
	const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

	const history = await db
		.select({
			contentId: mediaWatchProgress.contentId,
			positionSeconds: mediaWatchProgress.positionSeconds,
			durationSeconds: mediaWatchProgress.durationSeconds,
			completionPercent: mediaWatchProgress.completionPercent,
			updatedAt: mediaWatchProgress.updatedAt,
			title: mediaLibrary.title,
			mediaType: mediaLibrary.mediaType,
			thumbnail: mediaLibrary.thumbnail,
			ageRating: mediaLibrary.ageRating
		})
		.from(mediaWatchProgress)
		.leftJoin(mediaLibrary, eq(mediaWatchProgress.contentId, mediaLibrary.id))
		.where(
			eq(mediaWatchProgress.profileId, profileId)
		)
		.orderBy(desc(mediaWatchProgress.updatedAt))
		.limit(50);

	const totalSeconds = history.reduce((sum, h) => sum + (h.positionSeconds ?? 0), 0);
	const totalWatchHours = totalSeconds / 3600;

	return json({
		profile: { id: profileId, name: profile.name, type: profile.type },
		reportPeriod: { from: since.toISOString(), to: new Date().toISOString() },
		totalWatchHours: Math.round(totalWatchHours * 10) / 10,
		contentWatched: history.map(h => ({
			title: h.title,
			mediaType: h.mediaType,
			thumbnail: h.thumbnail,
			ageRating: h.ageRating,
			completionPercent: h.completionPercent,
			watchedAt: h.updatedAt
		}))
	});
};
