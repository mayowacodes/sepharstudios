import { w as db, z as events, y as eventRegistrations } from './drizzle-CKUH7ukq.js';
import { r as requireAdmin } from './admin-auth-DwogZLlW.js';
import { n as notify } from './notify-DpHZNtZn.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, and } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/events/[id]/+server.ts
/**
* PATCH /api/admin/events/[id]  — partial update
* DELETE /api/admin/events/[id] — cancel event + notify all registrants
*
* Cancellation soft-marks the event as `status='cancelled'` (not hard delete)
* so the audit trail + registrations remain. Registrants get an in-app
* notification explaining the cancellation.
*/
var ALLOWED_FIELDS = [
	"title",
	"description",
	"speaker",
	"speakerRole",
	"kind",
	"track",
	"audience",
	"startsAt",
	"endsAt",
	"durationMinutes",
	"location",
	"capacity",
	"meetingUrl",
	"recordingUrl",
	"status"
];
var PATCH = async ({ params, locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const body = await request.json();
	const updates = { updatedAt: /* @__PURE__ */ new Date() };
	for (const field of ALLOWED_FIELDS) if (field in body) if (field === "startsAt" || field === "endsAt") {
		const val = body[field];
		updates[field] = val ? new Date(val) : null;
	} else updates[field] = body[field];
	if (Object.keys(updates).length === 1) return json({ error: "No updatable fields supplied" }, { status: 400 });
	const [updated] = await db.update(events).set(updates).where(eq(events.id, params.id)).returning();
	if (!updated) return json({ error: "Event not found" }, { status: 404 });
	return json({
		success: true,
		event: updated
	});
};
var DELETE = async ({ params, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const [event] = await db.select().from(events).where(eq(events.id, params.id)).limit(1);
	if (!event) return json({ error: "Event not found" }, { status: 404 });
	if (event.status === "cancelled") return json({ error: "Event already cancelled" }, { status: 400 });
	await db.update(events).set({
		status: "cancelled",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(events.id, event.id));
	const regs = await db.select({ userId: eventRegistrations.userId }).from(eventRegistrations).where(and(eq(eventRegistrations.eventId, event.id), eq(eventRegistrations.status, "confirmed")));
	for (const r of regs) await notify({
		userId: r.userId,
		kind: "system",
		title: `Event cancelled: ${event.title}`,
		message: `Unfortunately we've had to cancel this event. We'll let you know when a similar one is scheduled.`,
		actionUrl: event.audience === "creator" ? "/creator/events" : "/webinars"
	}).catch(() => {});
	return json({
		success: true,
		cancelledRegistrants: regs.length
	});
};

export { DELETE, PATCH };
//# sourceMappingURL=_server.ts-DNXXT6dJ.js.map
