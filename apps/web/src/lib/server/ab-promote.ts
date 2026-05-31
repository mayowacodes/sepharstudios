import { db } from '$lib/db/drizzle';
import { contentThumbnailVariants, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq, isNull, sql } from 'drizzle-orm';

/**
 * A/B thumbnail auto-promote.
 *
 * Uses a simplified Bayesian comparison (Beta-Binomial conjugate) on
 * impressions/clicks per variant. Promotes a winner when:
 *   - Each variant has ≥ MIN_IMPRESSIONS impressions
 *   - The best variant's probability of beating each other variant is
 *     ≥ CONFIDENCE (default 0.95)
 *   - The best variant has a non-trivial CTR lift over the runner-up
 *
 * On promotion:
 *   - sets isWinner=true on the winner, false on others
 *   - sets promotedAt=now on the winner
 *   - copies the URL into media_library.thumbnail
 *
 * The math is deliberately conservative — false-positive promotion is
 * worse than waiting longer for more data. Test with a uniform prior
 * (alpha=beta=1).
 */

const MIN_IMPRESSIONS = 200;
const CONFIDENCE = 0.95;
const MIN_LIFT_PCT = 0.10; // winner must be at least 10% better CTR

interface Variant {
	id: string;
	url: string;
	impressions: number;
	clicks: number;
}

/**
 * P(rate_A > rate_B) where each rate is a Beta posterior given priors
 * alpha=beta=1 and observed clicks/impressions. Computed via Monte Carlo
 * sampling — fast, deterministic seedless, accurate enough for thresholds.
 */
function probAbeatsB(a: Variant, b: Variant, samples = 4000): number {
	const aA = 1 + a.clicks;
	const bA = 1 + (a.impressions - a.clicks);
	const aB = 1 + b.clicks;
	const bB = 1 + (b.impressions - b.clicks);
	let win = 0;
	for (let i = 0; i < samples; i++) {
		const rA = sampleBeta(aA, bA);
		const rB = sampleBeta(aB, bB);
		if (rA > rB) win++;
	}
	return win / samples;
}

// Marsaglia & Tsang Gamma sampler → derive Beta from Gamma(a)/Gamma(a)+Gamma(b).
function sampleGamma(shape: number): number {
	if (shape < 1) {
		const u = Math.random();
		return sampleGamma(shape + 1) * Math.pow(u, 1 / shape);
	}
	const d = shape - 1 / 3;
	const c = 1 / Math.sqrt(9 * d);
	for (;;) {
		let x: number, v: number;
		do {
			x = gaussian();
			v = 1 + c * x;
		} while (v <= 0);
		v = v * v * v;
		const u = Math.random();
		if (u < 1 - 0.0331 * x * x * x * x) return d * v;
		if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
	}
}
function sampleBeta(a: number, b: number): number {
	const x = sampleGamma(a);
	return x / (x + sampleGamma(b));
}
function gaussian(): number {
	let u = 0, v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export async function autoPromoteForContent(contentId: string): Promise<{
	contentId: string;
	promoted: boolean;
	reason: string;
	winnerId?: string;
}> {
	const variants = await db.select({
		id: contentThumbnailVariants.id,
		url: contentThumbnailVariants.url,
		impressions: contentThumbnailVariants.impressions,
		clicks: contentThumbnailVariants.clicks
	})
		.from(contentThumbnailVariants)
		.where(and(
			eq(contentThumbnailVariants.contentId, contentId),
			eq(contentThumbnailVariants.isActive, true),
			isNull(contentThumbnailVariants.promotedAt)
		));

	if (variants.length < 2) return { contentId, promoted: false, reason: 'fewer than 2 active variants' };

	if (variants.some((v) => v.impressions < MIN_IMPRESSIONS)) {
		return { contentId, promoted: false, reason: `awaiting more impressions (min ${MIN_IMPRESSIONS}/variant)` };
	}

	// Sort by raw CTR descending; the best is our candidate.
	const sorted = [...variants].sort((a, b) => {
		const ar = a.clicks / Math.max(a.impressions, 1);
		const br = b.clicks / Math.max(b.impressions, 1);
		return br - ar;
	});
	const best = sorted[0];
	const runnerUp = sorted[1];

	const bestRate = best.clicks / best.impressions;
	const runnerRate = runnerUp.clicks / runnerUp.impressions;
	if (runnerRate > 0 && (bestRate - runnerRate) / runnerRate < MIN_LIFT_PCT) {
		return { contentId, promoted: false, reason: `lift ${(((bestRate - runnerRate) / runnerRate) * 100).toFixed(1)}% below threshold` };
	}

	// Check the candidate beats every other variant with confidence.
	for (const other of sorted.slice(1)) {
		const p = probAbeatsB(best, other);
		if (p < CONFIDENCE) {
			return { contentId, promoted: false, reason: `P(winner beats ${other.id.slice(0, 6)}) = ${p.toFixed(3)} < ${CONFIDENCE}` };
		}
	}

	// Promote.
	const now = new Date();
	await db.transaction(async (tx) => {
		await tx.update(contentThumbnailVariants)
			.set({ isWinner: false })
			.where(eq(contentThumbnailVariants.contentId, contentId));
		await tx.update(contentThumbnailVariants)
			.set({ isWinner: true, promotedAt: now })
			.where(eq(contentThumbnailVariants.id, best.id));
		await tx.update(mediaLibrary)
			.set({ thumbnail: best.url, updatedAt: now })
			.where(eq(mediaLibrary.id, contentId));
	});

	return { contentId, promoted: true, reason: 'promoted', winnerId: best.id };
}

/**
 * Find all content with multiple active variants and run the auto-promote
 * check. Used by /api/cron/ab-auto-promote.
 */
export async function runAutoPromoteSweep(): Promise<{
	checked: number;
	promoted: number;
	results: Awaited<ReturnType<typeof autoPromoteForContent>>[];
}> {
	const rows = await db.select({
		contentId: contentThumbnailVariants.contentId,
		count: sql<number>`count(*)::int`
	})
		.from(contentThumbnailVariants)
		.where(and(
			eq(contentThumbnailVariants.isActive, true),
			isNull(contentThumbnailVariants.promotedAt)
		))
		.groupBy(contentThumbnailVariants.contentId)
		.having(sql`count(*) >= 2`);

	const results: Awaited<ReturnType<typeof autoPromoteForContent>>[] = [];
	let promoted = 0;
	for (const r of rows) {
		const out = await autoPromoteForContent(r.contentId);
		results.push(out);
		if (out.promoted) promoted += 1;
	}
	return { checked: rows.length, promoted, results };
}
