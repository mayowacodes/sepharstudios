// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { profiles, familyAddons, paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async ({ parent }: Parameters<PageServerLoad>[0]) => {
	const { user } = await parent();

	const [userProfiles, addon] = await Promise.all([
		db
			.select({
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
			.where(eq(profiles.userId, user.id))
			.orderBy(desc(profiles.isDefault)),

		db
			.select({ maxProfiles: familyAddons.maxProfiles, status: familyAddons.status })
			.from(familyAddons)
			.where(eq(familyAddons.userId, user.id))
			.limit(1)
			.then((r) => r[0] ?? null)
	]);

	const maxProfiles = addon?.status === 'active' ? (addon.maxProfiles ?? 8) : 2;

	return {
		profiles: userProfiles.map((p) => ({ ...p, hasPin: !!p.hasPin })),
		maxProfiles
	};
};
