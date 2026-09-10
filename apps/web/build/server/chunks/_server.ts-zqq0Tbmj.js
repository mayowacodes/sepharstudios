import { d as db, m as mediaLibrary, ad as contentThumbnailVariants } from './drizzle-DlGuU73K.js';
import { R as Role } from './constants-RccSloty.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

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
//# sourceMappingURL=_server.ts-zqq0Tbmj.js.map
