import { Ot as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/.bun/@lucide+svelte@1.24.0+5726b9c92ebd8575/node_modules/@lucide/svelte/dist/icons/flame.svelte
function Flame($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "flame" },
		props,
		{ iconNode: [["path", { "d": "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" }]] }
	]));
}
//#endregion
export { Flame as t };
