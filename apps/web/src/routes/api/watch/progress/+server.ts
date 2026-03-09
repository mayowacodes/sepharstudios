import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaWatchProgress } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { checkAndAwardAchievements, updateStreak } from '$lib/server/achievements';

// POST /api/watch/progress — save playback position (called every 30s)
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { contentId, profileId, contentType, episodeId, positionSeconds, durationSeconds } = await request.json() as {
		contentId: string;
		profileId?: string;
		contentType?: string;
		episodeId?: string;
		positionSeconds: number;
		durationSeconds?: number;
	};

	const userId = session.user.id;
	const completionPercent = durationSeconds ? Math.round((positionSeconds / durationSeconds) * 100) : 0;
	const isCompleted = completionPercent >= 90;

	// Upsert — update if exists, insert if not
	const existing = await db.select()
		.from(mediaWatchProgress)
		.where(and(
			eq(mediaWatchProgress.userId, userId),
			eq(mediaWatchProgress.contentId, contentId),
			episodeId ? eq(mediaWatchProgress.episodeId, episodeId) : eq(mediaWatchProgress.contentId, contentId)
		))
		.limit(1);

	const now = new Date();

	if (existing[0]) {
		await db.update(mediaWatchProgress)
			.set({ positionSeconds, durationSeconds, completionPercent, isCompleted, updatedAt: now })
			.where(eq(mediaWatchProgress.id, existing[0].id));
	} else {
		await db.insert(mediaWatchProgress).values({
			userId,
			profileId: profileId ?? null,
			contentId,
			contentType: contentType ?? 'movie',
			episodeId: episodeId ?? null,
			positionSeconds,
			durationSeconds,
			completionPercent,
			isCompleted
		});
	}

	// On completion, update streak and check achievements
	if (isCompleted && !existing[0]?.isCompleted) {
		const newStreak = await updateStreak(userId, profileId ?? null);
		const awarded = await checkAndAwardAchievements(userId, profileId ?? null, {
			type: 'watch_complete',
			contentId
		});
		await checkAndAwardAchievements(userId, profileId ?? null, {
			type: 'streak_update',
			currentStreak: newStreak
		});

		return json({ success: true, completed: true, newStreak, awarded });
	}

	return json({ success: true, completed: isCompleted });
};
