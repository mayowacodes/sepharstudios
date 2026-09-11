import { R as adCampaignDaily, d as db, T as adAdvertisers, W as adCampaigns } from './drizzle-C3SH12nS.js';
import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq, gte, lte, and, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/promo/reports/+server.ts
/**
* GET /api/admin/promo/reports?campaignId=&from=&to=
*
* Reads the ad_campaign_daily rollup, never ad_impressions directly — the raw
* table is pruned to 180 days and is far larger.
*
* `served` and `started` are reported as separate columns on purpose. Their
* ratio is the fill-to-render gap: ads decided by the server that never began
* playing on the client, which is predominantly ad-blocking. Collapsing them
* into one "impressions" number would hide the single most useful health
* signal this feature has.
*/
var GET = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const campaignId = url.searchParams.get("campaignId");
	const from = url.searchParams.get("from");
	const to = url.searchParams.get("to");
	const filters = [];
	if (campaignId) filters.push(eq(adCampaignDaily.campaignId, campaignId));
	if (from) filters.push(gte(adCampaignDaily.day, from));
	if (to) filters.push(lte(adCampaignDaily.day, to));
	const rows = await db.select({
		campaignId: adCampaignDaily.campaignId,
		campaignName: adCampaigns.name,
		advertiserName: adAdvertisers.name,
		day: adCampaignDaily.day,
		served: adCampaignDaily.served,
		started: adCampaignDaily.started,
		completed: adCampaignDaily.completed,
		skipped: adCampaignDaily.skipped,
		clicks: adCampaignDaily.clicks,
		watchSeconds: adCampaignDaily.watchSeconds
	}).from(adCampaignDaily).leftJoin(adCampaigns, eq(adCampaigns.id, adCampaignDaily.campaignId)).leftJoin(adAdvertisers, eq(adAdvertisers.id, adCampaigns.advertiserId)).where(filters.length ? and(...filters) : void 0).orderBy(desc(adCampaignDaily.day)).limit(1e3);
	const totals = rows.reduce((acc, r) => {
		acc.served += r.served;
		acc.started += r.started;
		acc.completed += r.completed;
		acc.skipped += r.skipped;
		acc.clicks += r.clicks;
		acc.watchSeconds += Number(r.watchSeconds);
		return acc;
	}, {
		served: 0,
		started: 0,
		completed: 0,
		skipped: 0,
		clicks: 0,
		watchSeconds: 0
	});
	return json({
		rows,
		totals,
		rates: {
			renderRate: totals.served ? totals.started / totals.served : 0,
			completionRate: totals.started ? totals.completed / totals.started : 0,
			clickThroughRate: totals.started ? totals.clicks / totals.started : 0
		}
	});
};

export { GET };
//# sourceMappingURL=_server.ts-BKaQFlqH.js.map
