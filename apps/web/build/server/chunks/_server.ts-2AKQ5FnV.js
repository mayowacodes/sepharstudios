import { w as db, a6 as sponsorshipApplications } from './drizzle-CKUH7ukq.js';
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

//#region src/routes/api/admin/sponsorships/[id]/review/+server.ts
var ALLOWED_STATUSES = new Set([
	"pending",
	"reviewing",
	"approved",
	"rejected"
]);
var PATCH = async ({ params, request, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const body = await request.json().catch(() => ({}));
	if (!body.status || !ALLOWED_STATUSES.has(body.status)) return json({ error: "Invalid status." }, { status: 400 });
	const [updated] = await db.update(sponsorshipApplications).set({
		status: body.status,
		adminNote: body.adminNote ?? null,
		reviewedAt: /* @__PURE__ */ new Date()
	}).where(eq(sponsorshipApplications.id, params.id)).returning();
	if (!updated) return json({ error: "Application not found" }, { status: 404 });
	if (updated.userId && body.status !== "pending") {
		const title = body.status === "approved" ? `Your sponsorship pitch was approved` : body.status === "rejected" ? `Your sponsorship pitch was declined` : `Your sponsorship pitch is under review`;
		await notify({
			userId: updated.userId,
			kind: "system",
			title,
			message: body.adminNote ?? `We'll follow up via email at ${updated.contactEmail ?? "your account email"}.`,
			actionUrl: "/sponsorships"
		}).catch(() => void 0);
	}
	return json({
		success: true,
		application: updated
	});
};

export { PATCH };
//# sourceMappingURL=_server.ts-2AKQ5FnV.js.map
