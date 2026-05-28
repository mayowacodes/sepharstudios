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
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const bucket = (formData.get('bucket') as string) || BUCKET_NAME;

	if (!file) return json({ error: 'No file uploaded' }, { status: 400 });

	try {
		const result = await uploadAndSaveFile(file, bucket);
		return json({ success: true, ...result });
	} catch (error) {
		console.error('API Upload error:', error);
		return json({ error: 'Upload failed' }, { status: 500 });
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
