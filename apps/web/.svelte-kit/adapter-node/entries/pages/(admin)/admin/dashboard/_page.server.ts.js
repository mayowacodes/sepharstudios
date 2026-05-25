import { d as db, E as session, b as user } from "../../../../../chunks/drizzle.js";
import { error } from "@sveltejs/kit";
import { count, eq, sql } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "admin") {
    throw error(403, "Forbidden");
  }
  const deviceStats = await db.select({
    deviceType: session.deviceType,
    count: count()
  }).from(session).groupBy(session.deviceType);
  const recentSessions = await db.select({
    id: session.id,
    userAgent: session.userAgent,
    deviceType: session.deviceType,
    ipAddress: session.ipAddress,
    createdAt: session.createdAt,
    userName: user.name,
    userEmail: user.email
  }).from(session).innerJoin(user, eq(session.userId, user.id)).orderBy(sql`${session.createdAt} DESC`).limit(10);
  return {
    deviceStats,
    recentSessions
  };
};
export {
  load
};
