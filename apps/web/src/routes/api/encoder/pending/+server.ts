import { json, type RequestHandler } from '@sveltejs/kit';
import { and, eq, isNotNull, ne } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { isValidInternalRequest } from '$lib/server/internal-auth';

export const GET: RequestHandler = async ({ request }) => {
	if (!isValidInternalRequest(request)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const rows = await db
		.select({
			contentId: mediaLibrary.id,
			jobId: mediaLibrary.encoderJobId,
			status: mediaLibrary.processingStatus
		})
		.from(mediaLibrary)
		.where(
			and(
				isNotNull(mediaLibrary.encoderJobId),
				ne(mediaLibrary.processingStatus, 'ready'),
				ne(mediaLibrary.processingStatus, 'failed')
			)
		)
		.limit(100);

	return json({
		jobs: rows.filter((row): row is { contentId: string; jobId: string; status: string } => Boolean(row.jobId))
	});
};

