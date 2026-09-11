import './index.js-BP8aAXBX.js';
import { A as Arrow_left } from './arrow-left-D1BMS_q0.js';
import './toast-state.svelte-B2rj3hM9.js';
import './client-ZoNwVBKD.js';
import { S as Skeleton } from './skeleton-6hclnaPy.js';
import './Icon-DOH8dWtn.js';
import './utils2-CqskQpUP.js';

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
//# sourceMappingURL=_page.svelte-2UBxuqCC.js.map
