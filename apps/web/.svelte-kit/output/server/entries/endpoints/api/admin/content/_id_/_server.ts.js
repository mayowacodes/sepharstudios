import { K as mediaLibrary, a as user, t as db, x as contentSubtitleTracks } from "../../../../../../chunks/drizzle.js";
import { n as resolvePlaybackUrl } from "../../../../../../chunks/encoder-playback.js";
import { t as permanentlyDeleteContent } from "../../../../../../chunks/content-delete.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/content/[id]/+server.ts
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const contentId = params.id;
	if (!contentId) return json({ error: "Missing content ID" }, { status: 400 });
	if ((await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]))?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const item = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		mediaType: mediaLibrary.mediaType,
		ageRating: mediaLibrary.ageRating,
		thumbnail: mediaLibrary.thumbnail,
		posterUrl: mediaLibrary.posterUrl,
		backdropUrl: mediaLibrary.backdropUrl,
		trailerUrl: mediaLibrary.trailerUrl,
		videoUrl: mediaLibrary.videoUrl,
		duration: mediaLibrary.duration,
		genres: mediaLibrary.genres,
		topics: mediaLibrary.topics,
		keywords: mediaLibrary.keywords,
		language: mediaLibrary.language,
		bibleReference: mediaLibrary.bibleReference,
		status: mediaLibrary.status,
		isActive: mediaLibrary.isActive,
		createdAt: mediaLibrary.createdAt,
		reviewNotes: mediaLibrary.reviewNotes,
		rejectionReason: mediaLibrary.rejectionReason,
		creatorId: mediaLibrary.creatorId,
		creatorName: user.name,
		creatorEmail: user.email,
		contentScanStatus: mediaLibrary.contentScanStatus,
		contentScanReport: mediaLibrary.contentScanReport,
		processingStatus: mediaLibrary.processingStatus,
		processingProgress: mediaLibrary.processingProgress,
		processingStage: mediaLibrary.processingStage,
		processingError: mediaLibrary.processingError,
		encoderJobId: mediaLibrary.encoderJobId,
		chapters: mediaLibrary.chapters,
		previewThumbnailsVtt: mediaLibrary.previewThumbnailsVtt,
		previewSpriteUrls: mediaLibrary.previewSpriteUrls,
		posterAutoUrl: mediaLibrary.posterAutoUrl,
		editedBy: mediaLibrary.editedBy,
		editedAt: mediaLibrary.editedAt,
		updatedAt: mediaLibrary.updatedAt,
		slug: mediaLibrary.slug,
		category: mediaLibrary.category,
		posterLandscapeUrl: mediaLibrary.posterLandscapeUrl,
		posterSquareUrl: mediaLibrary.posterSquareUrl,
		logoTitleUrl: mediaLibrary.logoTitleUrl,
		cast: mediaLibrary.cast,
		crew: mediaLibrary.crew,
		visibility: mediaLibrary.visibility,
		scheduledPublishAt: mediaLibrary.scheduledPublishAt
	}).from(mediaLibrary).leftJoin(user, eq(mediaLibrary.creatorId, user.id)).where(eq(mediaLibrary.id, contentId)).then((r) => r[0]);
	if (!item) return json({ error: "Content not found" }, { status: 404 });
	const tracks = await db.select().from(contentSubtitleTracks).where(eq(contentSubtitleTracks.contentId, contentId));
	const subtitles = tracks.filter((t) => t.kind !== "descriptions").map((t) => ({
		label: t.label,
		src: t.fileUrl,
		srclang: t.language
	}));
	const descriptions = tracks.filter((t) => t.kind === "descriptions").map((t) => ({
		label: t.label,
		src: t.fileUrl,
		srclang: t.language
	}));
	const videoUrl = resolvePlaybackUrl({
		videoUrl: item.videoUrl,
		encoderJobId: item.encoderJobId,
		processingStatus: item.processingStatus
	});
	let editorName = null;
	if (item.editedBy) {
		const [editor] = await db.select({ name: user.name }).from(user).where(eq(user.id, item.editedBy)).limit(1);
		editorName = editor?.name ?? null;
	}
	return json({
		...item,
		videoUrl,
		subtitles,
		descriptions,
		editorName
	});
};
/**
* PATCH /api/admin/content/[id]
*
* Admin metadata editor. Lets an admin rewrite the same field set the
* creator can rewrite on their own row — title, description, type,
* age rating, audience, taxonomy, etc. Unlike the creator's PATCH at
* /api/creator/content/[id], this endpoint bypasses the ownership
* check (creatorId === me) and stamps editedBy/editedAt for audit.
*
* Allow-list is the source of truth — any field NOT in the list is
* silently dropped, so a malformed payload can't write arbitrary
* columns. Empty-string posters get coerced to null so the catalog's
* fallback chain (poster → thumbnail → placeholder) still works.
*
* Asset URLs (posterUrl, trailerUrl, etc.) are accepted as raw
* strings — the admin pastes a freshly-uploaded MinIO URL. Full
* presigned upload UX inside this editor is a v2 task; v1 is text
* fields + the URLs the creator already submitted.
*/
var ADMIN_EDIT_ALLOW_LIST = [
	"title",
	"description",
	"mediaType",
	"ageRating",
	"category",
	"language",
	"duration",
	"genres",
	"topics",
	"keywords",
	"bibleReference",
	"thumbnail",
	"posterUrl",
	"posterLandscapeUrl",
	"posterSquareUrl",
	"logoTitleUrl",
	"backdropUrl",
	"trailerUrl",
	"cast",
	"crew",
	"visibility",
	"scheduledPublishAt",
	"isActive",
	"status"
];
var PATCH = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const contentId = params.id;
	if (!contentId) return json({ error: "Missing content ID" }, { status: 400 });
	if ((await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]))?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: "Invalid JSON" }, { status: 400 });
	}
	const VALID_STATUS = new Set([
		"draft",
		"submitted",
		"theological_review",
		"content_review",
		"technical_qa",
		"approved",
		"published",
		"rejected",
		"archived",
		"coming_soon"
	]);
	const VALID_MEDIA_TYPE = new Set([
		"movie",
		"series",
		"show",
		"tv",
		"episode",
		"documentary",
		"short",
		"sermon",
		"worship",
		"kids"
	]);
	const VALID_VISIBILITY = new Set([
		"public",
		"unlisted",
		"private"
	]);
	const patch = {};
	for (const key of ADMIN_EDIT_ALLOW_LIST) if (key in body) {
		const v = body[key];
		if (typeof v === "string" && v.trim() === "") patch[key] = null;
		else if (key === "scheduledPublishAt" && typeof v === "string" && v) {
			const d = new Date(v);
			patch[key] = Number.isNaN(d.getTime()) ? null : d;
		} else if (key === "status" && typeof v === "string" && !VALID_STATUS.has(v)) return json({ error: `Invalid status "${v}"` }, { status: 400 });
		else if (key === "mediaType" && typeof v === "string" && !VALID_MEDIA_TYPE.has(v)) return json({ error: `Invalid mediaType "${v}"` }, { status: 400 });
		else if (key === "visibility" && typeof v === "string" && !VALID_VISIBILITY.has(v)) return json({ error: `Invalid visibility "${v}"` }, { status: 400 });
		else patch[key] = v;
	}
	if (Object.keys(patch).length === 0) return json({ error: "No editable fields supplied" }, { status: 400 });
	const now = /* @__PURE__ */ new Date();
	patch.editedBy = session.user.id;
	patch.editedAt = now;
	patch.updatedAt = now;
	try {
		const [updated] = await db.update(mediaLibrary).set(patch).where(eq(mediaLibrary.id, contentId)).returning({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			editedAt: mediaLibrary.editedAt,
			updatedAt: mediaLibrary.updatedAt
		});
		if (!updated) return json({ error: "Content not found" }, { status: 404 });
		return json({
			ok: true,
			id: updated.id,
			title: updated.title,
			editedAt: updated.editedAt,
			updatedAt: updated.updatedAt,
			fieldsApplied: Object.keys(patch).filter((k) => k !== "editedBy" && k !== "editedAt" && k !== "updatedAt")
		});
	} catch (err) {
		console.error("[admin/content PATCH] update failed", err);
		return json({
			error: "Update failed",
			detail: err instanceof Error ? err.message : "unknown"
		}, { status: 500 });
	}
};
/**
* DELETE /api/admin/content/[id][?mode=archive|delete]
*
* Two modes, gated by the `mode` query string:
*
*   - default / mode=archive  → soft archive (flips is_active=false +
*     status='archived'). The row stays in the DB for audit + recovery.
*
*   - mode=delete             → hard delete via the shared helper. PPV
*     purchases block the action (409); an in-flight encoder workflow
*     is cancelled first; FK cascades + MinIO cleanup follow.
*/
var DELETE = async ({ params, url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const contentId = params.id;
	if (!contentId) return json({ error: "Missing content ID" }, { status: 400 });
	if ((await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]))?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	if ((url.searchParams.get("mode") ?? "archive") === "delete") {
		const result = await permanentlyDeleteContent(contentId, session.user.id);
		if (!result.ok) {
			if (result.reason === "not_found") return json({ error: "Content not found" }, { status: 404 });
			if (result.reason === "ppv_purchases_exist") return json({
				error: "Cannot permanently delete content with existing PPV purchases. Archive instead, or contact support to void the purchases first.",
				blockedBy: "ppv_purchases"
			}, { status: 409 });
		}
		return json({
			ok: true,
			deleted: true
		});
	}
	const [updated] = await db.update(mediaLibrary).set({
		isActive: false,
		status: "archived",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, contentId)).returning({ id: mediaLibrary.id });
	if (!updated) return json({ error: "Content not found" }, { status: 404 });
	return json({
		ok: true,
		id: updated.id,
		archived: true
	});
};
//#endregion
export { DELETE, GET, PATCH };
