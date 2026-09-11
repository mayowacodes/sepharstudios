import { c as apiSafe } from './client2-DMA58bua.js';
import './index.js-CxPEndTa.js';

//#region src/routes/(creator)/creator/+page.ts
/**
* Creator dashboard. The previous server load caught its own query errors and
* rendered an empty list rather than failing the page — `apiSafe` keeps that.
*/
var load = async ({ fetch }) => {
	return apiSafe("/api/creator/in-flight-encodes", { inFlightEncodes: [] }, { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 84;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B-Hi6Cf2.js')).default;
const universal_id = "src/routes/(creator)/creator/+page.ts";
const imports = ["_app/immutable/nodes/84.CDdGs-yd.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/D5Gespjo.js","_app/immutable/chunks/B198IuLT.js","_app/immutable/chunks/CZ0iejYq.js","_app/immutable/chunks/BcdcGr0x2.js","_app/immutable/chunks/BfO_mE1L2.js","_app/immutable/chunks/CayyNLW-2.js","_app/immutable/chunks/B_7j5KCJ2.js","_app/immutable/chunks/C3Xmh3sp2.js","_app/immutable/chunks/C2Srfcjv.js","_app/immutable/chunks/qvEsCU_-.js","_app/immutable/chunks/BK_Y07D62.js","_app/immutable/chunks/BtCW5bza2.js","_app/immutable/chunks/DqzUUf7Y2.js","_app/immutable/chunks/CqgOZEvA2.js","_app/immutable/chunks/CvYg6wId2.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/CZcHwv3h.js","_app/immutable/chunks/De3SsnuA.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=84-BtJGWmzG.js.map
