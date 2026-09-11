import { b as apiOrError } from './client2-DMA58bua.js';
import { aI as redirect } from './index.js-CxPEndTa.js';

//#region src/routes/(protected)/profiles/+page.ts
/**
* Profile picker. The endpoint coerces each PIN to a boolean before returning,
* so no PIN reaches the client.
*/
var load = async ({ parent, fetch }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, "/auth/login?redirectTo=/profiles");
	return apiOrError("/api/profiles/overview", { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 116;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-rvl0h1uL.js')).default;
const universal_id = "src/routes/(protected)/profiles/+page.ts";
const imports = ["_app/immutable/nodes/116.CIu7Vw5y.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/iSdTMXsR.js","_app/immutable/chunks/DQIHq--d2.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/DLupASnU.js","_app/immutable/chunks/Dck08oA8.js","_app/immutable/chunks/CrPz1wRa.js","_app/immutable/chunks/DLkOmWsm.js","_app/immutable/chunks/D07Fs7-n.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/BkgaBY1T.js","_app/immutable/chunks/Bs4EhOFp.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=116-BgFzheU2.js.map
