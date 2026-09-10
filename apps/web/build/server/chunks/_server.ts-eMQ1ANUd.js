import { d as db, m as mediaLibrary } from './drizzle-DlGuU73K.js';
import { m as mediaCardColumns } from './projections-DKC0kH5G.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq, asc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/catalog/coming-soon/+server.ts
/**
* GET /api/catalog/coming-soon  →  { items }
*
* Every row in the coming_soon state, sorted next-up. The page groups them by
* month client-side from `scheduledPublishAt`, so no limit is applied here —
* unlike the per-catalog carousels, this is the full listing.
*/
var GET = async () => {
	return json({ items: await db.select(mediaCardColumns).from(mediaLibrary).where(eq(mediaLibrary.status, "coming_soon")).orderBy(asc(mediaLibrary.scheduledPublishAt)) });
};

export { GET };
//# sourceMappingURL=_server.ts-eMQ1ANUd.js.map
