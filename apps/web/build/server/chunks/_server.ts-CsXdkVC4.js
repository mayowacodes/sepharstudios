import { m as mediaLibrary, d as db } from './drizzle-CsnNxG5m.js';
import { R as Role } from './constants-DSOCQRom.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { inArray, eq, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';

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
//# sourceMappingURL=_server.ts-CsXdkVC4.js.map
