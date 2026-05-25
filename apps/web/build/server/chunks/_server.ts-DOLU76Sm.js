import { j as json } from './index-BcOZ6EV9.js';
import { d as db, w as mediaWatchProgress, b as streaks, u as userAchievements, a as achievements } from './drizzle-CW7hPjGG.js';
import { and, eq, count } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

async function checkAndAwardAchievements(userId, profileId, event) {
  const awarded = [];
  const earned = await db.select({ code: userAchievements.achievementCode }).from(userAchievements).where(eq(userAchievements.userId, userId));
  const earnedCodes = new Set(earned.map((e) => e.code));
  const candidates = [];
  if (event.type === "watch_complete") {
    const totalWatched = await db.select({ count: count() }).from(mediaWatchProgress).where(and(eq(mediaWatchProgress.userId, userId), eq(mediaWatchProgress.isCompleted, true)));
    if ((totalWatched[0]?.count ?? 0) === 1) candidates.push("first_watch");
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour >= 0 && hour < 5) candidates.push("night_owl");
    if (hour >= 5 && hour < 7) candidates.push("early_bird");
  }
  if (event.type === "streak_update") {
    if (event.currentStreak >= 7) candidates.push("streak_7");
    if (event.currentStreak >= 30) candidates.push("streak_30");
  }
  if (event.type === "series_complete") {
    candidates.push("series_complete");
  }
  if (event.type === "referral") {
    candidates.push("referral_1");
  }
  for (const code of candidates) {
    if (earnedCodes.has(code)) continue;
    const achievement = await db.select().from(achievements).where(eq(achievements.code, code)).limit(1);
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
async function updateStreak(userId, profileId) {
  const now = /* @__PURE__ */ new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 864e5);
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
    await db.update(streaks).set({ currentStreak: 1, lastWatchDate: now, streakStartDate: now }).where(eq(streaks.userId, userId));
    return 1;
  }
  const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  if (lastDay.getTime() === today.getTime()) {
    return streak.currentStreak ?? 1;
  }
  let newStreak;
  if (lastDay.getTime() === yesterday.getTime()) {
    newStreak = (streak.currentStreak ?? 0) + 1;
  } else {
    newStreak = 1;
  }
  const longest = Math.max(newStreak, streak.longestStreak ?? 0);
  await db.update(streaks).set({ currentStreak: newStreak, longestStreak: longest, lastWatchDate: now, updatedAt: now }).where(eq(streaks.userId, userId));
  return newStreak;
}
const POST = async ({ request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { contentId, profileId, contentType, episodeId, positionSeconds, durationSeconds } = await request.json();
  const userId = session.user.id;
  const completionPercent = durationSeconds ? Math.round(positionSeconds / durationSeconds * 100) : 0;
  const isCompleted = completionPercent >= 90;
  const existing = await db.select().from(mediaWatchProgress).where(and(
    eq(mediaWatchProgress.userId, userId),
    eq(mediaWatchProgress.contentId, contentId),
    episodeId ? eq(mediaWatchProgress.episodeId, episodeId) : eq(mediaWatchProgress.contentId, contentId)
  )).limit(1);
  const now = /* @__PURE__ */ new Date();
  if (existing[0]) {
    await db.update(mediaWatchProgress).set({ positionSeconds, durationSeconds, completionPercent, isCompleted, updatedAt: now }).where(eq(mediaWatchProgress.id, existing[0].id));
  } else {
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
  }
  if (isCompleted && !existing[0]?.isCompleted) {
    const newStreak = await updateStreak(userId, profileId ?? null);
    const awarded = await checkAndAwardAchievements(userId, profileId ?? null, {
      type: "watch_complete"
    });
    await checkAndAwardAchievements(userId, profileId ?? null, {
      type: "streak_update",
      currentStreak: newStreak
    });
    return json({ success: true, completed: true, newStreak, awarded });
  }
  return json({ success: true, completed: isCompleted });
};

export { POST };
//# sourceMappingURL=_server.ts-DOLU76Sm.js.map
