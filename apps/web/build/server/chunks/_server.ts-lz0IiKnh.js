import { j as json } from './index-BcOZ6EV9.js';
import { d as db, a as achievements, u as userAchievements, b as streaks } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ locals }) => {
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
    streak: streak[0] ?? { currentStreak: 0, longestStreak: 0, lastWatchDate: null }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-lz0IiKnh.js.map
