import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { contentPricing, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, asc, eq } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * GET    /api/creator/content/[id]/pricing — list region rows
 * POST   /api/creator/content/[id]/pricing — upsert one region row
 *   body: { regionCode: 'US'|'GB'|...|'*', priceCents, currency }
 * DELETE /api/creator/content/[id]/pricing?regionCode=US
 */

async function ownerCheck(contentId: string, ownerId: string) {
	const [row] = await db.select({ creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);
	if (!row) return { ok: false, status: 404 as const };
	if (row.creatorId !== ownerId) return { ok: false, status: 403 as const };
	return { ok: true, status: 200 as const };
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const check = await ownerCheck(params.id!, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? 'Not found' : 'Forbidden' }, { status: check.status });

	const rows = await db.select()
		.from(contentPricing)
		.where(eq(contentPricing.contentId, params.id!))
		.orderBy(asc(contentPricing.regionCode));
	return json({ pricing: rows });
};

export const POST: RequestHandler = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const check = await ownerCheck(params.id!, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? 'Not found' : 'Forbidden' }, { status: check.status });

	const body = await request.json().catch(() => ({})) as {
		regionCode?: string;
		priceCents?: number;
		currency?: string;
	};
	const regionCode = body.regionCode?.trim().toUpperCase();
	const priceCents = Number(body.priceCents);
	const currency = body.currency?.trim().toUpperCase();
	if (!regionCode || !(regionCode === '*' || /^[A-Z]{2}$/.test(regionCode))) {
		return json({ error: "regionCode must be ISO-3166-1 alpha-2 or '*'" }, { status: 400 });
	}
	if (!Number.isInteger(priceCents) || priceCents < 0) {
		return json({ error: 'priceCents must be a non-negative integer' }, { status: 400 });
	}
	if (!currency || !/^[A-Z]{3}$/.test(currency)) {
		return json({ error: 'currency must be ISO-4217 (3 letters)' }, { status: 400 });
	}

	// Upsert: clear any existing row for this content+region, then insert.
	await db.delete(contentPricing)
		.where(and(
			eq(contentPricing.contentId, params.id!),
			eq(contentPricing.regionCode, regionCode)
		));
	const [inserted] = await db.insert(contentPricing).values({
		contentId: params.id!,
		regionCode,
		priceCents,
		currency
	}).returning();

	return json({ success: true, row: inserted });
};

export const DELETE: RequestHandler = async ({ params, locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	const check = await ownerCheck(params.id!, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? 'Not found' : 'Forbidden' }, { status: check.status });

	const regionCode = url.searchParams.get('regionCode');
	if (!regionCode) return json({ error: 'regionCode required' }, { status: 400 });
	await db.delete(contentPricing)
		.where(and(
			eq(contentPricing.contentId, params.id!),
			eq(contentPricing.regionCode, regionCode.toUpperCase())
		));
	return json({ success: true });
};
