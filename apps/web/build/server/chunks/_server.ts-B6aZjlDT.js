import { n as db, Y as successStories } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/success-stories/+server.ts
var ALLOWED_STATUSES = new Set([
	"pending",
	"approved",
	"rejected"
]);
var GET = async ({ url, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const status = url.searchParams.get("status");
	return json({ stories: await db.select().from(successStories).where(status && ALLOWED_STATUSES.has(status) ? eq(successStories.status, status) : void 0).orderBy(desc(successStories.createdAt)).limit(100) });
};

export { GET };
//# sourceMappingURL=_server.ts-B6aZjlDT.js.map
