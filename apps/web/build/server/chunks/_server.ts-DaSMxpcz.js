import { n as db, V as sponsorshipApplications } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/sponsorships/+server.ts
var ALLOWED_STATUSES = new Set([
	"pending",
	"reviewing",
	"approved",
	"rejected"
]);
var GET = async ({ url, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const status = url.searchParams.get("status");
	return json({ applications: await db.select().from(sponsorshipApplications).where(status && ALLOWED_STATUSES.has(status) ? eq(sponsorshipApplications.status, status) : void 0).orderBy(desc(sponsorshipApplications.createdAt)).limit(100) });
};

export { GET };
//# sourceMappingURL=_server.ts-DaSMxpcz.js.map
