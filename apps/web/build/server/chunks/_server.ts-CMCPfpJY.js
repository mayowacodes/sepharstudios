import { d as db, F as session, c as user } from './drizzle-CsnNxG5m.js';
import { j as json, e as error } from './index.js-BP8aAXBX.js';
import { count, eq, sql } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/dashboard/+server.ts
/**
* GET /api/admin/dashboard  →  { deviceStats, recentSessions }
*
* Session analytics for the admin dashboard, moved off the page's server load
* so the native bundle can render the route.
*
* The role check is NOT redundant with the layout guard. `(admin)/admin/
* +layout.ts` is a universal load, so on native it runs in the WebView where a
* determined caller can simply not run it — and this endpoint returns other
* users' emails, IP addresses and user agents. It is the real boundary.
*/
async function buildDashboardPayload({ locals }) {
	if (!locals.user || locals.user.role !== "admin") throw error(403, "Forbidden");
	const [deviceStats, recentSessions] = await Promise.all([db.select({
		deviceType: session.deviceType,
		count: count()
	}).from(session).groupBy(session.deviceType), db.select({
		id: session.id,
		userAgent: session.userAgent,
		deviceType: session.deviceType,
		ipAddress: session.ipAddress,
		createdAt: session.createdAt,
		userName: user.name,
		userEmail: user.email
	}).from(session).innerJoin(user, eq(session.userId, user.id)).orderBy(sql`${session.createdAt} DESC`).limit(10)]);
	return {
		deviceStats,
		recentSessions
	};
}
var GET = async (event) => json(await buildDashboardPayload(event));

export { GET };
//# sourceMappingURL=_server.ts-CMCPfpJY.js.map
