import { w as db, aa as successStories } from './drizzle-CKUH7ukq.js';
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
//# sourceMappingURL=_server.ts-CHf5CVgJ.js.map
