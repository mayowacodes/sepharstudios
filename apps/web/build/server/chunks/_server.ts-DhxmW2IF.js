import { d as db, m as mediaLibrary, ag as contentThumbnailVariants } from './drizzle-C3SH12nS.js';
import { R as Role } from './constants-BiiFHz9b.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

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
//# sourceMappingURL=_server.ts-DhxmW2IF.js.map
