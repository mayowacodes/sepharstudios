import { O as creators, t as db, yt as taxForms } from "../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";
//#region src/routes/api/creator/tax-forms/+server.ts
/**
* GET  /api/creator/tax-forms — list own submitted forms
* POST /api/creator/tax-forms — submit a new form
*
* Body: { formKind: 'W-9' | 'W-8BEN' | 'W-8BEN-E', taxYear, formData, pdfUrl? }
*
* formData is whatever the form-specific UI collected. The TIN/SSN field
* MUST be encrypted client-side before submission OR encrypted with the
* platform's KMS at the application layer here. For the v1 implementation
* we store the raw fields and rely on application-level access control;
* encryption-at-rest in jsonb is a follow-on hardening pass.
*/
var ALLOWED_KINDS = new Set([
	"W-9",
	"W-8BEN",
	"W-8BEN-E"
]);
async function loadCreator(userId) {
	const [c] = await db.select({ id: creators.id }).from(creators).where(eq(creators.userId, userId)).limit(1);
	return c;
}
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const creator = await loadCreator(session.user.id);
	if (!creator) return json({ forms: [] });
	return json({ forms: await db.select({
		id: taxForms.id,
		formKind: taxForms.formKind,
		taxYear: taxForms.taxYear,
		status: taxForms.status,
		submittedAt: taxForms.submittedAt,
		verifiedAt: taxForms.verifiedAt,
		rejectionReason: taxForms.rejectionReason,
		pdfUrl: taxForms.pdfUrl
	}).from(taxForms).where(eq(taxForms.creatorId, creator.id)).orderBy(desc(taxForms.submittedAt)) });
};
var POST = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	if (!body.formKind || !ALLOWED_KINDS.has(body.formKind)) return json({ error: "Invalid formKind" }, { status: 400 });
	const taxYear = Number(body.taxYear);
	if (!Number.isInteger(taxYear) || taxYear < 2e3 || taxYear > 2100) return json({ error: "Invalid taxYear" }, { status: 400 });
	if (!body.formData || typeof body.formData !== "object") return json({ error: "formData is required" }, { status: 400 });
	const creator = await loadCreator(session.user.id);
	if (!creator) return json({ error: "Creator profile not found" }, { status: 404 });
	await db.update(taxForms).set({ status: "expired" }).where(and(eq(taxForms.creatorId, creator.id), eq(taxForms.formKind, body.formKind), eq(taxForms.taxYear, taxYear), eq(taxForms.status, "submitted")));
	const [inserted] = await db.insert(taxForms).values({
		creatorId: creator.id,
		formKind: body.formKind,
		taxYear,
		formData: body.formData,
		pdfUrl: body.pdfUrl ?? null,
		status: "submitted"
	}).returning();
	return json({
		success: true,
		form: inserted
	});
};
//#endregion
export { GET, POST };
