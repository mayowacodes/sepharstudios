import "./ui-libs.js";
import "./download.js";
import "./smartphone.js";
import "./x.js";
//#region src/lib/components/widgets/PWAInstallPrompt.svelte
function PWAInstallPrompt($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { PWAInstallPrompt as t };
