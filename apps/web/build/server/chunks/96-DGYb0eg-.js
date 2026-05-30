import { n as db, N as profiles, r as familyAddons } from './drizzle-BjmsPAPl.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/(protected)/profiles/+page.server.ts
var load = async ({ parent }) => {
	const { user } = await parent();
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
	const maxProfiles = addon?.status === "active" ? addon.maxProfiles ?? 8 : 2;
	return {
		profiles: userProfiles.map((p) => ({
			...p,
			hasPin: !!p.hasPin
		})),
		maxProfiles
	};
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 96;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-v-ICYPEu.js')).default;
const server_id = "src/routes/(protected)/profiles/+page.server.ts";
const imports = ["_app/immutable/nodes/96.DCw1HKOl.js","_app/immutable/chunks/CFVmnJei2.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/CBGNjHFS.js","_app/immutable/chunks/BSFXd-fp.js","_app/immutable/chunks/B-hbAyTs2.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/DXFs0FbB2.js","_app/immutable/chunks/Cy442Xic.js","_app/immutable/chunks/pr5P8d2c.js","_app/immutable/chunks/B-_jW20x2.js","_app/immutable/chunks/CkPKcep_2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=96-DGYb0eg-.js.map
