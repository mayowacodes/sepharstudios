import { B as familyAddons, pt as profiles, t as db } from "../../../../../chunks/drizzle.js";
import { error, json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
//#region src/routes/api/profiles/overview/+server.ts
/**
* GET /api/profiles/overview  →  { profiles, maxProfiles }
*
* The profile picker's data. Note `hasPin`: the query selects the actual PIN
* column but the response coerces it to a boolean, so the PIN itself never
* leaves the server. Keep that coercion here — moving it to the client would
* ship every profile's PIN in the response body.
*/
async function buildProfilesPayload({ locals }) {
	const user = locals.user;
	if (!user) error(401, "Sign in required");
	const [userProfiles, addon] = await Promise.all([db.select({
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
	}).from(profiles).where(eq(profiles.userId, user.id)).orderBy(desc(profiles.isDefault)), db.select({
		maxProfiles: familyAddons.maxProfiles,
		status: familyAddons.status
	}).from(familyAddons).where(eq(familyAddons.userId, user.id)).limit(1).then((r) => r[0] ?? null)]);
	return {
		profiles: userProfiles.map((p) => ({
			...p,
			hasPin: !!p.hasPin
		})),
		maxProfiles: addon?.status === "active" ? addon.maxProfiles ?? 8 : 2
	};
}
var GET = async (event) => json(await buildProfilesPayload(event));
//#endregion
export { GET };
