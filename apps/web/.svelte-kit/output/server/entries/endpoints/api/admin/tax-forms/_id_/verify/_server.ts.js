import { O as creators, t as db, yt as taxForms } from "../../../../../../../chunks/drizzle.js";
import { t as notify } from "../../../../../../../chunks/notify.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/tax-forms/[id]/verify/+server.ts
/**
* PATCH /api/admin/tax-forms/[id]/verify
*
* Body: { status: 'verified' | 'rejected', rejectionReason? }
*
* Admin verdict on a submitted tax form. Notifies the creator either way.
*/
var ALLOWED = new Set(["verified", "rejected"]);
var PATCH = async ({ params, locals, request }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	if (!body.status || !ALLOWED.has(body.status)) return json({ error: "Invalid status" }, { status: 400 });
	if (body.status === "rejected" && !body.rejectionReason?.trim()) return json({ error: "rejectionReason is required for rejection" }, { status: 400 });
	const [form] = await db.select({
		id: taxForms.id,
		formKind: taxForms.formKind,
		taxYear: taxForms.taxYear,
		creatorId: taxForms.creatorId
	}).from(taxForms).where(eq(taxForms.id, params.id)).limit(1);
	if (!form) return json({ error: "Not found" }, { status: 404 });
	await db.update(taxForms).set({
		status: body.status,
		verifiedBy: locals.user.id,
		verifiedAt: /* @__PURE__ */ new Date(),
		rejectionReason: body.status === "rejected" ? body.rejectionReason ?? null : null
	}).where(eq(taxForms.id, form.id));
	const [c] = await db.select({ userId: creators.userId }).from(creators).where(eq(creators.id, form.creatorId)).limit(1);
	if (c?.userId) {
		const title = body.status === "verified" ? `Tax form approved: ${form.formKind} ${form.taxYear}` : `Tax form rejected: ${form.formKind} ${form.taxYear}`;
		const message = body.status === "verified" ? "Your form is on file. Payouts will use this for the listed tax year." : body.rejectionReason ?? "Please re-submit. Open the earnings page to view rejection notes.";
		notify({
			userId: c.userId,
			kind: "subscription",
			title,
			message,
			actionUrl: "/creator/earnings/tax-forms"
		}).catch(() => void 0);
	}
	return json({ success: true });
};
//#endregion
export { PATCH };
