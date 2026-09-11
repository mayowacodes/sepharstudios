import { d as db, m as mediaLibrary, o as contentSubtitleTracks } from './drizzle-CsnNxG5m.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/creator/content/[id]/subtitles/+server.ts
/**
* POST /api/creator/content/[id]/subtitles
*   body { kind: 'subtitles'|'captions'|'descriptions', language, label, fileUrl, isDefault? }
*
* Ownership check: the parent content row's creatorId must match the
* signed-in user.
*/
var ALLOWED_KINDS = /* @__PURE__ */ new Set([
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

export { POST };
//# sourceMappingURL=_server.ts-Dm-Mncvb.js.map
