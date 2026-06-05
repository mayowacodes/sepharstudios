import { w as db, c as achievements, ah as userAchievements, a8 as streaks } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-DVcblGer.js.map
