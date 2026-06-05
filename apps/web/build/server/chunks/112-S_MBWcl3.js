import { w as db, _ as profiles, A as familyAddons } from './drizzle-CKUH7ukq.js';
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

const index = 112;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BbPv82E6.js')).default;
const server_id = "src/routes/(protected)/profiles/+page.server.ts";
const imports = ["_app/immutable/nodes/112.CNOJ3ARg.js","_app/immutable/chunks/BSdbgJIN2.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/wL7JZQdi2.js","_app/immutable/chunks/bBIPRcQI2.js","_app/immutable/chunks/Dqag1JzJ.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/DTkeaA6Q2.js","_app/immutable/chunks/B5wmhr6D.js","_app/immutable/chunks/eNLe2CBL.js","_app/immutable/chunks/DQKwgIZf.js","_app/immutable/chunks/BC4b7XLa.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=112-S_MBWcl3.js.map
