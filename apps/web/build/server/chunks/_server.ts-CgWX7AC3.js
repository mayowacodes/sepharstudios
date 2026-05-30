import { n as db, q as events } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { j as json } from './index-5kYmxIr9.js';
import { desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/events/+server.ts
/**
* GET /api/admin/events  — list all events (admin view, all statuses + audiences)
* POST /api/admin/events — create a new event
*
* Body for POST:
*   {
*     title, description?, speaker?, speakerRole?,
*     kind?           ('webinar' | 'workshop' | 'fellowship' | 'conference' | 'qa' | 'ama')
*     track?          ('creator' | 'tokenomics' | 'theology' | 'tech')
*     audience        ('public' | 'creator')
*     startsAt        (ISO 8601 string)
*     endsAt?         (ISO 8601 string)
*     durationMinutes?
*     location?
*     capacity?
*     meetingUrl?
*   }
*/
var VALID_KINDS = new Set([
	"webinar",
	"workshop",
	"fellowship",
	"conference",
	"qa",
	"ama"
]);
var VALID_AUDIENCES = new Set(["public", "creator"]);
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	return json({ events: await db.select().from(events).orderBy(desc(events.startsAt)) });
};
var POST = async ({ locals, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error;
	const body = await request.json();
	if (typeof body.title !== "string" || body.title.trim().length === 0) return json({ error: "title is required" }, { status: 400 });
	if (!body.startsAt || typeof body.startsAt !== "string") return json({ error: "startsAt is required (ISO 8601)" }, { status: 400 });
	const startsAt = new Date(body.startsAt);
	if (isNaN(startsAt.getTime())) return json({ error: "startsAt is not a valid date" }, { status: 400 });
	const audience = body.audience ?? "public";
	if (!VALID_AUDIENCES.has(audience)) return json({ error: "audience must be public or creator" }, { status: 400 });
	const kind = body.kind ?? "webinar";
	if (!VALID_KINDS.has(kind)) return json({ error: `kind must be one of ${Array.from(VALID_KINDS).join(", ")}` }, { status: 400 });
	const [created] = await db.insert(events).values({
		title: body.title.trim(),
		description: typeof body.description === "string" ? body.description : null,
		speaker: typeof body.speaker === "string" ? body.speaker : null,
		speakerRole: typeof body.speakerRole === "string" ? body.speakerRole : null,
		kind,
		track: typeof body.track === "string" ? body.track : null,
		audience,
		startsAt,
		endsAt: body.endsAt && typeof body.endsAt === "string" ? new Date(body.endsAt) : null,
		durationMinutes: typeof body.durationMinutes === "number" ? body.durationMinutes : null,
		location: typeof body.location === "string" ? body.location : null,
		capacity: typeof body.capacity === "number" ? body.capacity : null,
		meetingUrl: typeof body.meetingUrl === "string" ? body.meetingUrl : null,
		status: "scheduled",
		createdBy: session.user.id
	}).returning();
	return json({
		success: true,
		event: created
	}, { status: 201 });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-CgWX7AC3.js.map
