import { Ct as attr_style, Ot as ensure_array_like, Wt as escape_html, qt as run } from "../../../../../chunks/ui-libs.js";
import { t as Shield_alert } from "../../../../../chunks/shield-alert.js";
import { t as Skeleton } from "../../../../../chunks/skeleton.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import "../../../../../chunks/PortalEmptyState.js";
//#region src/routes/(admin)/admin/disputes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let filter = "open";
		run(() => filter);
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "Finance",
			title: "Disputes",
			subtitle: "Stripe + Paystack disputes / chargebacks. Respond to open disputes through the processor's dashboard; this page tracks state + audit.",
			icon: Shield_alert
		});
		$$renderer.push(`<!----> <div class="flex gap-2 flex-wrap"><!--[-->`);
		const each_array = ensure_array_like([
			"open",
			"won",
			"lost",
			"withdrawn",
			"all"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<button type="button" class="px-3 py-1.5 rounded-full text-xs capitalize transition-colors"${attr_style(filter === f ? `background: hsl(var(--portal-accent)); color: hsl(var(--portal-bg-base)); font-weight: 600;` : `background: hsl(var(--portal-bg-elevated)/0.6); color: hsl(var(--portal-text-muted)); border: 1px solid hsl(var(--portal-border));`)}>${escape_html(f)}</button>`);
		}
		$$renderer.push(`<!--]--></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(4));
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				each_array_1[i];
				Skeleton($$renderer, { class: "h-16 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
