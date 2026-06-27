import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import { startEncoderWorkflow } from '$lib/server/temporal-client';
import { encoderMinioClient } from '$lib/server/minio';

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
	const inputObject = `${oldJobId}/source`;

	// Pre-flight: confirm the source video is actually in MinIO before we
	// burn a Temporal workflow + retry budget. The retry path used to start
	// a workflow blindly; if the original upload had silently failed, the
	// activity hit S3 404, retried 3× over ~3 min, and the admin saw a
	// cryptic "Activity task failed". Now we surface the real reason and
	// stamp the row with an actionable error so the admin can decide to
	// ask the creator to re-upload instead of clicking Retry again.
	try {
		await encoderMinioClient.statObject(INPUT_BUCKET, inputObject);
	} catch (err) {
		const isNotFound = (err as { code?: string })?.code === 'NotFound'
			|| /not\s*found/i.test((err as Error)?.message ?? '');
		if (isNotFound) {
			const detail = `Source video missing in MinIO (${INPUT_BUCKET}/${inputObject}). The original upload didn't land — Retry can't help here. Ask the creator to re-upload the video.`;
			await db.update(mediaLibrary)
				.set({
					processingStatus: 'failed',
					processingError: detail,
					updatedAt: new Date()
				})
				.where(eq(mediaLibrary.id, row.id));
			return json({ error: 'Source missing', detail }, { status: 410 });
		}
		// Any other MinIO error (auth, network) bubbles up — caller sees 502.
		console.error(`[admin/encoder/retry] MinIO statObject failed for ${inputObject}:`, err);
		return json({
			error: 'Could not verify source video',
			detail: err instanceof Error ? err.message : String(err)
		}, { status: 502 });
	}

	try {
		await startEncoderWorkflow({
			jobId: newJob,
			mediaId: row.id,
			inputBucket: INPUT_BUCKET,
			// Reuse the original upload — it's still in encoder MinIO at the old prefix.
			inputObject,
			outputBucket: OUTPUT_BUCKET,
			outputPrefix: newJob,
			profile: 'vod-multi'
		});
	} catch (err) {
		// The Temporal SDK wraps the underlying gRPC error in a `cause`
		// chain. Node's default console output stops at the top-level
		// ServiceError("Failed to start Workflow") which is uninformative;
		// flatten the chain so docker logs + the JSON response carry the
		// real cause (e.g. "INVALID_ARGUMENT: search attribute mediaId is
		// not defined", "UNAVAILABLE: connection refused", etc.).
		const flattenCauses = (e: unknown): string => {
			const messages: string[] = [];
			let cur: unknown = e;
			let depth = 0;
			while (cur && depth < 5) {
				if (cur instanceof Error) {
					messages.push(`${cur.name}: ${cur.message}`);
					cur = (cur as { cause?: unknown }).cause;
				} else {
					messages.push(String(cur));
					break;
				}
				depth += 1;
			}
			return messages.join(' → ');
		};
		const detail = flattenCauses(err);
		console.error(`[admin/encoder/retry] Temporal start failed for new jobId=${newJob}: ${detail}`, err);
		return json({ error: 'Temporal start failed', detail }, { status: 502 });
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
