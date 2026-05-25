import { j as json } from './index-BcOZ6EV9.js';
import { d as db, D as userMilestones, w as mediaWatchProgress } from './drizzle-CW7hPjGG.js';
import { eq, sum } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const ALL_MILESTONES = [
  { code: "stc_100", name: "First 100 STC", description: "Earn your first 100 STC tokens", stcBonus: 0 },
  { code: "stc_500", name: "Halfway There", description: "Earn 500 STC tokens", stcBonus: 25 },
  { code: "stake_first", name: "Staker", description: "Stake STC tokens for the first time", stcBonus: 0 },
  { code: "stc_sub_first", name: "Free Month", description: "Redeem your first free month with STC", stcBonus: 0 },
  { code: "year_1", name: "1 Year Member", description: "Celebrate your first year on Sephar Studios", stcBonus: 50 },
  { code: "hours_1000", name: "1,000 Hours Watched", description: "Watch 1,000 total hours of content", stcBonus: 0 }
];
const GET = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const earned = await db.select().from(userMilestones).where(eq(userMilestones.userId, session.user.id));
  const earnedCodes = new Set(earned.map((m) => m.code));
  const watchRows = await db.select({ total: sum(mediaWatchProgress.durationSeconds) }).from(mediaWatchProgress).where(eq(mediaWatchProgress.userId, session.user.id));
  const totalSeconds = Number(watchRows[0]?.total ?? 0);
  const totalHours = Math.round(totalSeconds / 3600);
  return json({
    milestones: ALL_MILESTONES.map((m) => ({
      ...m,
      earned: earnedCodes.has(m.code),
      earnedAt: earned.find((e) => e.code === m.code)?.earnedAt ?? null
    })),
    stats: { totalHoursWatched: totalHours }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-jh4QJGNO.js.map
