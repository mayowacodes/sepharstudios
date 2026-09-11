import { aI as redirect } from './index.js-BP8aAXBX.js';

//#region src/routes/(app)/apply/creator/+page.ts
/**
* Creator application form — sign-in required.
*
* Universal so the native bundle can render it. The guard is unchanged in
* effect: on the web build this still runs server-side during SSR, and the POST
* endpoint the form submits to authenticates independently, so the redirect is
* a UX affordance rather than the security boundary.
*/
var load = async ({ parent, url }) => {
	const { user } = await parent();
	if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	return {};
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 46;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CSXtEM2U.js')).default;
const universal_id = "src/routes/(app)/apply/creator/+page.ts";
const imports = ["_app/immutable/nodes/46.DeJtMAuM.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/B8fp1a6Z.js","_app/immutable/chunks/BfO_mE1L2.js","_app/immutable/chunks/Pkd2SUEW2.js","_app/immutable/chunks/CayyNLW-2.js","_app/immutable/chunks/DDNGFuwF2.js","_app/immutable/chunks/B3nkk3ZW2.js","_app/immutable/chunks/KNAn0aWZ.js","_app/immutable/chunks/B3qGyZ6B.js","_app/immutable/chunks/DqzUUf7Y2.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/DziTgYIQ2.js","_app/immutable/chunks/DLupASnU2.js","_app/immutable/chunks/D3r3jRQz.js","_app/immutable/chunks/C01nDjOm.js","_app/immutable/chunks/CL8nWERi.js","_app/immutable/chunks/CDYwmICT2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/46.D8u7_BJh.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=46-MJQ2DRQT.js.map
