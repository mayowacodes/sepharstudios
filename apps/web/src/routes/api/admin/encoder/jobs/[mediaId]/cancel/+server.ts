import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { cancelEncoderJob } from '$lib/server/encoder-orchestrator';

/**
 * POST /api/admin/encoder/jobs/[mediaId]/cancel
 *
 * System-health admin tool. Looks up the encoder job id from the media
 * row, then asks the orchestrator to cancel it (gateway model). The
 * worker tears down FFmpeg on its next /control poll and a `cancelled`
 * progress webhook settles the row. We optimistically flip the local
 * state to 'cancelled' so the dashboard reflects the action immediately.
 */

export const POST: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const [row] = await db.select({
		id: mediaLibrary.id,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus
	})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.mediaId!))
		.limit(1);

	if (!row) return json({ error: 'Not found' }, { status: 404 });
	if (!row.encoderJobId) {
		return json({ error: 'No encoder job for this content' }, { status: 409 });
	}
	if (['ready', 'cancelled'].includes(row.processingStatus ?? '')) {
		return json({ error: `Job is already ${row.processingStatus}` }, { status: 409 });
	}

	try {
		await cancelEncoderJob(row.encoderJobId);
	} catch (err) {
		console.error(`[admin encoder cancel] orchestrator cancel failed for ${row.id}:`, err);
		return json({
			error: 'Orchestrator cancel failed',
			detail: err instanceof Error ? err.message : 'unknown'
		}, { status: 502 });
	}

	// Optimistic local state — the terminal write comes from the cancel
	// progress webhook.
	await db.update(mediaLibrary)
		.set({ processingStatus: 'cancelled', updatedAt: new Date() })
		.where(eq(mediaLibrary.id, row.id));

	return json({ success: true, jobId: row.encoderJobId, status: 'cancelling' });
};
