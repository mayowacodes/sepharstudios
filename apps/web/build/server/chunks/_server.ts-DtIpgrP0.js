import { W as adCampaigns, d as db, T as adAdvertisers } from './drizzle-C3SH12nS.js';
import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq, and, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/promo/campaigns/+server.ts
var STATUSES = [
	"draft",
	"scheduled",
	"active",
	"paused",
	"completed"
];
/** GET /api/admin/promo/campaigns?status=&advertiserId= → { campaigns } */
var GET = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const status = url.searchParams.get("status");
	const advertiserId = url.searchParams.get("advertiserId");
	const filters = [];
	if (status && STATUSES.includes(status)) filters.push(eq(adCampaigns.status, status));
	if (advertiserId) filters.push(eq(adCampaigns.advertiserId, advertiserId));
	return json({ campaigns: await db.select({
		campaign: adCampaigns,
		advertiserName: adAdvertisers.name
	}).from(adCampaigns).leftJoin(adAdvertisers, eq(adAdvertisers.id, adCampaigns.advertiserId)).where(filters.length ? and(...filters) : void 0).orderBy(desc(adCampaigns.createdAt)).limit(200) });
};
/** POST /api/admin/promo/campaigns → { campaign } */
var POST = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const body = await request.json().catch(() => null);
	if (!body) return json({ error: "Invalid body" }, { status: 400 });
	const advertiserId = typeof body.advertiserId === "string" ? body.advertiserId : null;
	const name = typeof body.name === "string" ? body.name.trim() : "";
	if (!advertiserId) return json({ error: "advertiserId is required" }, { status: 400 });
	if (!name) return json({ error: "name is required" }, { status: 400 });
	const startsAt = body.startsAt ? new Date(body.startsAt) : /* @__PURE__ */ new Date();
	const endsAt = body.endsAt ? new Date(body.endsAt) : null;
	if (Number.isNaN(startsAt.getTime())) return json({ error: "startsAt is not a valid date" }, { status: 400 });
	if (endsAt && Number.isNaN(endsAt.getTime())) return json({ error: "endsAt is not a valid date" }, { status: 400 });
	if (endsAt && endsAt <= startsAt) return json({ error: "endsAt must be after startsAt" }, { status: 400 });
	const priority = Number.isFinite(body.priority) ? Number(body.priority) : 50;
	if (priority < 0 || priority > 100) return json({ error: "priority must be between 0 and 100" }, { status: 400 });
	const arr = (v) => Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
	const [campaign] = await db.insert(adCampaigns).values({
		advertiserId,
		name,
		status: STATUSES.includes(body.status) ? body.status : "draft",
		priority,
		startsAt,
		endsAt,
		goalImpressions: Number.isFinite(body.goalImpressions) ? Number(body.goalImpressions) : null,
		capPerViewer: Number.isFinite(body.capPerViewer) ? Number(body.capPerViewer) : null,
		capWindowHours: Number.isFinite(body.capWindowHours) ? Number(body.capWindowHours) : 24,
		targetGenres: arr(body.targetGenres),
		targetRegions: arr(body.targetRegions),
		targetDeviceTypes: arr(body.targetDeviceTypes),
		excludeContentIds: arr(body.excludeContentIds),
		kidsSafe: body.kidsSafe === true,
		trackingMode: body.trackingMode === "client" ? "client" : "server",
		vastCacheSeconds: Number.isFinite(body.vastCacheSeconds) ? Number(body.vastCacheSeconds) : 0
	}).returning();
	return json({ campaign }, { status: 201 });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-DtIpgrP0.js.map
