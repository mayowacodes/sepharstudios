import { At as clsx, ut as attr_class, yt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
import { t as cn } from "./utils2.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/arrow-left.svelte
function Arrow_left($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-left" },
		props,
		{ iconNode: [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]] }
	]));
}
//#endregion
//#region src/lib/components/ui/spin-loader/spin-loader.svelte
function Spin_loader($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className } = $$props;
		$$renderer.push(`<div${attr_class(clsx(cn("size-4 animate-spin rounded-full border-b-2 border-t-2 border-white", className)))}></div>`);
	});
}
//#endregion
//#region src/lib/components/web3-lazy/LazyWalletConnect.svelte
function LazyWalletConnect($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center p-8">`);
		Spin_loader($$renderer, { class: "size-8" });
		$$renderer.push(`<!----> <p class="ml-3 text-muted-foreground">Loading wallet connection...</p></div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/web3-lazy/LazySTCTokenDashboard.svelte
function LazySTCTokenDashboard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center p-8">`);
		Spin_loader($$renderer, { class: "size-8" });
		$$renderer.push(`<!----> <p class="ml-3 text-muted-foreground">Loading token dashboard...</p></div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/web3-lazy/LazySubscriptionNFT.svelte
function LazySubscriptionNFT($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center p-8">`);
		Spin_loader($$renderer, { class: "size-8" });
		$$renderer.push(`<!----> <p class="ml-3 text-muted-foreground">Loading subscription options...</p></div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { Arrow_left as i, LazySTCTokenDashboard as n, LazyWalletConnect as r, LazySubscriptionNFT as t };
