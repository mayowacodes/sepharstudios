import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { profiles, familyAddons } from '$lib/db/schema/sepharstudios';
import { eq, desc } from 'drizzle-orm';

// GET /api/profiles — list profiles for current user
export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const userProfiles = await db.select({
		id: profiles.id,
		name: profiles.name,
		type: profiles.type,
		avatarColor: profiles.avatarColor,
		avatarEmoji: profiles.avatarEmoji,
		contentRating: profiles.contentRating,
		safeModeEnabled: profiles.safeModeEnabled,
		isKidsMode: profiles.isKidsMode,
		isDefault: profiles.isDefault,
		hasPin: profiles.pin
	})
		.from(profiles)
		.where(eq(profiles.userId, session.user.id))
		.orderBy(desc(profiles.isDefault));

	return json(userProfiles.map((p) => ({ ...p, hasPin: !!p.hasPin })));
};

// POST /api/profiles — create a profile
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const userId = session.user.id;

	// Check profile limit
	const existing = await db.select().from(profiles).where(eq(profiles.userId, userId));
	const [addon] = await db.select().from(familyAddons).where(eq(familyAddons.userId, userId)).limit(1);
	const maxProfiles = addon?.status === 'active' ? (addon.maxProfiles ?? 8) : 2;

	if (existing.length >= maxProfiles) {
		return json({
			error: `Profile limit reached. Add the Family Add-on to create up to 8 profiles.`,
			limit: maxProfiles
		}, { status: 403 });
	}

	const { name, type, avatarColor, avatarEmoji, isKidsMode } = await request.json() as {
		name: string; type: string; avatarColor?: string; avatarEmoji?: string; isKidsMode?: boolean;
	};

	const [profile] = await db.insert(profiles).values({
		userId,
		name,
		type: type ?? 'adult',
		avatarColor: avatarColor ?? '#6366f1',
		avatarEmoji: avatarEmoji ?? '😊',
		isKidsMode: isKidsMode ?? (type === 'kids'),
		isDefault: existing.length === 0
	}).returning();

	return json(profile, { status: 201 });
};
