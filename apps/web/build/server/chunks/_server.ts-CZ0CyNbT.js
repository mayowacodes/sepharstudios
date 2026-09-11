import { j as json, p as private_env } from './index.js-BP8aAXBX.js';
import { d as db, ak as liveStreams } from './drizzle-CsnNxG5m.js';
import { R as Role } from './constants-DSOCQRom.js';
import { eq, desc } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';

//#region src/routes/api/creator/live/+server.ts
/**
* GET  /api/creator/live — list the signed-in creator's streams
* POST /api/creator/live — create a new stream (generates a fresh stream key)
*   body: { title, description?, visibility?, scheduledStartAt? }
*/
function generateStreamKey() {
	return `seph_${randomBytes(16).toString("hex")}`;
}
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	return json({ streams: await db.select().from(liveStreams).where(eq(liveStreams.creatorId, session.user.id)).orderBy(desc(liveStreams.createdAt)).limit(50) });
};
var POST = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const title = body.title?.trim();
	if (!title) return json({ error: "title is required" }, { status: 400 });
	const streamKey = generateStreamKey();
	const rtmpHost = private_env.LIVE_RTMP_INGEST_HOST || "rtmp://live.sepharstudios.com/app";
	const [inserted] = await db.insert(liveStreams).values({
		creatorId: session.user.id,
		title,
		description: body.description ?? null,
		visibility: body.visibility ?? "public",
		scheduledStartAt: body.scheduledStartAt ? new Date(body.scheduledStartAt) : null,
		streamKey,
		rtmpIngestUrl: rtmpHost
	}).returning();
	return json({
		success: true,
		stream: inserted
	});
};

export { GET, POST };
//# sourceMappingURL=_server.ts-CZ0CyNbT.js.map
