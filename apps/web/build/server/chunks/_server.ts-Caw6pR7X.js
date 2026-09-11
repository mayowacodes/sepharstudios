import { d as db, a3 as adminTokenomicsSettings } from './drizzle-CsnNxG5m.js';
import { r as requireAdmin } from './admin-auth-5N0bBtTQ.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

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

export { PATCH };
//# sourceMappingURL=_server.ts-Caw6pR7X.js.map
