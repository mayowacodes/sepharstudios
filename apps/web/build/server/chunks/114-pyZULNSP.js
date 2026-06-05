import { u as usersRoles, C as Constants } from './constants-BEpeHz1K.js';
import { r as redirect } from './index-Cv5VcsYq.js';
import './ui-libs-BjzLDLAh.js';
import './rolldown-runtime-pTpnEGsq.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/(protected)/users/+page.server.ts
var load = (async ({ locals, url }) => {
	const user = locals.user;
	if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	if (!usersRoles.includes(user.role)) throw redirect(303, Constants.AFTERAUTH);
	return {};
});

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 114;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-aoE3-qXa.js')).default;
const server_id = "src/routes/(protected)/users/+page.server.ts";
const imports = ["_app/immutable/nodes/114.DCJOqzJ7.js","_app/immutable/chunks/Biu5sxxD2.js","_app/immutable/chunks/CKRMjvU22.js","_app/immutable/chunks/DdntYR2r.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/DbP8MhBG2.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/DZXko5A82.js","_app/immutable/chunks/DQQV4u0O2.js","_app/immutable/chunks/BC4b7XLa.js","_app/immutable/chunks/GKWuiuOh.js","_app/immutable/chunks/lnztPWNe2.js","_app/immutable/chunks/ntRgMeff.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/COiortTs2.js","_app/immutable/chunks/CdtIMIMZ2.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/BSdbgJIN2.js","_app/immutable/chunks/bBIPRcQI2.js","_app/immutable/chunks/Dqag1JzJ.js","_app/immutable/chunks/DTkeaA6Q2.js","_app/immutable/chunks/B5wmhr6D.js","_app/immutable/chunks/DcIqsvyW2.js","_app/immutable/chunks/sZG0kLg2.js","_app/immutable/chunks/Cry5QRAL.js","_app/immutable/chunks/BxLQxVhM.js","_app/immutable/chunks/245GzMx_.js","_app/immutable/chunks/C30D9w632.js","_app/immutable/chunks/DWyV3ox3.js","_app/immutable/chunks/DQKwgIZf.js","_app/immutable/chunks/CAEG4N3A.js","_app/immutable/chunks/CO5m0ek1.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/Dy-TKAjK.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=114-pyZULNSP.js.map
