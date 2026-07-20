import { Et as derived } from "../../../../chunks/ui-libs.js";
import { t as page } from "../../../../chunks/state.js";
import "../../../../chunks/navigation.js";
import "../../../../chunks/portal-navigation.js";
//#region src/lib/components/kids/KidsTopNav.svelte
function KidsTopNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		derived(() => page.url.pathname.includes("/teens") ? "teens" : "kiddies");
		derived(() => ({
			type: "emoji",
			data: "😊",
			name: "Profile"
		}));
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/kids/kiddies/+layout@.svelte
function _layout_($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		if (derived(() => !page.url.pathname.endsWith("/kids") && !page.url.pathname.endsWith("/kids/profile"))()) {
			$$renderer.push("<!--[0-->");
			KidsTopNav($$renderer, {});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		children($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _layout_ as default };
