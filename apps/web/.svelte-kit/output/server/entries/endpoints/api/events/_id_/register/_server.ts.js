import { M as events, j as eventRegistrations, t as db } from "../../../../../../chunks/drizzle.js";
import { t as notify } from "../../../../../../chunks/notify.js";
import { json } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
//#region src/routes/api/events/[id]/register/+server.ts
/**
* POST /api/events/[id]/register   — register the current user
* DELETE /api/events/[id]/register — cancel registration
*
* Capacity is enforced: if `events.capacity` is set and registrations have
* reached it, registration is refused. Cancelled registrations don't open
* a slot back up automatically — the row is updated to status='cancelled'
* but a re-register would have to either reuse that row or insert a new
* one. We reuse via upsert to keep the unique constraint happy.
*/
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [event] = await db.select().from(events).where(eq(events.id, params.id)).limit(1);
	if (!event) return json({ error: "Event not found" }, { status: 404 });
	if (event.status !== "scheduled" && event.status !== "live") return json({ error: "Registration is closed for this event" }, { status: 400 });
	if (event.capacity !== null && event.capacity !== void 0) {
		const [row] = await db.select({ count: sql`count(*)::int` }).from(eventRegistrations).where(and(eq(eventRegistrations.eventId, event.id), eq(eventRegistrations.status, "confirmed")));
		if (Number(row?.count ?? 0) >= event.capacity) return json({ error: "Event is full" }, { status: 409 });
	}
	await db.insert(eventRegistrations).values({
		eventId: event.id,
		userId: session.user.id,
		status: "confirmed"
	}).onConflictDoUpdate({
		target: [eventRegistrations.eventId, eventRegistrations.userId],
		set: { status: "confirmed" }
	});
	await notify({
		userId: session.user.id,
		kind: "system",
		title: `You're registered for ${event.title}`,
		message: `See you on ${new Date(event.startsAt).toLocaleString()}. We'll email a reminder + meeting link before it starts.`,
		actionUrl: event.audience === "creator" ? "/creator/events" : "/webinars"
	});
	return json({
		success: true,
		isRegistered: true
	});
};
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if ((await db.update(eventRegistrations).set({ status: "cancelled" }).where(and(eq(eventRegistrations.eventId, params.id), eq(eventRegistrations.userId, session.user.id))).returning({ id: eventRegistrations.id })).length === 0) return json({ error: "You are not registered for this event" }, { status: 404 });
	return json({
		success: true,
		isRegistered: false
	});
};
//#endregion
export { DELETE, POST };
