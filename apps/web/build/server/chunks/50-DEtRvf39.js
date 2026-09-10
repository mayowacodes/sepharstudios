import { c as apiSafe } from './client2-BoVNkloV.js';
import './index.js-DwRgOKlO.js';

//#region src/routes/(app)/coming-soon/+page.ts
/**
* Dedicated Coming Soon listing. The page groups items by month client-side
* from `scheduledPublishAt`, so the endpoint returns the full set unlimited.
*/
var load = async ({ fetch }) => {
	return { items: (await apiSafe("/api/catalog/coming-soon", { items: [] }, { fetch })).items };
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 50;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BiGp4fsE.js')).default;
const universal_id = "src/routes/(app)/coming-soon/+page.ts";
const imports = ["_app/immutable/nodes/50.DIvd7z55.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/BK_Y07D6.js","_app/immutable/chunks/BnJD9Jdk2.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/BPrL8_Z8.js","_app/immutable/chunks/CZ0iejYq.js","_app/immutable/chunks/CcfisAwp2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=50-DEtRvf39.js.map
