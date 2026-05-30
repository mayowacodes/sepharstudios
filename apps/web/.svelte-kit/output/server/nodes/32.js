

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/admin/submissions/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/32.A71VWpfA.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
export const fonts = [];
