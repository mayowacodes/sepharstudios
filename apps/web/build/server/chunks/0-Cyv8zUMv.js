//#region src/routes/+layout.server.ts
/**
* Expose the current user to every page in the app.
* Components read `data.user` to check auth state.
* The AICopilot widget uses this to render auth-gated vs. guest UI.
*/
var load = async ({ locals }) => {
	return { user: locals.user ?? null };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-B6Yuc73X.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.B-mVyUtL.js","_app/immutable/chunks/DdntYR2r.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/DbP8MhBG2.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/DZXko5A82.js","_app/immutable/chunks/DQQV4u0O2.js","_app/immutable/chunks/BC4b7XLa.js","_app/immutable/chunks/GKWuiuOh.js","_app/immutable/chunks/BefVvb-N2.js","_app/immutable/chunks/oOhHCB-92.js","_app/immutable/chunks/C_jsyxKw.js","_app/immutable/chunks/Dqag1JzJ.js","_app/immutable/chunks/Cqn-zCcn2.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/Du36eeij2.js","_app/immutable/chunks/CO5m0ek1.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/AMeTL3ZL.js","_app/immutable/chunks/Dy-TKAjK.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/PWAInstallPrompt.Cw6HcEey.css","_app/immutable/assets/0.CNo69J0V.css","_app/immutable/assets/app.ELeLL5Dm.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-Cyv8zUMv.js.map
