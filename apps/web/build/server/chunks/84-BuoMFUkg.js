import { d as db, E as profiles, G as familyAddons } from './drizzle-CW7hPjGG.js';
import { eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const load = async ({ parent }) => {
  const { user } = await parent();
  const [userProfiles, addon] = await Promise.all([
    db.select({
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
    }).from(profiles).where(eq(profiles.userId, user.id)).orderBy(desc(profiles.isDefault)),
    db.select({ maxProfiles: familyAddons.maxProfiles, status: familyAddons.status }).from(familyAddons).where(eq(familyAddons.userId, user.id)).limit(1).then((r) => r[0] ?? null)
  ]);
  const maxProfiles = addon?.status === "active" ? addon.maxProfiles ?? 8 : 2;
  return {
    profiles: userProfiles.map((p) => ({ ...p, hasPin: !!p.hasPin })),
    maxProfiles
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 84;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BblYbp1D.js')).default;
const server_id = "src/routes/(protected)/profiles/+page.server.ts";
const imports = ["_app/immutable/nodes/84.CpF7Onih.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/DohTB1ky.js","_app/immutable/chunks/xgKUVLrI.js","_app/immutable/chunks/D8cC8Ip7.js","_app/immutable/chunks/CeyGdX2a.js","_app/immutable/chunks/CAqJuyZM.js","_app/immutable/chunks/BXqFt7q1.js","_app/immutable/chunks/BsR08jWl.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/X5A2AL_D.js","_app/immutable/chunks/b7n9CkEo.js","_app/immutable/chunks/qdopO_8X.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=84-BuoMFUkg.js.map
