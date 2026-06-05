import { aJ as onDestroy, as as ensure_array_like, ai as attr_class, au as escape_html, ah as attr, aR as stringify, aj as attr_style } from './ui-libs-BjzLDLAh.js';
import { A as Activity } from './activity-kAZcBtwB.js';
import { R as Refresh_cw } from './refresh-cw-BOgTab-0.js';
import { X } from './x-CQt15sbx.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';

//#region src/routes/(admin)/admin/system-health/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let jobs = [];
		let jobStatus = "failed";
		onDestroy(() => {});
		function statusBadge(s) {
			if (s === "ready") return "bg-green-600/30 text-green-200";
			if (s === "failed") return "bg-red-600/30 text-red-200";
			if (s === "cancelled") return "bg-gray-600/30 text-foreground/80";
			return "bg-yellow-600/30 text-yellow-200";
		}
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-6xl space-y-8">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<button type="button" class="px-3 py-1.5 rounded surface-2 text-foreground text-xs inline-flex items-center gap-1">`);
				Refresh_cw($$renderer, { class: "w-3.5 h-3.5" });
				$$renderer.push(`<!----> Refresh now</button>`);
			}
			PageHeader($$renderer, {
				icon: Activity,
				title: "System health",
				subtitle: "Live monitor of infrastructure + encoder jobs.",
				actions});
		}
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="text-center text-muted-foreground py-12">Checking…</div>`);
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
		if (jobs.length === 0) {
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

export { _page as default };
//# sourceMappingURL=_page.svelte-B1qBR4wh.js.map
