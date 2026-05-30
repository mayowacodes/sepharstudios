import { yt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/smartphone.svelte
function Smartphone($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "smartphone" },
		props,
		{ iconNode: [["rect", {
			"width": "14",
			"height": "20",
			"x": "5",
			"y": "2",
			"rx": "2",
			"ry": "2"
		}], ["path", { "d": "M12 18h.01" }]] }
	]));
}
//#endregion
export { Smartphone as t };
