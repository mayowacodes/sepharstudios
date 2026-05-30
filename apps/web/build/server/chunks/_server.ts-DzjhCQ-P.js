import { n as db, Z as supportTickets } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { n as notify } from './notify-Cul2puxj.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './index-DBqjc0Yf.js';

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

export { PATCH };
//# sourceMappingURL=_server.ts-DzjhCQ-P.js.map
