import { db } from '$lib/db/drizzle';
import { userAchievements, achievements, streaks, mediaWatchProgress } from '$lib/db/schema/sepharstudios';
import { eq, and, count, sql } from 'drizzle-orm';

export type AchievementEvent =
	| { type: 'watch_complete'; contentId: string }
	| { type: 'streak_update'; currentStreak: number }
	| { type: 'series_complete'; seriesId: string }
	| { type: 'referral' };

/**
 * Check and award any achievements earned by a user after an event.
 * Returns array of newly awarded achievement codes.
 */
export async function checkAndAwardAchievements(
	userId: string,
	profileId: string | null,
	event: AchievementEvent
): Promise<string[]> {
	const awarded: string[] = [];

	// Get already-earned achievements to avoid duplicates
	const earned = await db.select({ code: userAchievements.achievementCode })
		.from(userAchievements)
		.where(eq(userAchievements.userId, userId));
	const earnedCodes = new Set(earned.map((e) => e.code));

	const candidates: string[] = [];

	if (event.type === 'watch_complete') {
		// First watch ever?
		const totalWatched = await db.select({ count: count() })
			.from(mediaWatchProgress)
			.where(and(eq(mediaWatchProgress.userId, userId), eq(mediaWatchProgress.isCompleted, true)));
		if ((totalWatched[0]?.count ?? 0) === 1) candidates.push('first_watch');

		// Check watch time for milestones (night owl / early bird)
		const hour = new Date().getHours();
		if (hour >= 0 && hour < 5) candidates.push('night_owl');
		if (hour >= 5 && hour < 7) candidates.push('early_bird');
	}

	if (event.type === 'streak_update') {
		if (event.currentStreak >= 7) candidates.push('streak_7');
		if (event.currentStreak >= 30) candidates.push('streak_30');
	}

	if (event.type === 'series_complete') {
		candidates.push('series_complete');
	}

	if (event.type === 'referral') {
		candidates.push('referral_1');
	}

	// Award candidates not already earned
	for (const code of candidates) {
		if (earnedCodes.has(code)) continue;

		const achievement = await db.select()
			.from(achievements)
			.where(eq(achievements.code, code))
			.limit(1);

		if (!achievement[0]) continue;

		await db.insert(userAchievements).values({
			userId,
			profileId,
			achievementCode: code,
			stcAwarded: false
		});

		awarded.push(code);
	}

	return awarded;
}

/**
 * Update user streak after a watch event. Returns the new streak count.
 */
export async function updateStreak(userId: string, profileId: string | null): Promise<number> {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today.getTime() - 86400000);

	const existing = await db.select()
		.from(streaks)
		.where(eq(streaks.userId, userId))
		.limit(1);

	if (!existing[0]) {
		await db.insert(streaks).values({
			userId,
			profileId,
			currentStreak: 1,
			longestStreak: 1,
			lastWatchDate: now,
			streakStartDate: now
		});
		return 1;
	}

	const streak = existing[0];
	const lastDate = streak.lastWatchDate ? new Date(streak.lastWatchDate) : null;

	if (!lastDate) {
		await db.update(streaks).set({ currentStreak: 1, lastWatchDate: now, streakStartDate: now }).where(eq(streaks.userId, userId));
		return 1;
	}

	const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

	if (lastDay.getTime() === today.getTime()) {
		// Already watched today, no change
		return streak.currentStreak ?? 1;
	}

	let newStreak: number;
	if (lastDay.getTime() === yesterday.getTime()) {
		// Continued streak
		newStreak = (streak.currentStreak ?? 0) + 1;
	} else {
		// Streak broken
		newStreak = 1;
	}

	const longest = Math.max(newStreak, streak.longestStreak ?? 0);
	await db.update(streaks)
		.set({ currentStreak: newStreak, longestStreak: longest, lastWatchDate: now, updatedAt: now })
		.where(eq(streaks.userId, userId));

	return newStreak;
}
