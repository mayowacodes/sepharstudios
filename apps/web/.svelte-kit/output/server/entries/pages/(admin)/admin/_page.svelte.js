import { Lt as attr, wt as ensure_array_like, zt as escape_html } from "../../../../chunks/ui-libs.js";
import { n as Arrow_up_right, t as KpiCard } from "../../../../chunks/KpiCard.js";
import { t as Banknote } from "../../../../chunks/banknote.js";
import { t as Circle_check } from "../../../../chunks/circle-check.js";
import { t as Circle_x } from "../../../../chunks/circle-x.js";
import { t as Clock } from "../../../../chunks/clock.js";
import { t as Coins } from "../../../../chunks/coins.js";
import { t as Eye } from "../../../../chunks/eye.js";
import { t as File_check } from "../../../../chunks/file-check.js";
import { t as Message_square } from "../../../../chunks/message-square.js";
import { t as Shield_check } from "../../../../chunks/shield-check.js";
import { t as Sparkles } from "../../../../chunks/sparkles.js";
import { t as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { t as Users } from "../../../../chunks/users.js";
import { t as Video } from "../../../../chunks/video.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
//#region src/routes/(admin)/admin/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let adminStats = {
			pendingReviews: 0,
			totalCreators: 0,
			publishedContent: 0,
			rejectedContent: 0,
			totalViews: 0,
			pendingApplications: 0,
			approvedApplications7d: 0,
			approvedApplications30d: 0,
			avgApprovalHours: 0
		};
		const quickActions = [
			{
				href: "/admin/review",
				label: "Review Queue",
				icon: Shield_check,
				accent: "yellow"
			},
			{
				href: "/admin/content",
				label: "Content",
				icon: Video,
				accent: "blue"
			},
			{
				href: "/admin/creators",
				label: "Creators",
				icon: Users,
				accent: "green"
			},
			{
				href: "/admin/payouts",
				label: "Payouts",
				icon: Banknote,
				accent: "orange"
			},
			{
				href: "/admin/tokenomics",
				label: "Tokenomics",
				icon: Coins,
				accent: "amber"
			},
			{
				href: "/admin/communications",
				label: "Messages",
				icon: Message_square,
				accent: "cyan"
			}
		];
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<a href="/admin/ai-runs" class="hidden md:inline-flex items-center gap-1.5 text-xs surface-1 hover:surface-2 rounded-full px-3 py-1.5 text-foreground transition-colors">`);
				Sparkles($$renderer, { class: "w-3.5 h-3.5" });
				$$renderer.push(`<!----> AI Runs</a>`);
			}
			PageHeader($$renderer, {
				icon: Shield_check,
				title: "Admin",
				subtitle: "Platform overview, content review, creator community.",
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">`);
		KpiCard($$renderer, {
			label: "Pending Reviews",
			value: adminStats.pendingReviews,
			icon: Clock,
			accent: "yellow",
			href: "/admin/review",
			index: 0
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Active Creators",
			value: adminStats.totalCreators,
			icon: Users,
			accent: "blue",
			href: "/admin/creators",
			index: 1
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Published",
			value: adminStats.publishedContent,
			icon: Circle_check,
			accent: "green",
			href: "/admin/content?status=approved",
			index: 2
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Rejected",
			value: adminStats.rejectedContent,
			icon: Circle_x,
			accent: "red",
			href: "/admin/content?status=rejected",
			index: 3
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Platform Views",
			value: adminStats.totalViews.toLocaleString(),
			icon: Eye,
			accent: "purple",
			href: "/admin/analytics",
			index: 4
		});
		$$renderer.push(`<!----></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-3"><section class="lg:col-span-2 surface-1 rounded-xl p-5"><header class="flex items-center justify-between mb-4"><div class="flex items-center gap-2">`);
		Triangle_alert($$renderer, { class: "w-4 h-4 text-yellow-500" });
		$$renderer.push(`<!----> <h2 class="text-sm font-semibold text-foreground">Urgent reviews</h2></div> <a href="/admin/review" class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">Open queue `);
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
		$$renderer.push(`<!--]--></section> <section class="surface-1 rounded-xl p-5 space-y-4"><header class="flex items-center justify-between"><div class="flex items-center gap-2">`);
		File_check($$renderer, { class: "w-4 h-4 text-blue-500" });
		$$renderer.push(`<!----> <h2 class="text-sm font-semibold text-foreground">Creator applications</h2></div> <a href="/admin/creator-applications" class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">Review `);
		Arrow_up_right($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----></a></header> <div class="space-y-3"><div><div class="text-3xl font-semibold text-foreground tabular-nums">${escape_html(adminStats.pendingApplications)}</div> <div class="text-xs text-muted-foreground">pending</div></div> <div class="grid grid-cols-2 gap-2 text-xs"><div class="surface-2 rounded-md px-2 py-1.5"><div class="text-foreground font-medium tabular-nums">${escape_html(adminStats.approvedApplications7d)}</div> <div class="text-muted-foreground">approved · 7d</div></div> <div class="surface-2 rounded-md px-2 py-1.5"><div class="text-foreground font-medium tabular-nums">${escape_html(Number.isFinite(adminStats.avgApprovalHours) ? adminStats.avgApprovalHours.toFixed(1) : "0.0")}h</div> <div class="text-muted-foreground">avg approval</div></div></div></div></section></div> <section><h2 class="text-xs uppercase tracking-wide text-muted-foreground mb-2 px-1">Quick actions</h2> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2"><!--[-->`);
		const each_array_2 = ensure_array_like(quickActions);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let a = each_array_2[$$index_2];
			const Icon = a.icon;
			$$renderer.push(`<a${attr("href", a.href)} class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex flex-col items-start gap-2 group">`);
			if (Icon) {
				$$renderer.push("<!--[-->");
				Icon($$renderer, { class: "w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" });
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` <span class="text-sm font-medium text-foreground">${escape_html(a.label)}</span></a>`);
		}
		$$renderer.push(`<!--]--></div></section></div>`);
	});
}
//#endregion
export { _page as default };
