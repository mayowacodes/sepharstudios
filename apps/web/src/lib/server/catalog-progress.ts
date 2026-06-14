import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaWatchProgress } from '$lib/db/schema/sepharstudios';

/**
 * Catalog progress augmentation.
 *
 * Catalog pages (/movies, /shows, /documentaries, home page) want a
 * small in-progress strip burned into each card whenever the signed-in
 * viewer has unfinished progress on that title — same affordance
 * Netflix surfaces, which immediately tells users "you started this."
 *
 * This helper takes the catalog rows that those pages already fetched
 * + the current userId, and returns the SAME rows with two new
 * optional fields on every card that has progress:
 *
 *   progressPercent — completion % (1–94, since 95+ is considered done)
 *   positionSeconds — last known playhead, so cards can render a
 *                     time-remaining hint or build a `?t=` resume URL.
 *
 * Anonymous viewers + no-progress accounts get the rows unchanged.
 * One query per call regardless of catalog size — the WHERE filters by
 * `inArray(contentIds)` so it scales with what's already on screen.
 */

export interface CatalogProgressOverlay {
	progressPercent?: number;
	positionSeconds?: number;
}

export async function attachCatalogProgress<T extends { id: string }>(
	rows: T[],
	userId: string | null | undefined
): Promise<Array<T & CatalogProgressOverlay>> {
	if (!userId || rows.length === 0) return rows as Array<T & CatalogProgressOverlay>;

	const ids = rows.map((r) => r.id);
	// Show-level progress only (episodeId IS NULL would be too narrow —
	// for TV titles we want the catalog card to reflect ANY episode
	// progress so the user sees "started this show" even when they
	// haven't touched the show row itself). Use DISTINCT ON for the
	// most-recent row per content. Filter the same thresholds as
	// the detail page's Resume CTA so cards don't pretend a 4-second
	// scrub counts.
	const progressRows = await db.execute(sql`
		SELECT DISTINCT ON (content_id)
		    content_id           AS content_id,
		    position_seconds     AS position_seconds,
		    completion_percent   AS completion_percent
		FROM media_watch_progress
		WHERE user_id = ${userId}
		  AND content_id IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})
		  AND position_seconds >= 15
		  AND COALESCE(completion_percent, 0) < 95
		ORDER BY content_id, updated_at DESC
	`);

	const data = (Array.isArray(progressRows) ? progressRows : (progressRows as { rows?: unknown[] }).rows ?? []) as Array<{
		content_id: string;
		position_seconds: number;
		completion_percent: number | null;
	}>;
	const byId = new Map<string, { positionSeconds: number; progressPercent: number }>();
	for (const r of data) {
		byId.set(r.content_id, {
			positionSeconds: r.position_seconds ?? 0,
			progressPercent: r.completion_percent ?? 0
		});
	}

	return rows.map((row) => {
		const hit = byId.get(row.id);
		return hit ? { ...row, ...hit } : (row as T & CatalogProgressOverlay);
	});
}
