import { p as private_env } from './shared-server-DUDL94jl.js';
import { w as db, p as contentThumbnailVariants, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { sql, and, eq, isNull } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/lib/server/ab-promote.ts
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
var MIN_IMPRESSIONS = 200;
var CONFIDENCE = .95;
var MIN_LIFT_PCT = .1;
/**
* P(rate_A > rate_B) where each rate is a Beta posterior given priors
* alpha=beta=1 and observed clicks/impressions. Computed via Monte Carlo
* sampling — fast, deterministic seedless, accurate enough for thresholds.
*/
function probAbeatsB(a, b, samples = 4e3) {
	const aA = 1 + a.clicks;
	const bA = 1 + (a.impressions - a.clicks);
	const aB = 1 + b.clicks;
	const bB = 1 + (b.impressions - b.clicks);
	let win = 0;
	for (let i = 0; i < samples; i++) if (sampleBeta(aA, bA) > sampleBeta(aB, bB)) win++;
	return win / samples;
}
function sampleGamma(shape) {
	if (shape < 1) {
		const u = Math.random();
		return sampleGamma(shape + 1) * Math.pow(u, 1 / shape);
	}
	const d = shape - 1 / 3;
	const c = 1 / Math.sqrt(9 * d);
	for (;;) {
		let x, v;
		do {
			x = gaussian();
			v = 1 + c * x;
		} while (v <= 0);
		v = v * v * v;
		const u = Math.random();
		if (u < 1 - .0331 * x * x * x * x) return d * v;
		if (Math.log(u) < .5 * x * x + d * (1 - v + Math.log(v))) return d * v;
	}
}
function sampleBeta(a, b) {
	const x = sampleGamma(a);
	return x / (x + sampleGamma(b));
}
function gaussian() {
	let u = 0, v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
async function autoPromoteForContent(contentId) {
	const variants = await db.select({
		id: contentThumbnailVariants.id,
		url: contentThumbnailVariants.url,
		impressions: contentThumbnailVariants.impressions,
		clicks: contentThumbnailVariants.clicks
	}).from(contentThumbnailVariants).where(and(eq(contentThumbnailVariants.contentId, contentId), eq(contentThumbnailVariants.isActive, true), isNull(contentThumbnailVariants.promotedAt)));
	if (variants.length < 2) return {
		contentId,
		promoted: false,
		reason: "fewer than 2 active variants"
	};
	if (variants.some((v) => v.impressions < MIN_IMPRESSIONS)) return {
		contentId,
		promoted: false,
		reason: `awaiting more impressions (min ${MIN_IMPRESSIONS}/variant)`
	};
	const sorted = [...variants].sort((a, b) => {
		const ar = a.clicks / Math.max(a.impressions, 1);
		return b.clicks / Math.max(b.impressions, 1) - ar;
	});
	const best = sorted[0];
	const runnerUp = sorted[1];
	const bestRate = best.clicks / best.impressions;
	const runnerRate = runnerUp.clicks / runnerUp.impressions;
	if (runnerRate > 0 && (bestRate - runnerRate) / runnerRate < MIN_LIFT_PCT) return {
		contentId,
		promoted: false,
		reason: `lift ${((bestRate - runnerRate) / runnerRate * 100).toFixed(1)}% below threshold`
	};
	for (const other of sorted.slice(1)) {
		const p = probAbeatsB(best, other);
		if (p < CONFIDENCE) return {
			contentId,
			promoted: false,
			reason: `P(winner beats ${other.id.slice(0, 6)}) = ${p.toFixed(3)} < ${CONFIDENCE}`
		};
	}
	const now = /* @__PURE__ */ new Date();
	await db.transaction(async (tx) => {
		await tx.update(contentThumbnailVariants).set({ isWinner: false }).where(eq(contentThumbnailVariants.contentId, contentId));
		await tx.update(contentThumbnailVariants).set({
			isWinner: true,
			promotedAt: now
		}).where(eq(contentThumbnailVariants.id, best.id));
		await tx.update(mediaLibrary).set({
			thumbnail: best.url,
			updatedAt: now
		}).where(eq(mediaLibrary.id, contentId));
	});
	return {
		contentId,
		promoted: true,
		reason: "promoted",
		winnerId: best.id
	};
}
/**
* Find all content with multiple active variants and run the auto-promote
* check. Used by /api/cron/ab-auto-promote.
*/
async function runAutoPromoteSweep() {
	const rows = await db.select({
		contentId: contentThumbnailVariants.contentId,
		count: sql`count(*)::int`
	}).from(contentThumbnailVariants).where(and(eq(contentThumbnailVariants.isActive, true), isNull(contentThumbnailVariants.promotedAt))).groupBy(contentThumbnailVariants.contentId).having(sql`count(*) >= 2`);
	const results = [];
	let promoted = 0;
	for (const r of rows) {
		const out = await autoPromoteForContent(r.contentId);
		results.push(out);
		if (out.promoted) promoted += 1;
	}
	return {
		checked: rows.length,
		promoted,
		results
	};
}
//#endregion
//#region src/routes/api/cron/ab-auto-promote/+server.ts
/**
* POST /api/cron/ab-auto-promote
*
* Sweeps every content row that has ≥2 active thumbnail variants without
* a winner yet, runs the Bayesian comparison, and auto-promotes when a
* statistically significant winner emerges. CRON_SECRET bearer.
*
* Recommended schedule: hourly.
*/
var POST = async ({ request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	return json({
		ok: true,
		...await runAutoPromoteSweep()
	});
};

export { POST };
//# sourceMappingURL=_server.ts-Ckvz1yBY.js.map
