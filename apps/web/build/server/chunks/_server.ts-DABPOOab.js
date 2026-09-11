import { d as db, a as achievements, u as userAchievements, s as streaks } from './drizzle-C3SH12nS.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

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

export { GET };
//# sourceMappingURL=_server.ts-DABPOOab.js.map
