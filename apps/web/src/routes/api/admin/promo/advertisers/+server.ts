import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adAdvertisers } from '$lib/db/schema/sepharstudios';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

/** GET /api/admin/promo/advertisers → { advertisers } */
export const GET: RequestHandler = async ({ locals }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const advertisers = await db
		.select()
		.from(adAdvertisers)
		.orderBy(desc(adAdvertisers.createdAt))
		.limit(200);

	return json({ advertisers });
};

/** POST /api/admin/promo/advertisers → { advertiser } */
export const POST: RequestHandler = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const body = (await request.json().catch(() => null)) as {
		name?: string;
		slug?: string;
		kind?: string;
		contactEmail?: string;
	} | null;

	const name = body?.name?.trim();
	if (!name) return json({ error: 'name is required' }, { status: 400 });

	// Derive a slug when none is given. It is the advertiser's stable handle and
	// is uniquely indexed, so a collision is a 409 rather than a silent overwrite.
	const slug = (body?.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
		.replace(/^-+|-+$/g, '')
		.slice(0, 120);
	if (!slug) return json({ error: 'slug could not be derived from name' }, { status: 400 });

	try {
		const [advertiser] = await db
			.insert(adAdvertisers)
			.values({
				name,
				slug,
				kind: body?.kind === 'house' ? 'house' : 'external',
				contactEmail: body?.contactEmail?.trim() || null
			})
			.returning();
		return json({ advertiser }, { status: 201 });
	} catch (err) {
		const msg = err instanceof Error ? err.message : '';
		if (msg.includes('ad_advertisers_slug_uq') || msg.includes('duplicate key')) {
			return json({ error: `An advertiser with slug "${slug}" already exists` }, { status: 409 });
		}
		throw err;
	}
};
