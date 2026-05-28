import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { getEncoderPlayback } from '$lib/server/encoder-orchestrator';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const jobId = (params as Record<string, string>).jobId;
	if (!jobId) return json({ error: 'jobId is required' }, { status: 400 });

	const [content] = await db
		.select({ id: mediaLibrary.id, isActive: mediaLibrary.isActive })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.encoderJobId, jobId))
		.limit(1);

	if (!content || !content.isActive) {
		return json({ error: 'Content is not available' }, { status: 404 });
	}

	const body = await request.json().catch(() => ({}));
	const ttlSeconds = Number(body.ttlSeconds || 3600);

	try {
		const playback = await getEncoderPlayback(jobId, ttlSeconds);
		return json({ contentId: content.id, ...playback });
	} catch (error) {
		console.error(`Failed to create playback URL for encoder job ${jobId}:`, error);
		return json({ error: 'Failed to create playback URL' }, { status: 500 });
	}
};
