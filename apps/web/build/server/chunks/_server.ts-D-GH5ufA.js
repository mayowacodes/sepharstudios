import { w as db, N as mediaWatchProgress, aj as watchSessionMeta, a3 as reviews, X as playlists, W as playlistItems, ae as transactions, a8 as streaks, ah as userAchievements, c as achievements } from './drizzle-CKUH7ukq.js';
import { n as notify } from './notify-DpHZNtZn.js';
import { s as scoreWatchEngagement } from './ai-token-scoring-C5GY8B3x.js';
import { t as track } from './analytics-C04NmVoh.js';
import { f as fingerprintFromHeaders } from './ua-country-BNOH1xSS.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq, count } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './ai-provider-ZmR1UjfK.js';
import './ai-settings-b9zX_Yow.js';
import '@openpanel/sdk';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/lib/server/achievements.ts
/**
* Check and award any achievements earned by a user after an event.
* Returns array of newly awarded achievement codes.
*/
async function checkAndAwardAchievements(userId, profileId, event) {
	const awarded = [];
	const earned = await db.select({ code: userAchievements.achievementCode }).from(userAchievements).where(eq(userAchievements.userId, userId));
	const earnedCodes = new Set(earned.map((e) => e.code));
	const candidates = [];
	if (event.type === "watch_complete") {
		if (((await db.select({ count: count() }).from(mediaWatchProgress).where(and(eq(mediaWatchProgress.userId, userId), eq(mediaWatchProgress.isCompleted, true))))[0]?.count ?? 0) === 1) candidates.push("first_watch");
		const hour = (/* @__PURE__ */ new Date()).getHours();
		if (hour >= 0 && hour < 5) candidates.push("night_owl");
		if (hour >= 5 && hour < 7) candidates.push("early_bird");
	}
	if (event.type === "streak_update") {
		if (event.currentStreak >= 7) candidates.push("streak_7");
		if (event.currentStreak >= 30) candidates.push("streak_30");
	}
	if (event.type === "series_complete") candidates.push("series_complete");
	if (event.type === "referral") candidates.push("referral_1");
	for (const code of candidates) {
		if (earnedCodes.has(code)) continue;
		if (!(await db.select().from(achievements).where(eq(achievements.code, code)).limit(1))[0]) continue;
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
async function updateStreak(userId, profileId) {
	const now = /* @__PURE__ */ new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = /* @__PURE__ */ new Date(today.getTime() - 864e5);
	const existing = await db.select().from(streaks).where(eq(streaks.userId, userId)).limit(1);
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
		await db.update(streaks).set({
			currentStreak: 1,
			lastWatchDate: now,
			streakStartDate: now
		}).where(eq(streaks.userId, userId));
		return 1;
	}
	const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
	if (lastDay.getTime() === today.getTime()) return streak.currentStreak ?? 1;
	let newStreak;
	if (lastDay.getTime() === yesterday.getTime()) newStreak = (streak.currentStreak ?? 0) + 1;
	else newStreak = 1;
	const longest = Math.max(newStreak, streak.longestStreak ?? 0);
	await db.update(streaks).set({
		currentStreak: newStreak,
		longestStreak: longest,
		lastWatchDate: now,
		updatedAt: now
	}).where(eq(streaks.userId, userId));
	return newStreak;
}
//#endregion
//#region src/routes/api/watch/progress/+server.ts
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { contentId, profileId, contentType, episodeId, positionSeconds, durationSeconds } = await request.json();
	const userId = session.user.id;
	const completionPercent = durationSeconds ? Math.round(positionSeconds / durationSeconds * 100) : 0;
	const isCompleted = completionPercent >= 90;
	const existing = await db.select().from(mediaWatchProgress).where(and(eq(mediaWatchProgress.userId, userId), eq(mediaWatchProgress.contentId, contentId), episodeId ? eq(mediaWatchProgress.episodeId, episodeId) : eq(mediaWatchProgress.contentId, contentId))).limit(1);
	const now = /* @__PURE__ */ new Date();
	let justCompleted = false;
	if (existing[0]) if (isCompleted && !existing[0].isCompleted) {
		justCompleted = (await db.update(mediaWatchProgress).set({
			positionSeconds,
			durationSeconds,
			completionPercent,
			isCompleted: true,
			updatedAt: now
		}).where(and(eq(mediaWatchProgress.id, existing[0].id), eq(mediaWatchProgress.isCompleted, false))).returning({ id: mediaWatchProgress.id })).length > 0;
		if (!justCompleted) await db.update(mediaWatchProgress).set({
			positionSeconds,
			durationSeconds,
			completionPercent,
			updatedAt: now
		}).where(eq(mediaWatchProgress.id, existing[0].id));
	} else await db.update(mediaWatchProgress).set({
		positionSeconds,
		durationSeconds,
		completionPercent,
		isCompleted,
		updatedAt: now
	}).where(eq(mediaWatchProgress.id, existing[0].id));
	else {
		await db.insert(mediaWatchProgress).values({
			userId,
			profileId: profileId ?? null,
			contentId,
			contentType: contentType ?? "movie",
			episodeId: episodeId ?? null,
			positionSeconds,
			durationSeconds,
			completionPercent,
			isCompleted
		});
		justCompleted = isCompleted;
		const fp = fingerprintFromHeaders(request.headers);
		await db.insert(watchSessionMeta).values({
			userId,
			contentId,
			deviceType: fp.deviceType,
			browser: fp.browser,
			osName: fp.osName,
			country: fp.country
		}).catch((err) => console.warn("[watch/progress] watch_session_meta insert failed:", err));
	}
	if (justCompleted) {
		const newStreak = await updateStreak(userId, profileId ?? null);
		const awarded = await checkAndAwardAchievements(userId, profileId ?? null, {
			type: "watch_complete"});
		await checkAndAwardAchievements(userId, profileId ?? null, {
			type: "streak_update",
			currentStreak: newStreak
		});
		const [reviewRows, userPlaylists] = await Promise.all([db.select({ id: reviews.id }).from(reviews).where(and(eq(reviews.userId, userId), eq(reviews.contentId, contentId))).limit(1), db.select({ id: playlists.id }).from(playlists).where(eq(playlists.userId, userId))]);
		const existingReview = reviewRows[0];
		const addedToWatchlist = userPlaylists.map((p) => p.id).length > 0 && (await db.select({ id: playlistItems.id }).from(playlistItems).where(eq(playlistItems.contentId, contentId)).limit(1)).length > 0;
		const reward = await scoreWatchEngagement({
			completionPercent,
			watchTimeSeconds: positionSeconds,
			totalDurationSeconds: durationSeconds ?? 0,
			leftReview: !!existingReview,
			sharedContent: false,
			addedToWatchlist,
			baseStcReward: 10
		});
		const rewardAmount = reward?.recommendedStcReward ?? 0;
		if (rewardAmount > 0) await db.insert(transactions).values({
			id: crypto.randomUUID(),
			userId,
			type: "earn",
			amount: rewardAmount,
			currency: "STC",
			status: "pending",
			metadata: {
				contentId,
				completionPercent,
				engagementQuality: reward?.engagementQuality ?? null,
				tokenMultiplier: reward?.tokenMultiplier ?? null,
				source: "watch_complete"
			}
		}).catch((err) => console.error("[watch/progress] failed to write STC ledger row:", err));
		if (awarded.length > 0) await notify({
			userId,
			kind: "achievement",
			title: awarded.length === 1 ? "Achievement unlocked" : `${awarded.length} achievements unlocked`,
			message: rewardAmount > 0 ? `You earned ${rewardAmount} STC tokens. Check your earnings to see what's pending.` : `You unlocked new achievement${awarded.length === 1 ? "" : "s"}. Keep watching to earn more.`,
			actionUrl: "/my-studios?tab=recent"
		});
		await track(userId, "watch_complete", {
			contentId,
			completionPercent,
			stcEarned: rewardAmount,
			engagementQuality: reward?.engagementQuality ?? null,
			achievementsUnlocked: awarded.length
		});
		return json({
			success: true,
			completed: true,
			newStreak,
			awarded,
			reward: reward ?? null
		});
	}
	return json({
		success: true,
		completed: isCompleted
	});
};

export { POST };
//# sourceMappingURL=_server.ts-D-GH5ufA.js.map
