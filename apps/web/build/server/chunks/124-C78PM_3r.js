import { c as apiSafe } from './client2-DMA58bua.js';
import './index.js-CxPEndTa.js';

//#region src/routes/kids/kiddies/+page.ts
/**
* Kids portal feed. Universal so the native bundle can render it; the previous
* server load swallowed its own errors and rendered an empty grid, which
* `apiSafe` preserves.
*/
var load = async ({ fetch }) => {
	return apiSafe("/api/catalog/audience/kids", { content: [] }, { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 124;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DWWOwNL7.js')).default;
const universal_id = "src/routes/kids/kiddies/+page.ts";
const imports = ["_app/immutable/nodes/124.CYdpdwKn.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DSlTeFiz2.js","_app/immutable/chunks/CE6c-YOD2.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/Dglv-lwY2.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/BslTakuj2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=124-C78PM_3r.js.map
