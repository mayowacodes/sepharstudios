import { d as db, T as adAdvertisers } from './drizzle-CsnNxG5m.js';
import { r as requireAdmin } from './admin-auth-5N0bBtTQ.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/promo/advertisers/+server.ts
/** GET /api/admin/promo/advertisers → { advertisers } */
var GET = async ({ locals }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	return json({ advertisers: await db.select().from(adAdvertisers).orderBy(desc(adAdvertisers.createdAt)).limit(200) });
};
/** POST /api/admin/promo/advertisers → { advertiser } */
var POST = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const body = await request.json().catch(() => null);
	const name = body?.name?.trim();
	if (!name) return json({ error: "name is required" }, { status: 400 });
	const slug = (body?.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-+|-+$/g, "").slice(0, 120);
	if (!slug) return json({ error: "slug could not be derived from name" }, { status: 400 });
	try {
		const [advertiser] = await db.insert(adAdvertisers).values({
			name,
			slug,
			kind: body?.kind === "house" ? "house" : "external",
			contactEmail: body?.contactEmail?.trim() || null
		}).returning();
		return json({ advertiser }, { status: 201 });
	} catch (err) {
		const msg = err instanceof Error ? err.message : "";
		if (msg.includes("ad_advertisers_slug_uq") || msg.includes("duplicate key")) return json({ error: `An advertiser with slug "${slug}" already exists` }, { status: 409 });
		throw err;
	}
};

export { GET, POST };
//# sourceMappingURL=_server.ts-D1Gny8tH.js.map
