import { Lt as attr, zt as escape_html } from "../../../../../../chunks/ui-libs.js";
import { t as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import "../../../../../../chunks/circle-check.js";
import "../../../../../../chunks/circle-x.js";
import "../../../../../../chunks/clock.js";
import { t as File_text } from "../../../../../../chunks/file-text.js";
import { t as Skeleton } from "../../../../../../chunks/skeleton.js";
import { t as PageHeader } from "../../../../../../chunks/PageHeader.js";
//#region src/routes/(creator)/creator/earnings/tax-forms/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let saving = false;
		let formKind = "W-9";
		let taxYear = (/* @__PURE__ */ new Date()).getFullYear() - 1;
		let name = "";
		let businessName = "";
		let address = "";
		let citySZ = "";
		let tin = "";
		let signedAs = "";
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-3xl space-y-6"><a href="/creator/earnings" class="text-xs text-purple-300 hover:text-purple-200 inline-flex items-center gap-1">`);
		Arrow_left($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----> Back to earnings</a> `);
		PageHeader($$renderer, {
			icon: File_text,
			title: "Tax forms",
			subtitle: "Submit a W-9 (US persons), W-8BEN (foreign individuals), or W-8BEN-E (foreign entities). Admin reviews and confirms before annual 1099 generation."
		});
		$$renderer.push(`<!----> <section class="surface-1 rounded-xl p-5 space-y-4"><h2 class="text-sm font-semibold text-foreground">Submit a new form</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label for="form-kind" class="block text-xs text-foreground/80 mb-1">Form</label> `);
		$$renderer.select({
			id: "form-kind",
			value: formKind,
			class: "w-full surface-2 rounded px-3 py-2 text-sm text-foreground"
		}, ($$renderer) => {
			$$renderer.option({ value: "W-9" }, ($$renderer) => {
				$$renderer.push(`W-9 (US person)`);
			});
			$$renderer.option({ value: "W-8BEN" }, ($$renderer) => {
				$$renderer.push(`W-8BEN (foreign individual)`);
			});
			$$renderer.option({ value: "W-8BEN-E" }, ($$renderer) => {
				$$renderer.push(`W-8BEN-E (foreign entity)`);
			});
		});
		$$renderer.push(`</div> <div><label for="tax-year" class="block text-xs text-foreground/80 mb-1">Tax year</label> <input id="tax-year" type="number"${attr("value", taxYear)} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground"/></div> <div class="md:col-span-2"><label for="t-name" class="block text-xs text-foreground/80 mb-1">Legal name *</label> <input id="t-name" type="text"${attr("value", name)} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground"/></div> <div class="md:col-span-2"><label for="t-business" class="block text-xs text-foreground/80 mb-1">Business/entity name (if applicable)</label> <input id="t-business" type="text"${attr("value", businessName)} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground"/></div> <div class="md:col-span-2"><label for="t-address" class="block text-xs text-foreground/80 mb-1">Address *</label> <input id="t-address" type="text"${attr("value", address)} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground"/></div> <div class="md:col-span-2"><label for="t-city" class="block text-xs text-foreground/80 mb-1">City / state / ZIP</label> <input id="t-city" type="text"${attr("value", citySZ)} class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground"/></div> <div><label for="t-tin" class="block text-xs text-foreground/80 mb-1">TIN / SSN / EIN *</label> <input id="t-tin" type="password" autocomplete="off"${attr("value", tin)} placeholder="XX-XXXXXXX or XXX-XX-XXXX" class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground"/></div> <div><label for="t-signed" class="block text-xs text-foreground/80 mb-1">Signed as *</label> <input id="t-signed" type="text"${attr("value", signedAs)} placeholder="Type your full name" class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground"/></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex items-center justify-between"><p class="text-xs text-muted-foreground">TIN is masked at rest. Only verified admins can view your form.</p> <button type="button"${attr("disabled", saving, true)} class="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm">${escape_html("Submit form")}</button></div></section> <section><h2 class="text-sm font-semibold text-foreground mb-2">Annual 1099s</h2> `);
		$$renderer.push("<!--[0-->");
		Skeleton($$renderer, { class: "h-16 rounded-xl" });
		$$renderer.push(`<!--]--></section> <section><h2 class="text-sm font-semibold text-foreground mb-2">Submitted forms</h2> `);
		$$renderer.push("<!--[0-->");
		Skeleton($$renderer, { class: "h-16 rounded-xl" });
		$$renderer.push(`<!--]--></section></div>`);
	});
}
//#endregion
export { _page as default };
