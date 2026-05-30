import { n as db, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
import { j as json } from './index-5kYmxIr9.js';
import { and, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/creator/content/[id]/duplicate/+server.ts
/**
* POST /api/creator/content/[id]/duplicate
*
* Creates a copy of the creator's existing content row. Resets:
*   - id (new uuid)
*   - title → "Copy of …"
*   - slug → unique-ified with timestamp
*   - status → 'submitted' (must be re-reviewed)
*   - viewCount → 0
*   - encoder/video fields → null (creator must re-upload)
*   - createdAt/updatedAt → now
*
* Returns the new row so the page can navigate to /creator/upload?edit=<id>.
*/
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const sourceId = params.id;
	const [source] = await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.id, sourceId), eq(mediaLibrary.creatorId, session.user.id))).limit(1);
	if (!source) return json({ error: "Content not found or not yours" }, { status: 404 });
	const newId = crypto.randomUUID();
	const now = /* @__PURE__ */ new Date();
	const slugSuffix = Date.now().toString(36);
	const [duplicate] = await db.insert(mediaLibrary).values({
		id: newId,
		title: `Copy of ${source.title}`,
		description: source.description,
		thumbnail: source.thumbnail,
		backdropUrl: source.backdropUrl,
		posterUrl: source.posterUrl,
		trailerUrl: null,
		videoUrl: null,
		encoderJobId: null,
		processingStatus: "not_started",
		creatorId: session.user.id,
		videoId: null,
		thumbnailId: source.thumbnailId,
		backdropId: source.backdropId,
		posterId: source.posterId,
		trailerId: null,
		link: source.link,
		slug: `${source.slug ?? "copy"}-${slugSuffix}`,
		mediaType: source.mediaType,
		category: source.category,
		genres: source.genres,
		topics: source.topics,
		keywords: source.keywords,
		rating: source.rating,
		ageRating: source.ageRating,
		duration: source.duration,
		quality: source.quality,
		year: source.year,
		releaseDate: source.releaseDate,
		language: source.language,
		bibleReference: source.bibleReference,
		featured: false,
		isNew: false,
		isActive: false,
		status: "submitted",
		viewCount: 0,
		voteAverage: null,
		voteCount: null,
		popularity: null,
		createdAt: now,
		updatedAt: now
	}).returning();
	return json({
		success: true,
		content: duplicate
	}, { status: 201 });
};

export { POST };
//# sourceMappingURL=_server.ts-YKSrq84z.js.map
