import { Ct as attr_style, Ht as attr, Ot as ensure_array_like, Wt as escape_html, vt as onDestroy } from "../../../../../chunks/ui-libs.js";
import "../../../../../chunks/Icon.js";
import "../../../../../chunks/KpiCard.js";
import { t as Chart_column } from "../../../../../chunks/chart-column.js";
import "../../../../../chunks/clock.js";
import "../../../../../chunks/eye.js";
import "../../../../../chunks/heart.js";
import { t as Radio } from "../../../../../chunks/radio.js";
import "../../../../../chunks/target.js";
import { t as Skeleton } from "../../../../../chunks/skeleton.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import "../../../../../chunks/PortalEmptyState.js";
import "../../../../../chunks/TrendChart.js";
//#endregion
//#region src/routes/(creator)/creator/analytics/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let selectedPeriod = "30d";
		let aiLoading = false;
		let liveEvents = [];
		let evtSource = null;
		let refreshTimer = null;
		onDestroy(() => {
			evtSource?.close();
			evtSource = null;
			if (refreshTimer) {
				clearInterval(refreshTimer);
				refreshTimer = null;
			}
		});
		function relativeTime(iso) {
			const diff = Date.now() - new Date(iso).getTime();
			if (diff < 1e4) return "just now";
			if (diff < 6e4) return `${Math.floor(diff / 1e3)}s ago`;
			if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
			return new Date(iso).toLocaleTimeString();
		}
		$$renderer.push(`<div class="space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.select({
					value: selectedPeriod,
					class: "px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2",
					style: "background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
				}, ($$renderer) => {
					$$renderer.option({ value: "7d" }, ($$renderer) => {
						$$renderer.push(`Last 7 days`);
					});
					$$renderer.option({ value: "30d" }, ($$renderer) => {
						$$renderer.push(`Last 30 days`);
					});
					$$renderer.option({ value: "90d" }, ($$renderer) => {
						$$renderer.push(`Last 90 days`);
					});
					$$renderer.option({ value: "1y" }, ($$renderer) => {
						$$renderer.push(`Last year`);
					});
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Insights",
				title: "Your audience pulse",
				subtitle: "Watch time, completions, and what's resonating right now.",
				icon: Chart_column,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> `);
		if (liveEvents.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="relative rounded-2xl p-5 portal-fade-up backdrop-blur-md overflow-hidden" style="background: hsl(var(--portal-bg-card)/0.7); border: 1px solid hsl(var(--portal-accent)/0.35); box-shadow: var(--portal-accent-glow);"><div aria-hidden="true" class="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30 blur-3xl" style="background: radial-gradient(circle, hsl(var(--portal-accent)/0.7) 0%, transparent 70%);"></div> <div class="relative flex items-center gap-2 mb-3">`);
			Radio($$renderer, {
				class: "w-4 h-4 portal-pulse-dot",
				style: "color: hsl(var(--portal-accent))"
			});
			$$renderer.push(`<!----> <h2 class="text-sm font-semibold" style="color: hsl(var(--portal-text))">Live now</h2> <span class="text-xs" style="color: hsl(var(--portal-text-muted))">— ${escape_html(liveEvents.length)} recent ${escape_html(liveEvents.length === 1 ? "event" : "events")}</span></div> <ul class="relative space-y-1.5 max-h-48 overflow-y-auto"><!--[-->`);
			const each_array = ensure_array_like(liveEvents);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let ev = each_array[$$index];
				$$renderer.push(`<li class="flex items-center gap-2 text-xs"><span class="inline-block w-1.5 h-1.5 rounded-full shrink-0"${attr_style("", { "background-color": ev.kind === "watch_complete" ? "hsl(var(--portal-success))" : "hsl(var(--portal-accent))" })}></span> <span class="truncate flex-1" style="color: hsl(var(--portal-text))">${escape_html(ev.kind === "watch_complete" ? "Completed" : "Started watching")}: ${escape_html(ev.title)}</span> <span class="shrink-0" style="color: hsl(var(--portal-text-muted))">${escape_html(relativeTime(ev.at))}</span></li>`);
			}
			$$renderer.push(`<!--]--></ul></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6"><div class="flex items-start justify-between gap-4 mb-4"><div><div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1"><span>✨</span> AI Insights</div> <h2 class="text-xl font-bold text-foreground">What your data is telling us</h2></div> <button type="button"${attr("disabled", aiLoading, true)} class="text-xs text-purple-200 hover:text-foreground border border-purple-500/40 hover:border-purple-400 rounded-md px-3 py-1.5 transition-colors disabled:opacity-40">${escape_html("Refresh")}</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
			const each_array_5 = ensure_array_like(Array(4));
			for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
				each_array_5[i];
				Skeleton($$renderer, { class: "h-28 rounded-xl" });
			}
			$$renderer.push(`<!--]--></div> `);
			Skeleton($$renderer, { class: "h-64 rounded-xl" });
			$$renderer.push(`<!---->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
