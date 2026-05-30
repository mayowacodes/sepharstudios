import { n as db, a0 as user, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/content/[id]/+server.ts
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const contentId = params.id;
	if (!contentId) return json({ error: "Missing content ID" }, { status: 400 });
	if ((await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]))?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const item = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		mediaType: mediaLibrary.mediaType,
		ageRating: mediaLibrary.ageRating,
		thumbnail: mediaLibrary.thumbnail,
		posterUrl: mediaLibrary.posterUrl,
		backdropUrl: mediaLibrary.backdropUrl,
		trailerUrl: mediaLibrary.trailerUrl,
		videoUrl: mediaLibrary.videoUrl,
		duration: mediaLibrary.duration,
		genres: mediaLibrary.genres,
		topics: mediaLibrary.topics,
		keywords: mediaLibrary.keywords,
		language: mediaLibrary.language,
		bibleReference: mediaLibrary.bibleReference,
		status: mediaLibrary.status,
		isActive: mediaLibrary.isActive,
		createdAt: mediaLibrary.createdAt,
		reviewNotes: mediaLibrary.reviewNotes,
		rejectionReason: mediaLibrary.rejectionReason,
		creatorId: mediaLibrary.creatorId,
		creatorName: user.name,
		creatorEmail: user.email
	}).from(mediaLibrary).leftJoin(user, eq(mediaLibrary.creatorId, user.id)).where(eq(mediaLibrary.id, contentId)).then((r) => r[0]);
	if (!item) return json({ error: "Content not found" }, { status: 404 });
	return json(item);
};

export { GET };
//# sourceMappingURL=_server.ts-Da_rq1rw.js.map
