import { b as ensure_array_like, ae as attr_style, q as escape_html } from './index.js-BP8aAXBX.js';
import { S as Shield_alert } from './shield-alert-Cgwe5Fn0.js';
import { S as Skeleton } from './skeleton-6hclnaPy.js';
import { P as PortalHero } from './PortalHero-B80SkUjg.js';
import './Icon-DOH8dWtn.js';
import './utils2-CqskQpUP.js';

//#region src/routes/(admin)/admin/abuse/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let filter = "all";
		let statusFilter = "open";
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-5xl space-y-6">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "Trust & Safety",
			title: "Abuse queue",
			subtitle: "Triage user-submitted reports. Resolve to action the target, dismiss for false reports, or escalate when senior review is needed.",
			icon: Shield_alert
		});
		$$renderer.push(`<!----> <div class="space-y-3"><div class="flex flex-wrap gap-2 items-center"><span class="text-xs mr-2" style="color: hsl(var(--portal-text-muted));">Type:</span> <!--[-->`);
		const each_array = ensure_array_like([
			"all",
			"review",
			"forum_thread",
			"forum_reply",
			"content",
			"user"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<button type="button" class="px-3 py-1.5 rounded-full text-xs transition-colors"${attr_style(filter === f ? `background: hsl(var(--portal-accent)); color: hsl(var(--portal-bg-base)); font-weight: 600;` : `background: hsl(var(--portal-bg-elevated)/0.6); color: hsl(var(--portal-text-muted)); border: 1px solid hsl(var(--portal-border));`)}>${escape_html(f.replace("_", " "))}</button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-2 items-center"><span class="text-xs mr-2" style="color: hsl(var(--portal-text-muted));">Status:</span> <!--[-->`);
		const each_array_1 = ensure_array_like([
			"open",
			"resolved",
			"all"
		]);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let s = each_array_1[$$index_1];
			$$renderer.push(`<button type="button" class="px-3 py-1.5 rounded-full text-xs capitalize transition-colors"${attr_style(statusFilter === s ? `background: hsl(var(--portal-accent-2, var(--portal-accent))); color: hsl(var(--portal-bg-base)); font-weight: 600;` : `background: hsl(var(--portal-bg-elevated)/0.6); color: hsl(var(--portal-text-muted)); border: 1px solid hsl(var(--portal-border));`)}>${escape_html(s)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_2 = ensure_array_like(Array(4));
			for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
				each_array_2[i];
				Skeleton($$renderer, { class: "h-20 rounded-xl" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B4hvl-yQ.js.map
