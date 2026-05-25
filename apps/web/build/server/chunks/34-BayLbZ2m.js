import { r as redirect } from './index-BcOZ6EV9.js';
import './utils-FiC4zhrQ.js';

const load = (async ({ locals, url }) => {
  const user = locals.user;
  if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
  return {};
});

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 34;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-lNOLqGD_.js')).default;
const server_id = "src/routes/(app)/apply/creator/+page.server.ts";
const imports = ["_app/immutable/nodes/34.CmInSpEo.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/D8cC8Ip7.js","_app/immutable/chunks/xgKUVLrI.js","_app/immutable/chunks/CeyGdX2a.js","_app/immutable/chunks/X5A2AL_D.js","_app/immutable/chunks/CAqJuyZM.js","_app/immutable/chunks/CvPPxjhs.js","_app/immutable/chunks/CdVrz2qA.js","_app/immutable/chunks/ZIwaknx8.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=34-BayLbZ2m.js.map
