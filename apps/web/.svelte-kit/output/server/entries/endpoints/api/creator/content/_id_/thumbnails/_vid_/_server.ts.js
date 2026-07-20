import { K as mediaLibrary, S as contentThumbnailVariants, t as db } from "../../../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/api/creator/content/[id]/thumbnails/[vid]/+server.ts
/**
* DELETE /api/creator/content/[id]/thumbnails/[vid]
*
* Removes a variant. Ownership check on the parent content row.
*/
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!content) return json({ error: "Not found" }, { status: 404 });
	if (content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	await db.delete(contentThumbnailVariants).where(and(eq(contentThumbnailVariants.id, params.vid), eq(contentThumbnailVariants.contentId, content.id)));
	return json({ success: true });
};
//#endregion
export { DELETE };
