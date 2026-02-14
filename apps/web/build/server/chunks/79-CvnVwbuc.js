import { r as redirect } from './index-BcOZ6EV9.js';
import { u as usersRoles, C as Constants } from './index4-Cnd3Rmm9.js';
import './utils-FiC4zhrQ.js';
import './index-C14HL8mA.js';
import './index-client-DVey9PBT.js';
import './dev-cqarhAJ0.js';
import './Icon-DLeFNkXp.js';
import './users-CMHMaCG6.js';
import './user-CU8eWwNU.js';

const load = (async ({ locals, url }) => {
  const user = locals.user;
  if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
  if (!usersRoles.includes(user.role)) throw redirect(303, Constants.AFTERAUTH);
  return {};
});

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 79;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CEpDbULE.js')).default;
const server_id = "src/routes/(protected)/users/+page.server.ts";
const imports = ["_app/immutable/nodes/79.DJOnVxGE.js","_app/immutable/chunks/BQ03z0kT.js","_app/immutable/chunks/TpWHEDIq.js","_app/immutable/chunks/CxiJ-Vy5.js","_app/immutable/chunks/BGd3TWsR.js","_app/immutable/chunks/BgAte0LC.js","_app/immutable/chunks/S4pqshPe.js","_app/immutable/chunks/B5XzSBQu.js","_app/immutable/chunks/DJngHVR0.js","_app/immutable/chunks/B7A2vtwq.js","_app/immutable/chunks/BB8zUa0N.js","_app/immutable/chunks/CSw1PH97.js","_app/immutable/chunks/CZu3KfCi.js","_app/immutable/chunks/QqQ0AyNr.js","_app/immutable/chunks/DMNcghFY.js","_app/immutable/chunks/B4lX7oYV.js","_app/immutable/chunks/BTcBi_6o.js","_app/immutable/chunks/AF6ZT2E2.js","_app/immutable/chunks/BGnnG6dr.js","_app/immutable/chunks/C6zGasQL.js","_app/immutable/chunks/BNHV54_R.js","_app/immutable/chunks/BxnuXE-y.js","_app/immutable/chunks/C80fVOtw.js","_app/immutable/chunks/4UFl2hwb.js","_app/immutable/chunks/C3_ZgMKS.js","_app/immutable/chunks/DSSdZWAq.js","_app/immutable/chunks/DK_t75u1.js","_app/immutable/chunks/CC5gppOC.js","_app/immutable/chunks/C_Pj3l0M.js","_app/immutable/chunks/r3A2e8yX.js","_app/immutable/chunks/DrGiHYRm.js","_app/immutable/chunks/_oP7CrG1.js","_app/immutable/chunks/GOJD2agv.js","_app/immutable/chunks/BJZFbzpz.js","_app/immutable/chunks/BHHhkJPx.js","_app/immutable/chunks/B_v0IlUT.js","_app/immutable/chunks/ubq3dce-.js","_app/immutable/chunks/DTmrZ4Hq.js","_app/immutable/chunks/C69bBWPc.js","_app/immutable/chunks/CP9O2DC0.js","_app/immutable/chunks/D8yCv6r9.js","_app/immutable/chunks/CvVRT8WT.js","_app/immutable/chunks/CP_bqJSU.js","_app/immutable/chunks/DqoD9RWJ.js","_app/immutable/chunks/Db_4V6N5.js","_app/immutable/chunks/BC7FcDzY.js","_app/immutable/chunks/CkVK01BB.js","_app/immutable/chunks/CFy3_46E.js","_app/immutable/chunks/U-h140mV.js","_app/immutable/chunks/BnP5GyoK.js","_app/immutable/chunks/BHNWN5gL.js","_app/immutable/chunks/BG6uv3i3.js","_app/immutable/chunks/CLrGwJ6d.js"];
const stylesheets = ["_app/immutable/assets/79.CV-KWLNP.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=79-CvnVwbuc.js.map
