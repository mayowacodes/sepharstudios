import { m as mediaLibrary, d as db } from './drizzle-DlGuU73K.js';
import { R as Role } from './constants-RccSloty.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { inArray, eq, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

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
//# sourceMappingURL=_server.ts-MYBUaXyk.js.map
