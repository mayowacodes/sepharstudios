import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { liveStreams } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

/**
 * GET /api/encoder/live-state/validate?streamKey=<key>
 *
 * Called by the orchestrator's RTMP ingest on every new connection to
 * decide whether to accept or reject the stream. Returns the stream id
 * + creator id when valid so the orchestrator can route per-stream
 * artifacts.
 */

export const GET: RequestHandler = async ({ url }) => {
	const streamKey = url.searchParams.get('streamKey');
	if (!streamKey) return json({ valid: false });

	const [stream] = await db.select({
		id: liveStreams.id,
		creatorId: liveStreams.creatorId,
		status: liveStreams.status
	})
		.from(liveStreams)
		.where(eq(liveStreams.streamKey, streamKey))
		.limit(1);

	if (!stream) return json({ valid: false });
	if (stream.status === 'ended') return json({ valid: false, reason: 'Stream has ended' });

	return json({
		valid: true,
		streamId: stream.id,
		creatorId: stream.creatorId
	});
};
