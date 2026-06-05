import { t as private_env } from "../../../../../chunks/shared-server.js";
import { V as liveStreams, t as db } from "../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
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
//#endregion
export { GET, POST };
