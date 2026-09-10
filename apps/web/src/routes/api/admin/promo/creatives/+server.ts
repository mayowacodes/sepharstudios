import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adCreatives } from '$lib/db/schema/sepharstudios';
import { desc, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import { getMainPresignedUploadUrl } from '$lib/server/minio';
import { env } from '$env/dynamic/private';
import { randomUUID } from 'node:crypto';

const CREATIVE_BUCKET = () => env.ADS_CREATIVE_BUCKET || 'sephar-promo';

/** GET /api/admin/promo/creatives?campaignId= → { creatives } */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const campaignId = url.searchParams.get('campaignId');
	if (!campaignId) return json({ error: 'campaignId is required' }, { status: 400 });

	const creatives = await db
		.select()
		.from(adCreatives)
		.where(eq(adCreatives.campaignId, campaignId))
		.orderBy(desc(adCreatives.createdAt));

	return json({ creatives });
};

/**
 * POST /api/admin/promo/creatives
 *
 * Two modes:
 *   { intent: 'upload-url', campaignId, contentType }  → a presigned PUT so the
 *     browser can upload the file directly to MinIO, plus the objectKey to send
 *     back when creating the record.
 *   { campaignId, kind, name, ... }                    → creates the record.
 */
export const POST: RequestHandler = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
	if (!body) return json({ error: 'Invalid body' }, { status: 400 });

	const campaignId = typeof body.campaignId === 'string' ? body.campaignId : null;
	if (!campaignId) return json({ error: 'campaignId is required' }, { status: 400 });

	if (body.intent === 'upload-url') {
		// Random key, never the filename: an operator-supplied name could
		// collide with or overwrite another advertiser's creative.
		const ext = typeof body.ext === 'string' ? body.ext.replace(/[^a-z0-9]/gi, '').slice(0, 5) : 'mp4';
		const objectKey = `creatives/${campaignId}/${randomUUID()}.${ext || 'mp4'}`;
		const uploadUrl = await getMainPresignedUploadUrl(CREATIVE_BUCKET(), objectKey, 900);
		return json({ uploadUrl, objectKey });
	}

	const kind = body.kind === 'vast' ? 'vast' : 'video';
	const name = typeof body.name === 'string' ? body.name.trim() : '';
	if (!name) return json({ error: 'name is required' }, { status: 400 });

	// These mirror the DB CHECK constraint, rejected here so the admin sees a
	// readable message. Duration is not optional for video: the pause-vs-duck
	// decision is made BEFORE the ad element exists, so it cannot be discovered
	// at playback time.
	if (kind === 'video') {
		const duration = Number(body.durationSeconds);
		if (!body.videoObjectKey || typeof body.videoObjectKey !== 'string') {
			return json({ error: 'videoObjectKey is required for a video creative' }, { status: 400 });
		}
		if (!Number.isFinite(duration) || duration < 1 || duration > 180) {
			return json(
				{ error: 'durationSeconds must be between 1 and 180 for a video creative' },
				{ status: 400 }
			);
		}
	} else if (!body.vastTagUrl || typeof body.vastTagUrl !== 'string') {
		return json({ error: 'vastTagUrl is required for a VAST creative' }, { status: 400 });
	}

	const [creative] = await db
		.insert(adCreatives)
		.values({
			campaignId,
			kind,
			name,
			videoObjectKey: (body.videoObjectKey as string) ?? null,
			posterObjectKey: (body.posterObjectKey as string) ?? null,
			durationSeconds: kind === 'video' ? Number(body.durationSeconds) : null,
			bitrateKbps: Number.isFinite(body.bitrateKbps as number) ? Number(body.bitrateKbps) : null,
			width: Number.isFinite(body.width as number) ? Number(body.width) : null,
			height: Number.isFinite(body.height as number) ? Number(body.height) : null,
			vastTagUrl: (body.vastTagUrl as string) ?? null,
			clickUrl: (body.clickUrl as string) ?? null,
			ctaLabel: (body.ctaLabel as string) ?? null,
			headline: (body.headline as string) ?? null,
			body: (body.body as string) ?? null,
			mobileBehavior: body.mobileBehavior === 'skip' ? 'skip' : 'takeover',
			weight: Number.isFinite(body.weight as number) ? Number(body.weight) : 1
		})
		.returning();

	return json({ creative }, { status: 201 });
};
