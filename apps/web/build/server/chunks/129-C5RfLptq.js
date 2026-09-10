import { c as apiSafe } from './client2-BoVNkloV.js';
import './index.js-DwRgOKlO.js';

//#region src/routes/kids/teens/+page.ts
/** Teens portal feed. See kids/kiddies/+page.ts. */
var load = async ({ fetch }) => {
	return apiSafe("/api/catalog/audience/teens", { content: [] }, { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 129;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DNDUiIh0.js')).default;
const universal_id = "src/routes/kids/teens/+page.ts";
const imports = ["_app/immutable/nodes/129.Bl8uT3RX.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/CAFBQFxS2.js","_app/immutable/chunks/BMBNBL0Z2.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/CcfisAwp2.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/VZm97ZWC2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/129.Brez6pGR.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=129-C5RfLptq.js.map
