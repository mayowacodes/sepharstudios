import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { playbackTelemetry } from '$lib/db/schema/sepharstudios';
import { eq, sql } from 'drizzle-orm';
import { fingerprintFromHeaders } from '$lib/server/ua-country';
import { take } from '$lib/server/rate-limit';

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
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	try {
		const body = (await request.json()) as {
			sessionId?: string;
			contentId?: string;
			effectiveBitrateKbps?: number;
			startupMs?: number;
			stallCount?: number;
			stallSeconds?: number;
			errorCount?: number;
			fatalError?: string;
			finalQuality?: string;
			watchedSeconds?: number;
		};

		if (!body.contentId) return json({ ok: true });

		// A session posts a handful of updates over a couple of hours. This
		// bounds a client looping the endpoint without ever surfacing an error
		// to the page — `take`, not `enforceRateLimit`, which would throw a 429.
		const { allowed } = await take(`telemetry:${getClientAddress()}`, {
			capacity: 60,
			refillPerSec: 0.5
		});
		if (!allowed) return json({ ok: true });

		const session = await locals.auth.getSession();
		const fp = fingerprintFromHeaders(request.headers);

		const int = (v: unknown, max = 2_147_483_647) =>
			Number.isFinite(v as number) ? Math.min(max, Math.max(0, Math.floor(v as number))) : 0;

		// Monotonic fields only ever grow. A late-arriving beacon that reports
		// fewer stalls than an earlier one is stale, not a correction —
		// GREATEST keeps the true peak rather than letting ordering decide.
		const patch = {
			effectiveBitrateKbps: int(body.effectiveBitrateKbps),
			startupMs: int(body.startupMs),
			stallCount: int(body.stallCount),
			stallSeconds: int(body.stallSeconds),
			errorCount: int(body.errorCount),
			fatalError: body.fatalError?.slice(0, 500) ?? null,
			finalQuality: body.finalQuality?.slice(0, 20) ?? null,
			watchedSeconds: int(body.watchedSeconds),
			updatedAt: new Date()
		};

		if (body.sessionId) {
			await db
				.update(playbackTelemetry)
				.set({
					...patch,
					stallCount: sql`GREATEST(${playbackTelemetry.stallCount}, ${patch.stallCount})`,
					stallSeconds: sql`GREATEST(${playbackTelemetry.stallSeconds}, ${patch.stallSeconds})`,
					errorCount: sql`GREATEST(${playbackTelemetry.errorCount}, ${patch.errorCount})`,
					watchedSeconds: sql`GREATEST(${playbackTelemetry.watchedSeconds}, ${patch.watchedSeconds})`
				})
				.where(eq(playbackTelemetry.id, body.sessionId));
			return json({ ok: true, sessionId: body.sessionId });
		}

		const [row] = await db
			.insert(playbackTelemetry)
			.values({
				contentId: body.contentId,
				userId: session?.user.id ?? null,
				deviceType: fp.deviceType,
				country: fp.country,
				...patch
			})
			.returning({ id: playbackTelemetry.id });

		return json({ ok: true, sessionId: row?.id });
	} catch (err) {
		console.error('[telemetry] failed:', err instanceof Error ? err.message : err);
		return json({ ok: true });
	}
};
