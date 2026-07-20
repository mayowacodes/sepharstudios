import { jt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/volume-x.svelte
function Volume_x($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "volume-x" },
		props,
		{ iconNode: [
			["path", { "d": "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" }],
			["line", {
				"x1": "22",
				"x2": "16",
				"y1": "9",
				"y2": "15"
			}],
			["line", {
				"x1": "16",
				"x2": "22",
				"y1": "9",
				"y2": "15"
			}]
		] }
	]));
}
//#endregion
export { Volume_x as t };
