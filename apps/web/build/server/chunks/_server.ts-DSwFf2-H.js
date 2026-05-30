import { n as db, N as profiles, I as paystackSubscriptions, r as familyAddons } from './drizzle-BjmsPAPl.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, desc, and, inArray } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/profiles/+server.ts
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	return json((await db.select({
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
	}).from(profiles).where(eq(profiles.userId, session.user.id)).orderBy(desc(profiles.isDefault))).map((p) => ({
		...p,
		hasPin: !!p.hasPin
	})));
};
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const userId = session.user.id;
	const { name, type, avatarColor, avatarEmoji, isKidsMode } = await request.json();
	const wantsKids = isKidsMode ?? type === "kids";
	const [sub] = await db.select({
		maxProfiles: paystackSubscriptions.maxProfiles,
		kidsAllowed: paystackSubscriptions.kidsAllowed,
		status: paystackSubscriptions.status
	}).from(paystackSubscriptions).where(and(eq(paystackSubscriptions.userId, userId), inArray(paystackSubscriptions.status, ["trial", "active"]))).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
	const [legacyAddon] = await db.select().from(familyAddons).where(and(eq(familyAddons.userId, userId), eq(familyAddons.status, "active"))).limit(1);
	const maxProfiles = sub ? Math.max(sub.maxProfiles ?? 1, legacyAddon ? legacyAddon.maxProfiles ?? 8 : 0) : legacyAddon ? legacyAddon.maxProfiles ?? 8 : 1;
	const kidsAllowed = sub?.kidsAllowed === true;
	if (wantsKids && !kidsAllowed) return json({
		error: "Your current plan does not include a kids profile. Upgrade to Premium to enable kids mode.",
		requiredPlan: "premium"
	}, { status: 403 });
	const existing = await db.select().from(profiles).where(eq(profiles.userId, userId));
	if (existing.length >= maxProfiles) return json({
		error: `Profile limit reached for your plan (${maxProfiles}). Upgrade to add more profiles.`,
		limit: maxProfiles
	}, { status: 403 });
	const [profile] = await db.insert(profiles).values({
		userId,
		name,
		type: type ?? "adult",
		avatarColor: avatarColor ?? "#6366f1",
		avatarEmoji: avatarEmoji ?? "😊",
		isKidsMode: wantsKids,
		isDefault: existing.length === 0
	}).returning();
	return json(profile, { status: 201 });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-DSwFf2-H.js.map
