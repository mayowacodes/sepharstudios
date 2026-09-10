import { b as ensure_array_like, x as attr_class, q as escape_html } from './index.js-DwRgOKlO.js';
import { F as File_text } from './file-text-CHS0iqgH.js';
import { S as Skeleton } from './skeleton-DrNJG5oW.js';
import { P as PortalHero } from './PortalHero-cuWNLrHh.js';
import './Icon-C7ASqKku.js';
import './utils2-DHW1aw82.js';

//#region src/routes/(admin)/admin/tax-forms/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let filter = "submitted";
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "Compliance",
			title: "Tax forms",
			subtitle: "Review submitted W-9 / W-8BEN / W-8BEN-E forms before annual 1099 generation.",
			icon: File_text
		});
		$$renderer.push(`<!----> <div class="flex gap-2"><!--[-->`);
		const each_array = ensure_array_like([
			"submitted",
			"verified",
			"rejected",
			"expired",
			"all"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`px-3 py-1.5 rounded text-xs capitalize ${filter === f ? "bg-purple-600 text-foreground" : "surface-2  text-white hover:text-white"}`)}>${escape_html(f)}</button>`);
		}
		$$renderer.push(`<!--]--></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(4));
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				each_array_1[i];
				Skeleton($$renderer, { class: "h-16 rounded-xl" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DYrJImph.js.map
