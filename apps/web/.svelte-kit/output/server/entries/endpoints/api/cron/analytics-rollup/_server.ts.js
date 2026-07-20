import { t as private_env } from "../../../../../chunks/shared-server.js";
import { t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { sql } from "drizzle-orm";
//#region src/routes/api/cron/analytics-rollup/+server.ts
/**
* POST /api/cron/analytics-rollup
*
* Re-aggregates the last 2 days (UTC) of media_watch_progress into the
* media_analytics_daily rollup table. Two days, not one, because a
* progress row's updated_at moves as the viewer keeps watching — a row
* counted on yesterday's bucket can migrate into today's; re-running
* both days keeps them correct. Older days are frozen (their rows no
* longer change).
*
* Idempotent (ON CONFLICT DO UPDATE) — safe to run as often as you
* like. Recommended schedule: every 15 minutes.
*
* Auth: CRON_SECRET bearer (same as the other cron endpoints).
*/
var POST = async ({ request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured on server" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	const started = Date.now();
	try {
		await db.execute(sql`
			INSERT INTO media_analytics_daily
				(content_id, day, views, watch_seconds, completed_watches, completion_pct_sum, updated_at)
			SELECT
				mwp.content_id,
				date_trunc('day', mwp.updated_at)::date AS day,
				count(*)::int,
				coalesce(sum(mwp.position_seconds), 0)::bigint,
				sum(CASE WHEN mwp.is_completed THEN 1 ELSE 0 END)::int,
				coalesce(sum(mwp.completion_percent), 0)::double precision,
				now()
			FROM media_watch_progress mwp
			WHERE mwp.updated_at >= (now() - interval '2 days')
			GROUP BY mwp.content_id, date_trunc('day', mwp.updated_at)::date
			ON CONFLICT (content_id, day) DO UPDATE SET
				views = EXCLUDED.views,
				watch_seconds = EXCLUDED.watch_seconds,
				completed_watches = EXCLUDED.completed_watches,
				completion_pct_sum = EXCLUDED.completion_pct_sum,
				updated_at = now()
		`);
		return json({
			ok: true,
			tookMs: Date.now() - started
		});
	} catch (err) {
		console.error("[analytics-rollup] failed:", err);
		return json({ error: err instanceof Error ? err.message : "rollup failed" }, { status: 500 });
	}
};
//#endregion
export { POST };
