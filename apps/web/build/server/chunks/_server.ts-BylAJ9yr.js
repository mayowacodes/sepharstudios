import { d as db, m as mediaLibrary } from './drizzle-C3SH12nS.js';
import { R as Role } from './constants-BiiFHz9b.js';
import { j as json } from './index.js-CxPEndTa.js';
import { and, eq, or, ilike, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

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
//# sourceMappingURL=_server.ts-BylAJ9yr.js.map
