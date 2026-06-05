import { Dt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/upload.svelte
function Upload($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "upload" },
		props,
		{ iconNode: [
			["path", { "d": "M12 3v12" }],
			["path", { "d": "m17 8-5-5-5 5" }],
			["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]
		] }
	]));
}
//#endregion
export { Upload as t };
