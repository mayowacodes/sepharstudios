import { w as db, a3 as reviews } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/reviews/+server.ts
var GET = async ({ url, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const approvedParam = url.searchParams.get("approved");
	return json(await db.select().from(reviews).where(approvedParam === "false" ? eq(reviews.isApproved, false) : void 0).orderBy(desc(reviews.createdAt)).limit(50));
};
var PATCH = async ({ request, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const { id, isApproved } = await request.json();
	if (!id) return json({ error: "id required" }, { status: 400 });
	const [updated] = await db.update(reviews).set({
		isApproved,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(reviews.id, id)).returning({
		id: reviews.id,
		isApproved: reviews.isApproved
	});
	return json(updated);
};
var DELETE = async ({ request, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const { id } = await request.json();
	if (!id) return json({ error: "id required" }, { status: 400 });
	await db.delete(reviews).where(eq(reviews.id, id));
	return json({ success: true });
};

export { DELETE, GET, PATCH };
//# sourceMappingURL=_server.ts-DQ_Ot8j0.js.map
