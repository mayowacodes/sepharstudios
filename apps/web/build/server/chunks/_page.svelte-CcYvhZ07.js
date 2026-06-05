import { aO as spread_props, as as ensure_array_like, ai as attr_class, au as escape_html, ah as attr, ap as derived } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import { I as Inbox } from './inbox-DQ-hcBQa.js';
import { S as Skeleton } from './skeleton-DCiPgxrC.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-BaRxD-PE.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/archive.svelte
function Archive($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "archive" },
		props,
		{ iconNode: [
			["rect", {
				"width": "20",
				"height": "5",
				"x": "2",
				"y": "3",
				"rx": "1"
			}],
			["path", { "d": "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }],
			["path", { "d": "M10 12h4" }]
		] }
	]));
}

//#endregion
//#region src/routes/(creator)/creator/inbox/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let filter = "unread";
		let messages = [];
		let selected = {};
		let bulkBusy = false;
		const selectedIds = derived(() => Object.keys(selected).filter((id) => selected[id]));
		const allVisibleSelected = derived(() => messages.length > 0 && messages.every((m) => selected[m.id]));
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-3xl space-y-6">`);
		PageHeader($$renderer, {
			icon: Inbox,
			title: "Inbox",
			subtitle: "Messages from Sephar Studios about your content, applications, and account."
		});
		$$renderer.push(`<!----> <div class="flex flex-wrap gap-2 items-center"><!--[-->`);
		const each_array = ensure_array_like([
			"unread",
			"all",
			"archived"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "surface-1 text-foreground/80 hover:surface-2"}`)}>${escape_html(f)}</button>`);
		}
		$$renderer.push(`<!--]--> `);
		if (messages.length > 0 && true) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="ml-auto text-xs text-muted-foreground hover:text-foreground underline">${escape_html(allVisibleSelected() ? "Clear selection" : "Select all visible")}</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		if (selectedIds().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="sticky top-4 z-20 surface-2 border border-purple-500/40 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg"><span class="text-sm text-foreground font-medium">${escape_html(selectedIds().length)} selected</span> <div class="flex gap-2 ml-auto"><button type="button"${attr("disabled", bulkBusy, true)} class="px-3 py-1.5 rounded text-xs bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white inline-flex items-center gap-1">`);
			Archive($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!---->${escape_html("Archive selected")}</button> <button type="button" class="px-3 py-1.5 rounded text-xs surface-1 hover:surface-2 text-foreground">Clear</button></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(3));
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				each_array_1[i];
				Skeleton($$renderer, { class: "h-16 rounded-xl" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CcYvhZ07.js.map
