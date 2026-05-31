import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from '$lib/db/drizzle';
import { liveStreams, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { publish } from '$lib/server/sse';
import { notify } from '$lib/server/notify';

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

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
	if (!signature) return false;
	const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
	const a = Buffer.from(expected, 'hex');
	const b = Buffer.from(signature, 'hex');
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

interface FinalizeBody {
	streamKey?: string;
	recordingUrl?: string;
	durationSec?: number;
	thumbnailUrl?: string;
	encoderJobId?: string;
}

function formatDuration(sec: number | undefined): string | null {
	if (!sec || sec <= 0) return null;
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);
	return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function slugify(s: string): string {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	const secret = env.ENCODER_WEBHOOK_SECRET;
	if (secret) {
		const sig = request.headers.get('x-encoder-signature');
		if (!verifySignature(rawBody, sig, secret)) {
			return json({ error: 'Invalid signature' }, { status: 401 });
		}
	}

	let body: FinalizeBody;
	try {
		body = JSON.parse(rawBody);
	} catch {
		return json({ error: 'Malformed JSON' }, { status: 400 });
	}

	if (!body.streamKey) return json({ error: 'streamKey is required' }, { status: 400 });
	if (!body.recordingUrl) return json({ error: 'recordingUrl is required' }, { status: 400 });

	const [stream] = await db
		.select({
			id: liveStreams.id,
			creatorId: liveStreams.creatorId,
			title: liveStreams.title,
			description: liveStreams.description,
			thumbnailUrl: liveStreams.thumbnailUrl,
			recordingMediaId: liveStreams.recordingMediaId
		})
		.from(liveStreams)
		.where(eq(liveStreams.streamKey, body.streamKey))
		.limit(1);

	if (!stream) {
		// Unknown stream — orchestrator likely has stale state. Return 200 so
		// it doesn't pile DLQ entries.
		return json({ ok: true, matched: false });
	}

	if (stream.recordingMediaId) {
		// Idempotent — already finalized.
		return json({ ok: true, matched: true, mediaId: stream.recordingMediaId, alreadyFinalized: true });
	}

	const mediaId = crypto.randomUUID();
	const slugBase = slugify(`${stream.title} ${stream.id.slice(0, 8)}`);

	await db.insert(mediaLibrary).values({
		id: mediaId,
		title: stream.title,
		description: stream.description ?? null,
		thumbnail: body.thumbnailUrl ?? stream.thumbnailUrl ?? null,
		videoUrl: body.recordingUrl,
		encoderJobId: body.encoderJobId ?? null,
		processingStatus: 'ready',
		mediaType: 'movie',
		category: null,
		creatorId: stream.creatorId,
		link: `/watch/${mediaId}`,
		slug: `${slugBase}-${mediaId.slice(0, 6)}`,
		duration: formatDuration(body.durationSec),
		isActive: true,
		status: 'approved',
		visibility: 'public'
	});

	await db
		.update(liveStreams)
		.set({ recordingMediaId: mediaId, updatedAt: new Date() })
		.where(eq(liveStreams.id, stream.id));

	// Push the new id so the watch-live page swaps to "watch recording" mode.
	publish(`live:${stream.id}`, {
		streamId: stream.id,
		recordingMediaId: mediaId
	});

	notify({
		userId: stream.creatorId,
		kind: 'system',
		title: `Recording ready: "${stream.title.slice(0, 60)}"`,
		message: 'Your live broadcast has been published as a VOD.',
		actionUrl: `/watch/${mediaId}`
	}).catch(() => undefined);

	return json({ ok: true, matched: true, mediaId });
};
