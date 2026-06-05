import { St as derived } from "../../../../../../chunks/ui-libs.js";
import { t as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import "../../../../../../chunks/banknote.js";
import "../../../../../../chunks/shield-alert.js";
import "../../../../../../chunks/users.js";
import "../../../../../../chunks/video.js";
import "../../../../../../chunks/toast-state.svelte.js";
import { t as page } from "../../../../../../chunks/state.js";
import { t as Skeleton } from "../../../../../../chunks/skeleton.js";
import "../../../../../../chunks/PageHeader.js";
//#region src/routes/(admin)/admin/users/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		derived(() => page.params.id);
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-5xl space-y-6"><a href="/admin/users" class="text-xs text-purple-300 hover:text-purple-200 inline-flex items-center gap-1">`);
		Arrow_left($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----> All users</a> `);
		$$renderer.push("<!--[0-->");
		Skeleton($$renderer, { class: "h-24 rounded-xl" });
		$$renderer.push(`<!----> <div class="grid grid-cols-3 gap-3">`);
		Skeleton($$renderer, { class: "h-32 rounded-xl" });
		$$renderer.push(`<!----> `);
		Skeleton($$renderer, { class: "h-32 rounded-xl" });
		$$renderer.push(`<!----> `);
		Skeleton($$renderer, { class: "h-32 rounded-xl" });
		$$renderer.push(`<!----></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
