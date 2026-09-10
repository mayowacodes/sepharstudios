import { d as db, C as creators, ak as tax1099Forms } from './drizzle-DlGuU73K.js';
import { R as Role } from './constants-RccSloty.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq, and, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

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
//# sourceMappingURL=_server.ts-Ct3EJYRo.js.map
