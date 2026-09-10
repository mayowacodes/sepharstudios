import { Ot as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/.bun/@lucide+svelte@1.24.0+5726b9c92ebd8575/node_modules/@lucide/svelte/dist/icons/plus.svelte
function Plus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "plus" },
		props,
		{ iconNode: [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]] }
	]));
}
//#endregion
export { Plus as t };
