import { O as creators, t as db, vt as tax1099Forms } from "../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";
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
//#endregion
export { GET };
