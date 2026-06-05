import { V as liveStreams, t as db } from "../../../../../../../chunks/drizzle.js";
import { t as eventStream } from "../../../../../../../chunks/sse.js";
import "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/live/[streamId]/chat/stream/+server.ts
/**
* GET /api/live/[streamId]/chat/stream
*
* SSE feed of public chat events (`live-chat:{id}`). Creator + admin
* additionally subscribe to `live-chat-mod:{id}` so they see flagged
* messages awaiting moderation.
*/
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return new Response("Unauthorized", { status: 401 });
	const [stream] = await db.select({
		creatorId: liveStreams.creatorId,
		visibility: liveStreams.visibility
	}).from(liveStreams).where(eq(liveStreams.id, params.streamId)).limit(1);
	if (!stream) return new Response("Not found", { status: 404 });
	if (stream.visibility === "private" && stream.creatorId !== session.user.id) return new Response("Forbidden", { status: 403 });
	const topics = [`live-chat:${params.streamId}`];
	if (stream.creatorId === session.user.id || session.user.role === "admin") topics.push(`live-chat-mod:${params.streamId}`);
	return eventStream(topics);
};
//#endregion
export { GET };
