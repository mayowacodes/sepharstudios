import { m as mediaLibrary, d as db } from './drizzle-C3SH12nS.js';
import { R as Role } from './constants-BiiFHz9b.js';
import { j as json } from './index.js-CxPEndTa.js';
import { inArray, eq, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

//#region src/routes/api/creator/content/lookup/+server.ts
/**
* GET /api/creator/content/lookup?ids=a,b,c
*
* Batch-resolves content rows to {id, title, thumbnail} for the curated-
* next-up picker. Scoped to the signed-in creator's own catalog (admins
* can resolve any) so we don't leak titles across creators.
*/
var GET = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const raw = url.searchParams.get("ids")?.trim() ?? "";
	const ids = Array.from(new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))).slice(0, 30);
	if (ids.length === 0) return json({ results: [] });
	const conditions = [inArray(mediaLibrary.id, ids)];
	if (session.user.role !== Role.ADMIN) conditions.push(eq(mediaLibrary.creatorId, session.user.id));
	return json({ results: await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		thumbnail: mediaLibrary.thumbnail
	}).from(mediaLibrary).where(and(...conditions)) });
};

export { GET };
//# sourceMappingURL=_server.ts-DGa8lkHz.js.map
