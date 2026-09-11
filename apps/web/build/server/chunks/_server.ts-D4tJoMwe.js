import { j as json, p as private_env } from './index.js-BP8aAXBX.js';
import { d as db, P as paystackSubscriptions, m as mediaLibrary, p as ppvContent, q as ppvPurchases } from './drizzle-CsnNxG5m.js';
import { d as canonicalPlan } from './paystack-CI6fS_Y0.js';
import { and, eq, inArray, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/downloads/manifest/[id]/+server.ts
/**
* GET /api/downloads/manifest/:id → { manifestUrl, contentId, expiresAt }
*
* Authorises an offline download and hands back the HLS master playlist URL.
* The client walks that playlist and caches the segments itself — see
* `$lib/client/download-manager.ts`.
*
* This endpoint is an AUTHORISATION BOUNDARY, not a convenience. A download is
* a permanent local copy, so anything it lets through cannot be revoked later.
*/
/** Plans entitled to offline downloads. Free/ad-supported is not among them. */
var DOWNLOAD_PLANS = /* @__PURE__ */ new Set(["premium", "creator"]);
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const contentId = params.id;
	if (!contentId) return json({ error: "Missing content id" }, { status: 400 });
	const [active] = await db.select({
		plan: paystackSubscriptions.plan,
		status: paystackSubscriptions.status
	}).from(paystackSubscriptions).where(and(eq(paystackSubscriptions.userId, session.user.id), inArray(paystackSubscriptions.status, ["active", "trial"]))).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
	if (!active) return json({ error: "Active subscription required for downloads" }, { status: 403 });
	if (!DOWNLOAD_PLANS.has(canonicalPlan(active.plan ?? ""))) return json({ error: "Downloads require Premium or Creator" }, { status: 403 });
	const [content] = await db.select({
		videoUrl: mediaLibrary.videoUrl,
		isActive: mediaLibrary.isActive,
		title: mediaLibrary.title
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!content || !content.isActive) return json({ error: "Content not found" }, { status: 404 });
	if (!content.videoUrl) return json({ error: "No video available for this content" }, { status: 404 });
	const [ppv] = await db.select({ id: ppvContent.id }).from(ppvContent).where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true))).limit(1);
	if (ppv) {
		const [purchase] = await db.select({ id: ppvPurchases.id }).from(ppvPurchases).where(and(eq(ppvPurchases.userId, session.user.id), eq(ppvPurchases.contentId, contentId))).limit(1);
		if (!purchase) return json({ error: "This title must be purchased before it can be downloaded" }, { status: 403 });
	}
	let manifestUrl = content.videoUrl;
	if (!manifestUrl.startsWith("http")) manifestUrl = `${private_env.MINIO_PUBLIC_URL ?? private_env.S3_ENDPOINT ?? ""}/${manifestUrl}`;
	return json({
		contentId,
		title: content.title,
		manifestUrl,
		expiresAt: new Date(Date.now() + 24 * 36e5).toISOString()
	});
};

export { GET };
//# sourceMappingURL=_server.ts-D4tJoMwe.js.map
