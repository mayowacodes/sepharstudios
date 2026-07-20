import { t as db } from "./drizzle.js";
import { sql } from "drizzle-orm";
//#region src/lib/server/catalog-progress.ts
async function attachCatalogProgress(rows, userId) {
	if (!userId || rows.length === 0) return rows;
	const ids = rows.map((r) => r.id);
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
	const data = Array.isArray(progressRows) ? progressRows : progressRows.rows ?? [];
	const byId = /* @__PURE__ */ new Map();
	for (const r of data) byId.set(r.content_id, {
		positionSeconds: r.position_seconds ?? 0,
		progressPercent: r.completion_percent ?? 0
	});
	return rows.map((row) => {
		const hit = byId.get(row.id);
		return hit ? {
			...row,
			...hit
		} : row;
	});
}
//#endregion
export { attachCatalogProgress as t };
