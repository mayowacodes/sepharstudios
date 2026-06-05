import { wt as ensure_array_like } from "../../../../chunks/ui-libs.js";
import { n as Arrow_up_right, t as KpiCard } from "../../../../chunks/KpiCard.js";
import { t as Chart_column } from "../../../../chunks/chart-column.js";
import { t as Circle_check } from "../../../../chunks/circle-check.js";
import { t as Clock } from "../../../../chunks/clock.js";
import { t as Dollar_sign } from "../../../../chunks/dollar-sign.js";
import { t as Eye } from "../../../../chunks/eye.js";
import { t as House } from "../../../../chunks/house.js";
import { t as Message_square } from "../../../../chunks/message-square.js";
import { t as Sparkles } from "../../../../chunks/sparkles.js";
import { t as Upload } from "../../../../chunks/upload.js";
import { t as Video } from "../../../../chunks/video.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
//#region src/routes/(creator)/creator/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let creatorStats = {
			totalContent: 0,
			pendingReview: 0,
			published: 0,
			totalViews: 0,
			monthlyEarnings: 0
		};
		let loading = true;
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<a href="/creator/upload" class="inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 transition-opacity">`);
				Upload($$renderer, { class: "w-3.5 h-3.5" });
				$$renderer.push(`<!----> Upload</a>`);
			}
			PageHeader($$renderer, {
				icon: House,
				title: "Creator Studio",
				subtitle: "Manage your faith-based content and reach believers worldwide.",
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">`);
		KpiCard($$renderer, {
			label: "Total Content",
			value: creatorStats.totalContent,
			icon: Video,
			accent: "blue",
			href: "/creator/content",
			loading,
			index: 0
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Pending",
			value: creatorStats.pendingReview,
			icon: Clock,
			accent: "yellow",
			href: "/creator/content?status=pending",
			loading,
			index: 1
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Published",
			value: creatorStats.published,
			icon: Circle_check,
			accent: "green",
			href: "/creator/content?status=published",
			loading,
			index: 2
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Views",
			value: creatorStats.totalViews.toLocaleString(),
			icon: Eye,
			accent: "purple",
			href: "/creator/analytics",
			loading,
			index: 3
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "This Month",
			value: `$${creatorStats.monthlyEarnings.toFixed(2)}`,
			icon: Dollar_sign,
			accent: "orange",
			href: "/creator/earnings",
			loading,
			index: 4
		});
		$$renderer.push(`<!----></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-3"><section class="lg:col-span-2 surface-1 rounded-xl p-5"><header class="flex items-center justify-between mb-4"><div class="flex items-center gap-2">`);
		Sparkles($$renderer, { class: "w-4 h-4 text-primary" });
		$$renderer.push(`<!----> <h2 class="text-sm font-semibold text-foreground">Recent activity</h2></div> <a href="/creator/content" class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">All content `);
		Arrow_up_right($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----></a></header> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(Array(3));
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				each_array[i];
				$$renderer.push(`<div class="surface-2 rounded h-12 animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></section> <section class="space-y-3"><a href="/creator/upload" class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex items-center gap-3 group"><div class="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0">`);
		Upload($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----></div> <div class="min-w-0"><div class="text-sm font-medium text-foreground">Upload new content</div> <div class="text-xs text-muted-foreground truncate">Share your ministry with the world</div></div> `);
		Arrow_up_right($$renderer, { class: "w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" });
		$$renderer.push(`<!----></a> <a href="/creator/analytics" class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex items-center gap-3 group"><div class="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0">`);
		Chart_column($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----></div> <div class="min-w-0"><div class="text-sm font-medium text-foreground">View analytics</div> <div class="text-xs text-muted-foreground truncate">Track your impact and growth</div></div> `);
		Arrow_up_right($$renderer, { class: "w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" });
		$$renderer.push(`<!----></a> <a href="/creator/inbox" class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex items-center gap-3 group"><div class="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0">`);
		Message_square($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----></div> <div class="min-w-0"><div class="text-sm font-medium text-foreground">Inbox</div> <div class="text-xs text-muted-foreground truncate">Notes from admin team</div></div> `);
		Arrow_up_right($$renderer, { class: "w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" });
		$$renderer.push(`<!----></a></section></div></div>`);
	});
}
//#endregion
export { _page as default };
