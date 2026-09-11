import { b as apiOrError } from './client2-DMA58bua.js';
import './index.js-CxPEndTa.js';

//#region src/routes/(admin)/admin/dashboard/+page.ts
/** Admin dashboard. The endpoint enforces the admin role independently. */
var load = async ({ fetch }) => {
	return apiOrError("/api/admin/dashboard", { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 19;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BaL0MmdJ.js')).default;
const universal_id = "src/routes/(admin)/admin/dashboard/+page.ts";
const imports = ["_app/immutable/nodes/19.C40HmUwa.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bguy7RFu.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CayyNLW-2.js","_app/immutable/chunks/CfIeTnH-.js","_app/immutable/chunks/HJKNSgnP.js","_app/immutable/chunks/Bh1jI0ca2.js","_app/immutable/chunks/BfGqcxE32.js","_app/immutable/chunks/Bbiduq3k2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/BlJHiQLj.js","_app/immutable/chunks/DLupASnU.js","_app/immutable/chunks/DLkOmWsm.js","_app/immutable/chunks/CZcHwv3h.js","_app/immutable/chunks/BkgaBY1T.js","_app/immutable/chunks/BUyZ3f_d.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/19.COX9OWLn.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=19-C5HzX7YB.js.map
