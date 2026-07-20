import { Ct as attr_style, Ht as attr, Ot as ensure_array_like, Wt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Banknote } from "../../../../../chunks/banknote.js";
import { t as Search } from "../../../../../chunks/search.js";
import { t as X } from "../../../../../chunks/x.js";
import { t as Skeleton } from "../../../../../chunks/skeleton.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../chunks/PortalButton.js";
import "../../../../../chunks/PortalEmptyState.js";
//#region src/routes/(admin)/admin/refunds/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let status = "all";
		let q = "";
		let issueOpen = false;
		let issueRef = "";
		let issueAmount = "";
		let issueReason = "";
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "primary",
					size: "sm",
					onclick: () => issueOpen = true,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Issue refund`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Finance",
				title: "Refunds",
				subtitle: "Issue and audit refunds against Paystack transactions.",
				icon: Banknote,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="flex flex-wrap gap-3 items-center"><div class="flex gap-2 flex-wrap"><!--[-->`);
		const each_array = ensure_array_like([
			"all",
			"pending",
			"success",
			"failed"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let s = each_array[$$index];
			$$renderer.push(`<button type="button" class="px-3 py-1.5 rounded-full text-xs capitalize transition-colors"${attr_style(status === s ? `background: hsl(var(--portal-accent)); color: hsl(var(--portal-bg-base)); font-weight: 600;` : `background: hsl(var(--portal-bg-elevated)/0.6); color: hsl(var(--portal-text-muted)); border: 1px solid hsl(var(--portal-border));`)}>${escape_html(s)}</button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="relative ml-auto w-72">`);
		Search($$renderer, {
			class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
			style: "color: hsl(var(--portal-text-muted));"
		});
		$$renderer.push(`<!----> <input type="text"${attr("value", q)} placeholder="Search reference, email, name…" class="w-full rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2" style="background: hsl(var(--portal-bg-elevated)/0.6); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"/></div></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(5));
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				each_array_1[i];
				Skeleton($$renderer, { class: "h-12 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (issueOpen) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true" tabindex="-1"><div class="bg-gray-900 border border-border/40 rounded-xl max-w-md w-full p-6 space-y-4"><div class="flex items-center justify-between"><h2 class="text-lg font-semibold text-foreground">Issue refund</h2> <button type="button" class="text-muted-foreground hover:text-foreground">`);
			X($$renderer, { class: "w-5 h-5" });
			$$renderer.push(`<!----></button></div> <div class="space-y-3"><div><label for="ref" class="block text-sm text-foreground/80 mb-1">Paystack reference</label> <input id="ref" type="text"${attr("value", issueRef)} class="w-full surface-1 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground font-mono" placeholder="paystack-txn-ref"/></div> <div><label for="amt" class="block text-sm text-foreground/80 mb-1">Amount (USD, optional)</label> <input id="amt" type="number" min="0" step="0.01"${attr("value", issueAmount)} class="w-full surface-1 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground" placeholder="Leave blank for full refund"/></div> <div><label for="rsn" class="block text-sm text-foreground/80 mb-1">Reason (optional)</label> <textarea id="rsn" rows="3" class="w-full surface-1 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground resize-none" placeholder="Why is this being refunded?">`);
			const $$body = escape_html(issueReason);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea></div></div> <div class="flex gap-2 justify-end pt-2"><button type="button" class="px-4 py-2 rounded-lg text-sm text-foreground/80 hover:surface-2">Cancel</button> <button type="button"${attr("disabled", true, true)} class="px-4 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">${escape_html("Issue refund")}</button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
