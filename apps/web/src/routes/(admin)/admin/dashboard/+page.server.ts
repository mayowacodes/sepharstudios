import { db } from '$lib/db/drizzle';
import { session, user } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { count, eq, sql } from 'drizzle-orm';

export const load = async ({ locals }) => {
  // 1. Authorization Check (already handled by hooks, but good to be safe)
  if (!locals.user || locals.user.role !== 'admin') {
    throw error(403, 'Forbidden');
  }

  // 2. Fetch Session Stats by Device Type
  const deviceStats = await db
    .select({
      deviceType: session.deviceType,
      count: count(),
    })
    .from(session)
    .groupBy(session.deviceType);

  // 3. Fetch Recent Active Sessions with User Info
  const recentSessions = await db
    .select({
      id: session.id,
      userAgent: session.userAgent,
      deviceType: session.deviceType,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      userName: user.name,
      userEmail: user.email,
    })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .orderBy(sql`${session.createdAt} DESC`)
    .limit(10);

  return {
    deviceStats,
    recentSessions
  };
};
