import { K as mediaLibrary, b as contentShares, q as mediaWatchProgress, t as db, wt as watchSessionMeta } from "../../../../../../chunks/drizzle.js";
import { t as permanentlyDeleteContent } from "../../../../../../chunks/content-delete.js";
import { n as notifyAdmins, t as notify } from "../../../../../../chunks/notify.js";
import { r as Role } from "../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, eq, gte, isNotNull, sql } from "drizzle-orm";
//#region src/routes/api/creator/content/[id]/+server.ts
/**
* GET    /api/creator/content/[id] — single content row + per-content analytics
* PATCH  /api/creator/content/[id] — partial update (allow-listed fields)
* DELETE /api/creator/content/[id] — soft-delete (status='archived')
*
* Ownership: the row's `creator_id` must match the signed-in creator. Admins
* are NOT auto-trusted here on purpose — admin edits go through
* /api/admin/content/[id] which has its own audit trail.
*/
var ALLOWED_PATCH_FIELDS = new Set([
	"title",
	"description",
	"contentType",
	"ageRating",
	"audience",
	"genres",
	"topics",
	"keywords",
	"bibleReference",
	"language",
	"duration",
	"thumbnail",
	"posterUrl",
	"posterLandscapeUrl",
	"posterSquareUrl",
	"logoTitleUrl",
	"backdropUrl",
	"trailerUrl",
	"visibility",
	"scheduledPublishAt",
	"chapters",
	"cast",
	"crew",
	"geoMode",
	"geoRegions",
	"nextUpContentIds",
	"status"
]);
var TEXT_FIELD_MAX = {
	description: 1e4,
	ageRating: 10,
	bibleReference: 100,
	language: 50,
	duration: 50,
	thumbnail: 2048,
	posterUrl: 2048,
	posterLandscapeUrl: 2048,
	posterSquareUrl: 2048,
	logoTitleUrl: 2048,
	backdropUrl: 2048,
	trailerUrl: 2048
};
var CREATOR_STATUS_TRANSITIONS = { coming_soon: ["submitted"] };
var ALLOWED_VISIBILITY = new Set([
	"public",
	"unlisted",
	"private"
]);
var ALLOWED_CONTENT_TYPES = new Set([
	"movie",
	"show",
	"series",
	"short",
	"documentary"
]);
var ALLOWED_AUDIENCES = new Set([
	"general",
	"kids",
	"teens"
]);
var ALLOWED_GEO_MODES = new Set([
	"all",
	"allow",
	"block"
]);
async function loadOwned(contentId, ownerId) {
	const [row] = await db.select().from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!row) return {
		row: null,
		status: 404
	};
	if (row.creatorId !== ownerId) return {
		row: null,
		status: 403
	};
	return {
		row,
		status: 200
	};
}
async function perContentAnalytics(contentId) {
	const [watchAgg] = await db.select({
		views: sql`count(*)::int`,
		completed: sql`sum(case when ${mediaWatchProgress.isCompleted} then 1 else 0 end)::int`,
		watchSeconds: sql`coalesce(sum(${mediaWatchProgress.positionSeconds}), 0)`,
		avgCompletion: sql`coalesce(avg(${mediaWatchProgress.completionPercent}), 0)`
	}).from(mediaWatchProgress).where(eq(mediaWatchProgress.contentId, contentId));
	const [shareAgg] = await db.select({ total: sql`count(*)::int` }).from(contentShares).where(eq(contentShares.contentId, contentId));
	const since = /* @__PURE__ */ new Date(Date.now() - 30 * 864e5);
	const deviceRows = await db.select({
		deviceType: watchSessionMeta.deviceType,
		count: sql`count(*)::int`
	}).from(watchSessionMeta).where(and(eq(watchSessionMeta.contentId, contentId), gte(watchSessionMeta.createdAt, since), isNotNull(watchSessionMeta.deviceType))).groupBy(watchSessionMeta.deviceType);
	const countryRows = await db.select({
		country: watchSessionMeta.country,
		count: sql`count(*)::int`
	}).from(watchSessionMeta).where(and(eq(watchSessionMeta.contentId, contentId), gte(watchSessionMeta.createdAt, since), isNotNull(watchSessionMeta.country))).groupBy(watchSessionMeta.country).orderBy(sql`count(*) desc`).limit(5);
	const views = Number(watchAgg?.views ?? 0);
	const watchSeconds = Number(watchAgg?.watchSeconds ?? 0);
	return {
		views,
		completedWatches: Number(watchAgg?.completed ?? 0),
		watchTimeMinutes: Math.round(watchSeconds / 60),
		avgWatchMinutes: views > 0 ? Math.round(watchSeconds / views / 60 * 10) / 10 : 0,
		completionRate: Math.round(Number(watchAgg?.avgCompletion ?? 0)),
		totalShares: Number(shareAgg?.total ?? 0),
		viewsByDevice: deviceRows.map((r) => ({
			device: r.deviceType ?? "unknown",
			count: Number(r.count)
		})),
		topCountries: countryRows.map((r) => ({
			country: r.country ?? "XX",
			count: Number(r.count)
		}))
	};
}
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const { row, status } = await loadOwned(params.id, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? "Not found" : "Forbidden" }, { status });
	return json({
		content: row,
		analytics: await perContentAnalytics(row.id)
	});
};
var PATCH = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const { row, status } = await loadOwned(params.id, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? "Not found" : "Forbidden" }, { status });
	const body = await request.json().catch(() => ({}));
	const updates = { updatedAt: /* @__PURE__ */ new Date() };
	for (const [key, value] of Object.entries(body)) {
		if (!ALLOWED_PATCH_FIELDS.has(key)) continue;
		if (key === "visibility") {
			if (typeof value !== "string" || !ALLOWED_VISIBILITY.has(value)) return json({ error: "Invalid visibility" }, { status: 400 });
			updates.visibility = value;
			continue;
		}
		if (key === "contentType") {
			if (typeof value !== "string" || !ALLOWED_CONTENT_TYPES.has(value)) return json({ error: "Invalid content type" }, { status: 400 });
			updates.mediaType = value;
			continue;
		}
		if (key === "audience") {
			if (typeof value !== "string" || !ALLOWED_AUDIENCES.has(value)) return json({ error: "Invalid audience" }, { status: 400 });
			updates.category = value === "general" ? null : value;
			continue;
		}
		if (key === "scheduledPublishAt") {
			if (value === null || value === "") updates.scheduledPublishAt = null;
			else if (typeof value === "string") {
				const parsed = new Date(value);
				if (isNaN(parsed.getTime())) return json({ error: "Invalid scheduledPublishAt" }, { status: 400 });
				if (parsed.getTime() < Date.now() - 1440 * 60 * 1e3) return json({ error: "scheduledPublishAt must be today or in the future" }, { status: 400 });
				updates.scheduledPublishAt = parsed;
			}
			continue;
		}
		if (key === "title") {
			const t = String(value ?? "").trim();
			if (!t) return json({ error: "Title cannot be empty" }, { status: 400 });
			updates.title = t.slice(0, 255);
			continue;
		}
		if (key === "genres" || key === "topics" || key === "keywords") {
			updates[key] = Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
			continue;
		}
		if (key === "chapters") {
			if (value === null) {
				updates.chapters = null;
				continue;
			}
			if (!Array.isArray(value)) return json({ error: "chapters must be an array" }, { status: 400 });
			if (value.length > 50) return json({ error: "Max 50 chapters" }, { status: 400 });
			const cleaned = [];
			let lastStart = -1;
			for (const v of value) {
				if (!v || typeof v !== "object") return json({ error: "Each chapter must be an object" }, { status: 400 });
				const start = Number(v.start);
				const title = String(v.title ?? "").trim();
				if (!Number.isFinite(start) || start < 0) return json({ error: "chapter.start must be a non-negative number" }, { status: 400 });
				if (!title) return json({ error: "chapter.title is required" }, { status: 400 });
				if (start <= lastStart) return json({ error: "chapter starts must be strictly increasing" }, { status: 400 });
				lastStart = start;
				cleaned.push({
					start,
					title: title.slice(0, 80)
				});
			}
			updates.chapters = cleaned;
			continue;
		}
		if (key === "cast" || key === "crew") {
			if (!Array.isArray(value)) return json({ error: `${key} must be an array` }, { status: 400 });
			if (value.length > 50) return json({ error: `Max 50 ${key} entries` }, { status: 400 });
			updates[key] = value.map((v) => {
				if (!v || typeof v !== "object") return null;
				const name = String(v.name ?? "").trim();
				const role = String(v.role ?? "").trim();
				if (!name || !role) return null;
				const photoUrl = v.photoUrl;
				const out = {
					name: name.slice(0, 120),
					role: role.slice(0, 80)
				};
				if (typeof photoUrl === "string" && photoUrl) out.photoUrl = photoUrl.slice(0, 500);
				if (key === "cast") {
					const characterName = v.characterName;
					if (typeof characterName === "string" && characterName) out.characterName = characterName.trim().slice(0, 120);
				}
				return out;
			}).filter((v) => v !== null);
			continue;
		}
		if (key === "geoMode") {
			if (typeof value !== "string" || !ALLOWED_GEO_MODES.has(value)) return json({ error: "Invalid geoMode" }, { status: 400 });
			updates.geoMode = value;
			continue;
		}
		if (key === "geoRegions") {
			if (!Array.isArray(value)) return json({ error: "geoRegions must be an array" }, { status: 400 });
			updates.geoRegions = value.filter((v) => typeof v === "string").map((v) => v.trim().toUpperCase()).filter((v) => /^[A-Z]{2}$/.test(v));
			continue;
		}
		if (key === "nextUpContentIds") {
			if (!Array.isArray(value)) return json({ error: "nextUpContentIds must be an array" }, { status: 400 });
			const cleaned = value.filter((v) => typeof v === "string" && v.length > 0).filter((v) => v !== row.id).slice(0, 12);
			updates.nextUpContentIds = Array.from(new Set(cleaned));
			continue;
		}
		if (key === "status") {
			const target = typeof value === "string" ? value : "";
			const current = row.status ?? "";
			if (!(CREATOR_STATUS_TRANSITIONS[current] ?? []).includes(target)) return json({ error: `Status transition ${current || "(none)"} → ${target || "(empty)"} is not allowed` }, { status: 400 });
			updates.status = target;
			continue;
		}
		if (value === null) {
			updates[key] = null;
			continue;
		}
		if (typeof value !== "string") return json({ error: `${key} must be a string or null` }, { status: 400 });
		const cap = TEXT_FIELD_MAX[key] ?? 2048;
		updates[key] = value.slice(0, cap);
	}
	if (Object.keys(updates).length === 1) return json({ error: "No updatable fields supplied" }, { status: 400 });
	const [updated] = await db.update(mediaLibrary).set(updates).where(and(eq(mediaLibrary.id, row.id), eq(mediaLibrary.creatorId, session.user.id))).returning();
	if (!updated) return json({ error: "Not found" }, { status: 404 });
	if (updated.status === "published" && [
		"title",
		"description",
		"genres",
		"topics",
		"keywords",
		"bibleReference",
		"cast",
		"crew"
	].some((f) => f in updates)) try {
		const { indexMedia, isMeiliConfigured } = await import("../../../../../../chunks/meilisearch.js");
		if (isMeiliConfigured()) await indexMedia([{
			id: updated.id,
			title: updated.title,
			description: updated.description,
			genres: updated.genres ?? [],
			topics: updated.topics ?? [],
			keywords: updated.keywords ?? [],
			bibleReference: updated.bibleReference,
			mediaType: updated.mediaType,
			category: updated.category,
			year: updated.year,
			ageRating: updated.ageRating,
			thumbnail: updated.thumbnail,
			posterUrl: updated.posterUrl,
			viewCount: Number(updated.viewCount ?? 0),
			createdAt: updated.createdAt.getTime(),
			castNames: Array.isArray(updated.cast) ? updated.cast.map((c) => c.name).filter(Boolean) : [],
			crewNames: Array.isArray(updated.crew) ? updated.crew.map((c) => c.name).filter(Boolean) : []
		}]);
	} catch (err) {
		console.warn("[creator/content PATCH] Meili reindex failed:", err);
	}
	if ("mediaType" in updates && row.mediaType !== updates.mediaType) {
		console.info(`[creator/content PATCH] mediaType change ${row.mediaType} → ${updates.mediaType} on ${row.id}`);
		notifyAdmins({
			kind: "system",
			title: `Content type changed: "${updated.title.slice(0, 50)}"`,
			message: `Creator changed mediaType from ${row.mediaType} to ${updates.mediaType}. Re-review may be needed.`,
			actionUrl: `/admin/review/${updated.id}`
		}).catch(() => void 0);
	}
	if ("status" in updates && row.status === "coming_soon" && updates.status === "submitted") {
		console.info(`[creator/content PATCH] coming_soon → submitted (video added) on ${row.id}`);
		notifyAdmins({
			kind: "system",
			title: `Coming Soon video added: "${updated.title.slice(0, 50)}"`,
			message: "Creator attached the main video to a previously-approved Coming Soon row. Review the video, then it auto-publishes on the release date.",
			actionUrl: `/admin/review/${updated.id}`
		}).catch(() => void 0);
	}
	return json({
		success: true,
		content: updated
	});
};
/**
* DELETE /api/creator/content/[id][?mode=archive|delete]
*
* Two modes, gated by the `mode` query string. Ownership check
* applies to both — creator can only act on rows they own; admins
* still hit /api/admin/content/[id] for any-row access.
*
*   - default / mode=archive  → soft archive (status='archived',
*     is_active=false). Sends a "Content archived" notification.
*
*   - mode=delete             → hard delete via the shared helper.
*     Blocks on existing PPV purchases (409). Cancels in-flight
*     encoder workflow. FK cascades + MinIO cleanup follow.
*/
var DELETE = async ({ params, url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const { row, status } = await loadOwned(params.id, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? "Not found" : "Forbidden" }, { status });
	if ((url.searchParams.get("mode") ?? "archive") === "delete") {
		const result = await permanentlyDeleteContent(row.id, session.user.id);
		if (!result.ok) {
			if (result.reason === "not_found") return json({ error: "Not found" }, { status: 404 });
			if (result.reason === "ppv_purchases_exist") return json({
				error: "Cannot permanently delete content with existing PPV purchases. Archive instead, or contact support to void the purchases first.",
				blockedBy: "ppv_purchases"
			}, { status: 409 });
		}
		if (session.user.id) notify({
			userId: session.user.id,
			kind: "system",
			title: "Content deleted",
			message: `"${row.title}" has been permanently deleted.`,
			actionUrl: "/creator/content"
		}).catch(() => void 0);
		return json({
			success: true,
			deleted: true
		});
	}
	await db.update(mediaLibrary).set({
		status: "archived",
		isActive: false,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, row.id));
	if (session.user.id) notify({
		userId: session.user.id,
		kind: "system",
		title: "Content archived",
		message: `"${row.title}" has been archived and is no longer visible to viewers.`,
		actionUrl: "/creator/content"
	}).catch(() => void 0);
	return json({
		success: true,
		archived: true
	});
};
//#endregion
export { DELETE, GET, PATCH };
