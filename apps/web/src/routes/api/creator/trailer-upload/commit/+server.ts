import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { Role } from '$lib/constants';
import { startTrailerWorkflow } from '$lib/server/temporal-client';

/**
 * POST /api/creator/trailer-upload/commit
 *
 * Records a successfully-uploaded trailer in the media row. The bytes are
 * already in the encoder MinIO at this point (the browser PUT them via the
 * presigned URL from /sign). This endpoint just composes the public URL
 * and writes it to `media_library.trailerUrl`, replacing the
 * "staged-for-encoding" sentinel the wizard previously left there.
 *
 * Request:  { contentId, objectKey }
 * Response: { success: true, trailerUrl }
 */

const BUCKET = env.ENCODER_OUTPUT_BUCKET || env.MINIO_OUTPUT_BUCKET || 'encoder-output';
// The public-facing encoder MinIO host. Browsers fetch trailers from this
// URL — must match the Traefik route + bucket policy that allows public
// read on encoder-output (set up alongside the HLS playback work).
//
// Do NOT fall back to MINIO_PUBLIC_ENDPOINT — that's the MAIN MinIO and
// doesn't host the encoder-output bucket. The historical bug: an unset
// PUBLIC_ENCODER_MINIO_URL silently composed trailer URLs against the
// wrong host and every playback 403'd.
const ENCODER_MINIO_HOST = (env.PUBLIC_ENCODER_MINIO_URL ?? '').trim();
const PUBLIC_BASE = ENCODER_MINIO_HOST
	? `https://${ENCODER_MINIO_HOST.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`
	: 'https://encoder-s3.sepharstudios.com';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'unauthorized', detail: 'Sign in required.' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'forbidden', detail: 'Only creators (or admins) can commit a trailer.' }, { status: 403 });
	}

	let body: { contentId?: unknown; objectKey?: unknown };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'invalid_body', detail: 'Request body must be JSON.' }, { status: 400 });
	}

	const contentId = typeof body.contentId === 'string' ? body.contentId : '';
	const objectKey = typeof body.objectKey === 'string' ? body.objectKey : '';

	if (!contentId) return json({ error: 'missing_content_id', detail: 'contentId is required.' }, { status: 400 });
	if (!objectKey) return json({ error: 'missing_object', detail: 'objectKey is required.' }, { status: 400 });
	// Defensive — make sure the caller isn't trying to register an object
	// outside the trailers prefix we control. Without this, a malicious
	// caller could point trailerUrl at any object in the bucket.
	if (!objectKey.startsWith(`trailers/${contentId}/`)) {
		return json({ error: 'invalid_object', detail: 'objectKey is not within the expected trailer prefix.' }, { status: 400 });
	}

	const [content] = await db
		.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);
	if (!content) return json({ error: 'not_found', detail: 'Content not found.' }, { status: 404 });
	if (content.creatorId !== session.user.id && session.user.role !== 'admin') {
		return json({ error: 'forbidden', detail: 'You do not own this content.' }, { status: 403 });
	}

	const trailerUrl = `${PUBLIC_BASE}/${BUCKET}/${objectKey}`;

	try {
		await db.update(mediaLibrary)
			.set({ trailerUrl, updatedAt: new Date() })
			.where(eq(mediaLibrary.id, contentId));

		// Kick off the robust trailer pipeline. The activity probes the
		// upload — if it's already H.264/yuv420p/AAC MP4 the workflow
		// short-circuits without touching the file. Otherwise it
		// re-encodes in place to a browser-safe 720p MP4. This is
		// fire-and-forget; the trailer URL on the row doesn't change.
		// If Temporal isn't reachable, we still return success — the
		// trailer might play (if creator's source happened to be H.264)
		// or be audio-only, but the platform stays usable.
		startTrailerWorkflow({
			contentId,
			bucket: BUCKET,
			objectKey
		}).catch((err) => {
			console.error('[trailer-upload/commit] Temporal start failed (non-blocking):', err);
		});

		return json({ success: true, trailerUrl });
	} catch (err) {
		console.error('[trailer-upload/commit] DB update failed:', err);
		return json({ error: 'commit_failed', detail: 'Trailer is stored but the registry update failed.' }, { status: 500 });
	}
};
