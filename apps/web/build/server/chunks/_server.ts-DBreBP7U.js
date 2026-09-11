import { d as db, $ as sponsorshipApplications } from './drizzle-C3SH12nS.js';
import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/sponsorships/+server.ts
var ALLOWED_STATUSES = /* @__PURE__ */ new Set([
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
//# sourceMappingURL=_server.ts-DBreBP7U.js.map
