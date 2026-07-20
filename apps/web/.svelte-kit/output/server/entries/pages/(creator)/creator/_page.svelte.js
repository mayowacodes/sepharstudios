import { Ct as attr_style, Et as derived, Ht as attr, Ot as ensure_array_like, Pt as stringify, St as attr_class, Wt as escape_html, jt as spread_props, vt as onDestroy } from "../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as PortalKpi } from "../../../../chunks/PortalKpi.js";
import { t as Arrow_up_right } from "../../../../chunks/arrow-up-right.js";
import { t as Bell } from "../../../../chunks/bell.js";
import { t as Chart_column } from "../../../../chunks/chart-column.js";
import { t as Circle_check } from "../../../../chunks/circle-check.js";
import { t as Clock } from "../../../../chunks/clock.js";
import { t as Dollar_sign } from "../../../../chunks/dollar-sign.js";
import { t as Eye } from "../../../../chunks/eye.js";
import { t as Film } from "../../../../chunks/film.js";
import { t as Message_square } from "../../../../chunks/message-square.js";
import { t as Sparkles } from "../../../../chunks/sparkles.js";
import { t as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { t as Upload } from "../../../../chunks/upload.js";
import { t as Video } from "../../../../chunks/video.js";
import { t as page } from "../../../../chunks/state.js";
import { t as PortalHero } from "../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../chunks/PortalButton.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/wand-sparkles.svelte
function Wand_sparkles($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "wand-sparkles" },
		props,
		{ iconNode: [
			["path", { "d": "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" }],
			["path", { "d": "m14 7 3 3" }],
			["path", { "d": "M5 6v4" }],
			["path", { "d": "M19 14v4" }],
			["path", { "d": "M10 2v2" }],
			["path", { "d": "M7 8H3" }],
			["path", { "d": "M21 16h-4" }],
			["path", { "d": "M11 3H9" }]
		] }
	]));
}
//#endregion
//#region src/routes/(creator)/creator/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		let inFlightEncodes = [];
		let creatorStats = {
			totalContent: 0,
			pendingReview: 0,
			published: 0,
			totalViews: 0,
			monthlyEarnings: 0
		};
		let evtSource = null;
		onDestroy(() => {
			evtSource?.close();
			evtSource = null;
		});
		const firstName = derived(() => {
			return (page.data?.user?.name ?? "").trim().split(/\s+/)[0] ?? "there";
		});
		let greeting = "Welcome back";
		$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					href: "/creator/upload",
					variant: "primary",
					size: "md",
					children: ($$renderer) => {
						Upload($$renderer, { class: "w-4 h-4" });
						$$renderer.push(`<!----> New upload`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				eyebrow: "Creator Studio",
				title: `${greeting}, ${firstName()}.`,
				subtitle: "Your space for crafting faith-inspiring stories. Upload, schedule, and watch the impact unfold.",
				icon: Wand_sparkles,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">`);
		PortalKpi($$renderer, {
			label: "Total Content",
			value: creatorStats.totalContent,
			icon: Video,
			href: "/creator/content"
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "Pending",
			value: creatorStats.pendingReview,
			icon: Clock,
			href: "/creator/content?status=pending"
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "Published",
			value: creatorStats.published,
			icon: Circle_check,
			href: "/creator/content?status=published"
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "Views",
			value: creatorStats.totalViews,
			icon: Eye,
			href: "/creator/analytics"
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "This Month",
			value: `$${creatorStats.monthlyEarnings.toFixed(2)}`,
			icon: Dollar_sign,
			href: "/creator/earnings"
		});
		$$renderer.push(`<!----></div> `);
		if (inFlightEncodes.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="surface-1 rounded-xl p-5"><header class="flex items-center justify-between mb-4"><div class="flex items-center gap-2">`);
			Film($$renderer, { class: "w-4 h-4 text-primary" });
			$$renderer.push(`<!----> <h2 class="text-sm font-semibold text-foreground">Encoding in progress <span class="ml-1 text-xs text-muted-foreground">(${escape_html(inFlightEncodes.length)})</span></h2></div> <a href="/creator/upload" class="inline-flex items-center gap-1 text-xs text-primary hover:underline">Start a new upload `);
			Arrow_up_right($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!----></a></header> <ul class="space-y-3"><!--[-->`);
			const each_array = ensure_array_like(inFlightEncodes);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let enc = each_array[$$index];
				const isFailed = enc.processingStatus === "failed";
				const pct = Math.max(0, Math.min(100, enc.processingProgress ?? 0));
				$$renderer.push(`<li class="flex items-center gap-3">`);
				if (enc.thumbnail) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", enc.thumbnail)} alt="" class="w-12 h-8 rounded object-cover shrink-0"/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="w-12 h-8 rounded surface-2 shrink-0"></div>`);
				}
				$$renderer.push(`<!--]--> <div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2 mb-1"><div class="text-sm text-foreground truncate">${escape_html(enc.title)}</div> <div${attr_class(`text-xs font-mono shrink-0 ${isFailed ? "text-red-300" : "text-muted-foreground"}`)}>${escape_html(isFailed ? "failed" : `${pct}%`)}</div></div> `);
				if (!isFailed) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="h-1.5 rounded-full bg-muted overflow-hidden"><div class="h-full bg-primary transition-all duration-500"${attr_style(`width: ${stringify(pct)}%`)}></div></div> <div class="mt-1 text-[10px] text-muted-foreground">${escape_html(enc.processingStage ?? enc.processingStatus ?? "queued")}</div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="text-xs text-red-300 inline-flex items-center gap-1">`);
					Triangle_alert($$renderer, { class: "w-3 h-3" });
					$$renderer.push(`<!----> ${escape_html(enc.processingError ? enc.processingError.slice(0, 80) : "See admin to retry")}</div>`);
				}
				$$renderer.push(`<!--]--></div> <a${attr("href", `/creator/content/${enc.id}`)} class="text-xs text-muted-foreground hover:text-foreground shrink-0" aria-label="Open content details">Details →</a></li>`);
			}
			$$renderer.push(`<!--]--></ul></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-1 lg:grid-cols-3 gap-3"><section class="lg:col-span-2 surface-1 rounded-xl p-5"><header class="flex items-center justify-between mb-4"><div class="flex items-center gap-2">`);
		Sparkles($$renderer, { class: "w-4 h-4 text-primary" });
		$$renderer.push(`<!----> <h2 class="text-sm font-semibold text-foreground">Recent activity</h2></div> <a href="/creator/content" class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">All content `);
		Arrow_up_right($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----></a></header> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(3));
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				each_array_1[i];
				$$renderer.push(`<div class="surface-2 rounded h-12 animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></section> <section class="space-y-3"><a href="/creator/upload" class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex items-center gap-3 group"><div class="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0">`);
		Upload($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----></div> <div class="min-w-0"><div class="text-sm font-medium text-foreground">Upload new content</div> <div class="text-xs text-muted-foreground truncate">Share your ministry with the world</div></div> `);
		Arrow_up_right($$renderer, { class: "w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" });
		$$renderer.push(`<!----></a> <a href="/creator/upload?cs=1" class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex items-center gap-3 group"><div class="w-9 h-9 rounded-md bg-[#FF5E0E]/15 text-[#FF5E0E] flex items-center justify-center shrink-0">`);
		Bell($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----></div> <div class="min-w-0"><div class="text-sm font-medium text-foreground">Schedule a Coming Soon release</div> <div class="text-xs text-muted-foreground truncate">Build anticipation — viewers can tap "Notify me"</div></div> `);
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
