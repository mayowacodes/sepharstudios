import { al as ensure_array_like } from './ui-libs-TtGtWAGI.js';
import './button-D9M18H3C.js';
import 'hls.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';

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
	ArchiveVideo($$renderer);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BA5bg5wW.js.map
