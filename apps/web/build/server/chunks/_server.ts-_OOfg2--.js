import { n as db, q as events } from './drizzle-BjmsPAPl.js';
import { S as SiteMeta } from './constants-ChVx7CIu.js';
import { and, eq, gte } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-TtGtWAGI.js';
import './Icon-CGEdwVFL.js';
import './file-text-CODLMeLI.js';
import './layout-dashboard-B00hq5k6.js';
import './user-BR-ZR5dM.js';
import './users-Bb_ynahW.js';

//#region src/routes/api/events/feed.ics/+server.ts
/**
* GET /api/events/feed.ics?audience=public|creator
*
* Returns an .ics calendar feed for all upcoming events in the requested
* audience. Users add this URL to Google Calendar / Apple Calendar /
* Outlook and their app polls it for updates.
*
* Public — no auth required, since calendar apps don't send cookies.
*/
function fmtDate(d) {
	return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
function escape(s) {
	return (s ?? "").replace(/[,;\\]/g, "\\$&").replace(/\n/g, "\\n");
}
var GET = async ({ url }) => {
	const audience = url.searchParams.get("audience") ?? "public";
	if (audience !== "public" && audience !== "creator") return new Response("audience must be public or creator", { status: 400 });
	const rows = await db.select().from(events).where(and(eq(events.audience, audience), gte(events.startsAt, /* @__PURE__ */ new Date()), eq(events.status, "scheduled"))).orderBy(events.startsAt);
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Sephar Studios//Events Feed//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		`X-WR-CALNAME:${audience === "creator" ? "Sephar Creator Events" : "Sephar Webinars"}`,
		"X-WR-TIMEZONE:UTC"
	];
	const now = /* @__PURE__ */ new Date();
	for (const e of rows) {
		const start = new Date(e.startsAt);
		const end = e.endsAt ? new Date(e.endsAt) : new Date(start.getTime() + (e.durationMinutes ?? 60) * 6e4);
		lines.push("BEGIN:VEVENT", `UID:${e.id}@sepharstudios.com`, `DTSTAMP:${fmtDate(now)}`, `DTSTART:${fmtDate(start)}`, `DTEND:${fmtDate(end)}`, `SUMMARY:${escape(e.title)}`, `DESCRIPTION:${escape(e.description)}`, `LOCATION:${escape(e.location ?? "Online")}`, `URL:${SiteMeta.link}${audience === "creator" ? "/creator/events" : "/webinars"}`, "END:VEVENT");
	}
	lines.push("END:VCALENDAR");
	return new Response(lines.join("\r\n"), { headers: {
		"Content-Type": "text/calendar; charset=utf-8",
		"Content-Disposition": `inline; filename="sephar-${audience}-events.ics"`,
		"Cache-Control": "public, max-age=3600, s-maxage=3600"
	} });
};

export { GET };
//# sourceMappingURL=_server.ts-_OOfg2--.js.map
