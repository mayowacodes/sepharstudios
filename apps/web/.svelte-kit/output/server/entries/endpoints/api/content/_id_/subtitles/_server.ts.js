import { H as mediaLibrary, t as db, y as contentSubtitleTracks } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/content/[id]/subtitles/+server.ts
/**
* GET /api/content/[id]/subtitles
*
* Public read used by the watch page when fetching subtitle tracks for the
* VideoPlayer. Visibility-gated: returns empty for `private` content unless
* the caller is the creator. (Auth check is best-effort — the watch page
* itself enforces a stricter access gate; this just avoids leaking labels.)
*/
var GET = async ({ params, locals }) => {
	const [content] = await db.select({
		id: mediaLibrary.id,
		visibility: mediaLibrary.visibility,
		isActive: mediaLibrary.isActive,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!content) return json({ tracks: [] });
	if (content.visibility === "private") {
		const session = await locals.auth.getSession();
		if (!session || session.user.id !== content.creatorId) return json({ tracks: [] });
	}
	return json({ tracks: await db.select().from(contentSubtitleTracks).where(eq(contentSubtitleTracks.contentId, content.id)) });
};
//#endregion
export { GET };
