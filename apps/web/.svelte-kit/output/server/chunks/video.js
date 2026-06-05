import { Dt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/video.svelte
function Video($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "video" },
		props,
		{ iconNode: [["path", { "d": "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" }], ["rect", {
			"x": "2",
			"y": "6",
			"width": "14",
			"height": "12",
			"rx": "2"
		}]] }
	]));
}
//#endregion
export { Video as t };
