import { k as head } from './index.js-BP8aAXBX.js';
import { S as Shield_check } from './shield-check-CLcqoqe0.js';
import { P as PortalHero } from './PortalHero-B80SkUjg.js';
import './Icon-DOH8dWtn.js';

//#endregion
//#region src/routes/(admin)/admin/governance/roles/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1cuy8cy", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Roles - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="mx-auto px-4 py-8 space-y-6 max-w-7xl">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "DAO · Access",
			title: "Role permissions",
			subtitle: "Who can do what across the platform.",
			icon: Shield_check
		});
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-muted-foreground">Loading roles...</p>`);
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DG-ahHNM.js.map
