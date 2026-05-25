import { d as db, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { and, eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const load = async () => {
  try {
    const trendingShows = await db.select().from(mediaLibrary).where(
      and(
        eq(mediaLibrary.mediaType, "show"),
        eq(mediaLibrary.isActive, true)
      )
    ).orderBy(desc(mediaLibrary.createdAt)).limit(10);
    const trendingMovies = await db.select().from(mediaLibrary).where(
      and(
        eq(mediaLibrary.mediaType, "movie"),
        eq(mediaLibrary.isActive, true)
      )
    ).orderBy(desc(mediaLibrary.createdAt)).limit(10);
    return {
      shows: trendingShows,
      movies: trendingMovies,
      documentaries: []
    };
  } catch (error) {
    console.error("Homepage load failed, using fallback data:", error);
    return {
      shows: [],
      movies: [],
      documentaries: []
    };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 32;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DF-F16kR.js')).default;
const server_id = "src/routes/(app)/+page.server.ts";
const imports = ["_app/immutable/nodes/32.xN5ZQCHL.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/D7lO7nIc.js","_app/immutable/chunks/D8cC8Ip7.js","_app/immutable/chunks/xgKUVLrI.js","_app/immutable/chunks/CeyGdX2a.js","_app/immutable/chunks/DFj_1Ztd.js","_app/immutable/chunks/_r6ywi_I.js","_app/immutable/chunks/B09jOzlm.js","_app/immutable/chunks/CK77ZMFc.js","_app/immutable/chunks/aVfC764u.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/BqqE9v9i.js","_app/immutable/chunks/V_6YfDCx.js","_app/immutable/chunks/DNuQ6zDx.js","_app/immutable/chunks/CTZ0jGgp.js","_app/immutable/chunks/Bk_MNpG0.js","_app/immutable/chunks/OeFbPBnA.js","_app/immutable/chunks/BuZ3KnhT.js","_app/immutable/chunks/tc_j-4Mp.js","_app/immutable/chunks/B2Zll0gU.js","_app/immutable/chunks/BUnqiouU.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=32-Dcp4qnVz.js.map
