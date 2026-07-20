import { Ht as attr, Pt as stringify, St as attr_class, Wt as escape_html } from "./ui-libs.js";
import { t as Flag } from "./flag.js";
//#region src/lib/components/ReportButton.svelte
function ReportButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** Override the default Flag icon button with a slot or a label string. */
		/** Visual variant — "icon" is the bare flag, "button" is a labeled chip. */
		let { targetType, targetId, label, variant = "icon", class: klass = "" } = $$props;
		if (variant === "icon") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button"${attr_class(`text-gray-400 hover:text-red-400 transition-colors ${stringify(klass)}`)}${attr("title", label ?? "Report")} aria-label="Report">`);
			Flag($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----></button>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button type="button"${attr_class(`inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors ${stringify(klass)}`)}>`);
			Flag($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----> <span>${escape_html(label ?? "Report")}</span></button>`);
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { ReportButton as t };
