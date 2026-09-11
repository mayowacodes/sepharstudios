import { m as mediaLibrary, d as db } from './drizzle-C3SH12nS.js';
import { m as mediaCardColumns } from './projections-NrF4Pj6-.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq, and, asc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/coming-soon/+server.ts
/**
* GET /api/coming-soon?type=movie|show|documentary|all&limit=20
*
* Returns the list of Coming Soon rows (status='coming_soon'). Sorted
* by scheduledPublishAt ASC so the next-up titles come first. Used by:
*   - the dedicated /coming-soon page
*   - any client surface that wants to render a Coming Soon row
*
* Catalog/landing server loads inline-query the same shape directly
* (no HTTP hop) — this endpoint exists for client-side fetches +
* future native-app use.
*/
var GET = async ({ url }) => {
	const type = url.searchParams.get("type") ?? "all";
	const limit = Math.min(Number.parseInt(url.searchParams.get("limit") ?? "20", 10) || 20, 100);
	const filters = [eq(mediaLibrary.status, "coming_soon")];
	if (type !== "all") filters.push(eq(mediaLibrary.mediaType, type));
	return json({ items: await db.select(mediaCardColumns).from(mediaLibrary).where(and(...filters)).orderBy(asc(mediaLibrary.scheduledPublishAt)).limit(limit) });
};

export { GET };
//# sourceMappingURL=_server.ts-ZXrlUxH2.js.map
