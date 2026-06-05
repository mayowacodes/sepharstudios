import { w as db, m as contentPricing } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/content/[id]/pricing/+server.ts
/**
* Per-region PPV pricing for a single content item.
*
* GET    /api/admin/content/[id]/pricing
* POST   /api/admin/content/[id]/pricing — upsert one (regionCode, price)
* DELETE /api/admin/content/[id]/pricing?regionCode=US
*
* Region code is ISO-3166-1 alpha-2 (e.g. "US", "NG") or "*" for the
* default-region fallback. resolvePrice() in lib/server/pricing.ts reads
* this table when the per-country price API is hit.
*/
function adminGuard(locals) {
	if (locals.user?.role !== "admin") return { error: json({ error: "Forbidden" }, { status: 403 }) };
	return {};
}
function normalizeRegion(raw) {
	if (typeof raw !== "string") return null;
	const code = raw.trim().toUpperCase();
	if (code === "*") return "*";
	if (/^[A-Z]{2}$/.test(code)) return code;
	return null;
}
var GET = async ({ params, locals }) => {
	const g = adminGuard(locals);
	if (g.error) return g.error;
	return json({ rows: await db.select({
		id: contentPricing.id,
		regionCode: contentPricing.regionCode,
		priceCents: contentPricing.priceCents,
		currency: contentPricing.currency
	}).from(contentPricing).where(eq(contentPricing.contentId, params.id)) });
};
var POST = async ({ params, request, locals }) => {
	const g = adminGuard(locals);
	if (g.error) return g.error;
	const body = await request.json().catch(() => ({}));
	const regionCode = normalizeRegion(body.regionCode);
	if (!regionCode) return json({ error: "regionCode must be * or ISO-3166-1 alpha-2" }, { status: 400 });
	const priceCents = Math.round(Number(body.priceCents));
	if (!Number.isFinite(priceCents) || priceCents < 99) return json({ error: "priceCents must be ≥ 99" }, { status: 400 });
	const currency = (body.currency ?? "USD").toString().toUpperCase().slice(0, 3);
	if (!/^[A-Z]{3}$/.test(currency)) return json({ error: "currency must be 3-letter ISO-4217 code" }, { status: 400 });
	const [existing] = await db.select({ id: contentPricing.id }).from(contentPricing).where(and(eq(contentPricing.contentId, params.id), eq(contentPricing.regionCode, regionCode))).limit(1);
	if (existing) {
		await db.update(contentPricing).set({
			priceCents,
			currency
		}).where(eq(contentPricing.id, existing.id));
		return json({
			ok: true,
			action: "updated"
		});
	}
	await db.insert(contentPricing).values({
		contentId: params.id,
		regionCode,
		priceCents,
		currency
	});
	return json({
		ok: true,
		action: "inserted"
	});
};
var DELETE = async ({ params, url, locals }) => {
	const g = adminGuard(locals);
	if (g.error) return g.error;
	const regionCode = normalizeRegion(url.searchParams.get("regionCode"));
	if (!regionCode) return json({ error: "regionCode required" }, { status: 400 });
	await db.delete(contentPricing).where(and(eq(contentPricing.contentId, params.id), eq(contentPricing.regionCode, regionCode)));
	return json({ ok: true });
};

export { DELETE, GET, POST };
//# sourceMappingURL=_server.ts-CIQcbabB.js.map
