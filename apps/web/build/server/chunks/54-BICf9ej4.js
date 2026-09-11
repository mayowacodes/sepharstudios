import { c as apiSafe } from './client2-CYVUBClx.js';
import { f as faithDocumentaries } from './documentaries-Bz8JPNE4.js';
import './index.js-BP8aAXBX.js';

//#region src/routes/(app)/documentaries/+page.ts
/** Documentaries catalog. See (app)/movies/+page.ts for why this is universal. */
var load = async ({ fetch }) => {
	const data = await apiSafe("/api/catalog/documentaries", {
		items: faithDocumentaries,
		comingSoon: []
	}, { fetch });
	return {
		documentaries: data.items,
		comingSoon: data.comingSoon
	};
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 54;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BkxlvxbY.js')).default;
const universal_id = "src/routes/(app)/documentaries/+page.ts";
const imports = ["_app/immutable/nodes/54.AIiCH2YE.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BTEnPp3h.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/CMWPG8--2.js","_app/immutable/chunks/BlM0FlPC2.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/BXK0v__I2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js","_app/immutable/chunks/Cg-ENqvb2.js","_app/immutable/chunks/BK_Y07D6.js","_app/immutable/chunks/Brw2rEZo2.js","_app/immutable/chunks/BPrL8_Z8.js","_app/immutable/chunks/CZ0iejYq.js","_app/immutable/chunks/B9jkzeDm2.js","_app/immutable/chunks/Dpo89u1t2.js","_app/immutable/chunks/XsAVRn8p2.js","_app/immutable/chunks/BctpoitP2.js","_app/immutable/chunks/D3r3jRQz.js","_app/immutable/chunks/DLupASnU2.js","_app/immutable/chunks/C01nDjOm.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=54-BICf9ej4.js.map
