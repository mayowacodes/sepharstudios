import { St as derived, zt as escape_html } from "./ui-libs.js";
//#region src/lib/components/dashboard/EmptyState.svelte
function EmptyState($$renderer, $$props) {
	/**
	* Standard empty-state for portal pages — replaces the ad-hoc "no
	* results" blocks that mixed emoji icons + huge text + inconsistent
	* spacing across the admin and creator portals.
	*
	* Use:
	*   <EmptyState icon={CheckCircle2} title="All caught up" description="No pending reviews." />
	*
	* For an action slot:
	*   <EmptyState icon={Inbox} title="Inbox is empty">
	*     {#snippet action()}
	*       <a href="…">Compose new</a>
	*     {/snippet}
	*   </EmptyState>
	*/
	/** Optional CTA button(s). */
	/** Tone — "default" muted, "success" green tint (e.g. all done!). */
	let { icon: Icon, title, description, action, tone = "default" } = $$props;
	const iconClass = derived(() => tone === "success" ? "text-green-500/80" : "text-muted-foreground/70");
	$$renderer.push(`<div class="text-center py-12 space-y-3">`);
	if (Icon) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="inline-flex items-center justify-center w-12 h-12 rounded-full surface-1 mb-1">`);
		if (Icon) {
			$$renderer.push("<!--[-->");
			Icon($$renderer, { class: `w-5 h-5 ${iconClass()}` });
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <div><h3 class="text-sm font-medium text-foreground">${escape_html(title)}</h3> `);
	if (description) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">${escape_html(description)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div> `);
	if (action) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="pt-2">`);
		action($$renderer);
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
export { EmptyState as t };
