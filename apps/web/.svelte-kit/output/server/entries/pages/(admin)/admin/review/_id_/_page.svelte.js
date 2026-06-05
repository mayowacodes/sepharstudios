import { St as derived } from "../../../../../../chunks/ui-libs.js";
import "../../../../../../chunks/Icon.js";
import "../../../../../../chunks/arrow-left.js";
import "../../../../../../chunks/circle-check.js";
import "../../../../../../chunks/circle-x.js";
import "../../../../../../chunks/file-text.js";
import "../../../../../../chunks/ContentThreadPanel.js";
import "../../../../../../chunks/shield-check.js";
import "../../../../../../chunks/sparkles.js";
import "../../../../../../chunks/triangle-alert.js";
import "../../../../../../chunks/state.js";
import "../../../../../../chunks/PageHeader.js";
import { n as ReviewType, t as ReviewResult } from "../../../../../../chunks/admin.js";
import "../../../../../../chunks/VideoPlayer.js";
//#endregion
//#region src/routes/(admin)/admin/review/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		ReviewType.THEOLOGICAL, ReviewResult.APPROVED;
		derived(() => false);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<div class="container mx-auto px-4 py-12 text-center text-muted-foreground"><div class="text-sm">Loading content…</div></div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
