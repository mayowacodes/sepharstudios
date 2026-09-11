import { d as db, m as mediaLibrary, r as reviews, b as abuseReports } from './drizzle-C3SH12nS.js';
import { R as Role } from './constants-BiiFHz9b.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

//#region src/routes/api/creator/moderation/reviews/[id]/+server.ts
/**
* PATCH /api/creator/moderation/reviews/[id]
*
* Body: { action: 'approve' | 'hide' }
*
* Ownership check: the review must belong to a content row whose
* `creatorId === session.user.id`. Admins are not auto-trusted here —
* admin moderation flows through `/api/admin/abuse`.
*
* Side effect: when a creator approves/hides, we resolve any open abuse
* reports against that review so the queue doesn't show stale items.
*/
var ALLOWED_ACTIONS = /* @__PURE__ */ new Set(["approve", "hide"]);
var PATCH = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	if (!body.action || !ALLOWED_ACTIONS.has(body.action)) return json({ error: "Invalid action" }, { status: 400 });
	const [row] = await db.select({
		id: reviews.id,
		contentId: reviews.contentId,
		creatorId: mediaLibrary.creatorId
	}).from(reviews).leftJoin(mediaLibrary, eq(reviews.contentId, mediaLibrary.id)).where(eq(reviews.id, params.id)).limit(1);
	if (!row) return json({ error: "Not found" }, { status: 404 });
	if (row.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	const isApproved = body.action === "approve";
	await db.update(reviews).set({
		isApproved,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(reviews.id, row.id));
	await db.update(abuseReports).set({
		status: "resolved",
		resolution: isApproved ? "no_action" : "hidden",
		resolvedBy: session.user.id,
		resolvedAt: /* @__PURE__ */ new Date()
	}).where(and(eq(abuseReports.targetType, "review"), eq(abuseReports.targetId, row.id), eq(abuseReports.status, "open")));
	return json({ success: true });
};

export { PATCH };
//# sourceMappingURL=_server.ts-V3RR98hN.js.map
