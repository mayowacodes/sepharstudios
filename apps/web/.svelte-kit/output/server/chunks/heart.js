import { Dt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/heart.svelte
function Heart($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "heart" },
		props,
		{ iconNode: [["path", { "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" }]] }
	]));
}
//#endregion
export { Heart as t };
