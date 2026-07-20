import { Ct as attr_style, Et as derived, St as attr_class, Wt as escape_html } from "./ui-libs.js";
//#region src/lib/components/portal/PortalEmptyState.svelte
function PortalEmptyState($$renderer, $$props) {
	/**
	* Portal-themed empty state. Drop-in replacement for the older
	* `dashboard/EmptyState.svelte` — same prop shape but uses the
	* `--portal-*` tokens so it tints correctly under both the admin
	* (Mission Control teal) and creator (Cosmic Maker cyan) palettes,
	* and gets the portal-fade-up entrance.
	*
	* Use:
	*   <PortalEmptyState icon={CheckCircle2} title="All caught up" description="No pending reviews." />
	*
	* Action slot mirrors the old API:
	*   <PortalEmptyState icon={Inbox} title="Inbox is empty">
	*     {#snippet action()}
	*       <PortalButton href="…">Compose new</PortalButton>
	*     {/snippet}
	*   </PortalEmptyState>
	*/
	/** Tone — 'default' (subtle), 'success' (positive, accent ring),
	*  'warning' (orange-yellow), 'danger' (warm red). */
	/** Compact variant cuts padding in half — for inline-block lists. */
	let { icon: Icon, title, description, action, tone = "default", compact = false } = $$props;
	const ringColor = derived(() => tone === "success" ? "hsl(var(--portal-success))" : tone === "warning" ? "hsl(45 95% 60%)" : tone === "danger" ? "hsl(var(--portal-danger))" : "hsl(var(--portal-accent))");
	const iconColor = derived(() => tone === "success" ? "hsl(var(--portal-success))" : tone === "warning" ? "hsl(45 95% 70%)" : tone === "danger" ? "hsl(var(--portal-danger))" : "hsl(var(--portal-text-muted))");
	$$renderer.push(`<div${attr_class(`text-center ${compact ? "py-6" : "py-12"} space-y-3 portal-fade-up`, "svelte-1klpdpr")}>`);
	if (Icon) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div${attr_class(`relative inline-flex items-center justify-center ${compact ? "w-12 h-12" : "w-16 h-16"} rounded-full`, "svelte-1klpdpr")}${attr_style(`background: hsl(var(--portal-bg-elevated)/0.7); border: 1px solid ${ringColor() + "/0.35"}; box-shadow: 0 0 32px ${ringColor() + "/0.15"};`)}>`);
		if (Icon) {
			$$renderer.push("<!--[-->");
			Icon($$renderer, {
				class: compact ? "w-5 h-5" : "w-7 h-7",
				style: `color: ${iconColor()};`
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(` <span class="portal-halo-pulse absolute inset-0 rounded-full pointer-events-none svelte-1klpdpr"${attr_style(`--ring: ${ringColor()};`)} aria-hidden="true"></span></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <div class="svelte-1klpdpr"><h3${attr_class(`${compact ? "text-sm" : "text-base"} font-semibold`, "svelte-1klpdpr")} style="color: hsl(var(--portal-text));">${escape_html(title)}</h3> `);
	if (description) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p${attr_class(`${compact ? "text-xs" : "text-sm"} mt-1 max-w-md mx-auto leading-relaxed`, "svelte-1klpdpr")} style="color: hsl(var(--portal-text-muted));">${escape_html(description)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div> `);
	if (action) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="pt-2 inline-flex items-center gap-2 svelte-1klpdpr">`);
		action($$renderer);
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
export { PortalEmptyState as t };
