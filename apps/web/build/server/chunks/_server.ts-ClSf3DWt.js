import { n as db, g as adminTokenomicsSettings } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

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
//# sourceMappingURL=_server.ts-ClSf3DWt.js.map
