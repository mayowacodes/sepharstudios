import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import { startEncoderWorkflow } from '$lib/server/temporal-client';

/**
 * POST /api/admin/encoder/jobs/[mediaId]/retry
 *
 * Re-runs an existing encode against the SAME source video. The source
 * file is still in encoder MinIO at `${oldJobId}/source` (the original
 * /api/encoder/jobs upload). We don't re-upload — we just start a new
 * workflow.
 *
 * Why a NEW jobId: Temporal workflowIds are unique. Starting a workflow
 * with the same workflowId raises AlreadyStarted (even if the old one
 * failed). So we mint a fresh jobId, point its `inputObject` back at the
 * old upload, and update the media row to track the new id. The HLS
 * output lands under the new jobId prefix; the encoder-playback helper
 * keeps working because it derives videoUrl from `${encoderJobId}/master.m3u8`.
 */

const INPUT_BUCKET = env.ENCODER_INPUT_BUCKET || env.MINIO_INPUT_BUCKET || 'encoder-input';
const OUTPUT_BUCKET = env.ENCODER_OUTPUT_BUCKET || env.MINIO_OUTPUT_BUCKET || 'encoder-output';

function newJobId(): string {
	const d = new Date();
	const yyyymmdd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
	const hex = randomBytes(5).toString('hex');
	return `job_${yyyymmdd}_${hex}`;
}

export const POST: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const [row] = await db.select({
		id: mediaLibrary.id,
		encoderJobId: mediaLibrary.encoderJobId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.mediaId!)).limit(1);

	if (!row) return json({ error: 'Not found' }, { status: 404 });
	if (!row.encoderJobId) {
		return json({ error: 'No encoder job to retry — content needs a fresh upload.' }, { status: 400 });
	}

	const oldJobId = row.encoderJobId;
	const newJob = newJobId();

	try {
		await startEncoderWorkflow({
			jobId: newJob,
			mediaId: row.id,
			inputBucket: INPUT_BUCKET,
			// Reuse the original upload — it's still in encoder MinIO at the old prefix.
			inputObject: `${oldJobId}/source`,
			outputBucket: OUTPUT_BUCKET,
			outputPrefix: newJob,
			profile: 'vod-multi'
		});
	} catch (err) {
		console.error(`[admin/encoder/retry] Temporal start failed for new jobId=${newJob}:`, err);
		return json({ error: 'Temporal start failed', detail: (err as Error).message }, { status: 502 });
	}

	// Swap the row to the new workflow + clear the prior error / state.
	// videoUrl is also cleared so the webhook on the new `ready` writes a
	// fresh master.m3u8 URL pointing at the new prefix.
	await db.update(mediaLibrary)
		.set({
			encoderJobId: newJob,
			processingStatus: 'created',
			processingProgress: 0,
			processingStage: null,
			processingError: null,
			videoUrl: null,
			updatedAt: new Date()
		})
		.where(eq(mediaLibrary.id, row.id));

	return json({ success: true, oldJobId, jobId: newJob });
};
