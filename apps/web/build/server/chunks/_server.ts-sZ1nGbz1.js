import { d as db, Q as playbackTelemetry } from './drizzle-C3SH12nS.js';
import { t as take } from './rate-limit-Bpg0lNN3.js';
import { f as fingerprintFromHeaders } from './ua-country-BNOH1xSS.js';
import { j as json } from './index.js-CxPEndTa.js';
import { sql, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './redis-7fSdOjSS.js';
import 'ioredis';

//#region src/routes/api/watch/telemetry/+server.ts
/**
* POST /api/watch/telemetry → { ok: true, sessionId }
*
* One row per playback session, updated in place. The player posts a summary
* periodically and once more on teardown via `sendBeacon`.
*
* Always returns ok and swallows failures: telemetry must never break
* playback, and a viewer whose metrics fail to record should still watch the
* film. Device and country are derived SERVER-side from headers so they match
* watchSessionMeta's buckets and cannot be spoofed by the client.
*/
var POST = async ({ request, locals, getClientAddress }) => {
	try {
		const body = await request.json();
		if (!body.contentId) return json({ ok: true });
		const { allowed } = await take(`telemetry:${getClientAddress()}`, {
			capacity: 60,
			refillPerSec: .5
		});
		if (!allowed) return json({ ok: true });
		const session = await locals.auth.getSession();
		const fp = fingerprintFromHeaders(request.headers);
		const int = (v, max = 2147483647) => Number.isFinite(v) ? Math.min(max, Math.max(0, Math.floor(v))) : 0;
		const patch = {
			effectiveBitrateKbps: int(body.effectiveBitrateKbps),
			startupMs: int(body.startupMs),
			stallCount: int(body.stallCount),
			stallSeconds: int(body.stallSeconds),
			errorCount: int(body.errorCount),
			fatalError: body.fatalError?.slice(0, 500) ?? null,
			finalQuality: body.finalQuality?.slice(0, 20) ?? null,
			watchedSeconds: int(body.watchedSeconds),
			updatedAt: /* @__PURE__ */ new Date()
		};
		if (body.sessionId) {
			await db.update(playbackTelemetry).set({
				...patch,
				stallCount: sql`GREATEST(${playbackTelemetry.stallCount}, ${patch.stallCount})`,
				stallSeconds: sql`GREATEST(${playbackTelemetry.stallSeconds}, ${patch.stallSeconds})`,
				errorCount: sql`GREATEST(${playbackTelemetry.errorCount}, ${patch.errorCount})`,
				watchedSeconds: sql`GREATEST(${playbackTelemetry.watchedSeconds}, ${patch.watchedSeconds})`
			}).where(eq(playbackTelemetry.id, body.sessionId));
			return json({
				ok: true,
				sessionId: body.sessionId
			});
		}
		const [row] = await db.insert(playbackTelemetry).values({
			contentId: body.contentId,
			userId: session?.user.id ?? null,
			deviceType: fp.deviceType,
			country: fp.country,
			...patch
		}).returning({ id: playbackTelemetry.id });
		return json({
			ok: true,
			sessionId: row?.id
		});
	} catch (err) {
		console.error("[telemetry] failed:", err instanceof Error ? err.message : err);
		return json({ ok: true });
	}
};

export { POST };
//# sourceMappingURL=_server.ts-sZ1nGbz1.js.map
