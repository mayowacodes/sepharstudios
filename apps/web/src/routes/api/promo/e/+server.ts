import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adImpressions } from '$lib/db/schema/sepharstudios';
import { eq, sql } from 'drizzle-orm';
import { verifyDecisionId } from '$lib/server/ads/decision';
import { take } from '$lib/server/rate-limit';

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

const EVENT_TYPES = ['start', 'q1', 'q2', 'q3', 'complete', 'skip', 'error', 'click'] as const;
type EventType = (typeof EVENT_TYPES)[number];

/** Which events move `status`, and to what. */
const STATUS_FOR: Partial<Record<EventType, string>> = {
	start: 'started',
	q1: 'q1',
	q2: 'q2',
	q3: 'q3',
	complete: 'complete'
};

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const body = (await request.json()) as {
			decisionId?: string;
			campaignId?: string;
			creativeId?: string;
			type?: string;
			watchedSeconds?: number;
			wasMuted?: boolean;
			layout?: string;
		};

		const { decisionId, campaignId, creativeId, type } = body;
		if (!decisionId || !campaignId || !creativeId || !type) return json({ ok: true });
		if (!EVENT_TYPES.includes(type as EventType)) return json({ ok: true });

		// Not `enforceRateLimit` — that throws a 429, and a beacon should never
		// surface an error to the page. Drop silently instead.
		const { allowed } = await take(`promo:e:${getClientAddress()}`, {
			capacity: 60,
			refillPerSec: 1
		});
		if (!allowed) return json({ ok: true });

		if (!verifyDecisionId(decisionId, campaignId, creativeId)) return json({ ok: true });

		const watched = Number.isFinite(body.watchedSeconds)
			? Math.max(0, Math.floor(body.watchedSeconds as number))
			: 0;

		if (type === 'click') {
			await db
				.update(adImpressions)
				.set({ clicked: true })
				.where(eq(adImpressions.decisionId, decisionId));
			return json({ ok: true });
		}

		if (type === 'skip' || type === 'error') {
			// Terminal side-states. They do not participate in the monotonic
			// rank — an ad can be skipped from any point — but watchedSeconds
			// still only ever grows.
			await db
				.update(adImpressions)
				.set({
					skipped: type === 'skip',
					watchedSeconds: sql`GREATEST(${adImpressions.watchedSeconds}, ${watched})`,
					completedAt: new Date(),
					...(body.wasMuted !== undefined ? { wasMuted: !!body.wasMuted } : {}),
					...(body.layout ? { layout: body.layout } : {})
				})
				.where(eq(adImpressions.decisionId, decisionId));
			return json({ ok: true });
		}

		const nextStatus = STATUS_FOR[type as EventType];
		if (!nextStatus) return json({ ok: true });

		// The rank guard is the dedup: a replayed or out-of-order beacon fails
		// the WHERE and updates nothing.
		await db
			.update(adImpressions)
			.set({
				status: nextStatus,
				watchedSeconds: sql`GREATEST(${adImpressions.watchedSeconds}, ${watched})`,
				...(type === 'start' ? { startedAt: new Date() } : {}),
				...(type === 'complete' ? { completedAt: new Date() } : {}),
				...(body.wasMuted !== undefined ? { wasMuted: !!body.wasMuted } : {}),
				...(body.layout ? { layout: body.layout } : {})
			})
			.where(
				sql`${adImpressions.decisionId} = ${decisionId}
				    AND ad_status_rank(${nextStatus}) > ad_status_rank(${adImpressions.status})`
			);

		return json({ ok: true });
	} catch (err) {
		console.error('[promo/e] beacon failed:', err instanceof Error ? err.message : err);
		return json({ ok: true });
	}
};
