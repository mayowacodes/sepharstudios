import { Ot as ensure_array_like, St as attr_class, Wt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Shield_check } from "../../../../../chunks/shield-check.js";
import "../../../../../chunks/triangle-alert.js";
import { t as Skeleton } from "../../../../../chunks/skeleton.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
//#region src/routes/(creator)/creator/moderation/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let reviewFilter = "pending";
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-5xl space-y-6">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "Community",
			title: "Moderation",
			subtitle: "Review feedback and forum activity on your content. Hide spam, approve thoughtful reviews, or lock heated threads.",
			icon: Shield_check
		});
		$$renderer.push(`<!----> <div class="flex gap-2"><button type="button"${attr_class(`px-4 py-2 rounded-lg text-sm bg-purple-600 text-foreground`)}>Reviews on my content</button> <button type="button"${attr_class(`px-4 py-2 rounded-lg text-sm surface-2 text-white/80 hover:surface-3`)}>My forum threads</button></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array = ensure_array_like([
				"pending",
				"flagged",
				"all"
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let f = each_array[$$index];
				$$renderer.push(`<button type="button"${attr_class(`px-3 py-1.5 rounded text-xs capitalize ${reviewFilter === f ? "bg-purple-700 text-foreground" : "surface-1 text-white/80 hover:surface-2"}`)}>${escape_html(f)}</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			{
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="space-y-2"><!--[-->`);
				const each_array_1 = ensure_array_like(Array(3));
				for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
					each_array_1[i];
					Skeleton($$renderer, { class: "h-24 rounded-xl" });
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
