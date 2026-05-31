import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { createEncoderJob } from '$lib/server/encoder-orchestrator';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json();
	const { contentId, filename, profile = 'vod-multi', durationHint } = body;

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

	try {
		// Pass mediaId so the orchestrator echoes it on every webhook —
		// progress + scan-ready handlers can then resolve the row in O(1)
		// without a jobId → mediaId lookup.
		const encoderJob = await createEncoderJob({ filename, profile, durationHint, mediaId: contentId });

		await db
			.update(mediaLibrary)
			.set({
				encoderJobId: encoderJob.jobId,
				processingStatus: 'created',
				processingError: null,
				updatedAt: new Date()
			})
			.where(eq(mediaLibrary.id, contentId));

		return json(
			{
				contentId,
				jobId: encoderJob.jobId,
				upload: encoderJob.upload
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Failed to create encoder job:', error);
		return json({ error: 'Failed to create encoder job' }, { status: 500 });
	}
};

