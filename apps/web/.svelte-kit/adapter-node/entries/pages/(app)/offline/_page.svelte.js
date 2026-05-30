import { yt as spread_props } from "../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as Wifi } from "../../../../chunks/wifi.js";
import { t as Button } from "../../../../chunks/button.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/refresh-ccw.svelte
function Refresh_ccw($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "refresh-ccw" },
		props,
		{ iconNode: [
			["path", { "d": "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
			["path", { "d": "M3 3v5h5" }],
			["path", { "d": "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" }],
			["path", { "d": "M16 16h5v5" }]
		] }
	]));
}
//#endregion
//#region src/routes/(app)/offline/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function refresh() {
			window.location.reload();
		}
		$$renderer.push(`<div class="min-h-screen bg-background flex items-center justify-center p-4"><div class="max-w-md w-full text-center space-y-6"><div class="flex justify-center">`);
		$$renderer.push("<!--[0-->");
		Wifi($$renderer, { class: "w-20 h-20 text-primary" });
		$$renderer.push(`<!--]--></div> <h1 class="text-4xl font-bold">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`Back Online`);
		$$renderer.push(`<!--]--></h1> <p class="text-lg text-muted-foreground">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`Your connection has been restored. You can continue watching.`);
		$$renderer.push(`<!--]--></p> <div class="flex justify-center">`);
		Button($$renderer, {
			onclick: refresh,
			size: "lg",
			class: "gap-2",
			children: ($$renderer) => {
				Refresh_ccw($$renderer, { class: "w-5 h-5" });
				$$renderer.push(`<!----> Refresh Page`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div></div>`);
	});
}
//#endregion
export { _page as default };
