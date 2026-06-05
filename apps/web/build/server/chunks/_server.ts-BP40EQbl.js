import { p as private_env } from './shared-server-DUDL94jl.js';
import { w as db, L as liveStreams } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-BP40EQbl.js.map
