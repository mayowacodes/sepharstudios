import { af as onDestroy, i as attr, b as ensure_array_like, x as attr_class, f as derived, q as escape_html, s as spread_props, v as stringify } from './index.js-DwRgOKlO.js';
import { I as Icon } from './Icon-C7ASqKku.js';
import { P as PortalKpi } from './PortalKpi-DuR9asVZ.js';
import { C as Circle_check } from './circle-check-BowncvVB.js';
import { C as Clock } from './clock-Dg8sFht_.js';
import { R as Refresh_cw } from './refresh-cw-C755jTrD.js';
import { T as Triangle_alert } from './triangle-alert-Cvtknftj.js';
import { X } from './x-rv9H-xuH.js';
import { S as Skeleton } from './skeleton-DrNJG5oW.js';
import { P as PortalHero } from './PortalHero-cuWNLrHh.js';
import { P as PortalButton } from './PortalButton-LeMsb0Fy.js';
import { P as PortalEmptyState } from './PortalEmptyState-BsWmddDC.js';
import { S as Search } from './search-C-Rkbc9g.js';
import './utils2-DHW1aw82.js';

//#region src/lib/components/portal/PortalDataTable.svelte
function PortalDataTable($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Portal data table — the list/queue pattern for admin + creator
		* portals. Two main affordances over a plain grid:
		*
		*   1. Command bar — debounced search input plus filter dropdown
		*      slot. Press `/` to focus the search from anywhere on the page.
		*
		*   2. Side panel — clicking a row slides a 480px panel in from the
		*      right with that row's detail content. Doesn't navigate, so
		*      reviewers can flip through items quickly. Esc / click-outside
		*      closes.
		*
		* v1 renders all rows directly — virtualization is a follow-up.
		* Even uncached tables of a few hundred rows still scroll fine.
		*/
		let { items, searchPlaceholder = "Search…", row, detail, filters, bulkActions, empty} = $$props;
		let query = "";
		let selectedId = null;
		const selected = derived(() => items.find((i) => i.id === selectedId) ?? null);
		const filtered = derived(() => (items));
		function onKeyDown(e) {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
			if (e.key === "/") e.preventDefault();
			if (e.key === "Escape" && selectedId) ;
		}
		onDestroy(() => document.removeEventListener("keydown", onKeyDown));
		$$renderer.push(`<div class="space-y-4"><div class="sticky top-0 z-10 -mx-4 px-4 py-3 backdrop-blur-md" style="background: hsl(var(--portal-bg-base)/0.85);"><div class="flex items-center gap-3"><div class="relative flex-1">`);
		Search($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--portal-text-muted))]" });
		$$renderer.push(`<!----> <input${attr("value", query)} type="text"${attr("placeholder", searchPlaceholder)} class="w-full pl-10 pr-10 py-2 rounded-lg text-sm bg-[hsl(var(--portal-bg-elevated)/0.6)] border border-[hsl(var(--portal-border)/0.5)] text-[hsl(var(--portal-text))] placeholder:text-[hsl(var(--portal-text-muted))] focus:outline-none focus:border-[hsl(var(--portal-accent))] focus:ring-2 focus:ring-[hsl(var(--portal-accent)/0.25)] transition-colors"/> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<kbd class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded text-[hsl(var(--portal-text-muted))] bg-[hsl(var(--portal-bg-base)/0.6)] border border-[hsl(var(--portal-border)/0.5)]" aria-hidden="true">/</kbd>`);
		$$renderer.push(`<!--]--></div> `);
		if (filters) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-2">`);
			filters($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (bulkActions) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mt-2 flex items-center gap-2">`);
			bulkActions($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (filtered().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="py-12 text-center text-sm text-[hsl(var(--portal-text-muted))]">`);
			if (empty) {
				$$renderer.push("<!--[0-->");
				empty($$renderer);
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`No results.`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<ul class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(filtered());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<li><button type="button"${attr_class("w-full text-left rounded-xl border border-[hsl(var(--portal-border)/0.5)] bg-[hsl(var(--portal-bg-card)/0.6)] backdrop-blur-md p-4 transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 hover:border-[hsl(var(--portal-accent)/0.5)] hover:shadow-(--portal-accent-glow) focus:outline-none focus:border-[hsl(var(--portal-accent))] focus:ring-2 focus:ring-[hsl(var(--portal-accent)/0.25)] svelte-yoem8d", void 0, { "active-row": selectedId === item.id })}>`);
				row($$renderer, item);
				$$renderer.push(`<!----></button></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (selected()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm portal-fade-up"></div> <aside class="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-120 overflow-y-auto border-l border-[hsl(var(--portal-border))] shadow-2xl" style="background: hsl(var(--portal-bg-elevated));" role="dialog" aria-modal="true"><button type="button" class="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-lg text-[hsl(var(--portal-text-muted))] hover:text-[hsl(var(--portal-text))] hover:bg-[hsl(var(--portal-bg-card))] transition-colors" aria-label="Close detail panel">`);
			X($$renderer, { class: "w-5 h-5" });
			$$renderer.push(`<!----></button> <div class="p-6">`);
			detail($$renderer, selected());
			$$renderer.push(`<!----></div></aside>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

//#region ../../node_modules/.bun/@lucide+svelte@1.24.0+5726b9c92ebd8575/node_modules/@lucide/svelte/dist/icons/bot.svelte
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
		let loading = true;
		let filter = "all";
		let manualFiring = {};
		const isStale = derived(() => false);
		async function load() {
			loading = true;
			try {
				const params = new URLSearchParams();
				const res = await fetch(`/api/admin/agent-runs?${params}`);
				if (!res.ok) {
					console.error("[ai-runs] load HTTP", res.status);
					runs = [];
					return;
				}
				runs = (await res.json().catch(() => ({}))).runs ?? [];
			} catch (err) {
				console.error("[ai-runs] load failed:", err);
				runs = [];
			} finally {
				loading = false;
			}
		}
		function statusBadge(s) {
			if (s === "completed") return "bg-green-600/30 text-green-200";
			if (s === "failed") return "bg-red-600/30 text-red-200";
			if (s === "killed") return "bg-yellow-600/30 text-yellow-200";
			return "bg-blue-600/30 text-blue-200";
		}
		function duration(start, end) {
			if (!end) return "running…";
			const ms = new Date(end).getTime() - new Date(start).getTime();
			if (ms < 1e3) return `${ms}ms`;
			if (ms < 6e4) return `${Math.round(ms / 1e3)}s`;
			return `${Math.round(ms / 6e4)}m`;
		}
		const stats = derived(() => {
			const last24h = runs.filter((r) => Date.now() - new Date(r.startedAt).getTime() < 864e5);
			return {
				runs24h: last24h.length,
				itemsActioned24h: last24h.reduce((s, r) => s + r.itemsActioned, 0),
				failed24h: last24h.filter((r) => r.status === "failed" || r.status === "killed").length,
				costCents24h: last24h.reduce((s, r) => s + r.costCents, 0)
			};
		});
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "secondary",
					size: "sm",
					onclick: load,
					children: ($$renderer) => {
						Refresh_cw($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push(`<!----> Refresh`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Automation",
				title: "AI runs",
				subtitle: "Autonomous agent history. Toggle AI_AGENTS_ENABLED=true on the server to allow agents to fire.",
				icon: Bot,
				actions});
		}
		$$renderer.push(`<!----> `);
		if (isStale()) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="rounded-xl border border-orange-500/40 bg-orange-500/10 p-4 flex items-start gap-3">`);
			Clock($$renderer, { class: "w-5 h-5 text-orange-300 shrink-0 mt-0.5" });
			$$renderer.push(`<!----> <div class="text-sm text-orange-50 flex-1"><strong class="text-orange-100">No agent runs in the last 24h.</strong> Env var is on but no cron has fired. Check the schedule for <code class="font-mono text-xs bg-black/30 px-1 py-0.5 rounded">/api/cron/agents/&lt;name></code> or use the Fire-now buttons below to test.</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-2 md:grid-cols-4 gap-3">`);
		PortalKpi($$renderer, {
			label: "Runs (24h)",
			value: stats().runs24h,
			icon: Clock
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "Items actioned",
			value: stats().itemsActioned24h,
			icon: Circle_check
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "Failed/killed",
			value: stats().failed24h,
			icon: Triangle_alert
		});
		$$renderer.push(`<!----> `);
		PortalKpi($$renderer, {
			label: "AI spend (24h)",
			value: `$${(stats().costCents24h / 100).toFixed(2)}`,
			icon: Bot
		});
		$$renderer.push(`<!----></div> <div><h2 class="text-lg font-semibold text-foreground mb-3">Registered agents</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
		const each_array = ensure_array_like(AGENTS);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let a = each_array[$$index];
			$$renderer.push(`<div class="surface-1 rounded-xl p-4 space-y-2"><div class="flex items-center justify-between gap-2"><div><div class="text-foreground font-medium">${escape_html(a.name)}</div> <div class="text-xs text-muted-foreground uppercase tracking-wide">${escape_html(a.schedule)}</div></div> <button type="button"${attr("disabled", manualFiring[a.name], true)} class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40">${escape_html(manualFiring[a.name] ? "Firing…" : "Fire now")}</button></div> <p class="text-xs text-foreground/80">${escape_html(a.description)}</p></div>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><h2 class="text-lg font-semibold text-foreground mb-3">Run history</h2> `);
		if (loading) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(5));
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				each_array_1[i];
				Skeleton($$renderer, { class: "h-14 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			{
				function filters($$renderer) {
					$$renderer.select({
						value: filter,
						class: "rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2",
						style: "background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
					}, ($$renderer) => {
						$$renderer.option({ value: "all" }, ($$renderer) => {
							$$renderer.push(`All agents`);
						});
						$$renderer.push(`<!--[-->`);
						const each_array_2 = ensure_array_like(AGENTS);
						for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
							let a = each_array_2[$$index_2];
							$$renderer.option({ value: a.name }, ($$renderer) => {
								$$renderer.push(`${escape_html(a.name)}`);
							});
						}
						$$renderer.push(`<!--]-->`);
					});
				}
				function row($$renderer, r) {
					$$renderer.push(`<div class="flex items-center gap-3 text-sm"><span class="font-mono text-[hsl(var(--portal-text))] min-w-0 flex-1 truncate">${escape_html(r.agent)}</span> <span${attr_class(`px-2 py-0.5 rounded text-xs font-medium ${stringify(statusBadge(r.status))}`)}>${escape_html(r.status)}</span> <span class="text-xs text-[hsl(var(--portal-text-muted))] hidden md:inline">${escape_html(duration(r.startedAt, r.finishedAt))}</span> <span class="text-xs text-[hsl(var(--portal-text-muted))] hidden lg:inline">${escape_html(r.itemsProcessed)} processed · ${escape_html(r.itemsActioned)} actioned</span> <span class="text-xs text-[hsl(var(--portal-text-muted))] tabular-nums">$${escape_html((r.costCents / 100).toFixed(2))}</span> `);
					if (r.error) {
						$$renderer.push("<!--[0-->");
						X($$renderer, {
							class: "w-4 h-4 shrink-0",
							style: "color: hsl(var(--portal-danger));"
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				}
				function detail($$renderer, r) {
					$$renderer.push(`<div class="space-y-4"><div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Agent</div> <div class="font-mono text-[hsl(var(--portal-text))]">${escape_html(r.agent)}</div></div> <div class="grid grid-cols-2 gap-3"><div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Status</div> <span${attr_class(`px-2 py-0.5 rounded text-xs font-medium ${stringify(statusBadge(r.status))}`)}>${escape_html(r.status)}</span></div> <div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Duration</div> <div class="text-sm text-[hsl(var(--portal-text))]">${escape_html(duration(r.startedAt, r.finishedAt))}</div></div> <div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Started</div> <div class="text-sm text-[hsl(var(--portal-text))]">${escape_html(new Date(r.startedAt).toLocaleString())}</div></div> <div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Steps</div> <div class="text-sm text-[hsl(var(--portal-text))]">${escape_html(r.steps)}</div></div></div> <div class="grid grid-cols-3 gap-3 pt-2 border-t" style="border-color: hsl(var(--portal-border));"><div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Processed</div> <div class="text-lg font-semibold tabular-nums text-[hsl(var(--portal-text))]">${escape_html(r.itemsProcessed)}</div></div> <div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Actioned</div> <div class="text-lg font-semibold tabular-nums text-[hsl(var(--portal-text))]">${escape_html(r.itemsActioned)}</div></div> <div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Cost</div> <div class="text-lg font-semibold tabular-nums text-[hsl(var(--portal-text))]">$${escape_html((r.costCents / 100).toFixed(2))}</div></div></div> `);
					if (r.summary) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div><div class="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--portal-text-muted))] mb-1">Summary</div> <p class="text-sm text-[hsl(var(--portal-text))] whitespace-pre-wrap">${escape_html(r.summary)}</p></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (r.error) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="rounded-lg p-3 border" style="background: hsl(var(--portal-danger)/0.1); border-color: hsl(var(--portal-danger)/0.35); color: hsl(var(--portal-danger));"><div class="text-[10px] uppercase tracking-widest font-semibold mb-1 opacity-80">Error</div> <p class="text-xs font-mono whitespace-pre-wrap">${escape_html(r.error)}</p></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				}
				function empty($$renderer) {
					PortalEmptyState($$renderer, {
						icon: Bot,
						title: "No runs yet",
						description: "Set AI_AGENTS_ENABLED=true + add cron entries to start populating this table."
					});
				}
				PortalDataTable($$renderer, {
					items: runs,
					searchPlaceholder: "Search by agent name…",
					filters,
					row,
					detail,
					empty});
			}
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DO2ksU36.js.map
