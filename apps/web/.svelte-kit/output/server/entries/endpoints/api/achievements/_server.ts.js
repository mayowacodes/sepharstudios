import { Z as streaks, nt as userAchievements, o as achievements, t as db } from "../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/achievements/+server.ts
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [allAchievements, earned, streak] = await Promise.all([
		db.select().from(achievements),
		db.select().from(userAchievements).where(eq(userAchievements.userId, session.user.id)),
		db.select().from(streaks).where(eq(streaks.userId, session.user.id)).limit(1)
	]);
	const earnedCodes = new Set(earned.map((e) => e.achievementCode));
	return json({
		achievements: allAchievements.map((a) => ({
			...a,
			earned: earnedCodes.has(a.code),
			earnedAt: earned.find((e) => e.achievementCode === a.code)?.earnedAt ?? null
		})),
		streak: streak[0] ?? {
			currentStreak: 0,
			longestStreak: 0,
			lastWatchDate: null
		}
	});
};
//#endregion
export { GET };
