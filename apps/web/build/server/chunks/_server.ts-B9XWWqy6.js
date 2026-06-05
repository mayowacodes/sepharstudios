import { w as db, M as mediaLibrary, p as contentThumbnailVariants } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, and } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/creator/content/[id]/thumbnails/[vid]/+server.ts
/**
* DELETE /api/creator/content/[id]/thumbnails/[vid]
*
* Removes a variant. Ownership check on the parent content row.
*/
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!content) return json({ error: "Not found" }, { status: 404 });
	if (content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	await db.delete(contentThumbnailVariants).where(and(eq(contentThumbnailVariants.id, params.vid), eq(contentThumbnailVariants.contentId, content.id)));
	return json({ success: true });
};

export { DELETE };
//# sourceMappingURL=_server.ts-B9XWWqy6.js.map
