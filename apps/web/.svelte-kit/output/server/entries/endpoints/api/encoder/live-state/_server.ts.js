import { t as private_env } from "../../../../../chunks/shared-server.js";
import { V as liveStreams, t as db } from "../../../../../chunks/drizzle.js";
import { t as notify } from "../../../../../chunks/notify.js";
import { n as publish } from "../../../../../chunks/sse.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region src/routes/api/encoder/live-state/+server.ts
/**
* POST /api/encoder/live-state
*
* Webhook from the orchestrator's live ingest service. Pushes status
* transitions + viewer-count updates so the watch page + creator
* dashboard reflect reality in real time.
*
* Body:
*   { streamKey, status, playbackUrl?, viewerCount?, peakViewerCount?, recordingMediaId?, errorMessage? }
*
* HMAC-signed (same ENCODER_WEBHOOK_SECRET as the VOD pipeline).
*/
var KNOWN_STATUSES = new Set([
	"idle",
	"ingest",
	"live",
	"ending",
	"ended",
	"errored"
]);
function verifySignature(rawBody, signature, secret) {
	if (!signature) return false;
	const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
	const a = Buffer.from(expected, "hex");
	const b = Buffer.from(signature, "hex");
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}
var POST = async ({ request }) => {
	const rawBody = await request.text();
	const secret = private_env.ENCODER_WEBHOOK_SECRET;
	if (secret) {
		if (!verifySignature(rawBody, request.headers.get("x-encoder-signature"), secret)) return json({ error: "Invalid signature" }, { status: 401 });
	}
	let body;
	try {
		body = JSON.parse(rawBody);
	} catch {
		return json({ error: "Malformed JSON" }, { status: 400 });
	}
	if (!body.streamKey) return json({ error: "streamKey is required" }, { status: 400 });
	const [stream] = await db.select({
		id: liveStreams.id,
		creatorId: liveStreams.creatorId,
		title: liveStreams.title,
		status: liveStreams.status,
		viewerCountPeak: liveStreams.viewerCountPeak
	}).from(liveStreams).where(eq(liveStreams.streamKey, body.streamKey)).limit(1);
	if (!stream) return json({
		ok: true,
		matched: false
	});
	const updates = { updatedAt: /* @__PURE__ */ new Date() };
	if (body.status && KNOWN_STATUSES.has(body.status)) {
		updates.status = body.status;
		if (body.status === "live" && stream.status !== "live") updates.startedAt = /* @__PURE__ */ new Date();
		if (body.status === "ended" && stream.status !== "ended") updates.endedAt = /* @__PURE__ */ new Date();
	}
	if (typeof body.viewerCount === "number") {
		const nextCount = Math.max(0, Math.round(body.viewerCount));
		updates.viewerCount = nextCount;
		if (nextCount > Number(stream.viewerCountPeak ?? 0)) updates.viewerCountPeak = nextCount;
	}
	if (typeof body.peakViewerCount === "number" && Number(body.peakViewerCount) > Number(stream.viewerCountPeak ?? 0)) updates.viewerCountPeak = Math.round(body.peakViewerCount);
	if (body.playbackUrl) updates.playbackUrl = body.playbackUrl;
	if (body.recordingMediaId) updates.recordingMediaId = body.recordingMediaId;
	const [updated] = await db.update(liveStreams).set(updates).where(eq(liveStreams.id, stream.id)).returning({
		id: liveStreams.id,
		status: liveStreams.status,
		viewerCount: liveStreams.viewerCount,
		viewerCountPeak: liveStreams.viewerCountPeak,
		playbackUrl: liveStreams.playbackUrl
	});
	publish(`live:${stream.id}`, {
		streamId: stream.id,
		status: updated.status,
		viewerCount: updated.viewerCount,
		playbackUrl: updated.playbackUrl
	});
	if (body.status === "live" && stream.status !== "live") notify({
		userId: stream.creatorId,
		kind: "system",
		title: `You're live: "${stream.title.slice(0, 60)}"`,
		message: "Your stream is broadcasting now.",
		actionUrl: `/creator/live`
	}).catch(() => void 0);
	if (body.status === "ended" && stream.status !== "ended") notify({
		userId: stream.creatorId,
		kind: "system",
		title: `Stream ended: "${stream.title.slice(0, 60)}"`,
		message: body.recordingMediaId ? "Your recording is being processed." : "See you next time.",
		actionUrl: `/creator/live`
	}).catch(() => void 0);
	return json({ ok: true });
};
//#endregion
export { POST };
