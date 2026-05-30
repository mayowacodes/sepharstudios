

export const index = 101;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(web3)/tokens/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/101.BT0V4ylF.js","_app/immutable/chunks/DWk-VoS1.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/FqtpMiZa.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
export const fonts = [];
