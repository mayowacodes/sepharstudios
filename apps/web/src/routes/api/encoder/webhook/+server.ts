import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { publish } from '$lib/server/sse';
import { notify } from '$lib/server/notify';
import { masterPlaylistUrl } from '$lib/server/encoder-playback';

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

// Common stage strings — kept as a soft list; unknown stages are still
// persisted (free-text, capped) so the orchestrator can introduce new ones
// without a platform deploy.
const COMMON_STAGES = new Set([
	'probe',
	'queued',
	'hls-480',
	'hls-720',
	'hls-1080',
	'hls-1440',
	'hls-2160',
	'thumb',
	'finalize'
]);
const KNOWN_STATUSES = new Set([
	'created', 'queued', 'running', 'ready', 'failed', 'cancelled'
]);

/** Statuses sorted from earliest → terminal. Used to detect downgrades. */
const STATUS_ORDER = ['created', 'queued', 'running', 'ready', 'failed', 'cancelled'] as const;
function statusRank(s: string | null | undefined): number {
	if (!s) return -1;
	const i = (STATUS_ORDER as readonly string[]).indexOf(s);
	return i === -1 ? -1 : i;
}

interface WebhookBody {
	jobId?: string;
	mediaId?: string;
	status?: string;
	progressPct?: number;
	stage?: string;
	errorMessage?: string;
}

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
	if (!signature) return false;
	const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
	const a = Buffer.from(expected, 'hex');
	const b = Buffer.from(signature, 'hex');
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	const secret = env.ENCODER_WEBHOOK_SECRET;
	// FAIL CLOSED. An unset secret used to silently skip verification,
	// which meant a misconfigured deploy accepted unauthenticated status
	// events (anyone could mark arbitrary media "ready" + rewrite its
	// playback URL). Mirror the scheduled-publish cron: missing secret
	// is a hard configuration error, not an auth bypass.
	if (!secret) {
		console.error('[encoder/webhook] ENCODER_WEBHOOK_SECRET is not configured — rejecting webhook');
		return json({ error: 'Webhook secret not configured' }, { status: 500 });
	}
	const sig = request.headers.get('x-encoder-signature');
	if (!verifySignature(rawBody, sig, secret)) {
		return json({ error: 'Invalid signature' }, { status: 401 });
	}

	let body: WebhookBody;
	try {
		body = JSON.parse(rawBody);
	} catch {
		return json({ error: 'Malformed JSON' }, { status: 400 });
	}

	if (!body.jobId) return json({ error: 'jobId is required' }, { status: 400 });

	// Resolve the media row — prefer the orchestrator-supplied mediaId (set
	// at job creation), fall back to looking up by encoderJobId. `videoUrl`
	// and `encoderJobId` are pulled so the ready-transition branch below
	// can compose + persist the master.m3u8 URL (the webhook body never
	// includes it — see encoder-playback.ts for why).
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
	const [current] = await (body.mediaId
		? db.select(rowProjection).from(mediaLibrary).where(eq(mediaLibrary.id, body.mediaId)).limit(1)
		: db.select(rowProjection).from(mediaLibrary).where(eq(mediaLibrary.encoderJobId, body.jobId)).limit(1));

	if (!current) {
		// Unknown row — orchestrator probably retried with a stale ID. 200 so
		// it doesn't pile up DLQ entries; nothing we can do without a row.
		return json({ ok: true, matched: false });
	}

	// STALE-JOB GUARD. When the row was resolved by mediaId, the event's
	// jobId must match the row's CURRENT encoderJobId. Without this, a
	// late/duplicate "ready" from an old job (orchestrator retries are
	// expected) lands after a re-encode has already minted a new jobId:
	// the status rank check passes, processingStatus flips to ready
	// prematurely, and the ready-branch below composes videoUrl from the
	// NEW jobId whose output doesn't exist yet → permanent 404 playback,
	// while the terminal-state guard then blocks the real job's progress
	// updates. 200 (not 4xx) so the orchestrator doesn't retry a message
	// we will never accept.
	if (current.encoderJobId && body.jobId !== current.encoderJobId) {
		console.info(
			`[encoder/webhook] ignoring stale job event: row ${current.id} is on ${current.encoderJobId}, event was for ${body.jobId}`
		);
		return json({ ok: true, matched: false, stale: true });
	}

	// Decide which fields to actually update (idempotent / monotonic).
	const updates: Record<string, unknown> = { updatedAt: new Date() };

	if (body.status && KNOWN_STATUSES.has(body.status)) {
		// Don't downgrade a terminal state. Once we're in ready/failed/cancelled,
		// only allow another terminal write (e.g. ready→failed if a follow-up
		// step explodes, or cancelled overrides everything).
		const incomingRank = statusRank(body.status);
		const currentRank = statusRank(current.processingStatus);
		const currentTerminal = ['ready', 'failed', 'cancelled'].includes(current.processingStatus ?? '');
		const incomingTerminal = ['ready', 'failed', 'cancelled'].includes(body.status);
		if (incomingTerminal || incomingRank >= currentRank) {
			if (!currentTerminal || incomingTerminal) {
				updates.processingStatus = body.status;
				if (body.status === 'ready' && current.processingStatus !== 'ready') {
					updates.processedAt = new Date();
				}
			}
		}
	}

	if (typeof body.progressPct === 'number') {
		const next = Math.max(0, Math.min(100, Math.round(body.progressPct)));
		// Monotonic: never lower the persisted pct. The orchestrator already
		// clamps upstream, but a re-delivery could otherwise tick backward.
		if (next > (current.processingProgress ?? -1)) {
			updates.processingProgress = next;
		}
	}

	if (body.stage) {
		const stage = body.stage.slice(0, 40);
		// Persist unknown stages as-is (spec says treat as free-text); we
		// only filter empty/oversize strings.
		if (stage && stage !== current.processingStage && (COMMON_STAGES.has(stage) || stage.length <= 40)) {
			updates.processingStage = stage;
		}
	}

	if (body.status === 'failed' && body.errorMessage) {
		updates.processingError = body.errorMessage.slice(0, 2000);
	}
	if (body.status === 'ready') {
		updates.processingProgress = 100;
		updates.processingError = null;
		// Persist the master-playlist URL on the row so every consumer
		// (admin review, /movies modal, future surfaces) can play without
		// each one re-deriving the URL or calling out to the orchestrator.
		// Only write when the column is empty so we never stomp a static
		// upload, a live-recording finalize, or a prior successful encode.
		if (!current.videoUrl) {
			const jobIdForUrl = current.encoderJobId ?? body.jobId;
			if (jobIdForUrl) {
				try {
					updates.videoUrl = masterPlaylistUrl(jobIdForUrl);
				} catch (err) {
					// Composition only fails on an empty jobId; we've
					// already guarded that, but log defensively so this
					// never silently leaves videoUrl unset.
					console.error('[encoder/webhook] masterPlaylistUrl failed:', err);
				}
			}
		}
	}

	// Only hit the DB when something actually changed beyond updatedAt.
	let updated = current;
	if (Object.keys(updates).length > 1) {
		const [row] = await db.update(mediaLibrary)
			.set(updates)
			.where(eq(mediaLibrary.id, current.id))
			.returning({
				id: mediaLibrary.id,
				title: mediaLibrary.title,
				creatorId: mediaLibrary.creatorId,
				processingStatus: mediaLibrary.processingStatus,
				processingProgress: mediaLibrary.processingProgress,
				processingStage: mediaLibrary.processingStage,
				processingError: mediaLibrary.processingError
			});
		updated = { ...current, ...row };
	}

	const event = {
		jobId: body.jobId,
		mediaId: updated.id,
		creatorId: updated.creatorId,
		status: updated.processingStatus,
		progress: updated.processingProgress,
		stage: updated.processingStage,
		error: 'processingError' in updated ? (updated as typeof updated & { processingError: string | null }).processingError : null
	};

	publish('encoder:all', event);
	if (updated.creatorId) {
		publish(`encoder:creator:${updated.creatorId}`, event);
	}

	// Stage-transition notifications. We only notify the creator when the
	// job becomes ready or fails — every progress tick would spam them.
	// Guard on the actual state TRANSITION (not just incoming body) so a
	// re-delivered "ready" doesn't re-notify.
	const justTransitioned = body.status && current.processingStatus !== body.status && updates.processingStatus === body.status;
	if (updated.creatorId && justTransitioned && (body.status === 'ready' || body.status === 'failed')) {
		notify({
			userId: updated.creatorId,
			kind: 'system',
			title: body.status === 'ready'
				? `"${updated.title.slice(0, 60)}" is ready to publish`
				: `Encoding failed for "${updated.title.slice(0, 60)}"`,
			message: body.status === 'failed' && body.errorMessage
				? body.errorMessage.slice(0, 200)
				: 'Open the content detail page to continue.',
			actionUrl: `/creator/content/${updated.id}`
		}).catch(() => undefined);
	}

	return json({ ok: true, matched: true });
};
