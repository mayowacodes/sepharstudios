import { n as db, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
import { R as Role } from './constants-ChVx7CIu.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-TtGtWAGI.js';
import './Icon-CGEdwVFL.js';
import './file-text-CODLMeLI.js';
import './layout-dashboard-B00hq5k6.js';
import './user-BR-ZR5dM.js';
import './users-Bb_ynahW.js';
import './index-DBqjc0Yf.js';

//#region src/routes/api/creator/content/+server.ts
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	return json(await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		mediaType: mediaLibrary.mediaType,
		status: mediaLibrary.status,
		isActive: mediaLibrary.isActive,
		thumbnail: mediaLibrary.thumbnail,
		posterUrl: mediaLibrary.posterUrl,
		backdropUrl: mediaLibrary.backdropUrl,
		duration: mediaLibrary.duration,
		viewCount: mediaLibrary.viewCount,
		genres: mediaLibrary.genres,
		keywords: mediaLibrary.keywords,
		createdAt: mediaLibrary.createdAt,
		updatedAt: mediaLibrary.updatedAt,
		reviewNotes: mediaLibrary.reviewNotes,
		rejectionReason: mediaLibrary.rejectionReason
	}).from(mediaLibrary).where(eq(mediaLibrary.creatorId, session.user.id)).orderBy(desc(mediaLibrary.createdAt)));
};
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const data = await request.json();
	const id = crypto.randomUUID();
	const title = String(data.title || "").trim();
	if (!title) return json({ error: "Title is required" }, { status: 400 });
	try {
		await db.insert(mediaLibrary).values({
			id,
			title,
			description: data.description,
			mediaType: data.contentType,
			ageRating: data.ageRating,
			thumbnail: data.assets?.thumbnail,
			posterUrl: data.assets?.posterPortrait,
			backdropUrl: data.assets?.backdropHero,
			trailerUrl: data.trailerUrl || null,
			language: data.language || "English",
			bibleReference: data.bibleReferences?.[0] || null,
			genres: data.genre || [],
			topics: data.themes || [],
			keywords: data.keywords || [],
			duration: data.duration?.toString() || null,
			isActive: false,
			isNew: true,
			status: "submitted",
			creatorId: session.user.id,
			slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id.slice(0, 5)}`,
			link: `/watch/${id}`,
			videoUrl: data.videoUrl || null,
			processingStatus: "not_started"
		});
		return json({
			success: true,
			contentId: id
		});
	} catch (error) {
		console.error("Content submission error:", error);
		return json({ error: "Failed to save content metadata" }, { status: 500 });
	}
};

export { GET, POST };
//# sourceMappingURL=_server.ts-DRLui9eE.js.map
