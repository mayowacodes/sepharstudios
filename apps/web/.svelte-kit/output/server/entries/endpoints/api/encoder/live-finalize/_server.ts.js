import { t as private_env } from "../../../../../chunks/shared-server.js";
import { K as mediaLibrary, W as liveStreams, t as db } from "../../../../../chunks/drizzle.js";
import { n as publish } from "../../../../../chunks/sse.js";
import { t as notify } from "../../../../../chunks/notify.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region src/routes/api/encoder/live-finalize/+server.ts
/**
* POST /api/encoder/live-finalize
*
* Webhook from the orchestrator when a live stream's recording has been
* packaged into a playable VOD. We create a `media_library` row for the
* recording (carrying the live stream's title + creator + thumbnail) and
* pin its id onto `liveStreams.recordingMediaId`. The watch live page
* then automatically switches to "watch the recording" mode.
*
* Body:
*   {
*     streamKey: string;
*     recordingUrl: string;     // HLS master URL
*     durationSec?: number;
*     thumbnailUrl?: string;
*     encoderJobId?: string;
*   }
*
* HMAC-signed via ENCODER_WEBHOOK_SECRET. The route is idempotent on
* `streamKey` — if the stream already has a `recordingMediaId`, we don't
* create a duplicate media row, we just no-op.
*/
function verifySignature(rawBody, signature, secret) {
	if (!signature) return false;
	const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
	const a = Buffer.from(expected, "hex");
	const b = Buffer.from(signature, "hex");
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}
function formatDuration(sec) {
	if (!sec || sec <= 0) return null;
	const h = Math.floor(sec / 3600);
	const m = Math.floor(sec % 3600 / 60);
	return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function slugify(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
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
	if (!body.recordingUrl) return json({ error: "recordingUrl is required" }, { status: 400 });
	const [stream] = await db.select({
		id: liveStreams.id,
		creatorId: liveStreams.creatorId,
		title: liveStreams.title,
		description: liveStreams.description,
		thumbnailUrl: liveStreams.thumbnailUrl,
		recordingMediaId: liveStreams.recordingMediaId
	}).from(liveStreams).where(eq(liveStreams.streamKey, body.streamKey)).limit(1);
	if (!stream) return json({
		ok: true,
		matched: false
	});
	if (stream.recordingMediaId) return json({
		ok: true,
		matched: true,
		mediaId: stream.recordingMediaId,
		alreadyFinalized: true
	});
	const mediaId = crypto.randomUUID();
	const slugBase = slugify(`${stream.title} ${stream.id.slice(0, 8)}`);
	await db.insert(mediaLibrary).values({
		id: mediaId,
		title: stream.title,
		description: stream.description ?? null,
		thumbnail: body.thumbnailUrl ?? stream.thumbnailUrl ?? null,
		videoUrl: body.recordingUrl,
		encoderJobId: body.encoderJobId ?? null,
		processingStatus: "ready",
		mediaType: "movie",
		category: null,
		creatorId: stream.creatorId,
		link: `/watch/${mediaId}`,
		slug: `${slugBase}-${mediaId.slice(0, 6)}`,
		duration: formatDuration(body.durationSec),
		isActive: true,
		status: "approved",
		visibility: "public"
	});
	await db.update(liveStreams).set({
		recordingMediaId: mediaId,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(liveStreams.id, stream.id));
	publish(`live:${stream.id}`, {
		streamId: stream.id,
		recordingMediaId: mediaId
	});
	notify({
		userId: stream.creatorId,
		kind: "system",
		title: `Recording ready: "${stream.title.slice(0, 60)}"`,
		message: "Your live broadcast has been published as a VOD.",
		actionUrl: `/watch/${mediaId}`
	}).catch(() => void 0);
	return json({
		ok: true,
		matched: true,
		mediaId
	});
};
//#endregion
export { POST };
