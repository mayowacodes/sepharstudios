import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { e as enforceRateLimit, A as AI_AGENT_LIMIT } from './rate-limit-C3y7GHEd.js';
import { g as generateContentMetadata } from './ai-tagging-5RV1tce2.js';
import { e as error, j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './redis-B0W1dNO5.js';
import 'ioredis';
import './ai-provider-ZmR1UjfK.js';
import './ai-settings-b9zX_Yow.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/ai/tag/+server.ts
/**
* POST /api/ai/tag
* Auto-generate metadata for a content item.
* Called from: encoder-ready webhook, creator upload flow, admin panel.
*
* Body: { contentId } — existing mediaLibrary record
*   OR: { title, description, contentType } — standalone generation
*
* If contentId is provided, metadata suggestions are saved back to the DB.
*/
var POST = async ({ request, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	await enforceRateLimit(`ai:tag:${locals.user.id}`, AI_AGENT_LIMIT);
	const { contentId, title, description, contentType = "movie" } = await request.json();
	let resolvedTitle = title;
	let resolvedDescription = description;
	let resolvedType = contentType;
	if (contentId) {
		const [content] = await db.select({
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			mediaType: mediaLibrary.mediaType
		}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
		if (!content) throw error(404, "Content not found");
		resolvedTitle = content.title;
		resolvedDescription = content.description ?? "";
		resolvedType = content.mediaType;
	}
	if (!resolvedTitle) throw error(400, "title is required");
	const metadata = await generateContentMetadata(resolvedTitle, resolvedDescription ?? "", resolvedType);
	if (!metadata) throw error(503, "AI tagging service unavailable");
	if (contentId) await db.update(mediaLibrary).set({
		genres: metadata.genres,
		topics: metadata.topics,
		keywords: metadata.keywords,
		bibleReference: metadata.bibleReference || void 0,
		ageRating: metadata.ageRating,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, contentId));
	return json({
		metadata,
		saved: !!contentId
	});
};

export { POST };
//# sourceMappingURL=_server.ts-CDUJmmHS.js.map
