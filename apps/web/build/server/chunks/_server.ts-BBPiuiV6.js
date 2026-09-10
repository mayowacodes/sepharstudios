import { d as db, m as mediaLibrary } from './drizzle-DlGuU73K.js';
import { R as Role } from './constants-RccSloty.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { and, eq, or, ilike, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

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
//# sourceMappingURL=_server.ts-BBPiuiV6.js.map
