import { aI as redirect } from './index.js-CxPEndTa.js';

//#region src/routes/(protected)/+layout.ts
/**
* Requires a signed-in user for everything under (protected)/*.
*
* The server version called `auth.api.getSession()` directly. That is not
* reachable from a universal load, and does not need to be: the root
* `+layout.ts` already resolves the session once via /api/auth/get-session,
* and `parent()` reuses that result rather than issuing a second lookup.
*/
var load = async ({ parent, url }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, `/auth/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	return { user };
};

var _layout_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-BhrRasoi.js')).default;
const universal_id = "src/routes/(protected)/+layout.ts";
const imports = ["_app/immutable/nodes/6.D-WDcxaT.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/HclGiUj8.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/CVvb29p6.js","_app/immutable/chunks/hZsclpc0.js","_app/immutable/chunks/B3nkk3ZW.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/QHPknIdw2.js","_app/immutable/chunks/D6pBY8uh.js","_app/immutable/chunks/BGB5LaM1.js","_app/immutable/chunks/DLupASnU.js","_app/immutable/chunks/Dck08oA8.js","_app/immutable/chunks/DLkOmWsm.js","_app/immutable/chunks/BXwQc_pG.js","_app/immutable/chunks/CfLpMdx4.js","_app/immutable/chunks/CrPz1wRa.js","_app/immutable/chunks/DylRP6NN.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/CvYg6wId2.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/Cy0bMxJ1.js","_app/immutable/chunks/D4ivuZuN.js","_app/immutable/chunks/Bpr0fjjP.js","_app/immutable/chunks/BLoEAGVt.js","_app/immutable/chunks/F0gTKx62.js","_app/immutable/chunks/BlJHiQLj.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/skeleton.D38UF9u5.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=6-bz0ORX0N.js.map
