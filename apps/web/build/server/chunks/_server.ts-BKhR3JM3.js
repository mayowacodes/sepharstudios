import { w as db, M as mediaLibrary, o as contentSubtitleTracks } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/content/[id]/subtitles/+server.ts
/**
* GET /api/content/[id]/subtitles
*
* Public read used by the watch page when fetching subtitle tracks for the
* VideoPlayer. Visibility-gated: returns empty for `private` content unless
* the caller is the creator. (Auth check is best-effort — the watch page
* itself enforces a stricter access gate; this just avoids leaking labels.)
*/
var GET = async ({ params, locals }) => {
	const [content] = await db.select({
		id: mediaLibrary.id,
		visibility: mediaLibrary.visibility,
		isActive: mediaLibrary.isActive,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!content) return json({ tracks: [] });
	if (content.visibility === "private") {
		const session = await locals.auth.getSession();
		if (!session || session.user.id !== content.creatorId) return json({ tracks: [] });
	}
	return json({ tracks: await db.select().from(contentSubtitleTracks).where(eq(contentSubtitleTracks.contentId, content.id)) });
};

export { GET };
//# sourceMappingURL=_server.ts-BKhR3JM3.js.map
