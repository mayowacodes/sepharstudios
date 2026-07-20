import { W as liveStreams, a as user, t as db } from "../../../../../chunks/drizzle.js";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/watch/live/[id]/+page.server.ts
var load = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) error(401, "Please sign in to watch the live stream");
	const [stream] = await db.select({
		id: liveStreams.id,
		creatorId: liveStreams.creatorId,
		title: liveStreams.title,
		description: liveStreams.description,
		playbackUrl: liveStreams.playbackUrl,
		thumbnailUrl: liveStreams.thumbnailUrl,
		status: liveStreams.status,
		visibility: liveStreams.visibility,
		viewerCount: liveStreams.viewerCount,
		startedAt: liveStreams.startedAt,
		recordingMediaId: liveStreams.recordingMediaId,
		creatorName: user.name
	}).from(liveStreams).leftJoin(user, eq(user.id, liveStreams.creatorId)).where(eq(liveStreams.id, params.id)).limit(1);
	if (!stream) error(404, "Stream not found");
	const isOwner = stream.creatorId === session.user.id;
	if (stream.visibility === "private" && !isOwner) error(404, "Stream not found");
	const isAdmin = session.user.role === "admin";
	return {
		stream,
		isOwner,
		canModerateChat: isOwner || isAdmin
	};
};
//#endregion
export { load };
