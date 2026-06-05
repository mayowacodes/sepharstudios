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

//#region src/routes/api/creator/content/[id]/thumbnails/[vid]/promote/+server.ts
/**
* POST /api/creator/content/[id]/thumbnails/[vid]/promote
*
* Marks a variant as the winner and copies its URL into the parent row's
* `thumbnail` field. Clears `isWinner` on all sibling variants.
*/
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!content) return json({ error: "Not found" }, { status: 404 });
	if (content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	const [variant] = await db.select().from(contentThumbnailVariants).where(and(eq(contentThumbnailVariants.id, params.vid), eq(contentThumbnailVariants.contentId, content.id))).limit(1);
	if (!variant) return json({ error: "Variant not found" }, { status: 404 });
	await db.transaction(async (tx) => {
		await tx.update(contentThumbnailVariants).set({ isWinner: false }).where(eq(contentThumbnailVariants.contentId, content.id));
		await tx.update(contentThumbnailVariants).set({ isWinner: true }).where(eq(contentThumbnailVariants.id, variant.id));
		await tx.update(mediaLibrary).set({
			thumbnail: variant.url,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.id, content.id));
	});
	return json({ success: true });
};

export { POST };
//# sourceMappingURL=_server.ts-B_TpuL56.js.map
