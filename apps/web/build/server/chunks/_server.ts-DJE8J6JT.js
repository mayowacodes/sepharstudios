import { q as events, n as db, p as eventRegistrations } from './drizzle-BjmsPAPl.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, gte, lt, sql, and, inArray } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/events/+server.ts
/**
* GET /api/events?audience=public|creator&filter=upcoming|past|all
*
* Lists events for the requested audience, with per-row `registeredCount`
* and (if signed in) the current user's `isRegistered` flag.
*
*   audience: 'public' (default) — surfaces /webinars
*             'creator'           — surfaces /creator/events
*   filter:   'upcoming' (default), 'past', 'all'
*/
var GET = async ({ url, locals }) => {
	const audience = url.searchParams.get("audience") ?? "public";
	const filter = url.searchParams.get("filter") ?? "upcoming";
	if (audience !== "public" && audience !== "creator") return json({ error: "audience must be public or creator" }, { status: 400 });
	if (filter !== "upcoming" && filter !== "past" && filter !== "all") return json({ error: "filter must be upcoming, past, or all" }, { status: 400 });
	const now = /* @__PURE__ */ new Date();
	const conditions = [eq(events.audience, audience)];
	if (filter === "upcoming") {
		conditions.push(gte(events.startsAt, now));
		conditions.push(eq(events.status, "scheduled"));
	} else if (filter === "past") conditions.push(lt(events.startsAt, now));
	const rows = await db.select({
		id: events.id,
		title: events.title,
		description: events.description,
		speaker: events.speaker,
		speakerRole: events.speakerRole,
		kind: events.kind,
		track: events.track,
		audience: events.audience,
		startsAt: events.startsAt,
		endsAt: events.endsAt,
		durationMinutes: events.durationMinutes,
		location: events.location,
		capacity: events.capacity,
		recordingUrl: events.recordingUrl,
		status: events.status,
		registeredCount: sql`(select count(*)::int from event_registrations er where er.event_id = ${events.id} and er.status = 'confirmed')`
	}).from(events).where(and(...conditions)).orderBy(events.startsAt);
	const session = await locals.auth.getSession().catch(() => null);
	if (!session || rows.length === 0) return json({ events: rows.map((r) => ({
		...r,
		isRegistered: false
	})) });
	const myRegs = await db.select({ eventId: eventRegistrations.eventId }).from(eventRegistrations).where(and(eq(eventRegistrations.userId, session.user.id), eq(eventRegistrations.status, "confirmed"), inArray(eventRegistrations.eventId, rows.map((r) => r.id))));
	const myEventIds = new Set(myRegs.map((r) => r.eventId));
	return json({ events: rows.map((r) => ({
		...r,
		isRegistered: myEventIds.has(r.id)
	})) });
};

export { GET };
//# sourceMappingURL=_server.ts-DJE8J6JT.js.map
