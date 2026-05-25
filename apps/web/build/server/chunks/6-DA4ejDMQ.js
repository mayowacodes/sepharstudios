import { a as auth } from './auth-Cnjc5JQw.js';
import { r as redirect } from './index-BcOZ6EV9.js';
import './defu-DQ_N96GS.js';
import 'zod';
import './index-DDpoV-rm.js';
import './ui-libs-Yf6h8PPk.js';
import './Icon-DVHDtCfs.js';
import './layout-dashboard-xPr2miEu.js';
import './users-B4M3or-k.js';
import './user-CxFDLytf.js';
import 'drizzle-orm';
import './drizzle-CW7hPjGG.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import './server-nMhuZPcS.js';
import './utils-FiC4zhrQ.js';

const load = (async ({ request, locals, url }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect(302, `/auth/login?redirectTo=${url.pathname}`);
  return { session, user: session.user };
});

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-CIL4jUOY.js')).default;
const server_id = "src/routes/(protected)/+layout.server.ts";
const imports = ["_app/immutable/nodes/6.D-SKLdPe.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/xgKUVLrI.js","_app/immutable/chunks/X5A2AL_D.js","_app/immutable/chunks/CeyGdX2a.js","_app/immutable/chunks/Dt2SwEb1.js","_app/immutable/chunks/D8cC8Ip7.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/CDf6rFwL.js","_app/immutable/chunks/BsR08jWl.js","_app/immutable/chunks/DFj_1Ztd.js","_app/immutable/chunks/_r6ywi_I.js","_app/immutable/chunks/C_fDwyNP.js","_app/immutable/chunks/CModquu1.js","_app/immutable/chunks/DulpkoeT.js","_app/immutable/chunks/C6RMN0iQ.js","_app/immutable/chunks/BH2yH8Hf.js","_app/immutable/chunks/Bk_MNpG0.js","_app/immutable/chunks/qdopO_8X.js","_app/immutable/chunks/Br5cs_1G.js","_app/immutable/chunks/BYjb41BY.js","_app/immutable/chunks/B2nlVz8g.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/DreI2WDa.js","_app/immutable/chunks/DT8gsAiO.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-DA4ejDMQ.js.map
