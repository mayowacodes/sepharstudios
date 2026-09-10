import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adCampaigns, adAdvertisers } from '$lib/db/schema/sepharstudios';
import { and, desc, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

const STATUSES = ['draft', 'scheduled', 'active', 'paused', 'completed'] as const;

/** GET /api/admin/promo/campaigns?status=&advertiserId= → { campaigns } */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const status = url.searchParams.get('status');
	const advertiserId = url.searchParams.get('advertiserId');

	const filters = [];
	if (status && (STATUSES as readonly string[]).includes(status)) {
		filters.push(eq(adCampaigns.status, status));
	}
	if (advertiserId) filters.push(eq(adCampaigns.advertiserId, advertiserId));

	const campaigns = await db
		.select({
			campaign: adCampaigns,
			advertiserName: adAdvertisers.name
		})
		.from(adCampaigns)
		.leftJoin(adAdvertisers, eq(adAdvertisers.id, adCampaigns.advertiserId))
		.where(filters.length ? and(...filters) : undefined)
		.orderBy(desc(adCampaigns.createdAt))
		.limit(200);

	return json({ campaigns });
};

/** POST /api/admin/promo/campaigns → { campaign } */
export const POST: RequestHandler = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
	if (!body) return json({ error: 'Invalid body' }, { status: 400 });

	const advertiserId = typeof body.advertiserId === 'string' ? body.advertiserId : null;
	const name = typeof body.name === 'string' ? body.name.trim() : '';
	if (!advertiserId) return json({ error: 'advertiserId is required' }, { status: 400 });
	if (!name) return json({ error: 'name is required' }, { status: 400 });

	const startsAt = body.startsAt ? new Date(body.startsAt as string) : new Date();
	const endsAt = body.endsAt ? new Date(body.endsAt as string) : null;
	if (Number.isNaN(startsAt.getTime())) {
		return json({ error: 'startsAt is not a valid date' }, { status: 400 });
	}
	if (endsAt && Number.isNaN(endsAt.getTime())) {
		return json({ error: 'endsAt is not a valid date' }, { status: 400 });
	}
	// Mirrors the DB CHECK, but rejected here so the admin gets a readable
	// message rather than a constraint-violation stack.
	if (endsAt && endsAt <= startsAt) {
		return json({ error: 'endsAt must be after startsAt' }, { status: 400 });
	}

	const priority = Number.isFinite(body.priority as number) ? Number(body.priority) : 50;
	if (priority < 0 || priority > 100) {
		return json({ error: 'priority must be between 0 and 100' }, { status: 400 });
	}

	// Targeting arrays: an EMPTY array means "unconstrained on this dimension",
	// not "matches nothing". Normalise anything unexpected to empty rather than
	// letting a malformed value silently stop a campaign from serving.
	const arr = (v: unknown): string[] =>
		Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

	const [campaign] = await db
		.insert(adCampaigns)
		.values({
			advertiserId,
			name,
			status: (STATUSES as readonly string[]).includes(body.status as string)
				? (body.status as string)
				: 'draft',
			priority,
			startsAt,
			endsAt,
			goalImpressions: Number.isFinite(body.goalImpressions as number)
				? Number(body.goalImpressions)
				: null,
			capPerViewer: Number.isFinite(body.capPerViewer as number)
				? Number(body.capPerViewer)
				: null,
			capWindowHours: Number.isFinite(body.capWindowHours as number)
				? Number(body.capWindowHours)
				: 24,
			targetGenres: arr(body.targetGenres),
			targetRegions: arr(body.targetRegions),
			targetDeviceTypes: arr(body.targetDeviceTypes),
			excludeContentIds: arr(body.excludeContentIds),
			kidsSafe: body.kidsSafe === true,
			trackingMode: body.trackingMode === 'client' ? 'client' : 'server',
			vastCacheSeconds: Number.isFinite(body.vastCacheSeconds as number)
				? Number(body.vastCacheSeconds)
				: 0
		})
		.returning();

	return json({ campaign }, { status: 201 });
};
