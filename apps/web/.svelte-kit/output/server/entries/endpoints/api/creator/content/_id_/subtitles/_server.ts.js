import { K as mediaLibrary, t as db, x as contentSubtitleTracks } from "../../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/api/creator/content/[id]/subtitles/+server.ts
/**
* POST /api/creator/content/[id]/subtitles
*   body { kind: 'subtitles'|'captions'|'descriptions', language, label, fileUrl, isDefault? }
*
* Ownership check: the parent content row's creatorId must match the
* signed-in user.
*/
var ALLOWED_KINDS = new Set([
	"subtitles",
	"captions",
	"descriptions"
]);
var POST = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!content) return json({ error: "Content not found" }, { status: 404 });
	if (content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const kind = body.kind && ALLOWED_KINDS.has(body.kind) ? body.kind : "subtitles";
	const language = body.language?.trim().slice(0, 10) ?? "";
	const label = body.label?.trim().slice(0, 60) ?? "";
	const fileUrl = body.fileUrl?.trim() ?? "";
	const isDefault = !!body.isDefault;
	if (!language) return json({ error: "language is required" }, { status: 400 });
	if (!label) return json({ error: "label is required" }, { status: 400 });
	if (!fileUrl.startsWith("http")) return json({ error: "fileUrl must be an absolute URL" }, { status: 400 });
	if (isDefault) await db.update(contentSubtitleTracks).set({ isDefault: false }).where(and(eq(contentSubtitleTracks.contentId, content.id), eq(contentSubtitleTracks.kind, kind)));
	const [track] = await db.insert(contentSubtitleTracks).values({
		contentId: content.id,
		kind,
		language,
		label,
		fileUrl,
		isDefault
	}).returning();
	return json({
		success: true,
		track
	});
};
//#endregion
export { POST };
