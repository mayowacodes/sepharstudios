import { d as db, m as mediaLibrary } from './drizzle-CsnNxG5m.js';
import { R as Role } from './constants-DSOCQRom.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { and, eq, or, ilike, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';

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
//# sourceMappingURL=_server.ts-C9x7RqIn.js.map
