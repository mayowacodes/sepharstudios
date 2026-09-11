import { u as usersRoles, C as Constants } from './constants-DSOCQRom.js';
import { aI as redirect } from './index.js-BP8aAXBX.js';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';

//#region src/routes/(protected)/users/+page.ts
/**
* User management page. Role-gated to `usersRoles`.
*
* `parent()` resolves against (protected)/+layout.ts, which has already
* redirected anonymous visitors — so `user` is present here in practice; the
* null check remains because the type permits it and a redirect is cheaper than
* a crash. Every /api/users/* endpoint re-checks the role server-side.
*/
var load = async ({ parent, url }) => {
	const { user } = await parent();
	if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	if (!usersRoles.includes(user.role)) throw redirect(303, Constants.AFTERAUTH);
	return {};
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 116;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CK7kQ27L.js')).default;
const universal_id = "src/routes/(protected)/users/+page.ts";
const imports = ["_app/immutable/nodes/116.ClkXuMr0.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/DRUPmJi1.js","_app/immutable/chunks/B3nkk3ZW2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/QCbDkIzJ.js","_app/immutable/chunks/Dy8qoEGg2.js","_app/immutable/chunks/DPRDCEcT2.js","_app/immutable/chunks/7vOP9Dph2.js","_app/immutable/chunks/B3qGyZ6B.js","_app/immutable/chunks/Bkpf_Ads.js","_app/immutable/chunks/DQIHq--d2.js","_app/immutable/chunks/BtCW5bza2.js","_app/immutable/chunks/CMWPG8--2.js","_app/immutable/chunks/BTEnPp3h.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/DLupASnU2.js","_app/immutable/chunks/DziTgYIQ2.js","_app/immutable/chunks/C01nDjOm.js","_app/immutable/chunks/BiEXOabg.js","_app/immutable/chunks/D3r3jRQz.js","_app/immutable/chunks/Cortmpgb.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/Bj5gH5nx.js","_app/immutable/chunks/3Kz8jO-M.js","_app/immutable/chunks/wvZn4wUS.js","_app/immutable/chunks/DEkDGlhb.js","_app/immutable/chunks/DRffz76i.js","_app/immutable/chunks/CL8nWERi.js","_app/immutable/chunks/Bm5OCFel2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=116-C4vNFpuk.js.map
