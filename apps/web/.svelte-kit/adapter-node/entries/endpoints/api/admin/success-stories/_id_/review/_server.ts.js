import { Q as successStories, t as db } from "../../../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../../../chunks/admin-auth.js";
import { t as notify } from "../../../../../../../chunks/notify.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/success-stories/[id]/review/+server.ts
var ALLOWED_STATUSES = new Set([
	"pending",
	"approved",
	"rejected"
]);
var PATCH = async ({ params, request, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const body = await request.json().catch(() => ({}));
	if (!body.status || !ALLOWED_STATUSES.has(body.status)) return json({ error: "Invalid status." }, { status: 400 });
	const [updated] = await db.update(successStories).set({
		status: body.status,
		moderationNote: body.moderationNote ?? null,
		reviewedAt: /* @__PURE__ */ new Date()
	}).where(eq(successStories.id, params.id)).returning();
	if (!updated) return json({ error: "Story not found" }, { status: 404 });
	if (updated.userId && body.status !== "pending") await notify({
		userId: updated.userId,
		kind: "system",
		title: body.status === "approved" ? "Your story was published" : "Your story was not approved",
		message: body.status === "approved" ? "Thanks for sharing — your testimony is now live for the community." : body.moderationNote ? `Reason: ${body.moderationNote}` : "Please review the submission guidelines and try again.",
		actionUrl: "/creator/success-stories"
	}).catch(() => void 0);
	return json({
		success: true,
		story: updated
	});
};
//#endregion
export { PATCH };
