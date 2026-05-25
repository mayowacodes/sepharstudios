import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { isValidInternalRequest } from '$lib/server/internal-auth';

export const POST: RequestHandler = async ({ request }) => {
	if (!isValidInternalRequest(request)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { contentId, jobId, playback, errorMessage } = body;

	if (!jobId) return json({ error: 'jobId is required' }, { status: 400 });

	if (errorMessage) {
		await db
			.update(mediaLibrary)
			.set({
				processingStatus: 'failed',
				processingError: String(errorMessage),
				updatedAt: new Date()
			})
			.where(eq(mediaLibrary.encoderJobId, jobId));

		return json({ success: true, jobId, status: 'failed' });
	}

	const where = contentId ? eq(mediaLibrary.id, contentId) : eq(mediaLibrary.encoderJobId, jobId);

	await db
		.update(mediaLibrary)
		.set({
			processingStatus: 'ready',
			processingError: null,
			processedAt: new Date(),
			updatedAt: new Date()
		})
		.where(where);

	return json({ success: true, contentId, jobId, status: 'ready' });
};
