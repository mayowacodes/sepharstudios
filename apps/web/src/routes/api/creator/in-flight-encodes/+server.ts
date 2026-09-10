import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq, inArray, desc, ne } from 'drizzle-orm';

/**
 * GET /api/creator/in-flight-encodes  →  { inFlightEncodes }
 *
 * Every in-flight encode for the signed-in creator, so the dashboard can say
 * "Video 1 is at 47% — start Video 2" instead of leaving them to guess whether
 * the previous upload is still alive. The dashboard's SSE stream then updates
 * progress without a reload.
 *
 * Anonymous callers get an empty list rather than a 401: the dashboard route is
 * already guarded, and returning empty keeps this endpoint safe to call
 * unconditionally during hydration.
 */
function queryEncodes(userId: string) {
	return db
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
				eq(mediaLibrary.creatorId, userId),
				// 'created' = the encoder accepted the job but ffmpeg hasn't
				// started. 'in_progress' = ffmpeg is running. 'failed' stays
				// listed so the creator can open it in admin/edit and retry.
				inArray(mediaLibrary.processingStatus, ['created', 'in_progress', 'failed']),
				// Exclude archived rows. Admin delete and creator archive both
				// set status='archived' + isActive=false; without this guard,
				// deleted uploads kept showing under "Encoding in progress"
				// long after the encoder workflow had died.
				ne(mediaLibrary.status, 'archived')
			)
		)
		.orderBy(desc(mediaLibrary.createdAt))
		.limit(10);
}

type InFlightEncode = Awaited<ReturnType<typeof queryEncodes>>[number];

/**
 * The response contract, exported so the page load can type `data` precisely.
 *
 * Deriving it from the handler is not possible: `json()` returns a bare
 * `Response`, and `Response.json()` is `Promise<any>` — a page that inferred
 * from it would silently get `any` and lose every guarantee the previous
 * `+page.server.ts` gave the component for free.
 */
export type InFlightEncodesPayload = { inFlightEncodes: InFlightEncode[] };

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	const payload: InFlightEncodesPayload = session
		? { inFlightEncodes: await queryEncodes(session.user.id) }
		: { inFlightEncodes: [] };
	return json(payload);
};
