import { d as db, Y as sponsorshipApplications } from './drizzle-DlGuU73K.js';
import { r as requireAdmin } from './admin-auth-i1sA9-vE.js';
import { j as json } from './index.js-DwRgOKlO.js';
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
//# sourceMappingURL=_server.ts-CqCJM637.js.map
