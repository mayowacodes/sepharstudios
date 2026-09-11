import { e as error } from './index.js-CxPEndTa.js';

//#region src/routes/(creator)/creator/+layout.ts
/**
* Role guard for every route under /creator. Admins pass too — they need to
* inspect a creator's workspace for moderation.
*
* Placed at `(creator)/creator/` rather than `(creator)/` for the same reason
* documented in (admin)/admin/+layout.ts: the `+layout@.svelte` reset in this
* directory removes the `(creator)` group node from the route chain, so a guard
* one level up never executes.
*/
var load = async ({ parent }) => {
	const { user } = await parent();
	if (!user) throw error(401, "Sign in required");
	if (user.role !== "creator" && user.role !== "admin") throw error(403, "Forbidden: you are not a creator");
	return { user };
};

var _layout_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout@.svelte-B-BiMlNX.js')).default;
const universal_id = "src/routes/(creator)/creator/+layout.ts";
const imports = ["_app/immutable/nodes/5.DmiiEAbC.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/C3ERpuUJ2.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/CVvb29p6.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/Bguy7RFu.js","_app/immutable/chunks/E4wFmwoy.js","_app/immutable/chunks/CZ0iejYq.js","_app/immutable/chunks/BcdcGr0x2.js","_app/immutable/chunks/Dy8qoEGg2.js","_app/immutable/chunks/QHPknIdw2.js","_app/immutable/chunks/B90YRj3u2.js","_app/immutable/chunks/DDNGFuwF2.js","_app/immutable/chunks/Dhfq-MNX.js","_app/immutable/chunks/B3nkk3ZW.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/LI4RzlLk.js","_app/immutable/chunks/B3qGyZ6B.js","_app/immutable/chunks/D6pBY8uh.js","_app/immutable/chunks/C6_1_GyP.js","_app/immutable/chunks/qvEsCU_-.js","_app/immutable/chunks/CfIeTnH-.js","_app/immutable/chunks/BGB5LaM1.js","_app/immutable/chunks/DLupASnU.js","_app/immutable/chunks/Dck08oA8.js","_app/immutable/chunks/DLkOmWsm.js","_app/immutable/chunks/BXwQc_pG.js","_app/immutable/chunks/CfLpMdx4.js","_app/immutable/chunks/CrPz1wRa.js","_app/immutable/chunks/DylRP6NN.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/BMr-SSC6.js","_app/immutable/chunks/iSdTMXsR.js","_app/immutable/chunks/Bkpf_Ads.js","_app/immutable/chunks/PnT1f7q6.js","_app/immutable/chunks/DzLw8YWo.js","_app/immutable/chunks/CFKu6x7M.js","_app/immutable/chunks/HJKNSgnP.js","_app/immutable/chunks/BK_Y07D62.js","_app/immutable/chunks/BtCW5bza2.js","_app/immutable/chunks/DqzUUf7Y2.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/CqgOZEvA2.js","_app/immutable/chunks/CTsNHExs2.js","_app/immutable/chunks/CMVhVUDw2.js","_app/immutable/chunks/CvYg6wId2.js","_app/immutable/chunks/Dglv-lwY2.js","_app/immutable/chunks/Cy0bMxJ1.js","_app/immutable/chunks/q2Vb4eal.js","_app/immutable/chunks/D07Fs7-n.js","_app/immutable/chunks/C9Hg4rJI.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/skeleton.D38UF9u5.css","_app/immutable/assets/PortalShell._wPY6-_N.css","_app/immutable/assets/app.CPRa53Os.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=5-D9fM34_B.js.map
