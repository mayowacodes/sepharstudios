import { f as adminTokenomicsSettings, t as db } from "../../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/tokenomics/distribution/+server.ts
var PATCH = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const payload = await request.json();
	if (!payload?.revenueDistribution) return json({ error: "Missing distribution" }, { status: 400 });
	const existing = await db.select({ id: adminTokenomicsSettings.id }).from(adminTokenomicsSettings).then((r) => r[0]);
	if (existing) await db.update(adminTokenomicsSettings).set({
		revenueDistribution: payload.revenueDistribution,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(adminTokenomicsSettings.id, existing.id));
	else await db.insert(adminTokenomicsSettings).values({ revenueDistribution: payload.revenueDistribution });
	return json({ success: true });
};
//#endregion
export { PATCH };
