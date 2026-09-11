import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adBreaks, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import {
	MAX_BREAKS_PER_TITLE,
	MIN_BREAK_GAP_SECONDS,
	NO_BREAKS_AFTER_PCT
} from '$lib/server/ads/decision';

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
export const POST: RequestHandler = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const body = (await request.json().catch(() => null)) as {
		contentId?: string;
		runtimeSeconds?: number;
		strategy?: 'chapters' | 'interval';
		intervalSeconds?: number;
		includePreroll?: boolean;
		replace?: boolean;
	} | null;

	const contentId = body?.contentId;
	const runtime = Number(body?.runtimeSeconds);
	if (!contentId) return json({ error: 'contentId is required' }, { status: 400 });
	if (!Number.isFinite(runtime) || runtime <= 0) {
		return json(
			{ error: 'runtimeSeconds is required (the DB stores duration as a display string, not seconds)' },
			{ status: 400 }
		);
	}

	const [content] = await db
		.select({
			id: mediaLibrary.id,
			category: mediaLibrary.category,
			chapters: mediaLibrary.chapters
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);

	if (!content) return json({ error: 'Content not found' }, { status: 404 });
	if (content.category === 'kids' || content.category === 'teens') {
		return json(
			{ error: 'Kids and Teens titles are ad-free — generated breaks would never serve' },
			{ status: 400 }
		);
	}

	const cutoff = runtime * NO_BREAKS_AFTER_PCT;
	const strategy = body?.strategy === 'chapters' ? 'chapters' : 'interval';

	let candidates: number[] = [];

	if (strategy === 'chapters') {
		// Chapter boundaries are act breaks — a cut the director already chose,
		// which is far less jarring than an arbitrary timestamp mid-scene.
		const chapters = (content.chapters ?? []) as Array<{ start?: number }>;
		candidates = chapters
			.map((c) => Math.floor(Number(c?.start ?? 0)))
			.filter((n) => Number.isFinite(n) && n > 0);
		if (candidates.length === 0) {
			return json(
				{ error: 'This title has no chapter markers — use the interval strategy instead' },
				{ status: 400 }
			);
		}
	} else {
		const interval = Math.max(
			MIN_BREAK_GAP_SECONDS,
			Number(body?.intervalSeconds) || Math.floor(runtime / (MAX_BREAKS_PER_TITLE + 1))
		);
		for (let t = interval; t < cutoff; t += interval) candidates.push(Math.floor(t));
	}

	// Apply the same policy the decision path enforces, so a generated set can
	// never contain a break that would be silently skipped at playback.
	const placed: number[] = [];
	let last = -Infinity;
	for (const t of candidates.sort((a, b) => a - b)) {
		if (placed.length >= MAX_BREAKS_PER_TITLE) break;
		if (t > cutoff) continue;
		if (t - last < MIN_BREAK_GAP_SECONDS) continue;
		placed.push(t);
		last = t;
	}

	if (body?.replace) {
		await db.delete(adBreaks).where(eq(adBreaks.contentId, contentId));
	}

	const rows: Array<{ contentId: string; positionSeconds: number; kind: string }> = [];
	if (body?.includePreroll) rows.push({ contentId, positionSeconds: 0, kind: 'preroll' });
	for (const t of placed) rows.push({ contentId, positionSeconds: t, kind: 'midroll' });

	if (rows.length === 0) {
		return json(
			{ error: 'No valid break positions for this runtime and strategy' },
			{ status: 400 }
		);
	}

	// onConflictDoNothing rather than a pre-check: the unique index on
	// (content_id, position_seconds) is the real arbiter, and re-running the
	// generator should be idempotent rather than an error.
	const inserted = await db
		.insert(adBreaks)
		.values(rows)
		.onConflictDoNothing()
		.returning();

	return json({
		created: inserted.length,
		requested: rows.length,
		positions: inserted.map((r) => r.positionSeconds).sort((a, b) => a - b),
		policy: { MAX_BREAKS_PER_TITLE, MIN_BREAK_GAP_SECONDS, NO_BREAKS_AFTER_PCT, cutoffSeconds: Math.floor(cutoff) }
	});
};
