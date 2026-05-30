import "../../../../../../chunks/ui-libs.js";
import "../../../../../../chunks/state.js";
import { n as ReviewType, t as ReviewResult } from "../../../../../../chunks/admin.js";
//#region src/routes/(admin)/admin/review/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		ReviewType.THEOLOGICAL, ReviewResult.APPROVED;
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<div class="text-center py-12"><div class="text-4xl mb-4">📋</div> <div class="text-xl text-white mb-2">Loading content...</div></div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
