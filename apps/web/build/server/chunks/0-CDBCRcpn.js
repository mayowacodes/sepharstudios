const load = async ({ locals }) => {
  return {
    user: locals.user ?? null,
    session: locals.session ?? null
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-CrJQBD_M.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.rhkcwrVI.js","_app/immutable/chunks/BQ03z0kT.js","_app/immutable/chunks/TpWHEDIq.js","_app/immutable/chunks/CxiJ-Vy5.js","_app/immutable/chunks/Cl4ny3Dy.js","_app/immutable/chunks/CZu3KfCi.js","_app/immutable/chunks/CSw1PH97.js","_app/immutable/chunks/QqQ0AyNr.js","_app/immutable/chunks/DMNcghFY.js","_app/immutable/chunks/DrGiHYRm.js","_app/immutable/chunks/BGd3TWsR.js","_app/immutable/chunks/BgAte0LC.js","_app/immutable/chunks/B4lX7oYV.js","_app/immutable/chunks/BTcBi_6o.js","_app/immutable/chunks/B5XzSBQu.js","_app/immutable/chunks/DJngHVR0.js","_app/immutable/chunks/BNHV54_R.js","_app/immutable/chunks/CFy3_46E.js","_app/immutable/chunks/S4pqshPe.js","_app/immutable/chunks/B3OFaTZD.js","_app/immutable/chunks/D5sXZnZo.js","_app/immutable/chunks/FLktOQ2X.js","_app/immutable/chunks/BxnuXE-y.js","_app/immutable/chunks/C80fVOtw.js","_app/immutable/chunks/DTmrZ4Hq.js","_app/immutable/chunks/GOJD2agv.js","_app/immutable/chunks/C69bBWPc.js","_app/immutable/chunks/CP9O2DC0.js"];
const stylesheets = ["_app/immutable/assets/0.rN8r_Hzv.css","_app/immutable/assets/app.BrK9Co4j.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-CDBCRcpn.js.map
