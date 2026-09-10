import './index.js-DwRgOKlO.js';
import { A as Arrow_left } from './arrow-left-BuHbGgND.js';
import './toast-state.svelte-_bigiMZf.js';
import './client-BnGpewQC.js';
import { S as Skeleton } from './skeleton-DrNJG5oW.js';
import './Icon-C7ASqKku.js';
import './utils2-DHW1aw82.js';

//#region src/routes/(admin)/admin/users/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-6xl space-y-6"><a href="/admin/users" class="text-xs inline-flex items-center gap-1 transition-colors" style="color: hsl(var(--portal-accent));">`);
		Arrow_left($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----> All users</a> `);
		{
			$$renderer.push("<!--[0-->");
			Skeleton($$renderer, { class: "h-24 rounded-xl" });
			$$renderer.push(`<!----> <div class="grid grid-cols-3 gap-3">`);
			Skeleton($$renderer, { class: "h-32 rounded-xl" });
			$$renderer.push(`<!----> `);
			Skeleton($$renderer, { class: "h-32 rounded-xl" });
			$$renderer.push(`<!----> `);
			Skeleton($$renderer, { class: "h-32 rounded-xl" });
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C9Z8XRM7.js.map
