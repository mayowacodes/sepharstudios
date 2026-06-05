import { w as db, aa as successStories } from './drizzle-CKUH7ukq.js';
import { r as requireAdmin } from './admin-auth-DwogZLlW.js';
import { n as notify } from './notify-DpHZNtZn.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

export { PATCH };
//# sourceMappingURL=_server.ts-65rlArmM.js.map
