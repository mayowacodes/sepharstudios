import { r as redirect } from './index-BcOZ6EV9.js';
import { u as usersRoles, C as Constants } from './index-DDpoV-rm.js';
import './utils-FiC4zhrQ.js';
import './ui-libs-Yf6h8PPk.js';
import './Icon-DVHDtCfs.js';
import './layout-dashboard-xPr2miEu.js';
import './users-B4M3or-k.js';
import './user-CxFDLytf.js';

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

const index = 86;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-5YjS8PMq.js')).default;
const server_id = "src/routes/(protected)/users/+page.server.ts";
const imports = ["_app/immutable/nodes/86.BNih_KOS.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/D8cC8Ip7.js","_app/immutable/chunks/xgKUVLrI.js","_app/immutable/chunks/CeyGdX2a.js","_app/immutable/chunks/X5A2AL_D.js","_app/immutable/chunks/BXqFt7q1.js","_app/immutable/chunks/BsR08jWl.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/CAqJuyZM.js","_app/immutable/chunks/Cb0hb-Op.js","_app/immutable/chunks/C13KTx9R.js","_app/immutable/chunks/Dt2SwEb1.js","_app/immutable/chunks/DFj_1Ztd.js","_app/immutable/chunks/_r6ywi_I.js","_app/immutable/chunks/DulpkoeT.js","_app/immutable/chunks/C6RMN0iQ.js","_app/immutable/chunks/BH2yH8Hf.js","_app/immutable/chunks/Bk_MNpG0.js","_app/immutable/chunks/qdopO_8X.js","_app/immutable/chunks/B2nlVz8g.js","_app/immutable/chunks/CEuCkD7A.js","_app/immutable/chunks/qFWYKm0h.js","_app/immutable/chunks/DT8gsAiO.js","_app/immutable/chunks/DreI2WDa.js","_app/immutable/chunks/C_fDwyNP.js","_app/immutable/chunks/b7n9CkEo.js","_app/immutable/chunks/BYcaKGQO.js","_app/immutable/chunks/CdVrz2qA.js","_app/immutable/chunks/CwF4VqdN.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=86-DXExqYnN.js.map
