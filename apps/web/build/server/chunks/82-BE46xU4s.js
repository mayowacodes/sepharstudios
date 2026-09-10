import { c as apiSafe } from './client2-BoVNkloV.js';
import './index.js-DwRgOKlO.js';

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

const index = 82;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BsH8CNRM.js')).default;
const universal_id = "src/routes/(creator)/creator/+page.ts";
const imports = ["_app/immutable/nodes/82.DogIK89y.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/D5Gespjo.js","_app/immutable/chunks/B198IuLT.js","_app/immutable/chunks/CZ0iejYq.js","_app/immutable/chunks/BcdcGr0x2.js","_app/immutable/chunks/BfO_mE1L2.js","_app/immutable/chunks/CayyNLW-2.js","_app/immutable/chunks/B_7j5KCJ2.js","_app/immutable/chunks/C3Xmh3sp2.js","_app/immutable/chunks/C2Srfcjv.js","_app/immutable/chunks/qvEsCU_-.js","_app/immutable/chunks/BK_Y07D6.js","_app/immutable/chunks/BtCW5bza2.js","_app/immutable/chunks/DqzUUf7Y2.js","_app/immutable/chunks/CqgOZEvA2.js","_app/immutable/chunks/B9LjkC4M2.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/CZcHwv3h.js","_app/immutable/chunks/De3SsnuA.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=82-BE46xU4s.js.map
