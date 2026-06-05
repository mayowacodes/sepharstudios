import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getMainPresignedUploadUrl } from '$lib/server/minio';

const DEFAULT_BUCKET = env.MINIO_BUCKET || 'uploads';

// Whitelist of bucket names the wizard / profile uploads are allowed to
// target. Without this any signed-in user could request a presigned PUT
// against any bucket name the server happens to be able to create —
// including a name designed to clash with internal infra. Keep it short
// and add new entries as new asset categories appear.
const ALLOWED_BUCKETS = new Set(['thumbnails', 'avatars', 'uploads']);

// Cap the filename length so we can't be tricked into generating an
// object name that violates MinIO's 1024-byte object name limit.
const MAX_FILENAME_LEN = 200;

// Reject obviously hostile filenames before we hand them to MinIO. The
// regex allows letters, digits, ASCII punctuation we actually need, and
// nothing else — no path separators, no control chars, no NULs.
const SAFE_FILENAME = /^[A-Za-z0-9._\-() ]+$/;

/**
 * POST /api/files/sign
 *
 * Returns a short-lived presigned PUT URL the browser can use to upload
 * a file directly to MinIO. The actual file bytes never pass through
 * this server — that's the whole point. We just sign + return the URL.
 *
 * Request:  { filename: string, bucket?: 'thumbnails' | 'avatars' | 'uploads', contentType?: string }
 * Response: { uploadUrl: string, objectName: string, bucket: string, expiresInSeconds: number }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'unauthorized', detail: 'Sign in required.' }, { status: 401 });

	let body: { filename?: unknown; bucket?: unknown; contentType?: unknown };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'invalid_body', detail: 'Request body must be JSON.' }, { status: 400 });
	}

	const filenameRaw = typeof body.filename === 'string' ? body.filename.trim() : '';
	const bucketRaw = typeof body.bucket === 'string' ? body.bucket : DEFAULT_BUCKET;

	if (!filenameRaw) {
		return json({ error: 'missing_filename', detail: 'A filename is required.' }, { status: 400 });
	}
	if (filenameRaw.length > MAX_FILENAME_LEN) {
		return json({ error: 'filename_too_long', detail: `Filename must be ${MAX_FILENAME_LEN} characters or fewer.` }, { status: 400 });
	}
	if (!SAFE_FILENAME.test(filenameRaw)) {
		return json({ error: 'invalid_filename', detail: 'Filename contains characters that are not allowed.' }, { status: 400 });
	}
	if (!ALLOWED_BUCKETS.has(bucketRaw)) {
		return json({ error: 'invalid_bucket', detail: 'That bucket is not allowed for direct uploads.' }, { status: 400 });
	}

	// Random-ish prefix to defang two creators picking the same name in
	// the same millisecond. Date.now alone collides under concurrent
	// uploads more often than you'd expect during testing.
	const objectName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${filenameRaw}`;
	const expiresInSeconds = 900;

	try {
		const uploadUrl = await getMainPresignedUploadUrl(bucketRaw, objectName, expiresInSeconds);
		return json({ uploadUrl, objectName, bucket: bucketRaw, expiresInSeconds });
	} catch (error) {
		console.error('[api/files/sign] presign failed:', error);
		const message = error instanceof Error ? error.message : String(error);
		const lower = message.toLowerCase();
		// Map the same MinIO failure shapes the /api/files classifier
		// handles, so the client can show one consistent set of errors
		// regardless of which path is in use.
		if (lower.includes('access denied') || lower.includes('signaturedoesnotmatch') || lower.includes('invalidaccesskey')) {
			return json({ error: 'storage_auth', detail: 'Storage credentials rejected. Please contact support.' }, { status: 500 });
		}
		if (lower.includes('nosuchbucket') || (lower.includes('bucket') && lower.includes('not'))) {
			return json({ error: 'storage_bucket_missing', detail: 'Storage bucket unavailable. Please contact support.' }, { status: 500 });
		}
		if (lower.includes('econnrefused') || lower.includes('etimedout') || lower.includes('econnreset')) {
			return json({ error: 'storage_unreachable', detail: 'Storage service is unreachable. Try again in a moment.' }, { status: 500 });
		}
		return json({ error: 'sign_failed', detail: 'Could not prepare upload. Try again or contact support.' }, { status: 500 });
	}
};
