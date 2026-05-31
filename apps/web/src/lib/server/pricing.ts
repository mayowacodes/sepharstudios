import { db } from '$lib/db/drizzle';
import { contentPricing, ppvContent } from '$lib/db/schema/sepharstudios';
import { and, eq, inArray } from 'drizzle-orm';

/**
 * Per-region PPV pricing resolver.
 *
 * Lookup order:
 *   1. Exact region match in contentPricing (e.g. viewer in US → row with regionCode='US')
 *   2. Default row in contentPricing (regionCode='*')
 *   3. Active ppvContent.finalPriceCents (single-region, admin-approved price)
 *
 * Returns null when the content has no PPV setting at all.
 */

export interface ResolvedPrice {
	priceCents: number;
	currency: string;
	source: 'region' | 'default' | 'ppv';
}

export async function resolvePrice(
	contentId: string,
	viewerCountry: string | null
): Promise<ResolvedPrice | null> {
	const regionPriority = viewerCountry ? [viewerCountry.toUpperCase(), '*'] : ['*'];

	const rows = await db.select({
		regionCode: contentPricing.regionCode,
		priceCents: contentPricing.priceCents,
		currency: contentPricing.currency
	})
		.from(contentPricing)
		.where(and(
			eq(contentPricing.contentId, contentId),
			inArray(contentPricing.regionCode, regionPriority)
		));

	const byRegion = new Map(rows.map((r) => [r.regionCode, r]));
	const exact = viewerCountry ? byRegion.get(viewerCountry.toUpperCase()) : undefined;
	if (exact) {
		return { priceCents: exact.priceCents, currency: exact.currency, source: 'region' };
	}
	const fallbackRow = byRegion.get('*');
	if (fallbackRow) {
		return { priceCents: fallbackRow.priceCents, currency: fallbackRow.currency, source: 'default' };
	}

	// Fallback to the admin-approved ppvContent price (single-currency, no
	// region split). Only active PPV configurations count.
	const [ppv] = await db.select({
		priceCents: ppvContent.finalPriceCents,
		currency: ppvContent.currency
	})
		.from(ppvContent)
		.where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true)))
		.limit(1);
	if (ppv?.priceCents != null && ppv.priceCents > 0) {
		return {
			priceCents: ppv.priceCents,
			currency: (ppv.currency ?? 'USD').toUpperCase(),
			source: 'ppv'
		};
	}
	return null;
}
