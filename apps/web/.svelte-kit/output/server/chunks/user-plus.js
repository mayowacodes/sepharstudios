import { Dt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/user-plus.svelte
function User_plus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "user-plus" },
		props,
		{ iconNode: [
			["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
			["circle", {
				"cx": "9",
				"cy": "7",
				"r": "4"
			}],
			["line", {
				"x1": "19",
				"x2": "19",
				"y1": "8",
				"y2": "14"
			}],
			["line", {
				"x1": "22",
				"x2": "16",
				"y1": "11",
				"y2": "11"
			}]
		] }
	]));
}
//#endregion
export { User_plus as t };
