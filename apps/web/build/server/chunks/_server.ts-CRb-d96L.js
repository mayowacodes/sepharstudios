import { w as db, u as creators, ac as tax1099Forms } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, and, desc } from 'drizzle-orm';
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

//#region src/routes/api/creator/tax-1099-forms/+server.ts
/**
* GET /api/creator/tax-1099-forms
*
* Returns every 1099 row the system has generated for the signed-in
* creator, newest tax year first. Used by the tax-forms page to render
* download links once the cron has rendered the PDF.
*/
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const [creatorRow] = await db.select({ id: creators.id }).from(creators).where(eq(creators.userId, session.user.id)).limit(1);
	if (!creatorRow) return json({ forms: [] });
	return json({ forms: await db.select({
		id: tax1099Forms.id,
		taxYear: tax1099Forms.taxYear,
		totalPaidCents: tax1099Forms.totalPaidCents,
		pdfUrl: tax1099Forms.pdfUrl,
		emailedAt: tax1099Forms.emailedAt,
		createdAt: tax1099Forms.createdAt
	}).from(tax1099Forms).where(and(eq(tax1099Forms.creatorId, creatorRow.id))).orderBy(desc(tax1099Forms.taxYear)) });
};

export { GET };
//# sourceMappingURL=_server.ts-CRb-d96L.js.map
