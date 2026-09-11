import './index.js-CxPEndTa.js';
import { A as Arrow_left } from './arrow-left-B6xUHJVB.js';
import './client-DsZfmj3l.js';
import './Icon-Bw1rnKTC.js';

//#endregion
//#region src/routes/(creator)/creator/forum/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="container mx-auto max-w-4xl py-6 px-4 space-y-6"><a href="/creator/forum" class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">`);
		Arrow_left($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----> Back to forum</a> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center text-muted-foreground py-12">Loading…</div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Csek6eQk.js.map
