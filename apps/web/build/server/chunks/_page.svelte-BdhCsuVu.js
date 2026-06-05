import { aA as head } from './ui-libs-BjzLDLAh.js';
import { S as Shield_check } from './shield-check-BMw6bQZG.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';

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

export { _page as default };
//# sourceMappingURL=_page.svelte-BdhCsuVu.js.map
