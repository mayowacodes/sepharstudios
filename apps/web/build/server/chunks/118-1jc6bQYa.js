import { u as usersRoles, C as Constants } from './constants-BiiFHz9b.js';
import { aI as redirect } from './index.js-CxPEndTa.js';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

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

const index = 118;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-tCjWqIYg.js')).default;
const universal_id = "src/routes/(protected)/users/+page.ts";
const imports = ["_app/immutable/nodes/118.CjyqoDom.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/hZsclpc0.js","_app/immutable/chunks/B3nkk3ZW.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/QCbDkIzJ2.js","_app/immutable/chunks/Dy8qoEGg2.js","_app/immutable/chunks/DPRDCEcT2.js","_app/immutable/chunks/7vOP9Dph2.js","_app/immutable/chunks/B3qGyZ6B.js","_app/immutable/chunks/Bkpf_Ads.js","_app/immutable/chunks/DQIHq--d2.js","_app/immutable/chunks/BtCW5bza2.js","_app/immutable/chunks/CvYg6wId2.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/DLupASnU.js","_app/immutable/chunks/Dck08oA8.js","_app/immutable/chunks/DLkOmWsm.js","_app/immutable/chunks/CfLpMdx4.js","_app/immutable/chunks/CrPz1wRa.js","_app/immutable/chunks/D07Fs7-n.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/D4ivuZuN.js","_app/immutable/chunks/Bpr0fjjP.js","_app/immutable/chunks/BLoEAGVt.js","_app/immutable/chunks/F0gTKx62.js","_app/immutable/chunks/BlJHiQLj.js","_app/immutable/chunks/Bs4EhOFp.js","_app/immutable/chunks/CJs0ogUV2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=118-1jc6bQYa.js.map
