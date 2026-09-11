import { c as apiSafe } from './client2-DMA58bua.js';
import './index.js-CxPEndTa.js';

//#region src/routes/(app)/browse/+page.ts
/** Browse landing rows. See (app)/movies/+page.ts for why this is universal. */
var load = async ({ fetch }) => {
	return apiSafe("/api/catalog/browse", {
		shows: [],
		movies: [],
		documentaries: []
	}, { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 49;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Dx9eCt1T.js')).default;
const universal_id = "src/routes/(app)/browse/+page.ts";
const imports = ["_app/immutable/nodes/49.CDYc1_TE.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/C9Hg4rJI.js","_app/immutable/chunks/DSlTeFiz2.js","_app/immutable/chunks/CE6c-YOD2.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/Dglv-lwY2.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/BslTakuj2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js","_app/immutable/chunks/Cr4roabJ2.js","_app/immutable/chunks/DTGrwegR2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=49-CRT5ljlh.js.map
