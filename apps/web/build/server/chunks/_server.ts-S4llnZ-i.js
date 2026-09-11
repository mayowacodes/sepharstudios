import { d as db, Y as adImpressions } from './drizzle-CsnNxG5m.js';
import { v as verifyDecisionId } from './decision-h45JlQJX.js';
import { t as take } from './rate-limit-8igsU22q.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq, sql } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './redis-8sKVJ4Iw.js';
import 'ioredis';
import './ads-CWhe8cTk.js';
import './paystack-CI6fS_Y0.js';
import 'node:crypto';

//#region src/routes/api/promo/e/+server.ts
/**
* POST /api/promo/e  →  { ok: true }
*
* Playback beacons for a served ad: start, quartiles, complete, skip, error,
* click.
*
* Always returns `{ ok: true }` and swallows failures, following the
* tracking-pixel precedent already in this codebase — a beacon must never break
* playback. But it improves on that precedent in three specific ways, because
* the existing thumbnail counters are an unauthenticated `col = col + 1` with
* no dedup and no rate limit, and are trivially inflatable:
*
*   1. AUTHENTICITY — `decisionId` is HMAC-signed at decision time. You cannot
*      invent one; you can only replay one you were served.
*   2. DEDUP — status advances monotonically via `ad_status_rank()`, so a
*      replayed `start` updates zero rows rather than incrementing a counter.
*      This is a single UPDATE with the guard in the WHERE clause, not a
*      read-modify-write, so concurrent beacons cannot interleave.
*   3. RATE LIMIT — one ad legitimately emits at most ~8 events.
*
* Terminal events are sent with `navigator.sendBeacon`, so this handler must
* tolerate a request whose page is already gone.
*/
var EVENT_TYPES = [
	"start",
	"q1",
	"q2",
	"q3",
	"complete",
	"skip",
	"error",
	"click"
];
/** Which events move `status`, and to what. */
var STATUS_FOR = {
	start: "started",
	q1: "q1",
	q2: "q2",
	q3: "q3",
	complete: "complete"
};
var POST = async ({ request, getClientAddress }) => {
	try {
		const body = await request.json();
		const { decisionId, campaignId, creativeId, type } = body;
		if (!decisionId || !campaignId || !creativeId || !type) return json({ ok: true });
		if (!EVENT_TYPES.includes(type)) return json({ ok: true });
		const { allowed } = await take(`promo:e:${getClientAddress()}`, {
			capacity: 60,
			refillPerSec: 1
		});
		if (!allowed) return json({ ok: true });
		if (!verifyDecisionId(decisionId, campaignId, creativeId)) return json({ ok: true });
		const watched = Number.isFinite(body.watchedSeconds) ? Math.max(0, Math.floor(body.watchedSeconds)) : 0;
		if (type === "click") {
			await db.update(adImpressions).set({ clicked: true }).where(eq(adImpressions.decisionId, decisionId));
			return json({ ok: true });
		}
		if (type === "skip" || type === "error") {
			await db.update(adImpressions).set({
				skipped: type === "skip",
				watchedSeconds: sql`GREATEST(${adImpressions.watchedSeconds}, ${watched})`,
				completedAt: /* @__PURE__ */ new Date(),
				...body.wasMuted !== void 0 ? { wasMuted: !!body.wasMuted } : {},
				...body.layout ? { layout: body.layout } : {}
			}).where(eq(adImpressions.decisionId, decisionId));
			return json({ ok: true });
		}
		const nextStatus = STATUS_FOR[type];
		if (!nextStatus) return json({ ok: true });
		await db.update(adImpressions).set({
			status: nextStatus,
			watchedSeconds: sql`GREATEST(${adImpressions.watchedSeconds}, ${watched})`,
			...type === "start" ? { startedAt: /* @__PURE__ */ new Date() } : {},
			...type === "complete" ? { completedAt: /* @__PURE__ */ new Date() } : {},
			...body.wasMuted !== void 0 ? { wasMuted: !!body.wasMuted } : {},
			...body.layout ? { layout: body.layout } : {}
		}).where(sql`${adImpressions.decisionId} = ${decisionId}
				    AND ad_status_rank(${nextStatus}) > ad_status_rank(${adImpressions.status})`);
		return json({ ok: true });
	} catch (err) {
		console.error("[promo/e] beacon failed:", err instanceof Error ? err.message : err);
		return json({ ok: true });
	}
};

export { POST };
//# sourceMappingURL=_server.ts-S4llnZ-i.js.map
