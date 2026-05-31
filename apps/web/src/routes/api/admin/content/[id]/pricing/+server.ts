import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { contentPricing } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

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

function adminGuard(locals: App.Locals): { error?: Response } {
	if (locals.user?.role !== 'admin') {
		return { error: json({ error: 'Forbidden' }, { status: 403 }) };
	}
	return {};
}

function normalizeRegion(raw: unknown): string | null {
	if (typeof raw !== 'string') return null;
	const code = raw.trim().toUpperCase();
	if (code === '*') return '*';
	if (/^[A-Z]{2}$/.test(code)) return code;
	return null;
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const g = adminGuard(locals);
	if (g.error) return g.error;

	const rows = await db
		.select({
			id: contentPricing.id,
			regionCode: contentPricing.regionCode,
			priceCents: contentPricing.priceCents,
			currency: contentPricing.currency
		})
		.from(contentPricing)
		.where(eq(contentPricing.contentId, params.id!));

	return json({ rows });
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const g = adminGuard(locals);
	if (g.error) return g.error;

	const body = await request.json().catch(() => ({})) as {
		regionCode?: string;
		priceCents?: number;
		currency?: string;
	};

	const regionCode = normalizeRegion(body.regionCode);
	if (!regionCode) return json({ error: 'regionCode must be * or ISO-3166-1 alpha-2' }, { status: 400 });

	const priceCents = Math.round(Number(body.priceCents));
	if (!Number.isFinite(priceCents) || priceCents < 99) {
		return json({ error: 'priceCents must be ≥ 99' }, { status: 400 });
	}

	const currency = (body.currency ?? 'USD').toString().toUpperCase().slice(0, 3);
	if (!/^[A-Z]{3}$/.test(currency)) {
		return json({ error: 'currency must be 3-letter ISO-4217 code' }, { status: 400 });
	}

	const [existing] = await db
		.select({ id: contentPricing.id })
		.from(contentPricing)
		.where(and(eq(contentPricing.contentId, params.id!), eq(contentPricing.regionCode, regionCode)))
		.limit(1);

	if (existing) {
		await db.update(contentPricing)
			.set({ priceCents, currency })
			.where(eq(contentPricing.id, existing.id));
		return json({ ok: true, action: 'updated' });
	}

	await db.insert(contentPricing).values({
		contentId: params.id!,
		regionCode,
		priceCents,
		currency
	});
	return json({ ok: true, action: 'inserted' });
};

export const DELETE: RequestHandler = async ({ params, url, locals }) => {
	const g = adminGuard(locals);
	if (g.error) return g.error;

	const regionCode = normalizeRegion(url.searchParams.get('regionCode'));
	if (!regionCode) return json({ error: 'regionCode required' }, { status: 400 });

	await db.delete(contentPricing)
		.where(and(eq(contentPricing.contentId, params.id!), eq(contentPricing.regionCode, regionCode)));
	return json({ ok: true });
};
