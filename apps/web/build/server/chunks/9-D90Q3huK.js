import { a as auth } from './auth-PuLQJk1d.js';
import { r as redirect } from './index-BcOZ6EV9.js';
import './defu-BDNAzC90.js';
import 'zod';
import './index4-Cnd3Rmm9.js';
import './index-C14HL8mA.js';
import './index-client-DVey9PBT.js';
import './dev-cqarhAJ0.js';
import './Icon-DLeFNkXp.js';
import './users-CMHMaCG6.js';
import './user-CU8eWwNU.js';
import 'drizzle-orm';
import './drizzle-D6ijTnnB.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
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

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-Cehg8cH-.js')).default;
const server_id = "src/routes/(protected)/+layout.server.ts";
const imports = ["_app/immutable/nodes/9.OGmXHbHR.js","_app/immutable/chunks/BQ03z0kT.js","_app/immutable/chunks/TpWHEDIq.js","_app/immutable/chunks/CxiJ-Vy5.js","_app/immutable/chunks/S4pqshPe.js","_app/immutable/chunks/BTcBi_6o.js","_app/immutable/chunks/B5XzSBQu.js","_app/immutable/chunks/DJngHVR0.js","_app/immutable/chunks/BGd3TWsR.js","_app/immutable/chunks/BgAte0LC.js","_app/immutable/chunks/CZu3KfCi.js","_app/immutable/chunks/CSw1PH97.js","_app/immutable/chunks/QqQ0AyNr.js","_app/immutable/chunks/DMNcghFY.js","_app/immutable/chunks/BNHV54_R.js","_app/immutable/chunks/B4lX7oYV.js","_app/immutable/chunks/BB8zUa0N.js","_app/immutable/chunks/AF6ZT2E2.js","_app/immutable/chunks/BGnnG6dr.js","_app/immutable/chunks/B7A2vtwq.js","_app/immutable/chunks/DrGiHYRm.js","_app/immutable/chunks/C6zGasQL.js","_app/immutable/chunks/DK_t75u1.js","_app/immutable/chunks/CC5gppOC.js","_app/immutable/chunks/C3_ZgMKS.js","_app/immutable/chunks/CaaA1nLV.js","_app/immutable/chunks/C_Pj3l0M.js","_app/immutable/chunks/ubq3dce-.js","_app/immutable/chunks/DTmrZ4Hq.js","_app/immutable/chunks/GOJD2agv.js","_app/immutable/chunks/C69bBWPc.js","_app/immutable/chunks/CP9O2DC0.js","_app/immutable/chunks/BHHhkJPx.js","_app/immutable/chunks/DSSdZWAq.js","_app/immutable/chunks/D5sXZnZo.js","_app/immutable/chunks/FLktOQ2X.js","_app/immutable/chunks/Cl4ny3Dy.js","_app/immutable/chunks/BxnuXE-y.js","_app/immutable/chunks/C80fVOtw.js","_app/immutable/chunks/CvVRT8WT.js","_app/immutable/chunks/D9TzEy3b.js","_app/immutable/chunks/r3A2e8yX.js","_app/immutable/chunks/_oP7CrG1.js","_app/immutable/chunks/CP_bqJSU.js","_app/immutable/chunks/DqoD9RWJ.js","_app/immutable/chunks/BHNWN5gL.js","_app/immutable/chunks/oZL51M0s.js","_app/immutable/chunks/CZwbrwxY.js","_app/immutable/chunks/B3OFaTZD.js","_app/immutable/chunks/BkDWGGaK.js","_app/immutable/chunks/BnP5GyoK.js","_app/immutable/chunks/Db_4V6N5.js","_app/immutable/chunks/U-h140mV.js","_app/immutable/chunks/CFy3_46E.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/Cpn8846K.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-D90Q3huK.js.map
