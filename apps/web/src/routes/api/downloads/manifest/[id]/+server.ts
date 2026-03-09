import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	// Downloads require Premium or Creator plan
	const sub = await db
		.select({ plan: paystackSubscriptions.plan, status: paystackSubscriptions.status })
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, session.user.id))
		.then(r => r[0]);

	if (!sub || !['premium', 'creator'].includes(sub.plan ?? '')) {
		return json({ error: 'Downloads require Premium or Creator plan' }, { status: 403 });
	}

	if (!['active', 'trial'].includes(sub.status ?? '')) {
		return json({ error: 'Active subscription required' }, { status: 403 });
	}

	const contentId = params.id;
	const content = await db
		.select({ videoUrl: mediaLibrary.videoUrl, isActive: mediaLibrary.isActive })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId!))
		.then(r => r[0]);

	if (!content || !content.isActive) return json({ error: 'Content not found' }, { status: 404 });
	if (!content.videoUrl) return json({ error: 'No video available for this content' }, { status: 404 });

	// Return the manifest URL — the video URL stored is either a direct HLS URL or a MinIO path
	// For MinIO paths, we construct a presigned URL valid for 24 hours
	let manifestUrl = content.videoUrl;

	if (!manifestUrl.startsWith('http')) {
		// It's a relative MinIO path — construct signed URL
		const minioBase = env.MINIO_PUBLIC_URL ?? env.S3_ENDPOINT ?? '';
		manifestUrl = `${minioBase}/${manifestUrl}`;
	}

	return json({ manifestUrl, contentId });
};
