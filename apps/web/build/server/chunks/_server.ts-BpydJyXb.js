import { d as db, m as mediaLibrary, ag as contentThumbnailVariants } from './drizzle-CsnNxG5m.js';
import { R as Role } from './constants-DSOCQRom.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';

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
//# sourceMappingURL=_server.ts-BpydJyXb.js.map
