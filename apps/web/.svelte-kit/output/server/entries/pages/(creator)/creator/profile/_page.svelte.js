import { Lt as attr, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Save } from "../../../../../chunks/save.js";
import { t as User } from "../../../../../chunks/user.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
//#region src/routes/(creator)/creator/profile/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let isSaving = false;
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<button${attr("disabled", isSaving, true)} class="text-xs bg-primary hover:opacity-90 disabled:opacity-50 rounded-full px-3 py-1.5 text-primary-foreground font-medium inline-flex items-center gap-1 transition-opacity">`);
				$$renderer.push("<!--[-1-->");
				Save($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!--]--> ${escape_html("Save")}</button>`);
			}
			PageHeader($$renderer, {
				icon: User,
				title: "Creator Profile",
				subtitle: "Manage your profile and ministry information.",
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div> <p class="text-foreground ml-4">Loading profile...</p></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
