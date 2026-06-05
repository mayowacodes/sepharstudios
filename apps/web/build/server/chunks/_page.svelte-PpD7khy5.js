import { as as ensure_array_like, au as escape_html, ah as attr, ap as derived, aO as spread_props } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import { K as KpiCard } from './KpiCard-p3Xq44Ey.js';
import { C as Circle_check } from './circle-check-Dew2U4ec.js';
import { C as Clock } from './clock-DYMPyb02.js';
import { R as Refresh_cw } from './refresh-cw-BOgTab-0.js';
import { T as Triangle_alert } from './triangle-alert-Cv6gABx4.js';
import { S as Skeleton } from './skeleton-DCiPgxrC.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-BaRxD-PE.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/bot.svelte
function Bot($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "bot" },
		props,
		{ iconNode: [
			["path", { "d": "M12 8V4H8" }],
			["rect", {
				"width": "16",
				"height": "12",
				"x": "4",
				"y": "8",
				"rx": "2"
			}],
			["path", { "d": "M2 14h2" }],
			["path", { "d": "M20 14h2" }],
			["path", { "d": "M15 13v2" }],
			["path", { "d": "M9 13v2" }]
		] }
	]));
}
//#endregion
//#region src/routes/(admin)/admin/ai-runs/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const AGENTS = [
			{
				name: "abuse-triage",
				schedule: "daily",
				description: "Triages open abuse reports, auto-dismisses obvious spam."
			},
			{
				name: "anomaly-watch",
				schedule: "hourly",
				description: "Watches platform metrics for spikes + failures."
			},
			{
				name: "content-quality-auditor",
				schedule: "quarterly",
				description: "Drafts coaching notes for underperforming creators."
			},
			{
				name: "theology-monitor",
				schedule: "daily",
				description: "Re-evaluates recent content against the belief statement."
			}
		];
		let runs = [];
		let filter = "all";
		let manualFiring = {};
		const stats = derived(() => {
			const last24h = runs.filter((r) => Date.now() - new Date(r.startedAt).getTime() < 864e5);
			return {
				runs24h: last24h.length,
				itemsActioned24h: last24h.reduce((s, r) => s + r.itemsActioned, 0),
				failed24h: last24h.filter((r) => r.status === "failed" || r.status === "killed").length,
				costCents24h: last24h.reduce((s, r) => s + r.costCents, 0)
			};
		});
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-6xl space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<button type="button" class="px-3 py-1.5 rounded surface-2 text-foreground text-xs inline-flex items-center gap-1">`);
				Refresh_cw($$renderer, { class: "w-3.5 h-3.5" });
				$$renderer.push(`<!----> Refresh</button>`);
			}
			PageHeader($$renderer, {
				icon: Bot,
				title: "AI runs",
				subtitle: "Autonomous agent history. Toggle AI_AGENTS_ENABLED=true on the server to allow agents to fire.",
				actions});
		}
		$$renderer.push(`<!----> <div class="grid grid-cols-2 md:grid-cols-4 gap-3">`);
		KpiCard($$renderer, {
			label: "Runs (24h)",
			value: stats().runs24h,
			icon: Clock,
			accent: "blue",
			variant: "compact",
			index: 0
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Items actioned",
			value: stats().itemsActioned24h,
			icon: Circle_check,
			accent: "green",
			variant: "compact",
			index: 1
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "Failed/killed",
			value: stats().failed24h,
			icon: Triangle_alert,
			accent: "red",
			variant: "compact",
			index: 2
		});
		$$renderer.push(`<!----> `);
		KpiCard($$renderer, {
			label: "AI spend (24h)",
			value: `$${(stats().costCents24h / 100).toFixed(2)}`,
			icon: Bot,
			accent: "purple",
			variant: "compact",
			index: 3
		});
		$$renderer.push(`<!----></div> <div><h2 class="text-lg font-semibold text-foreground mb-3">Registered agents</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
		const each_array = ensure_array_like(AGENTS);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let a = each_array[$$index];
			$$renderer.push(`<div class="surface-1 rounded-xl p-4 space-y-2"><div class="flex items-center justify-between gap-2"><div><div class="text-foreground font-medium">${escape_html(a.name)}</div> <div class="text-xs text-muted-foreground uppercase tracking-wide">${escape_html(a.schedule)}</div></div> <button type="button"${attr("disabled", manualFiring[a.name], true)} class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40">${escape_html(manualFiring[a.name] ? "Firing…" : "Fire now")}</button></div> <p class="text-xs text-foreground/80">${escape_html(a.description)}</p></div>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><div class="flex items-center justify-between mb-3"><h2 class="text-lg font-semibold text-foreground">Run history</h2> `);
		$$renderer.select({
			value: filter,
			class: "surface-2 rounded-lg px-3 py-1.5 text-sm text-foreground"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All agents`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(AGENTS);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let a = each_array_1[$$index_1];
				$$renderer.option({ value: a.name }, ($$renderer) => {
					$$renderer.push(`${escape_html(a.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_2 = ensure_array_like(Array(5));
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				each_array_2[$$index_2];
				Skeleton($$renderer, { class: "h-14 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-PpD7khy5.js.map
