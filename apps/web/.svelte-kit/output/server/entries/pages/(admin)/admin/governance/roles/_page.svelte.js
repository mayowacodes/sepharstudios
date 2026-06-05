import { Tt as head } from "../../../../../../chunks/ui-libs.js";
import { t as Shield_check } from "../../../../../../chunks/shield-check.js";
import { t as PageHeader } from "../../../../../../chunks/PageHeader.js";
//#endregion
//#region src/routes/(admin)/admin/governance/roles/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1cuy8cy", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Roles - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
		PageHeader($$renderer, {
			icon: Shield_check,
			title: "Role Permissions",
			subtitle: "Who can do what across the platform."
		});
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-muted-foreground">Loading roles...</p>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
