import { d as db, ag as contentThumbnailVariants, m as mediaLibrary } from './drizzle-C3SH12nS.js';
import { R as Role } from './constants-BiiFHz9b.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

//#region src/routes/api/creator/content/[id]/thumbnails/+server.ts
/**
* GET  /api/creator/content/[id]/thumbnails — list variants for own content
* POST /api/creator/content/[id]/thumbnails — add a new variant
*   body: { url, label? }
*/
async function ownerCheck(contentId, ownerId) {
	const [row] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!row) return {
		ok: false,
		status: 404
	};
	if (row.creatorId !== ownerId) return {
		ok: false,
		status: 403
	};
	return {
		ok: true,
		status: 200
	};
}
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const check = await ownerCheck(params.id, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? "Not found" : "Forbidden" }, { status: check.status });
	return json({ variants: (await db.select().from(contentThumbnailVariants).where(eq(contentThumbnailVariants.contentId, params.id)).orderBy(desc(contentThumbnailVariants.createdAt))).map((v) => ({
		...v,
		ctr: v.impressions > 0 ? Math.round(v.clicks / v.impressions * 1e3) / 10 : 0
	})) });
};
var POST = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const url = body.url?.trim();
	if (!url) return json({ error: "url is required" }, { status: 400 });
	const check = await ownerCheck(params.id, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? "Not found" : "Forbidden" }, { status: check.status });
	if ((await db.select({ id: contentThumbnailVariants.id }).from(contentThumbnailVariants).where(eq(contentThumbnailVariants.contentId, params.id))).length >= 5) return json({ error: "Max 5 variants per content row" }, { status: 400 });
	const [inserted] = await db.insert(contentThumbnailVariants).values({
		contentId: params.id,
		url: url.slice(0, 500),
		label: body.label?.trim().slice(0, 40) || null
	}).returning();
	return json({
		success: true,
		variant: inserted
	});
};

export { GET, POST };
//# sourceMappingURL=_server.ts-DmaPP5E1.js.map
