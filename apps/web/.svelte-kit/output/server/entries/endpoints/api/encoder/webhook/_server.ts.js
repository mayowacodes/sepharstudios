import { t as private_env } from "../../../../../chunks/shared-server.js";
import { K as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { n as publish } from "../../../../../chunks/sse.js";
import { t as masterPlaylistUrl } from "../../../../../chunks/encoder-playback.js";
import { t as notify } from "../../../../../chunks/notify.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region src/routes/api/encoder/webhook/+server.ts
/**
* POST /api/encoder/webhook
*
* Push endpoint from the orchestrator in `Documents/Projects/encoder`. The
* orchestrator is the only thing that talks to us (gateway model) — the
* worker never calls in directly. HMAC-signed body over the RAW request
* bytes; we verify before any JSON re-serialization.
*
* Body (per platform integration contract §1):
*   {
*     jobId,                 // required
*     mediaId?,              // present if passed at job creation
*     status,                // created|queued|running|ready|failed|cancelled
*     progressPct?,          // 0-100, monotonic per job, exactly 100 at "ready"
*     stage?,                // free-text; see common stage list below
*     errorMessage?          // only when status="failed", ≤2000 chars
*   }
*
* Idempotent + tolerant of out-of-order: the orchestrator re-emits
* `running` every ~5s as a keepalive; we treat a lower pct or a status
* downgrade as a no-op for the column update (still publish the SSE event
* so subscribers tick).
*
* Headers:
*   x-encoder-signature: hex HMAC-SHA256 of the raw body using
*                         $ENCODER_WEBHOOK_SECRET. Required in non-dev.
*/
var COMMON_STAGES = new Set([
	"probe",
	"queued",
	"hls-480",
	"hls-720",
	"hls-1080",
	"hls-1440",
	"hls-2160",
	"thumb",
	"finalize"
]);
var KNOWN_STATUSES = new Set([
	"created",
	"queued",
	"running",
	"ready",
	"failed",
	"cancelled"
]);
/** Statuses sorted from earliest → terminal. Used to detect downgrades. */
var STATUS_ORDER = [
	"created",
	"queued",
	"running",
	"ready",
	"failed",
	"cancelled"
];
function statusRank(s) {
	if (!s) return -1;
	const i = STATUS_ORDER.indexOf(s);
	return i === -1 ? -1 : i;
}
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
	if (!secret) {
		console.error("[encoder/webhook] ENCODER_WEBHOOK_SECRET is not configured — rejecting webhook");
		return json({ error: "Webhook secret not configured" }, { status: 500 });
	}
	if (!verifySignature(rawBody, request.headers.get("x-encoder-signature"), secret)) return json({ error: "Invalid signature" }, { status: 401 });
	let body;
	try {
		body = JSON.parse(rawBody);
	} catch {
		return json({ error: "Malformed JSON" }, { status: 400 });
	}
	if (!body.jobId) return json({ error: "jobId is required" }, { status: 400 });
	const rowProjection = {
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		creatorId: mediaLibrary.creatorId,
		processingStatus: mediaLibrary.processingStatus,
		processingProgress: mediaLibrary.processingProgress,
		processingStage: mediaLibrary.processingStage,
		videoUrl: mediaLibrary.videoUrl,
		encoderJobId: mediaLibrary.encoderJobId
	};
	const [current] = await (body.mediaId ? db.select(rowProjection).from(mediaLibrary).where(eq(mediaLibrary.id, body.mediaId)).limit(1) : db.select(rowProjection).from(mediaLibrary).where(eq(mediaLibrary.encoderJobId, body.jobId)).limit(1));
	if (!current) return json({
		ok: true,
		matched: false
	});
	if (current.encoderJobId && body.jobId !== current.encoderJobId) {
		console.info(`[encoder/webhook] ignoring stale job event: row ${current.id} is on ${current.encoderJobId}, event was for ${body.jobId}`);
		return json({
			ok: true,
			matched: false,
			stale: true
		});
	}
	const updates = { updatedAt: /* @__PURE__ */ new Date() };
	if (body.status && KNOWN_STATUSES.has(body.status)) {
		const incomingRank = statusRank(body.status);
		const currentRank = statusRank(current.processingStatus);
		const currentTerminal = [
			"ready",
			"failed",
			"cancelled"
		].includes(current.processingStatus ?? "");
		const incomingTerminal = [
			"ready",
			"failed",
			"cancelled"
		].includes(body.status);
		if (incomingTerminal || incomingRank >= currentRank) {
			if (!currentTerminal || incomingTerminal) {
				updates.processingStatus = body.status;
				if (body.status === "ready" && current.processingStatus !== "ready") updates.processedAt = /* @__PURE__ */ new Date();
			}
		}
	}
	if (typeof body.progressPct === "number") {
		const next = Math.max(0, Math.min(100, Math.round(body.progressPct)));
		if (next > (current.processingProgress ?? -1)) updates.processingProgress = next;
	}
	if (body.stage) {
		const stage = body.stage.slice(0, 40);
		if (stage && stage !== current.processingStage && (COMMON_STAGES.has(stage) || stage.length <= 40)) updates.processingStage = stage;
	}
	if (body.status === "failed" && body.errorMessage) updates.processingError = body.errorMessage.slice(0, 2e3);
	if (body.status === "ready") {
		updates.processingProgress = 100;
		updates.processingError = null;
		if (!current.videoUrl) {
			const jobIdForUrl = current.encoderJobId ?? body.jobId;
			if (jobIdForUrl) try {
				updates.videoUrl = masterPlaylistUrl(jobIdForUrl);
			} catch (err) {
				console.error("[encoder/webhook] masterPlaylistUrl failed:", err);
			}
		}
	}
	let updated = current;
	if (Object.keys(updates).length > 1) {
		const [row] = await db.update(mediaLibrary).set(updates).where(eq(mediaLibrary.id, current.id)).returning({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			creatorId: mediaLibrary.creatorId,
			processingStatus: mediaLibrary.processingStatus,
			processingProgress: mediaLibrary.processingProgress,
			processingStage: mediaLibrary.processingStage,
			processingError: mediaLibrary.processingError
		});
		updated = {
			...current,
			...row
		};
	}
	const event = {
		jobId: body.jobId,
		mediaId: updated.id,
		creatorId: updated.creatorId,
		status: updated.processingStatus,
		progress: updated.processingProgress,
		stage: updated.processingStage,
		error: "processingError" in updated ? updated.processingError : null
	};
	publish("encoder:all", event);
	if (updated.creatorId) publish(`encoder:creator:${updated.creatorId}`, event);
	const justTransitioned = body.status && current.processingStatus !== body.status && updates.processingStatus === body.status;
	if (updated.creatorId && justTransitioned && (body.status === "ready" || body.status === "failed")) notify({
		userId: updated.creatorId,
		kind: "system",
		title: body.status === "ready" ? `"${updated.title.slice(0, 60)}" is ready to publish` : `Encoding failed for "${updated.title.slice(0, 60)}"`,
		message: body.status === "failed" && body.errorMessage ? body.errorMessage.slice(0, 200) : "Open the content detail page to continue.",
		actionUrl: `/creator/content/${updated.id}`
	}).catch(() => void 0);
	return json({
		ok: true,
		matched: true
	});
};
//#endregion
export { POST };
