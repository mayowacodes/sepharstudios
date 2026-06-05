import { Dt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/coins.svelte
function Coins($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "coins" },
		props,
		{ iconNode: [
			["path", { "d": "M13.744 17.736a6 6 0 1 1-7.48-7.48" }],
			["path", { "d": "M15 6h1v4" }],
			["path", { "d": "m6.134 14.768.866-.5 2 3.464" }],
			["circle", {
				"cx": "16",
				"cy": "8",
				"r": "6"
			}]
		] }
	]));
}
//#endregion
export { Coins as t };
