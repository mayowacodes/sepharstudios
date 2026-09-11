import { b as apiOrError } from './client2-DMA58bua.js';
import './index.js-CxPEndTa.js';

//#region src/routes/(app)/creators/[id]/+page.ts
/** Public creator profile. */
var load = async ({ params, fetch }) => {
	return apiOrError(`/api/creators/${encodeURIComponent(params.id)}/page`, { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 54;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BVNtMmZj.js')).default;
const universal_id = "src/routes/(app)/creators/[id]/+page.ts";
const imports = ["_app/immutable/nodes/54.MwrpRd6B.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/hZsclpc0.js","_app/immutable/chunks/B3nkk3ZW.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/DDNGFuwF2.js","_app/immutable/chunks/82Vx61fA.js","_app/immutable/chunks/Dglv-lwY2.js","_app/immutable/chunks/CrPz1wRa.js","_app/immutable/chunks/DLupASnU.js","_app/immutable/chunks/DLkOmWsm.js","_app/immutable/chunks/BlJHiQLj.js","_app/immutable/chunks/CE6c-YOD2.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/BslTakuj2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=54-8l2oxm4S.js.map
