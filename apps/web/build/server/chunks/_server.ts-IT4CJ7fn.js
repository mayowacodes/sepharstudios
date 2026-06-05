import { w as db, a6 as sponsorshipApplications } from './drizzle-CKUH7ukq.js';
import { r as requireAdmin } from './admin-auth-DwogZLlW.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-IT4CJ7fn.js.map
