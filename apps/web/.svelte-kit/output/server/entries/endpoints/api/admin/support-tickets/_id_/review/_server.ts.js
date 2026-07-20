import { _t as supportTickets, t as db } from "../../../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../../../chunks/admin-auth.js";
import { t as notify } from "../../../../../../../chunks/notify.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/support-tickets/[id]/review/+server.ts
var ALLOWED_STATUSES = new Set([
	"open",
	"in_progress",
	"resolved",
	"closed"
]);
var PATCH = async ({ params, request, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const body = await request.json().catch(() => ({}));
	if (!body.status || !ALLOWED_STATUSES.has(body.status)) return json({ error: "Invalid status." }, { status: 400 });
	const updates = {
		status: body.status,
		updatedAt: /* @__PURE__ */ new Date()
	};
	if (typeof body.adminResponse === "string") updates.adminResponse = body.adminResponse;
	if (body.status === "resolved") updates.resolvedAt = /* @__PURE__ */ new Date();
	const [updated] = await db.update(supportTickets).set(updates).where(eq(supportTickets.id, params.id)).returning();
	if (!updated) return json({ error: "Ticket not found" }, { status: 404 });
	if (updated.userId) {
		const responsePart = body.adminResponse ? `\n\nResponse: ${body.adminResponse}` : "";
		await notify({
			userId: updated.userId,
			kind: "system",
			title: `Support ticket ${body.status === "resolved" ? "resolved" : `marked ${body.status}`}`,
			message: `Your ticket "${updated.subject.slice(0, 80)}" is now ${body.status}.${responsePart}`,
			actionUrl: "/creator/tech-support"
		}).catch(() => void 0);
	}
	return json({
		success: true,
		ticket: updated
	});
};
//#endregion
export { PATCH };
