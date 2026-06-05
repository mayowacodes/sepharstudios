import { V as liveStreams, t as db } from "../../../../../../../chunks/drizzle.js";
import { t as eventStream } from "../../../../../../../chunks/sse.js";
import "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/watch/live/[id]/stream/+server.ts
/**
* GET /api/watch/live/[id]/stream
*
* SSE feed of viewer-facing live state for one stream. Open to any
* authenticated viewer; private streams blocked.
*/
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return new Response("Unauthorized", { status: 401 });
	const [stream] = await db.select({
		visibility: liveStreams.visibility,
		creatorId: liveStreams.creatorId
	}).from(liveStreams).where(eq(liveStreams.id, params.id)).limit(1);
	if (!stream) return new Response("Not found", { status: 404 });
	if (stream.visibility === "private" && stream.creatorId !== session.user.id) return new Response("Forbidden", { status: 403 });
	return eventStream([`live:${params.id}`]);
};
//#endregion
export { GET };
