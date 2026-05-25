let base = "";
let assets = base;
const app_dir = "_app";
const relative = true;
const initial = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
function reset() {
  base = initial.base;
  assets = initial.assets;
}
function set_assets(path) {
  assets = initial.assets = path;
}
let building = false;
let prerendering = false;
function set_building() {
  building = true;
}
function set_prerendering() {
  prerendering = true;
}
export {
  set_building as a,
  building as b,
  set_prerendering as c,
  base as d,
  app_dir as e,
  assets as f,
  reset as g,
  override as o,
  prerendering as p,
  relative as r,
  set_assets as s
};
