import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { profiles, familyAddons, paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq, desc, inArray, and } from 'drizzle-orm';

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

	const { name, type, avatarColor, avatarEmoji, isKidsMode } = await request.json() as {
		name: string; type: string; avatarColor?: string; avatarEmoji?: string; isKidsMode?: boolean;
	};
	const wantsKids = isKidsMode ?? (type === 'kids');

	// Resolve the user's entitlements. We read the snapshot stored on the
	// subscription row at sub-creation time (see verify endpoint) so a
	// PLAN_FEATURES change doesn't retroactively affect existing subscribers.
	// Falls back to the legacy familyAddons row for grandfathered subscribers
	// who paid for the add-on before premium absorbed it.
	const [sub] = await db.select({
		maxProfiles: paystackSubscriptions.maxProfiles,
		kidsAllowed: paystackSubscriptions.kidsAllowed,
		status: paystackSubscriptions.status
	})
		.from(paystackSubscriptions)
		.where(and(
			eq(paystackSubscriptions.userId, userId),
			inArray(paystackSubscriptions.status, ['trial', 'active'])
		))
		.orderBy(desc(paystackSubscriptions.createdAt))
		.limit(1);

	const [legacyAddon] = await db.select()
		.from(familyAddons)
		.where(and(eq(familyAddons.userId, userId), eq(familyAddons.status, 'active')))
		.limit(1);

	// Effective cap: subscription snapshot wins; legacy addon adds up to 8;
	// no active sub → 1 profile (matches freemium baseline so a lapsed user
	// keeps their default profile but can't add new ones).
	const maxProfiles = sub
		? Math.max(sub.maxProfiles ?? 1, legacyAddon ? (legacyAddon.maxProfiles ?? 8) : 0)
		: (legacyAddon ? (legacyAddon.maxProfiles ?? 8) : 1);
	const kidsAllowed = sub?.kidsAllowed === true;

	if (wantsKids && !kidsAllowed) {
		return json({
			error: 'Your current plan does not include a kids profile. Upgrade to Premium to enable kids mode.',
			requiredPlan: 'premium'
		}, { status: 403 });
	}

	const existing = await db.select().from(profiles).where(eq(profiles.userId, userId));
	if (existing.length >= maxProfiles) {
		return json({
			error: `Profile limit reached for your plan (${maxProfiles}). Upgrade to add more profiles.`,
			limit: maxProfiles
		}, { status: 403 });
	}

	const [profile] = await db.insert(profiles).values({
		userId,
		name,
		type: type ?? 'adult',
		avatarColor: avatarColor ?? '#6366f1',
		avatarEmoji: avatarEmoji ?? '😊',
		isKidsMode: wantsKids,
		isDefault: existing.length === 0
	}).returning();

	return json(profile, { status: 201 });
};
