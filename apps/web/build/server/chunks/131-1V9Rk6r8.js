import { c as apiSafe } from './client2-DMA58bua.js';
import './index.js-CxPEndTa.js';

//#region src/routes/kids/teens/+page.ts
/** Teens portal feed. See kids/kiddies/+page.ts. */
var load = async ({ fetch }) => {
	return apiSafe("/api/catalog/audience/teens", { content: [] }, { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 131;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DQ5gpuhR.js')).default;
const universal_id = "src/routes/kids/teens/+page.ts";
const imports = ["_app/immutable/nodes/131.ucLi6J8d.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DSlTeFiz2.js","_app/immutable/chunks/CE6c-YOD2.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/Dglv-lwY2.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/BslTakuj2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/131.Brez6pGR.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=131-1V9Rk6r8.js.map
