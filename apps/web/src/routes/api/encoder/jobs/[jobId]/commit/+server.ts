import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { commitEncoderJob } from '$lib/server/encoder-orchestrator';

export const POST: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.validate();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const jobId = (params as Record<string, string>).jobId;
	if (!jobId) return json({ error: 'jobId is required' }, { status: 400 });

	const [content] = await db
		.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.encoderJobId, jobId))
		.limit(1);

	if (!content) return json({ error: 'Content not found for job' }, { status: 404 });

	if (content.creatorId && content.creatorId !== session.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const result = await commitEncoderJob(jobId);

		await db
			.update(mediaLibrary)
			.set({
				processingStatus: 'queued',
				processingError: null,
				updatedAt: new Date()
			})
			.where(eq(mediaLibrary.id, content.id));

		return json({ contentId: content.id, ...result });
	} catch (error) {
		console.error(`Failed to commit encoder job ${jobId}:`, error);
		return json({ error: 'Failed to commit encoder job' }, { status: 500 });
	}
};
