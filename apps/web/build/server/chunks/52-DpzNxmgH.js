import { b as apiOrError } from './client2-CYVUBClx.js';
import './index.js-BP8aAXBX.js';

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
const component = async () => component_cache ??= (await import('./_page.svelte-CC2qgZ0R.js')).default;
const universal_id = "src/routes/(app)/creators/[id]/+page.ts";
const imports = ["_app/immutable/nodes/52.DgR3cAri.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BTEnPp3h.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/DRUPmJi1.js","_app/immutable/chunks/B3nkk3ZW2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/DDNGFuwF2.js","_app/immutable/chunks/82Vx61fA.js","_app/immutable/chunks/BlM0FlPC2.js","_app/immutable/chunks/D3r3jRQz.js","_app/immutable/chunks/DLupASnU2.js","_app/immutable/chunks/C01nDjOm.js","_app/immutable/chunks/DRffz76i.js","_app/immutable/chunks/BDRHQXOc2.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/BXK0v__I2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=52-DpzNxmgH.js.map
