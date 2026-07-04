import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { getEncoderPresignedUploadUrl } from '$lib/server/minio';
import { randomBytes } from 'node:crypto';

/**
 * POST /api/encoder/jobs
 *
 * Stage-1 of the upload flow: mint a jobId and return a presigned PUT URL
 * the browser can use to push the source video straight into the encoder
 * MinIO. No orchestrator call — we own presign now.
 *
 * Object key convention: `${jobId}/source`. The Temporal workflow + worker
 * read from `inputBucket=encoder-input` / `inputObject=${jobId}/source`.
 * Extension is omitted; ffmpeg sniffs the container.
 *
 * jobId format: `job_${YYYYMMDD}_${10 hex}` — same shape the legacy
 * orchestrator emitted, so downstream tooling (Temporal Web UI, logs,
 * webhook handler) doesn't need to learn a new pattern.
 *
 * The actual encode is kicked off at /commit (stage-2) once the browser
 * has finished the PUT.
 */

const INPUT_BUCKET = env.ENCODER_INPUT_BUCKET || env.MINIO_INPUT_BUCKET || 'encoder-input';
const PRESIGN_TTL_SECONDS = 3600;

function newJobId(): string {
	const d = new Date();
	const yyyymmdd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
	const hex = randomBytes(5).toString('hex');
	return `job_${yyyymmdd}_${hex}`;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();
	const { contentId, filename } = body;
	// profile + durationHint kept for telemetry / future per-job overrides;
	// the worker reads the profile off the workflow input at /commit.

	if (!contentId || !filename) {
		return json({ error: 'contentId and filename are required' }, { status: 400 });
	}

	const [content] = await db
		.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);

	if (!content) return json({ error: 'Content not found' }, { status: 404 });
	if (content.creatorId && content.creatorId !== session.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const jobId = newJobId();
	const objectKey = `${jobId}/source`;

	try {
		const uploadUrl = await getEncoderPresignedUploadUrl(INPUT_BUCKET, objectKey, PRESIGN_TTL_SECONDS);

		await db
			.update(mediaLibrary)
			.set({
				encoderJobId: jobId,
				processingStatus: 'created',
				processingError: null,
				// Clear any prior encode's playback URL. The webhook only
				// writes videoUrl when the column is EMPTY (so it never
				// stomps static uploads), which means a re-encode that
				// leaves the old URL here plays the OLD video forever —
				// the row's encoder_job_id and the jobId inside video_url
				// drift apart. The admin retry endpoint already nulls it;
				// this creator path missed the same line.
				videoUrl: null,
				processingProgress: 0,
				updatedAt: new Date()
			})
			.where(eq(mediaLibrary.id, contentId));

		return json(
			{
				contentId,
				jobId,
				upload: {
					url: uploadUrl,
					method: 'PUT',
					expiresAt: new Date(Date.now() + PRESIGN_TTL_SECONDS * 1000).toISOString()
				}
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Failed to create encoder job:', error);
		return json({ error: 'Failed to create encoder job' }, { status: 500 });
	}
};
