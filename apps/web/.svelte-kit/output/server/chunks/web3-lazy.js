import { Rt as clsx, vt as attr_class } from "./ui-libs.js";
import { t as cn } from "./utils2.js";
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
export { LazySTCTokenDashboard as n, LazyWalletConnect as r, LazySubscriptionNFT as t };
