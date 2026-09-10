import { d as db, c as user, ah as liveStreams } from './drizzle-DlGuU73K.js';
import { j as json, e as error } from './index.js-DwRgOKlO.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/playback/live/[id]/+server.ts
/**
* GET /api/playback/live/:id  →  { stream, isOwner, canModerateChat }
*
* The former `watch/live/[id]/+page.server.ts` load, moved so the native bundle
* can render the live route.
*
* Stays server-side for the same reason as the on-demand playback endpoint: a
* private stream must 404 for anyone but its owner, and the visibility check
* has to run somewhere the caller cannot skip. `canModerateChat` is likewise an
* authorisation answer, not a UI hint — the chat moderation endpoints re-check
* it independently rather than trusting this flag.
*/
async function buildLivePayload({ params, locals }) {
	const session = await locals.auth.getSession();
	if (!session) error(401, "Please sign in to watch the live stream");
	const streamId = params.id;
	if (!streamId) error(400, "Missing stream id");
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
	}).from(liveStreams).leftJoin(user, eq(user.id, liveStreams.creatorId)).where(eq(liveStreams.id, streamId)).limit(1);
	if (!stream) error(404, "Stream not found");
	const isOwner = stream.creatorId === session.user.id;
	if (stream.visibility === "private" && !isOwner) error(404, "Stream not found");
	const isAdmin = session.user.role === "admin";
	return {
		stream,
		isOwner,
		canModerateChat: isOwner || isAdmin
	};
}
var GET = async (event) => json(await buildLivePayload(event));

export { GET };
//# sourceMappingURL=_server.ts-Ct-nW0P5.js.map
