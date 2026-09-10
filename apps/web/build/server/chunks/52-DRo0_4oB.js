import { b as apiOrError } from './client2-BoVNkloV.js';
import './index.js-DwRgOKlO.js';

//#region src/routes/(app)/creators/[id]/+page.ts
/** Public creator profile. */
var load = async ({ params, fetch }) => {
	return apiOrError(`/api/creators/${encodeURIComponent(params.id)}/page`, { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 52;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-FZkEf_kp.js')).default;
const universal_id = "src/routes/(app)/creators/[id]/+page.ts";
const imports = ["_app/immutable/nodes/52.BHYp7WEZ.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/DRUPmJi1.js","_app/immutable/chunks/B3nkk3ZW2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/DDNGFuwF2.js","_app/immutable/chunks/82Vx61fA.js","_app/immutable/chunks/CcfisAwp2.js","_app/immutable/chunks/D3r3jRQz.js","_app/immutable/chunks/DLupASnU2.js","_app/immutable/chunks/C01nDjOm.js","_app/immutable/chunks/DRffz76i.js","_app/immutable/chunks/BMBNBL0Z2.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/VZm97ZWC2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=52-DRo0_4oB.js.map
