import { dt as reviews, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
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
//#endregion
export { DELETE, GET, PATCH };
