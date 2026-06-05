import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq, or, ilike, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/creator/content/search/+server.ts
/**
* GET /api/creator/content/search?q=...&limit=8
*
* Lightweight title/description search restricted to the signed-in
* creator's own catalog. Used by the curated-next-up picker on the
* content detail page — keeps the query private to their library so
* they can build coherent video sequences without scrolling the full
* platform catalog.
*/
var GET = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const q = url.searchParams.get("q")?.trim() ?? "";
	const limit = Math.min(20, Math.max(1, parseInt(url.searchParams.get("limit") ?? "8", 10)));
	if (!q) return json({ results: [] });
	const term = `%${q.replace(/[%_]/g, (m) => `\\${m}`)}%`;
	return json({ results: await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		thumbnail: mediaLibrary.thumbnail
	}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, session.user.id), eq(mediaLibrary.isActive, true), or(ilike(mediaLibrary.title, term), ilike(mediaLibrary.description, term)))).orderBy(desc(mediaLibrary.viewCount)).limit(limit) });
};

export { GET };
//# sourceMappingURL=_server.ts-CKAl1iSS.js.map
