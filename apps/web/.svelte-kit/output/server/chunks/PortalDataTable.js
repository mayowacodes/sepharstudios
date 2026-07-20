import { Et as derived, Ht as attr, Ot as ensure_array_like, St as attr_class, vt as onDestroy } from "./ui-libs.js";
import { t as Search } from "./search.js";
import { t as X } from "./x.js";
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
		let { items, searchPlaceholder = "Search…", row, detail, filters, bulkActions, empty, searchKey } = $$props;
		let query = "";
		let selectedId = null;
		const selected = derived(() => items.find((i) => i.id === selectedId) ?? null);
		derived(() => searchKey ?? (items[0] && "title" in items[0] ? "title" : items[0] && "name" in items[0] ? "name" : "id"));
		const filtered = derived(() => (query.trim(), items));
		function onKeyDown(e) {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
			if (e.key === "/") e.preventDefault();
			if (e.key === "Escape" && selectedId) selectedId = null;
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
//#endregion
export { PortalDataTable as t };
