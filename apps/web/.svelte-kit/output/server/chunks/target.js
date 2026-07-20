import { jt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/target.svelte
function Target($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "target" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}],
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "6"
			}],
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "2"
			}]
		] }
	]));
}
//#endregion
export { Target as t };
