import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from '$lib/db/drizzle';
import { liveStreams } from '$lib/db/schema/sepharstudios';
import { eq, sql } from 'drizzle-orm';
import { publish } from '$lib/server/sse';
import { notify } from '$lib/server/notify';

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

const KNOWN_STATUSES = new Set(['idle', 'ingest', 'live', 'ending', 'ended', 'errored']);

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
	if (!signature) return false;
	const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
	const a = Buffer.from(expected, 'hex');
	const b = Buffer.from(signature, 'hex');
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

interface LiveStateBody {
	streamKey?: string;
	status?: string;
	playbackUrl?: string;
	viewerCount?: number;
	peakViewerCount?: number;
	recordingMediaId?: string;
	errorMessage?: string;
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

	let body: LiveStateBody;
	try {
		body = JSON.parse(rawBody);
	} catch {
		return json({ error: 'Malformed JSON' }, { status: 400 });
	}

	if (!body.streamKey) return json({ error: 'streamKey is required' }, { status: 400 });

	const [stream] = await db.select({
		id: liveStreams.id,
		creatorId: liveStreams.creatorId,
		title: liveStreams.title,
		status: liveStreams.status,
		viewerCountPeak: liveStreams.viewerCountPeak
	})
		.from(liveStreams)
		.where(eq(liveStreams.streamKey, body.streamKey))
		.limit(1);
	if (!stream) {
		// Unknown stream key — orchestrator probably has stale routing. 200
		// so it doesn't pile DLQ entries.
		return json({ ok: true, matched: false });
	}

	const updates: Record<string, unknown> = { updatedAt: new Date() };
	if (body.status && KNOWN_STATUSES.has(body.status)) {
		updates.status = body.status;
		if (body.status === 'live' && stream.status !== 'live') updates.startedAt = new Date();
		if (body.status === 'ended' && stream.status !== 'ended') updates.endedAt = new Date();
	}
	if (typeof body.viewerCount === 'number') {
		const nextCount = Math.max(0, Math.round(body.viewerCount));
		updates.viewerCount = nextCount;
		if (nextCount > Number(stream.viewerCountPeak ?? 0)) {
			updates.viewerCountPeak = nextCount;
		}
	}
	if (typeof body.peakViewerCount === 'number' && Number(body.peakViewerCount) > Number(stream.viewerCountPeak ?? 0)) {
		updates.viewerCountPeak = Math.round(body.peakViewerCount);
	}
	if (body.playbackUrl) updates.playbackUrl = body.playbackUrl;
	if (body.recordingMediaId) updates.recordingMediaId = body.recordingMediaId;

	const [updated] = await db.update(liveStreams)
		.set(updates)
		.where(eq(liveStreams.id, stream.id))
		.returning({
			id: liveStreams.id,
			status: liveStreams.status,
			viewerCount: liveStreams.viewerCount,
			viewerCountPeak: liveStreams.viewerCountPeak,
			playbackUrl: liveStreams.playbackUrl
		});

	// Push to anyone watching this stream's live state.
	publish(`live:${stream.id}`, {
		streamId: stream.id,
		status: updated.status,
		viewerCount: updated.viewerCount,
		playbackUrl: updated.playbackUrl
	});

	// Notify the creator on key transitions.
	if (body.status === 'live' && stream.status !== 'live') {
		notify({
			userId: stream.creatorId,
			kind: 'system',
			title: `You're live: "${stream.title.slice(0, 60)}"`,
			message: 'Your stream is broadcasting now.',
			actionUrl: `/creator/live`
		}).catch(() => undefined);
	}
	if (body.status === 'ended' && stream.status !== 'ended') {
		notify({
			userId: stream.creatorId,
			kind: 'system',
			title: `Stream ended: "${stream.title.slice(0, 60)}"`,
			message: body.recordingMediaId ? 'Your recording is being processed.' : 'See you next time.',
			actionUrl: `/creator/live`
		}).catch(() => undefined);
	}

	return json({ ok: true });
};
