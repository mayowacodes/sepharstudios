import { d as db, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { f as faithTVShows } from './shows-BXPO8af7.js';
import { and, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const load = async () => {
  try {
    const shows = await db.select().from(mediaLibrary).where(
      and(
        eq(mediaLibrary.mediaType, "show"),
        eq(mediaLibrary.isActive, true)
      )
    );
    return {
      shows
    };
  } catch (error) {
    console.error("Shows load failed, using fallback data:", error);
    return {
      shows: faithTVShows
    };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 52;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DFX8A3cE.js')).default;
const server_id = "src/routes/(app)/shows/+page.server.ts";
const imports = ["_app/immutable/nodes/52.CUccVALV.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/DFj_1Ztd.js","_app/immutable/chunks/_r6ywi_I.js","_app/immutable/chunks/aVfC764u.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/BqqE9v9i.js","_app/immutable/chunks/D8cC8Ip7.js","_app/immutable/chunks/xgKUVLrI.js","_app/immutable/chunks/CeyGdX2a.js","_app/immutable/chunks/CTZ0jGgp.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=52-duXdXeR2.js.map
