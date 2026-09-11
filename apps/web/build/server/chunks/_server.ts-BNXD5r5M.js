import { j as json, p as private_env } from './index.js-CxPEndTa.js';
import { d as db, X as adCreatives } from './drizzle-C3SH12nS.js';
import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { g as getMainPresignedUploadUrl } from './minio-CSpfiG3D.js';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'minio';

//#region src/routes/api/admin/promo/creatives/+server.ts
var CREATIVE_BUCKET = () => private_env.ADS_CREATIVE_BUCKET || "sephar-promo";
/** GET /api/admin/promo/creatives?campaignId= → { creatives } */
var GET = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const campaignId = url.searchParams.get("campaignId");
	if (!campaignId) return json({ error: "campaignId is required" }, { status: 400 });
	return json({ creatives: await db.select().from(adCreatives).where(eq(adCreatives.campaignId, campaignId)).orderBy(desc(adCreatives.createdAt)) });
};
/**
* POST /api/admin/promo/creatives
*
* Two modes:
*   { intent: 'upload-url', campaignId, contentType }  → a presigned PUT so the
*     browser can upload the file directly to MinIO, plus the objectKey to send
*     back when creating the record.
*   { campaignId, kind, name, ... }                    → creates the record.
*/
var POST = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const body = await request.json().catch(() => null);
	if (!body) return json({ error: "Invalid body" }, { status: 400 });
	const campaignId = typeof body.campaignId === "string" ? body.campaignId : null;
	if (!campaignId) return json({ error: "campaignId is required" }, { status: 400 });
	if (body.intent === "upload-url") {
		const ext = typeof body.ext === "string" ? body.ext.replace(/[^a-z0-9]/gi, "").slice(0, 5) : "mp4";
		const objectKey = `creatives/${campaignId}/${randomUUID()}.${ext || "mp4"}`;
		return json({
			uploadUrl: await getMainPresignedUploadUrl(CREATIVE_BUCKET(), objectKey, 900),
			objectKey
		});
	}
	const kind = body.kind === "vast" ? "vast" : "video";
	const name = typeof body.name === "string" ? body.name.trim() : "";
	if (!name) return json({ error: "name is required" }, { status: 400 });
	if (kind === "video") {
		const duration = Number(body.durationSeconds);
		if (!body.videoObjectKey || typeof body.videoObjectKey !== "string") return json({ error: "videoObjectKey is required for a video creative" }, { status: 400 });
		if (!Number.isFinite(duration) || duration < 1 || duration > 180) return json({ error: "durationSeconds must be between 1 and 180 for a video creative" }, { status: 400 });
	} else if (!body.vastTagUrl || typeof body.vastTagUrl !== "string") return json({ error: "vastTagUrl is required for a VAST creative" }, { status: 400 });
	const [creative] = await db.insert(adCreatives).values({
		campaignId,
		kind,
		name,
		videoObjectKey: body.videoObjectKey ?? null,
		posterObjectKey: body.posterObjectKey ?? null,
		durationSeconds: kind === "video" ? Number(body.durationSeconds) : null,
		bitrateKbps: Number.isFinite(body.bitrateKbps) ? Number(body.bitrateKbps) : null,
		width: Number.isFinite(body.width) ? Number(body.width) : null,
		height: Number.isFinite(body.height) ? Number(body.height) : null,
		vastTagUrl: body.vastTagUrl ?? null,
		clickUrl: body.clickUrl ?? null,
		ctaLabel: body.ctaLabel ?? null,
		headline: body.headline ?? null,
		body: body.body ?? null,
		mobileBehavior: body.mobileBehavior === "skip" ? "skip" : "takeover",
		weight: Number.isFinite(body.weight) ? Number(body.weight) : 1
	}).returning();
	return json({ creative }, { status: 201 });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-BNXD5r5M.js.map
