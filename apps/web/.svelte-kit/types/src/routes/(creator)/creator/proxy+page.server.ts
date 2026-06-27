// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq, inArray, desc, ne } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

/**
 * Creator dashboard load. Surfaces every in-flight encode for the current
 * creator so the dashboard can show "Video 1 is at 47% — start Video 2"
 * instead of leaving the creator to guess whether the previous upload is
 * still alive. The SSE wired into the dashboard component streams live
 * progress without a page reload.
 */
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const session = await locals.auth.getSession();
	if (!session) return { inFlightEncodes: [] };

	try {
		const inFlightEncodes = await db
			.select({
				id: mediaLibrary.id,
				title: mediaLibrary.title,
				slug: mediaLibrary.slug,
				thumbnail: mediaLibrary.thumbnail,
				processingStatus: mediaLibrary.processingStatus,
				processingProgress: mediaLibrary.processingProgress,
				processingStage: mediaLibrary.processingStage,
				processingError: mediaLibrary.processingError,
				encoderJobId: mediaLibrary.encoderJobId,
				createdAt: mediaLibrary.createdAt
			})
			.from(mediaLibrary)
			.where(
				and(
					eq(mediaLibrary.creatorId, session.user.id),
					// "Created" = encoder workflow accepted the job but ffmpeg
					// hasn't started yet. "In progress" = ffmpeg is running.
					// "Failed" stays on the dashboard so the creator can see
					// the broken job + open it in admin/edit for retry.
					inArray(mediaLibrary.processingStatus, ['created', 'in_progress', 'failed']),
					// Exclude archived rows. The admin's delete + the creator's
					// archive both flip status='archived' + isActive=false;
					// without this guard, deleted uploads kept appearing in the
					// "Encoding in progress" card even though they're gone from
					// the catalog and the encoder workflow is long-dead.
					ne(mediaLibrary.status, 'archived')
				)
			)
			.orderBy(desc(mediaLibrary.createdAt))
			.limit(10);

		return { inFlightEncodes };
	} catch (err) {
		console.error('[creator dashboard] inFlightEncodes query failed', err);
		return { inFlightEncodes: [] };
	}
};
