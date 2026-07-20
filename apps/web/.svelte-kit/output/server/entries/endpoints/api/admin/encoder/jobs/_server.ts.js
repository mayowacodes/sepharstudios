import { K as mediaLibrary, O as creators, a as user, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, isNotNull } from "drizzle-orm";
//#region src/routes/api/admin/encoder/jobs/+server.ts
/**
* GET /api/admin/encoder/jobs
*
* Lists encoder jobs across all creators. Backed by the `mediaLibrary` row
* (which carries `encoderJobId` + `processingStatus`) rather than an
* encoder-side table — that side is owned by the orchestrator and we don't
* mirror it.
*
* Query: ?status=&limit=&offset=
*   status: 'not_started' | 'created' | 'ready' | 'failed' | 'cancelled'
*/
var GET = async ({ url, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const status = url.searchParams.get("status");
	const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100", 10) || 100, 500);
	const offset = Math.max(parseInt(url.searchParams.get("offset") ?? "0", 10) || 0, 0);
	const conditions = [isNotNull(mediaLibrary.encoderJobId)];
	if (status) conditions.push(eq(mediaLibrary.processingStatus, status));
	return json({ jobs: await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus,
		processingError: mediaLibrary.processingError,
		processingProgress: mediaLibrary.processingProgress,
		processingStage: mediaLibrary.processingStage,
		updatedAt: mediaLibrary.updatedAt,
		createdAt: mediaLibrary.createdAt,
		creatorId: mediaLibrary.creatorId,
		creatorName: user.name,
		creatorDisplayName: creators.displayName
	}).from(mediaLibrary).leftJoin(user, eq(mediaLibrary.creatorId, user.id)).leftJoin(creators, eq(creators.userId, user.id)).where(and(...conditions)).orderBy(desc(mediaLibrary.updatedAt)).limit(limit).offset(offset) });
};
//#endregion
export { GET };
