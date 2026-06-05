import { H as mediaLibrary, t as db, y as contentSubtitleTracks } from "../../../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/api/creator/content/[id]/subtitles/[trackId]/+server.ts
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!content) return json({ error: "Content not found" }, { status: 404 });
	if (content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	if ((await db.delete(contentSubtitleTracks).where(and(eq(contentSubtitleTracks.id, params.trackId), eq(contentSubtitleTracks.contentId, content.id))).returning({ id: contentSubtitleTracks.id })).length === 0) return json({ error: "Track not found" }, { status: 404 });
	return json({ success: true });
};
//#endregion
export { DELETE };
