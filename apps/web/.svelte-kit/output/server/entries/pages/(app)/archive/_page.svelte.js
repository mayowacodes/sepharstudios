import { wt as ensure_array_like } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/EnhancedVideoPlayer.js";
//#region src/lib/components/browse/ArchiveVideo.svelte
function ArchiveVideo($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[-1-->");
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"><!--[-->`);
			const each_array = ensure_array_like(Array(6));
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				each_array[i];
				$$renderer.push(`<div class="animate-pulse bg-gray-200 h-64 rounded-lg"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/(app)/archive/+page.svelte
function _page($$renderer) {
	ArchiveVideo($$renderer, {});
}
//#endregion
export { _page as default };
