import { d as db, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { and, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const load = async () => {
  const content = await db.select().from(mediaLibrary).where(
    and(
      eq(mediaLibrary.category, "teens"),
      eq(mediaLibrary.isActive, true)
    )
  );
  return {
    content
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 97;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DNcQLaaH.js')).default;
const server_id = "src/routes/kids/teens/+page.server.ts";
const imports = ["_app/immutable/nodes/97.CMchGOus.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/B09jOzlm.js","_app/immutable/chunks/CK77ZMFc.js","_app/immutable/chunks/_r6ywi_I.js","_app/immutable/chunks/aVfC764u.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/BqqE9v9i.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css","_app/immutable/assets/97.Brez6pGR.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=97-DDhmYuJR.js.map
