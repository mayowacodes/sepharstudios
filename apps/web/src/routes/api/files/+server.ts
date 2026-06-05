import { json, type RequestHandler } from '@sveltejs/kit';
import { uploadAndSaveFile, deleteFileById, listObjects, getDirectObjectUrl, uploadFile } from '$lib/server/minio';
import { env } from '$env/dynamic/private';

const BUCKET_NAME = env.MINIO_BUCKET || 'uploads';

// Listing every file in the bucket is admin-only; we do not want anonymous
// users (or even regular signed-in users) enumerating the whole storage layer.
export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (session.user.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	try {
		const objects = await listObjects(BUCKET_NAME);
		const files = objects.map((obj: any) => ({
			id: obj.name, url: getDirectObjectUrl(BUCKET_NAME, obj.name),
			filename: obj.name.split('-').slice(1).join('-') || obj.name,
			size: obj.size, etag: obj.etag, uploadedAt: obj.lastModified
		}));
		return json({ success: true, files });
	} catch (error) {
		console.error('Files list failed:', error);
		return json({ error: 'Failed to list files' }, { status: 500 });
	}
};

// Uploads require a signed-in user (any role). Used by the creator upload
// wizard, profile-avatar uploader, etc.
//
// Hard request-side cap. The encoder takes the long-form video via its own
// signed URL — this endpoint is for image assets (posters, backdrops,
// thumbnails, logos) and other small files. 25 MB is comfortably above the
// largest asset cap the wizard surfaces (5 MB hero) and well below MinIO's
// bucket-level limit, so an oversize upload fails fast here instead of
// streaming bytes that will only be rejected later.
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

// Map a low-level MinIO/DB error into a short safe category + human
// detail. The client surfaces these in the upload toast so creators see
// "Storage bucket unavailable" instead of "Upload failed" and can act on
// it (retry, contact support, etc). Stack traces stay in server logs.
function classifyUploadError(err: unknown): { category: string; detail: string } {
	const message = err instanceof Error ? err.message : String(err);
	const lower = message.toLowerCase();
	if (lower.includes('access denied') || lower.includes('signaturedoesnotmatch') || lower.includes('invalidaccesskey')) {
		return { category: 'storage_auth', detail: 'Storage credentials rejected. Please contact support.' };
	}
	if (lower.includes('nosuchbucket') || lower.includes('bucket') && lower.includes('not')) {
		return { category: 'storage_bucket_missing', detail: 'Storage bucket unavailable. Please contact support.' };
	}
	if (lower.includes('entitytoolarge') || lower.includes('too large')) {
		return { category: 'storage_size_limit', detail: 'File exceeds the storage size limit.' };
	}
	if (lower.includes('econnrefused') || lower.includes('econnreset') || lower.includes('etimedout')) {
		return { category: 'storage_unreachable', detail: 'Storage service is unreachable. Try again in a moment.' };
	}
	return { category: 'upload_failed', detail: 'Upload failed unexpectedly. Try again or contact support.' };
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'unauthorized', detail: 'Sign in required.' }, { status: 401 });

	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const bucket = (formData.get('bucket') as string) || BUCKET_NAME;

	if (!file) return json({ error: 'missing_file', detail: 'No file was attached to the request.' }, { status: 400 });

	if (file.size > MAX_UPLOAD_BYTES) {
		return json({
			error: 'file_too_large',
			detail: `File is ${(file.size / (1024 * 1024)).toFixed(1)} MB; the limit for image uploads is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`
		}, { status: 413 });
	}

	try {
		const result = await uploadAndSaveFile(file, bucket);
		return json({ success: true, ...result });
	} catch (error) {
		console.error('API Upload error:', error);
		const { category, detail } = classifyUploadError(error);
		return json({ error: category, detail }, { status: 500 });
	}
};

// PUT (overwriting an existing object) is admin-only — we can't safely tell
// from the request alone whether the caller "owns" the target object without
// a cross-reference against the files table, and most legitimate replacements
// flow through the typed upload endpoints. Keep this as an admin escape hatch.
export const PUT: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (session.user.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const objectId = formData.get('id') as string | null;
	const bucket = (formData.get('bucket') as string) || BUCKET_NAME;

	if (!file || !objectId) return json({ error: 'File and ID required' }, { status: 400 });

	try {
		const result = await uploadFile(bucket, objectId, file);
		return json({ success: true, ...result });
	} catch (error) {
		console.error('API Update error:', error);
		return json({ error: 'Update failed' }, { status: 500 });
	}
};

// DELETE is admin-only for the same reason — without ownership tracking, any
// signed-in user could otherwise delete any object by guessing IDs.
export const DELETE: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (session.user.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const { id, bucket } = await request.json();
	const targetBucket = bucket || BUCKET_NAME;
	if (!id) return json({ error: 'ID required' }, { status: 400 });
	try {
		await deleteFileById(targetBucket, id);
		return json({ success: true, message: 'File deleted successfully' });
	} catch (error) {
		console.error('API Delete error:', error);
		return json({ error: 'Delete failed' }, { status: 500 });
	}
};
