import { K as mediaLibrary, t as db, y as contentPricing } from "../../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, asc, eq } from "drizzle-orm";
//#region src/routes/api/creator/content/[id]/pricing/+server.ts
/**
* GET    /api/creator/content/[id]/pricing — list region rows
* POST   /api/creator/content/[id]/pricing — upsert one region row
*   body: { regionCode: 'US'|'GB'|...|'*', priceCents, currency }
* DELETE /api/creator/content/[id]/pricing?regionCode=US
*/
async function ownerCheck(contentId, ownerId) {
	const [row] = await db.select({ creatorId: mediaLibrary.creatorId }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
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
	return json({ pricing: await db.select().from(contentPricing).where(eq(contentPricing.contentId, params.id)).orderBy(asc(contentPricing.regionCode)) });
};
var POST = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const check = await ownerCheck(params.id, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? "Not found" : "Forbidden" }, { status: check.status });
	const body = await request.json().catch(() => ({}));
	const regionCode = body.regionCode?.trim().toUpperCase();
	const priceCents = Number(body.priceCents);
	const currency = body.currency?.trim().toUpperCase();
	if (!regionCode || !(regionCode === "*" || /^[A-Z]{2}$/.test(regionCode))) return json({ error: "regionCode must be ISO-3166-1 alpha-2 or '*'" }, { status: 400 });
	if (!Number.isInteger(priceCents) || priceCents < 0) return json({ error: "priceCents must be a non-negative integer" }, { status: 400 });
	if (!currency || !/^[A-Z]{3}$/.test(currency)) return json({ error: "currency must be ISO-4217 (3 letters)" }, { status: 400 });
	await db.delete(contentPricing).where(and(eq(contentPricing.contentId, params.id), eq(contentPricing.regionCode, regionCode)));
	const [inserted] = await db.insert(contentPricing).values({
		contentId: params.id,
		regionCode,
		priceCents,
		currency
	}).returning();
	return json({
		success: true,
		row: inserted
	});
};
var DELETE = async ({ params, locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const check = await ownerCheck(params.id, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? "Not found" : "Forbidden" }, { status: check.status });
	const regionCode = url.searchParams.get("regionCode");
	if (!regionCode) return json({ error: "regionCode required" }, { status: 400 });
	await db.delete(contentPricing).where(and(eq(contentPricing.contentId, params.id), eq(contentPricing.regionCode, regionCode.toUpperCase())));
	return json({ success: true });
};
//#endregion
export { DELETE, GET, POST };
