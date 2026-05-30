import { b as events, t as db, y as eventRegistrations } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
//#region src/routes/api/events/[id]/+server.ts
/**
* GET /api/events/[id]
*
* Single event detail. Includes the meeting URL ONLY if:
*   - the current user is registered AND status='confirmed', OR
*   - the event is past + has a recording URL set.
*
* This stops a casual viewer from copy-pasting the Zoom link without signing up.
*/
var GET = async ({ params, locals }) => {
	const [event] = await db.select().from(events).where(eq(events.id, params.id)).limit(1);
	if (!event) return json({ error: "Event not found" }, { status: 404 });
	const [countRow] = await db.select({ count: sql`count(*)::int` }).from(eventRegistrations).where(and(eq(eventRegistrations.eventId, event.id), eq(eventRegistrations.status, "confirmed")));
	const registeredCount = Number(countRow?.count ?? 0);
	const session = await locals.auth.getSession().catch(() => null);
	let isRegistered = false;
	if (session) {
		const [reg] = await db.select({ id: eventRegistrations.id }).from(eventRegistrations).where(and(eq(eventRegistrations.eventId, event.id), eq(eventRegistrations.userId, session.user.id), eq(eventRegistrations.status, "confirmed"))).limit(1);
		isRegistered = !!reg;
	}
	const { meetingUrl, ...publicFields } = event;
	return json({ event: {
		...publicFields,
		meetingUrl: isRegistered ? meetingUrl : null,
		registeredCount,
		isRegistered
	} });
};
//#endregion
export { GET };
