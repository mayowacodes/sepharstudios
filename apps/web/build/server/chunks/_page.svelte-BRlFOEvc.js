import './index.js-CxPEndTa.js';
import { A as Arrow_left } from './arrow-left-B6xUHJVB.js';
import './toast-state.svelte-jhYVYtU8.js';
import './client-DsZfmj3l.js';
import { S as Skeleton } from './skeleton-C99_WNvK.js';
import './Icon-Bw1rnKTC.js';
import './utils2-DZI6czOR.js';

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
//# sourceMappingURL=_page.svelte-BRlFOEvc.js.map
