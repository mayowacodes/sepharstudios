import { d as db, m as mediaLibrary, U as adBreaks } from './drizzle-C3SH12nS.js';
import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { N as NO_BREAKS_AFTER_PCT } from './decision-D3MG31ZT.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './redis-7fSdOjSS.js';
import 'ioredis';
import './paystack-DWLDZ9qO.js';
import 'node:crypto';

//#region src/routes/api/admin/promo/breaks/generate/+server.ts
/**
* POST /api/admin/promo/breaks/generate
*
* Body: { contentId, runtimeSeconds, strategy: 'chapters' | 'interval',
*         intervalSeconds?, includePreroll?, replace? }
*
* Places up to MAX_BREAKS_PER_TITLE cue points in one call. Placing four
* breaks by hand for every title in a catalog is the kind of work nobody
* finishes, so the generator is what makes the policy actually get applied.
*
* `runtimeSeconds` is REQUIRED. `mediaLibrary.duration` is a display string
* ('2h 7m'), not seconds — there is no numeric runtime column — so the server
* cannot derive the 90% cutoff on its own.
*/
var POST = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const body = await request.json().catch(() => null);
	const contentId = body?.contentId;
	const runtime = Number(body?.runtimeSeconds);
	if (!contentId) return json({ error: "contentId is required" }, { status: 400 });
	if (!Number.isFinite(runtime) || runtime <= 0) return json({ error: "runtimeSeconds is required (the DB stores duration as a display string, not seconds)" }, { status: 400 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		category: mediaLibrary.category,
		chapters: mediaLibrary.chapters
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!content) return json({ error: "Content not found" }, { status: 404 });
	if (content.category === "kids" || content.category === "teens") return json({ error: "Kids and Teens titles are ad-free — generated breaks would never serve" }, { status: 400 });
	const cutoff = runtime * NO_BREAKS_AFTER_PCT;
	const strategy = body?.strategy === "chapters" ? "chapters" : "interval";
	let candidates = [];
	if (strategy === "chapters") {
		candidates = (content.chapters ?? []).map((c) => Math.floor(Number(c?.start ?? 0))).filter((n) => Number.isFinite(n) && n > 0);
		if (candidates.length === 0) return json({ error: "This title has no chapter markers — use the interval strategy instead" }, { status: 400 });
	} else {
		const interval = Math.max(300, Number(body?.intervalSeconds) || Math.floor(runtime / 5));
		for (let t = interval; t < cutoff; t += interval) candidates.push(Math.floor(t));
	}
	const placed = [];
	let last = -Infinity;
	for (const t of candidates.sort((a, b) => a - b)) {
		if (placed.length >= 4) break;
		if (t > cutoff) continue;
		if (t - last < 300) continue;
		placed.push(t);
		last = t;
	}
	if (body?.replace) await db.delete(adBreaks).where(eq(adBreaks.contentId, contentId));
	const rows = [];
	if (body?.includePreroll) rows.push({
		contentId,
		positionSeconds: 0,
		kind: "preroll"
	});
	for (const t of placed) rows.push({
		contentId,
		positionSeconds: t,
		kind: "midroll"
	});
	if (rows.length === 0) return json({ error: "No valid break positions for this runtime and strategy" }, { status: 400 });
	const inserted = await db.insert(adBreaks).values(rows).onConflictDoNothing().returning();
	return json({
		created: inserted.length,
		requested: rows.length,
		positions: inserted.map((r) => r.positionSeconds).sort((a, b) => a - b),
		policy: {
			MAX_BREAKS_PER_TITLE: 4,
			MIN_BREAK_GAP_SECONDS: 300,
			NO_BREAKS_AFTER_PCT,
			cutoffSeconds: Math.floor(cutoff)
		}
	});
};

export { POST };
//# sourceMappingURL=_server.ts-BO3Ur7e_.js.map
