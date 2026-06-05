import { zt as escape_html } from "./ui-libs.js";
//#region src/lib/components/dashboard/PageHeader.svelte
function PageHeader($$renderer, $$props) {
	let { icon: Icon, title, subtitle, actions } = $$props;
	$$renderer.push(`<header class="flex items-start justify-between gap-4 flex-wrap mb-6"><div class="flex items-start gap-3">`);
	if (Icon) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="surface-2 rounded-xl p-2.5 mt-0.5">`);
		if (Icon) {
			$$renderer.push("<!--[-->");
			Icon($$renderer, { class: "w-5 h-5 text-primary" });
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <div><h1 class="text-2xl font-semibold text-foreground tracking-tight">${escape_html(title)}</h1> `);
	if (subtitle) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-muted-foreground mt-1">${escape_html(subtitle)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div></div> `);
	if (actions) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center gap-2">`);
		actions($$renderer);
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></header>`);
}
//#endregion
export { PageHeader as t };
