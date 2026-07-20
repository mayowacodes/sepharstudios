import { Ct as attr_style, Ht as attr, Ot as ensure_array_like, Pt as stringify, St as attr_class, Wt as escape_html, vt as onDestroy } from "../../../../../chunks/ui-libs.js";
import { t as Activity } from "../../../../../chunks/activity.js";
import "../../../../../chunks/KpiCard.js";
import { t as Circle_check } from "../../../../../chunks/circle-check.js";
import { t as Refresh_cw } from "../../../../../chunks/refresh-cw.js";
import { t as Triangle_alert } from "../../../../../chunks/triangle-alert.js";
import { t as X } from "../../../../../chunks/x.js";
import "../../../../../chunks/skeleton.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../chunks/PortalButton.js";
//#region src/routes/(admin)/admin/system-health/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let health = null;
		let jobs = [];
		let jobStatus = "failed";
		let loadingHealth = true;
		let loadingJobs = true;
		let lastRefresh = null;
		async function loadHealth() {
			loadingHealth = true;
			try {
				const res = await fetch("/api/health");
				if (!res.ok) {
					console.error("[system-health] /api/health HTTP", res.status);
					return;
				}
				const body = await res.json().catch(() => null);
				if (body) health = body;
				lastRefresh = /* @__PURE__ */ new Date();
			} catch (err) {
				console.error("[system-health] loadHealth failed:", err);
			} finally {
				loadingHealth = false;
			}
		}
		async function loadJobs() {
			loadingJobs = true;
			try {
				const params = new URLSearchParams();
				params.set("status", jobStatus);
				const res = await fetch(`/api/admin/encoder/jobs?${params}`);
				if (!res.ok) {
					console.error("[system-health] /api/admin/encoder/jobs HTTP", res.status);
					jobs = [];
					return;
				}
				jobs = (await res.json().catch(() => ({}))).jobs ?? [];
			} catch (err) {
				console.error("[system-health] loadJobs failed:", err);
				jobs = [];
			} finally {
				loadingJobs = false;
			}
		}
		onDestroy(() => {});
		function checkCardClass(result) {
			if (result.error === "not_configured") return "surface-1 border-border/40";
			if (result.ok) return "bg-green-600/15 border-green-600/30";
			return "bg-red-600/20 border-red-600/40";
		}
		function statusBadge(s) {
			if (s === "ready") return "bg-green-600/30 text-green-200";
			if (s === "failed") return "bg-red-600/30 text-red-200";
			if (s === "cancelled") return "bg-gray-600/30 text-foreground/80";
			return "bg-yellow-600/30 text-yellow-200";
		}
		function formatUptime(sec) {
			const h = Math.floor(sec / 3600);
			const m = Math.floor(sec % 3600 / 60);
			if (h > 0) return `${h}h ${m}m`;
			return `${m}m`;
		}
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-7xl space-y-8">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "secondary",
					size: "sm",
					onclick: () => {
						loadHealth();
						loadJobs();
					},
					children: ($$renderer) => {
						Refresh_cw($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push(`<!----> Refresh now`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Infrastructure",
				title: "System health",
				subtitle: lastRefresh ? `Last refresh ${lastRefresh.toLocaleTimeString()}` : "Live monitor of infrastructure + encoder jobs.",
				icon: Activity,
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> `);
		if (loadingHealth && !health) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center text-muted-foreground py-12">Checking…</div>`);
		} else if (health) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div><div class="flex items-center gap-3 mb-3"><h2 class="text-lg font-semibold text-foreground">Infrastructure</h2> <span${attr_class(`px-2 py-0.5 rounded text-xs uppercase tracking-wide ${health.status === "ok" ? "bg-green-600/30 text-green-200" : "bg-red-600/30 text-red-200"}`)}>${escape_html(health.status)}</span> <span class="text-xs text-muted-foreground">uptime ${escape_html(formatUptime(health.uptimeSec))}</span></div> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"><!--[-->`);
			const each_array = ensure_array_like([
				{
					key: "db",
					label: "PostgreSQL",
					result: health.db
				},
				{
					key: "redis",
					label: "Redis",
					result: health.redis
				},
				{
					key: "minio",
					label: "MinIO",
					result: health.minio
				},
				{
					key: "meili",
					label: "Meilisearch",
					result: health.meili
				},
				{
					key: "orchestrator",
					label: "Orchestrator",
					result: health.orchestrator
				}
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let card = each_array[$$index];
				$$renderer.push(`<div${attr_class(`border rounded-xl p-4 ${stringify(checkCardClass(card.result))}`)}><div class="flex items-start justify-between"><span class="text-sm font-medium text-foreground">${escape_html(card.label)}</span> `);
				if (card.result.error === "not_configured") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-xs text-muted-foreground">—</span>`);
				} else if (card.result.ok) {
					$$renderer.push("<!--[1-->");
					Circle_check($$renderer, { class: "w-4 h-4 text-green-400" });
				} else {
					$$renderer.push("<!--[-1-->");
					Triangle_alert($$renderer, { class: "w-4 h-4 text-red-400" });
				}
				$$renderer.push(`<!--]--></div> <div class="mt-2 text-xs text-foreground/80">`);
				if (card.result.error === "not_configured") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`not configured`);
				} else if (card.result.ok) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`${escape_html(card.result.latencyMs)}ms`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="text-red-300">${escape_html(card.result.error ?? "failed")}</span>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div><div class="flex items-center justify-between gap-4 flex-wrap mb-3"><h2 class="text-lg font-semibold text-foreground">Encoder jobs</h2> <div class="flex gap-1.5"><!--[-->`);
		const each_array_1 = ensure_array_like([
			"all",
			"failed",
			"created",
			"ready",
			"cancelled"
		]);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let s = each_array_1[$$index_1];
			$$renderer.push(`<button type="button"${attr_class(`px-3 py-1 rounded text-xs capitalize ${jobStatus === s ? "bg-purple-600 text-foreground" : "surface-1 text-white/80 hover:surface-2"}`)}>${escape_html(s)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		if (loadingJobs && jobs.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="surface-1 border border-border/40 rounded-xl p-8 text-center text-muted-foreground">Loading…</div>`);
		} else if (jobs.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="surface-1 border border-border/40 rounded-xl p-8 text-center text-muted-foreground">No jobs match this filter.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="surface-1 border border-border/40 rounded-xl overflow-hidden"><table class="w-full text-sm"><thead class="surface-1"><tr class="text-left text-xs uppercase tracking-wide text-muted-foreground"><th class="px-4 py-3">Content</th><th class="px-4 py-3">Creator</th><th class="px-4 py-3">Job ID</th><th class="px-4 py-3">Status</th><th class="px-4 py-3">Progress</th><th class="px-4 py-3">Updated</th><th class="px-4 py-3 text-right">Actions</th></tr></thead><tbody><!--[-->`);
			const each_array_2 = ensure_array_like(jobs);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let j = each_array_2[$$index_2];
				$$renderer.push(`<tr class="border-t border-white/5 hover:surface-1"><td class="px-4 py-3 text-foreground"><a${attr("href", `/admin/content`)} class="hover:text-purple-300">${escape_html(j.title)}</a> `);
				if (j.processingError) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="text-xs text-red-300 mt-0.5 max-w-md truncate">${escape_html(j.processingError)}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></td><td class="px-4 py-3 text-foreground/80">${escape_html(j.creatorDisplayName ?? j.creatorName ?? "—")}</td><td class="px-4 py-3 font-mono text-xs text-muted-foreground">${escape_html(j.encoderJobId?.slice(0, 12) ?? "—")}</td><td class="px-4 py-3"><span${attr_class(`px-2 py-0.5 rounded text-xs ${stringify(statusBadge(j.processingStatus))}`)}>${escape_html(j.processingStatus ?? "unknown")}</span> `);
				if (j.processingStage) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="text-[10px] text-muted-foreground mt-0.5">${escape_html(j.processingStage)}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></td><td class="px-4 py-3 min-w-32">`);
				if (j.processingProgress !== null && j.processingProgress !== void 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="h-1.5 surface-2 rounded overflow-hidden"><div class="h-full bg-purple-500 transition-all duration-500"${attr_style(`width: ${stringify(Math.max(0, Math.min(100, j.processingProgress)))}%`)}></div></div> <div class="text-[10px] text-muted-foreground mt-0.5">${escape_html(j.processingProgress)}%</div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="text-xs text-muted-foreground">—</span>`);
				}
				$$renderer.push(`<!--]--></td><td class="px-4 py-3 text-xs text-muted-foreground">${escape_html(new Date(j.updatedAt).toLocaleString())}</td><td class="px-4 py-3 text-right"><div class="inline-flex gap-2">`);
				if (j.processingStatus === "failed" || j.processingStatus === "cancelled") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<button type="button" class="px-2.5 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-1">`);
					Refresh_cw($$renderer, { class: "w-3 h-3" });
					$$renderer.push(`<!---->Retry</button>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (j.processingStatus !== "ready" && j.processingStatus !== "cancelled") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<button type="button" class="px-2.5 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-1">`);
					X($$renderer, { class: "w-3 h-3" });
					$$renderer.push(`<!---->Cancel</button>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
