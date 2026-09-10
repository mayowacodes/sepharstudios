import { p as private_env, j as json } from './index.js-DwRgOKlO.js';
import { d as db } from './drizzle-DlGuU73K.js';
import { sql } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/cron/promo-rollup/+server.ts
/**
* POST /api/cron/promo-rollup
*
* Three jobs, in order:
*   1. Re-aggregate the last 2 days of ad_impressions into ad_campaign_daily.
*   2. Refresh each campaign's delivered_impressions from that rollup.
*   3. Sweep campaign flight status (scheduled → active → completed).
*
* Two days rather than one, for the same reason as the analytics rollup: an
* impression row MUTATES after insert as the viewer progresses (served →
* started → complete), so a row already counted in yesterday's bucket can
* change value today. Re-running both days keeps them correct; older days are
* frozen because their rows no longer move.
*
* Idempotent (ON CONFLICT DO UPDATE) — safe to run as often as you like.
* Recommended schedule: every 15 minutes.
*
* Auth: CRON_SECRET bearer, same as the other cron endpoints.
*/
var POST = async ({ request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured on server" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	const started = Date.now();
	try {
		await db.execute(sql`
			INSERT INTO ad_campaign_daily
				(campaign_id, day, served, started, completed, skipped, clicks, watch_seconds)
			SELECT
				ai.campaign_id,
				date_trunc('day', ai.created_at)::date AS day,
				count(*)::int,
				sum(CASE WHEN ad_status_rank(ai.status) >= ad_status_rank('started')
				          AND ai.watched_seconds >= 2 THEN 1 ELSE 0 END)::int,
				sum(CASE WHEN ai.status = 'complete' THEN 1 ELSE 0 END)::int,
				sum(CASE WHEN ai.skipped THEN 1 ELSE 0 END)::int,
				sum(CASE WHEN ai.clicked THEN 1 ELSE 0 END)::int,
				coalesce(sum(ai.watched_seconds), 0)::bigint
			FROM ad_impressions ai
			WHERE ai.created_at >= (now() - interval '2 days')
			GROUP BY ai.campaign_id, date_trunc('day', ai.created_at)::date
			ON CONFLICT (campaign_id, day) DO UPDATE SET
				served        = EXCLUDED.served,
				started       = EXCLUDED.started,
				completed     = EXCLUDED.completed,
				skipped       = EXCLUDED.skipped,
				clicks        = EXCLUDED.clicks,
				watch_seconds = EXCLUDED.watch_seconds
		`);
		await db.execute(sql`
			UPDATE ad_campaigns c
			SET delivered_impressions = coalesce(t.total, 0)
			FROM (
				SELECT campaign_id, sum(started)::int AS total
				FROM ad_campaign_daily
				GROUP BY campaign_id
			) t
			WHERE t.campaign_id = c.id
		`);
		await db.execute(sql`
			UPDATE ad_campaigns
			SET status = 'active', updated_at = now()
			WHERE status = 'scheduled' AND starts_at <= now()
		`);
		const completed = await db.execute(sql`
			UPDATE ad_campaigns
			SET status = 'completed', updated_at = now()
			WHERE status = 'active'
			  AND (
			    (ends_at IS NOT NULL AND ends_at < now())
			    OR (goal_impressions IS NOT NULL AND delivered_impressions >= goal_impressions)
			  )
			RETURNING id
		`);
		return json({
			ok: true,
			completedCampaigns: Array.isArray(completed) ? completed.length : 0,
			tookMs: Date.now() - started
		});
	} catch (err) {
		console.error("[promo-rollup] failed:", err);
		return json({ error: "Rollup failed" }, { status: 500 });
	}
};

export { POST };
//# sourceMappingURL=_server.ts-CJslpqzT.js.map
